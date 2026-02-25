import { INVALID_MOVE } from 'boardgame.io/core';

export const PokerGame = {
  name: 'poker',

  setup: ({ ctx }, setupData) => ({
    players: {},
    gamePhase: 'waiting', // waiting | playing
    settings: setupData?.settings || {
      maxPlayers: 6,
      startingChips: 1000,
      smallBlind: 10,
      bigBlind: 20,
      timeLimit: 30,
    },
    readyPlayers: [],
    leaderId: setupData?.leaderId || null,
  }),

  moves: {
    setReady: ({ G, ctx, playerID }) => {
      if (!G.readyPlayers.includes(playerID)) {
        G.readyPlayers.push(playerID);
      }
    },

    setNotReady: ({ G, ctx, playerID }) => {
      G.readyPlayers = G.readyPlayers.filter(id => id !== playerID);
    },

    kickPlayer: ({ G, ctx, playerID }, targetID) => {
      if (G.leaderId !== playerID) return INVALID_MOVE;
      G.readyPlayers = G.readyPlayers.filter(id => id !== targetID);
      delete G.players[targetID];
    },

    startGame: ({ G, ctx, playerID }) => {
      if (G.leaderId !== playerID) return INVALID_MOVE;
      const playerCount = Object.keys(ctx.activePlayers || {}).length;
      if (playerCount < 2) return INVALID_MOVE;
      G.gamePhase = 'playing';
    },

    updatePlayerName: ({ G, playerID }, name) => {
      G.players[playerID] = { name, id: playerID };
    },
  },

  turn: {
    moveLimit: undefined,
  },

  endIf: ({ G }) => {
    if (G.gamePhase === 'playing') {
      return { started: true };
    }
  },
};
