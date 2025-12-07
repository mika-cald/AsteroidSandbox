// =========================== GAME STATE MODULE =============================
// Centralized game state management for ship position, velocity, game status,
// player stats, and projectiles.
// ===========================================================================

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
  projectiles: [],

  lastShotTime: 0,
  shotCooldown: 200
};

export { state };
