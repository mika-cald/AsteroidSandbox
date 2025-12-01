// ========================= PROJECTILES MODULE ===========================
// Manages creation, movement, and collision detection of projectiles fired
// by the player's ship.
// ========================================================================

import { state } from "./gameState.js";
import { scoreElem } from "./ui.js";

// Projectile properties
const projectileSpeed = 800;
const projectileLifetime = 1500;
const projectileDamage = 100;

// Fire a new projectile from the ship's position
function fireProjectile() {
  if (!state.gameRunning) return;

  const projectile = document.createElement("div");
  projectile.className = "projectile";

  const projectileImg = document.createElement("img");
  projectileImg.src = "assets/player/projectiles/rocket.gif"; 
  projectileImg.className = "asteroid-img";
  projectile.appendChild(projectileImg);

  // Calculate starting position and velocity based on ship's angle
  const rad = state.angle * Math.PI / 180;
  const offset = 30;
  const startX = state.shipX + Math.sin(rad) * offset;
  const startY = state.shipY - Math.cos(rad) * offset;

  // Set initial position and rotation
  projectile.style.left = `${startX}px`;
  projectile.style.top  = `${startY}px`;
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
        p.remove();
        state.projectiles = state.projectiles.filter(b => b !== p);

        const asteroidWrap = a.closest(".asteroid");
        if (asteroidWrap) {
          const asteroidImg = asteroidWrap.querySelector(".asteroid-img");
          if (asteroidImg) {
            const newImg = asteroidImg.cloneNode();
            newImg.src = `assets/asteroids/explode.gif?${Date.now()}`;
            asteroidImg.replaceWith(newImg);
          }
          const hitbox = asteroidWrap.querySelector(".asteroid-hitbox");
          if (hitbox) hitbox.remove();
          setTimeout(() => asteroidWrap.remove(), 700);
        }

        let score = parseInt(scoreElem.textContent) || 0;
        score += projectileDamage;
        scoreElem.textContent = score;
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
        score += projectileDamage + 300;
        scoreElem.textContent = score;
      }
    });
  });
}

export {
  fireProjectile,
  updateProjectiles,
  checkProjectileCollisions,
  checkProjectileCollisionsWithUfos
};
