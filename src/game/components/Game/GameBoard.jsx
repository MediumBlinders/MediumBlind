import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { PokerGame } from '../../PokerGame.js';
import './GameBoard.css';

export default function GameBoard() {
  const { matchID } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [client, setClient] = useState(null);

  const credentials = JSON.parse(localStorage.getItem('poker_credentials') || 'null');

  useEffect(() => {
    if (!credentials) {
      navigate('/');
      return;
    }

    const bggClient = Client({
      game: PokerGame,
      multiplayer: SocketIO({ server: 'http://localhost:8000' }),
      matchID,
      playerID: credentials.playerID,
      credentials: credentials.playerCredentials,
    });

    bggClient.start();
    setClient(bggClient);

    const unsubscribe = bggClient.subscribe(state => {
      if (state) setGameState(state.G);
    });

    return () => {
      unsubscribe();
      bggClient.stop();
    };
  }, [matchID]);

  return (
    <div className="game-board">
      <div className="game-header">
        <span>Table 🃏</span>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          Exit
        </button>
      </div>

      <div className="poker-table">
        <div className="table-center">
          <div className="coming-soon">
            <h2>Poker Table🎮</h2>
            <p>فاز ۲: منطق بازی اینجا اضافه میشه</p>
            <div className="player-info-display">
              <p>Player: {credentials?.playerID}</p>
              <p>Room: {matchID?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
