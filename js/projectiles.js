// ========================= PROJECTILES MODULE ===========================
// This file handles projectile creation, direction, movement, lifetime,
// and collision detection with asteroids and UFOs.
// ========================================================================

import { state } from "./gameState.js";
import { scoreElem } from "./ui.js";

// Projectile properties
const projectileType = {
  name: "rocket",
  damage: 100 // points per hit
}

const projectileSpeed = 800; // pixels per second
const projectileLifetime = 1500; // milliseconds

// Fires a new projectile from the ship's position
function fireProjectile() {
  // Exit guard that prevents firing when the game is not running
  if (!state.gameRunning) return;

// ==============================
// FIRE RATE LIMITER (COOLDOWN)
// ==============================
  const now = performance.now();

  if (now - state.lastShotTime < state.shotCooldown) {
  return; // cooling down
  }

  state.lastShotTime = now;
// ==============================


  // Creates projectile element
  const projectile = document.createElement("div");
  projectile.className = "projectile";

  // Create and append projectile image
  const projectileImg = document.createElement("img");
  projectileImg.src = `assets/player/projectiles/${projectileType.name}.gif`; 
  projectileImg.className = "projectile-img";
  projectile.appendChild(projectileImg);

  // Calculate projectile starting position
  const rad = state.angle * Math.PI / 180;

  // Offset to start projectile slightly in front of the ship
  const offset = 30; // 30 pixels in front of the ship

  // Calculate projectile starting coordinates
  const startX = state.shipX + Math.sin(rad) * offset; // horizontal direction
  const startY = state.shipY - Math.cos(rad) * offset; // vertical direction

  // Set initial position and rotation
  projectile.style.left = `${startX}px`;
  projectile.style.top = `${startY}px`;
  projectile.style.transform = `translate(-50%, -50%) rotate(${state.angle}deg)`;

  // Set velocity
  projectile.dataset.velX = Math.sin(rad) * projectileSpeed;
  projectile.dataset.velY = -Math.cos(rad) * projectileSpeed;

  document.body.appendChild(projectile);
  state.projectiles.push(projectile);

  // Remove projectile after its lifetime expires
  setTimeout(() => {
    if (projectile.parentNode) {
      projectile.remove();
      state.projectiles = state.projectiles.filter(b => b !== projectile);
    }
  }, projectileLifetime);
}

// Update positions of all projectiles
function updateProjectiles(deltaSec) {
  state.projectiles.forEach(p => {
    let x = parseFloat(p.style.left);
    let y = parseFloat(p.style.top);

    x += parseFloat(p.dataset.velX) * deltaSec;
    y += parseFloat(p.dataset.velY) * deltaSec;

    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    if (x < -10 || x > window.innerWidth + 10 || y < -10 || y > window.innerHeight + 10) {
      p.remove();
      state.projectiles = state.projectiles.filter(b => b !== p);
    }
  });
}

// Check for collisions between projectiles and asteroids
function checkProjectileCollisions() {
  const asteroids = document.querySelectorAll(".asteroid-hitbox");

  [...state.projectiles].forEach(p => {
    const pRect = p.getBoundingClientRect();

    [...asteroids].forEach(a => {
      const aRect = a.getBoundingClientRect();

      const hit =
        pRect.left < aRect.right &&
        pRect.right > aRect.left &&
        pRect.top < aRect.bottom &&
        pRect.bottom > aRect.top;

      if (hit) {
        // Remove projectile
        p.remove();
        state.projectiles = state.projectiles.filter(b => b !== p);

        const asteroidWrap = a.closest(".asteroid");
        if (asteroidWrap) {
          // ---------- NEW: multi-hit health system ----------
          let health = parseInt(asteroidWrap.dataset.health || "1", 10);
          health--;
          asteroidWrap.dataset.health = String(health);

          if (health <= 0) {
            // Only when asteroid "dies" do we explode & remove & score
            const asteroidImg = asteroidWrap.querySelector(".asteroid-img");
            if (asteroidImg) {
              const newImg = asteroidImg.cloneNode();
              newImg.src = `assets/asteroids/explode.gif?${Date.now()}`;
              asteroidImg.replaceWith(newImg);
            }
            const hitbox = asteroidWrap.querySelector(".asteroid-hitbox");
            if (hitbox) hitbox.remove();
            setTimeout(() => asteroidWrap.remove(), 700);

            // Score awarded on destruction, not each hit
            let score = parseInt(scoreElem.textContent) || 0;
            score += projectileType.damage;
            scoreElem.textContent = score;
          }
        }
      }
    });
  });
}

// Check for collisions between projectiles and UFOs
function checkProjectileCollisionsWithUfos() {
  const ufos = document.querySelectorAll(".ufo-hitbox");
  [...state.projectiles].forEach(p => {
    const pRect = p.getBoundingClientRect();

    [...ufos].forEach(u => {
      const aRect = u.getBoundingClientRect();

      const hit =
        pRect.left < aRect.right &&
        pRect.right > aRect.left &&
        pRect.top < aRect.bottom &&
        pRect.bottom > aRect.top;

      if (hit) {
        p.remove();
        state.projectiles = state.projectiles.filter(b => b !== p);

        const ufoWrap = u.closest(".ufo");
        if (!ufoWrap) return;

        let health = parseInt(ufoWrap.dataset.health) || 3;
        health--;
        ufoWrap.dataset.health = health;

        if (health <= 0) {
          ufoWrap.dataset.hit = "true";

          const ufoImg = ufoWrap.querySelector(".ufo-img");
          if (ufoImg) {
            const newImg = ufoImg.cloneNode();
            ufoImg.replaceWith(newImg);
            newImg.src = `assets/enemies/ships/bomber/destruction.gif?${Date.now()}`;
          }
          const hitbox = ufoWrap.querySelector(".ufo-hitbox");
          if (hitbox) hitbox.remove();
          setTimeout(() => ufoWrap.remove(), 1400);
        }

        let score = parseInt(scoreElem.textContent) || 0;
        score += projectileType.damage + 300;
        scoreElem.textContent = score;
      }
    });
  });
}

export {
  projectileType,
  fireProjectile,
  updateProjectiles,
  checkProjectileCollisions,
  checkProjectileCollisionsWithUfos
};