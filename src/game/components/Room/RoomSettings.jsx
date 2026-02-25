import './RoomSettings.css';

export default function RoomSettings({ settings }) {
  const items = [
    { label: 'حداکثر بازیکن', value: `${settings.maxPlayers} نفر`, icon: '👥' },
    { label: 'چیپ شروع', value: settings.startingChips?.toLocaleString(), icon: '💰' },
    { label: 'Small Blind', value: settings.smallBlind, icon: '🎯' },
    { label: 'Big Blind', value: settings.bigBlind, icon: '🎯' },
    { label: 'زمان هر نوبت', value: `${settings.timeLimit} ثانیه`, icon: '⏱️' },
  ];

  return (
    <div className="room-settings">
      <h3>⚙️ تنظیمات اتاق</h3>
      <ul>
        {items.map(item => (
          <li key={item.label}>
            <span className="setting-icon">{item.icon}</span>
            <span className="setting-label">{item.label}</span>
            <span className="setting-value">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
