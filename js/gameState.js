// gameState.js
// Shared mutable game state for the entire game.

const state = {
  // Ship position & physics
  shipX: window.innerWidth / 2,
  shipY: window.innerHeight / 2,
  angle: 0,
  velX: 0,
  velY: 0,

  // Runtime flags & loop
  keys: {},
  gameRunning: false,
  loopId: null,
  lastTime: 0,

  // Player stats
  lives: 3,
  isInvincible: false,

  // Projectiles
  projectiles: []
};

export { state };
