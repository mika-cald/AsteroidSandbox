// ============================= SHIP MODULE ===============================
// Manages the player's ship movement, rotation, thrust, and screen wrapping.
// =========================================================================

import { state } from "./gameState.js";
import { ship, engine } from "./ui.js";

// Ship physics constants
const thrust = 600; 
const rotationSpeed = 180;
const friction = 0.98;

let spriteChange = 0;

// Update ship position and state
function updateShip(deltaSec = 0) {
  const engineImg = engine.querySelector("img");

  if (state.gameRunning) {
    engineImg.style.opacity = "1";

    // Rotation
    if (state.keys["a"]) state.angle -= rotationSpeed * deltaSec;
    if (state.keys["d"]) state.angle += rotationSpeed * deltaSec;

    // Thrust
    if (state.keys["w"]) {
      const rad = state.angle * Math.PI / 180;
      state.velX += Math.sin(rad) * thrust * deltaSec;
      state.velY -= Math.cos(rad) * thrust * deltaSec;

      if (spriteChange !== 1) {
        engineImg.src = "assets/player/engines/effects/base-power.gif";
        spriteChange = 1;
      }
    } else {
      if (spriteChange !== 0) {
        engineImg.src = "assets/player/engines/effects/base-idle.gif";
        spriteChange = 0;
      }
    }
  } else {
    engineImg.style.opacity = "0";
  }

  // Friction
  state.velX *= Math.pow(friction, deltaSec * 60);
  state.velY *= Math.pow(friction, deltaSec * 60);

  // Move
  state.shipX += state.velX * deltaSec;
  state.shipY += state.velY * deltaSec;

  // Screen wrapping
  if (state.shipX < 0) state.shipX = window.innerWidth;
  if (state.shipX > window.innerWidth) state.shipX = 0;
  if (state.shipY < 0) state.shipY = window.innerHeight;
  if (state.shipY > window.innerHeight) state.shipY = 0;

  // Apply transform
  ship.style.left = state.shipX + "px";
  ship.style.top  = state.shipY + "px";
  ship.style.transform = `translate(-50%, -50%) rotate(${state.angle}deg)`;
}

export { updateShip };
