import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { LobbyClient } from 'boardgame.io/client';
import { PokerGame } from '../../PokerGame.js';
import PlayerSlot from './PlayerSlot.jsx';
import RoomSettings from './RoomSettings.jsx';
import './Room.css';

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' });

export default function Room() {
  const { matchID } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [myCredentials] = useState(() => {
    const saved = localStorage.getItem('poker_credentials');
    return saved ? JSON.parse(saved) : null;
  });

  const playerID = myCredentials?.playerID;
  const isLeader = myCredentials?.isLeader || playerID === '0';

  useEffect(() => {
    if (!myCredentials) {
      navigate('/');
      return;
    }

    const bggClient = Client({
      game: PokerGame,
      multiplayer: SocketIO({ server: 'http://localhost:8000' }),
      matchID,
      playerID: myCredentials.playerID,
      credentials: myCredentials.playerCredentials,
    });

    bggClient.start();
    setClient(bggClient);

    const unsubscribe = bggClient.subscribe(state => {
      if (state) {
        setGameState(state.G);
        // اگه بازی شروع شد برو صفحه بازی
        if (state.G.gamePhase === 'playing') {
          navigate(`/game/${matchID}`);
        }
      }
    });

    return () => {
      unsubscribe();
      bggClient.stop();
    };
  }, [matchID, myCredentials, navigate]);

  // -- فچ اطلاعات match برای دیدن اسم بازیکنا
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const data = await lobbyClient.getMatch('poker', matchID);
        setMatchData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatchData();
    const interval = setInterval(fetchMatchData, 3000);
    return () => clearInterval(interval);
  }, [matchID]);

  const handleReady = () => {
    client?.moves.setReady();
  };

  const handleNotReady = () => {
    client?.moves.setNotReady();
  };

  const handleKick = (targetID) => {
    client?.moves.kickPlayer(targetID);
    lobbyClient.leaveMatch('poker', matchID, {
      playerID: targetID,
      credentials: 'kick', // سرور باید این رو هندل کنه
    }).catch(() => {});
  };

  const handleStartGame = () => {
    client?.moves.startGame();
  };

  const handleLeave = async () => {
    try {
      await lobbyClient.leaveMatch('poker', matchID, {
        playerID: myCredentials.playerID,
        credentials: myCredentials.playerCredentials,
      });
    } catch (err) {}
    localStorage.removeItem('poker_credentials');
    navigate('/');
  };

  const settings = gameState?.settings || {};
  const readyPlayers = gameState?.readyPlayers || [];
  const players = matchData?.players || [];
  const activePlayers = players.filter(p => p.name);
  const allReady = activePlayers.length >= 2 &&
    activePlayers.every(p => readyPlayers.includes(String(p.id)));

  const isReady = readyPlayers.includes(playerID);

  const roomCode = matchID?.slice(0, 8).toUpperCase();

  return (
    <div className="room-page">
      <div className="room-top-bar">
        <button className="btn-ghost btn-back" onClick={handleLeave}>
          ← خروج
        </button>
        <div className="room-code-display">
          🔑 کد اتاق: <strong>{roomCode}</strong>
          <button
            className="btn-copy"
            onClick={() => navigator.clipboard.writeText(roomCode)}
          >
            📋 کپی
          </button>
        </div>
      </div>

      <div className="room-content">
        <div className="room-main">
          <h2>
            {settings.roomName || `اتاق ${roomCode}`}
            {isLeader && <span className="leader-badge"> 👑 لیدر</span>}
          </h2>

          <div className="players-grid">
            {Array.from({ length: settings.maxPlayers || 6 }).map((_, idx) => {
              const player = players.find(p => p.id === idx);
              const isOccupied = !!player?.name;
              const isThisMe = String(idx) === playerID;
              const isPlayerReady = readyPlayers.includes(String(idx));
              const isPlayerLeader = String(idx) === '0';

              return (
                <PlayerSlot
                  key={idx}
                  slotIndex={idx}
                  player={player}
                  isOccupied={isOccupied}
                  isMe={isThisMe}
                  isReady={isPlayerReady}
                  isLeader={isPlayerLeader}
                  canKick={isLeader && isOccupied && !isThisMe}
                  onKick={() => handleKick(String(idx))}
                />
              );
            })}
          </div>

          <div className="room-footer">
            <div className="ready-status">
              آماده: {readyPlayers.length} / {activePlayers.length}
            </div>

            {/* دکمه آماده برای بازیکنان */}
            {!isLeader && (
              <button
                className={`btn-large ${isReady ? 'btn-danger' : 'btn-success'}`}
                onClick={isReady ? handleNotReady : handleReady}
              >
                {isReady ? '❌ نه، آماده نیستم' : '✅ آماده‌ام!'}
              </button>
            )}

            {/* دکمه شروع برای لیدر */}
            {isLeader && (
              <button
                className={`btn-large ${allReady ? 'btn-primary btn-glow' : 'btn-disabled'}`}
                onClick={handleStartGame}
                disabled={!allReady}
              >
                {allReady ? '🚀 شروع بازی!' : `⏳ منتظر آماده شدن بازیکنان...`}
              </button>
            )}
          </div>
        </div>

        <RoomSettings settings={settings} />
      </div>
    </div>
  );
}
