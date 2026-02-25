import './PlayerSlot.css';

export default function PlayerSlot({
  slotIndex,
  player,
  isOccupied,
  isMe,
  isReady,
  isLeader,
  canKick,
  onKick
}) {
  if (!isOccupied) {
    return (
      <div className="player-slot empty">
        <span className="slot-number">{slotIndex + 1}</span>
        <span className="empty-label">خالی</span>
      </div>
    );
  }

  return (
    <div className={`player-slot occupied ${isMe ? 'slot-me' : ''} ${isReady ? 'slot-ready' : ''}`}>
      <div className="slot-header">
        <span className="slot-number">{slotIndex + 1}</span>
        {isLeader && <span className="crown">👑</span>}
        {isReady && <span className="ready-icon">✅</span>}
        {!isReady && isOccupied && <span className="not-ready-icon">⏳</span>}
      </div>

      <div className="player-avatar">
        {player?.name?.charAt(0).toUpperCase()}
      </div>

      <div className="player-name">
        {player?.name}
        {isMe && <span className="you-badge"> (شما)</span>}
      </div>

      {canKick && (
        <button
          className="btn-kick"
          onClick={onKick}
          title="کیک کردن بازیکن"
        >
          🚫 کیک
        </button>
      )}
    </div>
  );
}
