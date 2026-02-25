import { useState } from 'react';
import './JoinRoom.css';

export default function JoinRoom({ onJoin, onCancel }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('Enter the RoomKey');
      return;
    }
    setLoading(true);
    try {
      await onJoin(trimmed);
    } catch (err) {
      setError('Room Not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Enter with RoomKey🔑</h2>
        <p>Enter your Key</p>
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
          placeholder="for example: ABC123"
          maxLength={8}
          autoFocus
        />
        {error && <span className="error">{error}</span>}
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-secondary">cancel</button>
          <button onClick={handleJoin} className="btn-primary" disabled={loading}>
            {loading ? '⏳...' : 'Joining...'}
          </button>
        </div>
      </div>
    </div>
  );
}
