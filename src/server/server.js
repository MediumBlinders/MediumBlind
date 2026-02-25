const { Server, LobbyClient } = require('boardgame.io/server');
const { PokerGame } = require('../game/PokerGame');

const server = Server({
  games: [PokerGame],
  origins: ['http://localhost:5173'],
});

const PORT = 8000;
server.run(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
