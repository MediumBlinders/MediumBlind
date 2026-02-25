import './RoomList.css';

export default function RoomList({ rooms, onJoinRoom, loading }) {
  if (loading) {
    return (
      <div className="room-list">
        <div className="loading-spinner">Loading Rooms... ⏳</div>
      </div>
    );
  }

  const publicRooms = rooms.filter(r => !r.setupData?.settings?.isPrivate);

  if (publicRooms.length === 0) {
    return (
      <div className="room-list empty">
        <div className="empty-state">
          <span className="empty-icon">🃏</span>
          <p>No Room found</p>
          <small>Creat a Room!</small>
        </div>
      </div>
    );
  }

  return (
    <div className="room-list">
      <h3>Rooms : ({publicRooms.length})</h3>
      <div className="rooms-grid">
        {publicRooms.map(room => {
          const settings = room.setupData?.settings || {};
          const playerCount = room.players.filter(p => p.name).length;
          const maxPlayers = settings.maxPlayers || 6;
          const isFull = playerCount >= maxPlayers;

          return (
            <div key={room.id} className={`room-card ${isFull ? 'full' : ''}`}>
              <div className="room-header">
                <span className="room-name">
                  {settings.roomName || `Room ${room.id.slice(0, 6)}`}
                </span>
                <span className={`room-status ${isFull ? 'status-full' : 'status-open'}`}>
                  {isFull ? 'Full🔴' : 'Open🟢'}
                </span>
              </div>

              <div className="room-info">
                <span>👥 {playerCount}/{maxPlayers}</span>
                <span>💰 {settings.startingChips?.toLocaleString()}</span>
                <span>🎯 {settings.smallBlind}/{settings.bigBlind}</span>
                <span>⏱️ {settings.timeLimit}s</span>
              </div>

              <div className="room-id">
                key: <strong>{room.id.slice(0, 8).toUpperCase()}</strong>
              </div>

              <button
                onClick={() => onJoinRoom(room.id)}
                className={`btn-join ${isFull ? 'btn-disabled' : 'btn-primary'}`}
                disabled={isFull}
              >
                {isFull ? 'Full' : 'Join the Room'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
