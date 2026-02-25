import { useState, useEffect } from 'react';
import './PlayerNameModal.css';

export default function PlayerNameModal({ onConfirm }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('poker_player_name');
    if (saved) setName(saved);
  }, []);

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name Can't be empty");
      return;
    }
    if (trimmed.length < 2) {
      setError('It is less than 2 char');
      return;
    }
    localStorage.setItem('poker_player_name', trimmed);
    onConfirm(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Wellcome 🃏</h2>
        <p>Enter your Name</p>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="Player Name..."
          maxLength={20}
          autoFocus
        />
        {error && <span className="error">{error}</span>}
        <button onClick={handleConfirm} className="btn-primary">
        Go to Looby 🚀
        </button>
      </div>
    </div>
  );
}
