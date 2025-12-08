// =========================== GAME MODULE =============================
// Manages the main game loop, state transitions, and collision handling.
// =====================================================================

import { state } from "./gameState.js";
import { menuScreen, highScoresScreen, scoreDisplay, livesDisplay, gameRestart, ship, engine, endScreen, finalScoreElem, nicknameInput, scoreElem } from "./ui.js";
import { updateLives } from "./ui.js";
import { updateShip } from "./ship.js";
import { updateProjectiles, checkProjectileCollisions, checkProjectileCollisionsWithUfos } from "./projectiles.js";
import { spawnAsteroids, updateAsteroids, respawnAsteroids, clearAsteroids, activateAsteroids } from "./asteroids.js";
import { spawnUfos, updateUfos, respawnUfos, clearUfos, activateUfos } from "./ufos.js";
import { collisionWithAsteroids, collisionWithUfos } from "./collision.js";
import { crossFadeAudio, musicEnabled, menuTrack, gameTrack } from "./audio.js";

const MAX_DELTA = 0.05;

// Main game loop
function gameLoop(timestamp) {
  if (state.lastTime === 0) state.lastTime = timestamp;
  let deltaSec = (timestamp - state.lastTime) / 1000;
  state.lastTime = timestamp;

  if (deltaSec > MAX_DELTA) deltaSec = MAX_DELTA;

  updateShip(deltaSec);
  updateProjectiles(deltaSec);
  checkProjectileCollisions();
  checkProjectileCollisionsWithUfos();
  updateAsteroids(deltaSec);
  respawnAsteroids(7);

  // ========================================================
  // UFOs unlock ONLY when the score reaches 2500
  // ========================================================
  const currentScore = parseInt(scoreElem.textContent) || 0;

  if (currentScore >= 2500) {
    activateUfos(true);
    updateUfos(deltaSec);
    respawnUfos(1);
  }

  if (collisionWithAsteroids() || collisionWithUfos()) handleCollision();

  state.loopId = requestAnimationFrame(gameLoop);
}

// Handle ship collision with asteroid or UFO
function handleCollision() {
  if (state.isInvincible) return;
  state.isInvincible = true;

  state.lives = Math.max(0, state.lives - 1);
  updateLives();

  const img = ship.querySelector("img");
  img.style.filter =
    "brightness(0) saturate(100%) invert(38%) sepia(90%) saturate(5342%) hue-rotate(343deg)";
  setTimeout(() => (img.style.filter = "none"), 300);

  document.body.style.animation = "shake 0.15s";
  setTimeout(() => (document.body.style.animation = ""), 150);

  if (state.lives === 0) {
    deathAnimation();
  } else {
    setTimeout(() => (state.isInvincible = false), 1200);
  }
}

// Ship death animation and game over handling
function deathAnimation() {
  ship.classList.add("ship-death-zoom");
  document.getElementById("death-fade").style.opacity = 1;

  setTimeout(() => {
    cancelAnimationFrame(state.loopId);
    state.gameRunning = false;
    state.isInvincible = false;
    shipDestroyed();
    document.getElementById("death-fade").style.opacity = 0;
    ship.classList.remove("ship-death-zoom");

    if (musicEnabled) {
      crossFadeAudio(gameTrack, menuTrack, 1500);
    }
  }, 1200);
}

// Handle ship destruction and transition to end screen
function shipDestroyed() {
  cancelAnimationFrame(state.loopId);
  state.gameRunning = false;
  state.isInvincible = false;

  Object.keys(state.keys).forEach(k => (state.keys[k] = false));

  activateAsteroids(false);
  clearAsteroids();
  activateUfos(false);
  clearUfos();

  ship.style.display = "none";
  engine.style.display = "none";

  endScreen.style.display = "block";
  scoreDisplay.style.display = "none";
  livesDisplay.style.display = "none";
  finalScoreElem.textContent = scoreElem.textContent;
  nicknameInput.value = "";
}

// Reset the game to initial state
function resetGame() {
  cancelAnimationFrame(state.loopId);
  activateAsteroids(true);
  clearAsteroids();
  activateUfos(true);
  clearUfos();
  state.lastTime = 0;
  state.gameRunning = false;
  state.isInvincible = false;
  state.lives = 3;
  updateLives();
  scoreElem.textContent = "0";

  state.shipX = window.innerWidth / 2;
  state.shipY = window.innerHeight / 2;
  state.velX = state.velY = 0;
  state.angle = 0;

  state.projectiles.forEach(p => p.remove());
  state.projectiles = [];

  ship.style.display = "none";
  engine.style.display = "none";

  scoreDisplay.style.display = "none";
  livesDisplay.style.display = "none";
  gameRestart.style.display = "none";

  menuScreen.style.display = "block";
}

// Start a new game
function startGame() {
  menuScreen.style.display = "none";
  highScoresScreen.style.display = "none";
  gameRestart.style.display = "none";

  ship.style.display = "block";
  engine.style.display = "block";
  scoreDisplay.style.display = "block";
  livesDisplay.style.display = "block";

  state.lives = 3;
  state.isInvincible = false;
  updateLives();
  scoreElem.textContent = "0";

  activateAsteroids(true);
  clearAsteroids();
  spawnAsteroids();

  activateUfos(true);
  clearUfos();
  spawnUfos();

  state.projectiles = [];
  state.lastTime = 0;

  if (!state.gameRunning) {
    state.gameRunning = true;
    state.loopId = requestAnimationFrame(gameLoop);
  }

  if (musicEnabled) {
    crossFadeAudio(menuTrack, gameTrack, 1200);
  }
}

// Return to main menu from game or high scores
function backToMenu() {
  cancelAnimationFrame(state.loopId);
  activateAsteroids(false);
  clearAsteroids();
  activateUfos(false);
  clearUfos();
  state.lastTime = 0;
  state.gameRunning  = false;
  state.isInvincible = false;
  state.lives = 3;
  updateLives();

  state.shipX = window.innerWidth / 2;
  state.shipY = window.innerHeight / 2;
  state.velX = state.velY = 0;
  state.angle = 0;

  state.projectiles.forEach(p => p.remove());
  state.projectiles = [];

  ship.style.display = "none";
  engine.style.display = "none";
  scoreDisplay.style.display = "none";
  livesDisplay.style.display = "none";

  menuScreen.style.display = "block";
  highScoresScreen.style.display = "none";
  endScreen.style.display = "none";
}

// Used by high score submit / back-to-menu
function resetGameState() {
  cancelAnimationFrame(state.loopId);
  activateAsteroids(false);
  clearAsteroids();
  activateUfos(false);
  clearUfos();
  state.lastTime = 0;
  state.gameRunning  = false;
  state.isInvincible = false;
  state.lives = 3;
  updateLives();
  scoreElem.textContent = "0";

  state.shipX = window.innerWidth / 2;
  state.shipY = window.innerHeight / 2;
  state.velX = state.velY = 0;
  state.angle = 0;

  state.projectiles.forEach(p => p.remove());
  state.projectiles = [];
}

// Go to main menu from end screen
function goToMenu() {
  endScreen.style.display = "none";
  menuScreen.style.display = "block";
  ship.style.display = "none";
  engine.style.display = "none";
  scoreDisplay.style.display = "none";
  livesDisplay.style.display = "none";

  resetGameState();
}

export { gameLoop, resetGame, startGame, backToMenu, resetGameState, goToMenu };