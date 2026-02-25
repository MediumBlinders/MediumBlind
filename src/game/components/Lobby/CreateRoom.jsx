import { useState } from 'react';
import './CreateRoom.css';

const DEFAULT_SETTINGS = {
  maxPlayers: 6,
  startingChips: 1000,
  smallBlind: 10,
  bigBlind: 20,
  timeLimit: 30,
  isPrivate: false,
  roomName: '',
};

export default function CreateRoom({ onCreateRoom, onCancel, playerName }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await onCreateRoom(settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box create-room-box">
        <h2>Creat New Room 🎮</h2>

        <div className="form-group">
          <label>Room Name</label>
          <input
            type="text"
            value={settings.roomName}
            onChange={e => handleChange('roomName', e.target.value)}
            placeholder={`${playerName}'s Room`}
            maxLength={30}
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Starting Chips:</label>
            <select
              value={settings.startingChips}
              onChange={e => handleChange('startingChips', Number(e.target.value))}
            >
              {[500, 1000, 2000, 5000, 10000].map(n => (
                <option key={n} value={n}>{n.toLocaleString()}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Small Blind</label>
            <select
              value={settings.smallBlind}
              onChange={e => handleChange('smallBlind', Number(e.target.value))}
            >
              {[5, 10, 25, 50, 100].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Big Blind</label>
            <input
              type="number"
              value={settings.bigBlind}
              readOnly
              className="readonly"
            />
            <small>= Small Blind × 2</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Time of each turn</label>
            <select
              value={settings.timeLimit}
              onChange={e => handleChange('timeLimit', Number(e.target.value))}
            >
              {[15, 20, 30, 45, 60].map(n => (
                <option key={n} value={n}>{n} sec</option>
              ))}
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={settings.isPrivate}
                onChange={e => handleChange('isPrivate', e.target.checked)}
              />
              Privet Room🔒
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} className="btn-secondary">Cancle</button>
          <button onClick={handleCreate} className="btn-primary" disabled={loading}>
            {loading ? '⏳ Loading...' : 'Bilding✅'}
          </button>
        </div>
      </div>
    </div>
  );
}
