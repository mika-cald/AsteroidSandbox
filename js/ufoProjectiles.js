// ========================= UFO PROJECTILES MODULE ===========================
// Handles UFO projectile creation, movement, lifetime, and collisions with ship
// ============================================================================

import { state } from "./gameState.js";
import { ship } from "./ui.js";
import { handleCollision } from "./game.js";

// ===== Projectile properties =====
const ufoProjectileSpeed = 400;
const ufoProjectileLifetime = 2000;

const ufoProjectiles = [];

// ===== Fire a projectile from a UFO =====
export function fireUfoProjectile(ufo) {
  if (!state.gameRunning) return;

  const projectile = document.createElement("div");
  projectile.classList.add("projectile", "ufo-projectile");
  projectile.style.position = "absolute";
  projectile.style.transform = "translate(-50%, -50%)";

  const img = document.createElement("img");
  img.src = "assets/player/projectiles/rocket.gif";
  img.className = "ufoProjectiles-img";
  projectile.appendChild(img);

  // UFO position
  const ufoX = parseFloat(ufo.style.left);
  const ufoY = parseFloat(ufo.style.top);

  // Vector toward player ship
  const dx = state.shipX - ufoX;
  const dy = state.shipY - ufoY;
  const dist = Math.hypot(dx, dy);

  const velX = (dx / dist) * ufoProjectileSpeed;
  const velY = (dy / dist) * ufoProjectileSpeed;

  projectile.style.left = `${ufoX}px`;
  projectile.style.top = `${ufoY}px`;

  projectile.velX = velX;
  projectile.velY = velY;

  // Rotate projectile to face velocity vector
  const angleRad = Math.atan2(velY, velX);
  const angleDeg = angleRad * -180 / Math.PI;
  img.style.transform = `translate(-50%, -50%) rotate(${state.angle}deg)`;

  document.body.appendChild(projectile);
  ufoProjectiles.push(projectile);

  // Remove after lifetime expires
  setTimeout(() => {
    if (projectile.parentNode) {
      projectile.remove();
      const idx = ufoProjectiles.indexOf(projectile);
      if (idx !== -1) ufoProjectiles.splice(idx, 1);
    }
  }, ufoProjectileLifetime);
}

// ===== Update UFO projectile positions =====
export function updateUfoProjectiles(deltaSec) {
  for (let i = ufoProjectiles.length - 1; i >= 0; i--) {
    const p = ufoProjectiles[i];
    let x = parseFloat(p.style.left);
    let y = parseFloat(p.style.top);

    x += p.velX * deltaSec;
    y += p.velY * deltaSec;

    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    // Remove if offscreen
    if (x < -10 || x > window.innerWidth + 10 || y < -10 || y > window.innerHeight + 10) {
      p.remove();
      ufoProjectiles.splice(i, 1);
    }
  }
}

// ===== Collision check with ship =====
export function collisionWithUfoProjectiles() {
  const shipRect = ship.getBoundingClientRect();
  const shipCenterX = shipRect.left + shipRect.width / 2;
  const shipCenterY = shipRect.top + shipRect.height / 2;
  const shipRadius = Math.max(shipRect.width, shipRect.height) / 2;

  for (let i = ufoProjectiles.length - 1; i >= 0; i--) {
    const p = ufoProjectiles[i];
    const rect = p.getBoundingClientRect();
    const projCenterX = rect.left + rect.width / 2;
    const projCenterY = rect.top + rect.height / 2;
    const projRadius = Math.max(rect.width, rect.height) / 2;

    const dist = Math.hypot(shipCenterX - projCenterX, shipCenterY - projCenterY);
    if (dist < shipRadius + projRadius) {
      p.remove();
      ufoProjectiles.splice(i, 1);
      handleCollision(); // reuse your existing damage logic
      return true;
    }
  }
  return false;
}
