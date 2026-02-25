import { useState, useEffect, useCallback } from 'react';
import { LobbyClient } from 'boardgame.io/client';
import { useNavigate } from 'react-router-dom';
import RoomList from './RoomList.jsx';
import CreateRoom from './CreateRoom.jsx';
import JoinRoom from './JoinRoom.jsx';
import PlayerNameModal from './PlayerNameModal.jsx';
import './Lobby.css';

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' });

export default function Lobby() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinByCode, setShowJoinByCode] = useState(false);
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('poker_credentials');
    return saved ? JSON.parse(saved) : null;
  });

  // -- بارگذاری اسم از localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('poker_player_name');
    if (savedName) setPlayerName(savedName);
  }, []);

  // -- فچ کردن لیست اتاق‌ها
  const fetchRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const { rooms: fetchedRooms } = await lobbyClient.listMatches('poker');
      setRooms(fetchedRooms || []);
    } catch (err) {
      console.error('Error: ', err);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    if (playerName) {
      fetchRooms();
      const interval = setInterval(fetchRooms, 5000); // هر ۵ ثانیه آپدیت
      return () => clearInterval(interval);
    }
  }, [playerName, fetchRooms]);

  // -- ساخت اتاق
  const handleCreateRoom = async (settings) => {
    const { matchID } = await lobbyClient.createMatch('poker', {
      numPlayers: settings.maxPlayers,
      setupData: { settings, leaderId: '0' },
    });

    const { playerCredentials } = await lobbyClient.joinMatch('poker', matchID, {
      playerID: '0',
      playerName,
    });

    const creds = { matchID, playerID: '0', playerCredentials, isLeader: true };
    localStorage.setItem('poker_credentials', JSON.stringify(creds));
    setCredentials(creds);
    setShowCreateRoom(false);
    navigate(`/room/${matchID}`);
  };

  // -- جوین با کد
  const handleJoinByCode = async (code) => {
    await handleJoinRoom(code.toLowerCase());
    setShowJoinByCode(false);
  };

  // -- جوین به اتاق
  const handleJoinRoom = async (matchID) => {
    const match = await lobbyClient.getMatch('poker', matchID);
    const openSlot = match.players.find(p => !p.name);
    if (!openSlot) throw new Error('Room is full');

    const playerID = String(openSlot.id);
    const { playerCredentials } = await lobbyClient.joinMatch('poker', matchID, {
      playerID,
      playerName,
    });

    const creds = {
      matchID,
      playerID,
      playerCredentials,
      isLeader: playerID === '0',
    };
    localStorage.setItem('poker_credentials', JSON.stringify(creds));
    setCredentials(creds);
    navigate(`/room/${matchID}`);
  };

  if (!playerName) {
    return <PlayerNameModal onConfirm={setPlayerName} />;
  }

  return (
    <div className="lobby">
      <header className="lobby-header">
        <h1>MediumBlind 🃏</h1>
        <div className="player-info">
          <span>Hello, <strong>{playerName}</strong> 👋</span>
          <button
            className="btn-ghost"
            onClick={() => {
              localStorage.removeItem('poker_player_name');
              setPlayerName(null);
            }}
          >
            change name
          </button>
        </div>
      </header>

      <div className="lobby-actions">
        <button className="btn-primary btn-large" onClick={() => setShowCreateRoom(true)}>
          Creat new Room ➕
        </button>
        <button className="btn-secondary btn-large" onClick={() => setShowJoinByCode(true)}>
          Enter with Key🔑
        </button>
        <button className="btn-ghost" onClick={fetchRooms} disabled={loadingRooms}>
          Refresh🔄
        </button>
      </div>

      <RoomList
        rooms={rooms}
        onJoinRoom={handleJoinRoom}
        loading={loadingRooms}
      />

      {showCreateRoom && (
        <CreateRoom
          onCreateRoom={handleCreateRoom}
          onCancel={() => setShowCreateRoom(false)}
          playerName={playerName}
        />
      )}

      {showJoinByCode && (
        <JoinRoom
          onJoin={handleJoinByCode}
          onCancel={() => setShowJoinByCode(false)}
        />
      )}
    </div>
  );
}
