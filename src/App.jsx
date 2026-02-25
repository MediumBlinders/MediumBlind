import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lobby from './game/components/Lobby/Lobby.jsx';
import Room from './game/components/Room/Room.jsx';
import GameBoard from './game/components/Game/GameBoard';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:matchID" element={<Room />} />
        <Route path="/game/:matchID" element={<GameBoard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
