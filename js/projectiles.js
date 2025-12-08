// ========================= PROJECTILES MODULE ===========================
// This file handles projectile creation, direction, movement, lifetime,
// and collision detection with asteroids and UFOs.
// ========================================================================

import { state } from "./gameState.js";
import { scoreElem } from "./ui.js";

// Projectile properties
const projectileSpeed = 800; // pixels per second
const projectileLifetime = 1500; // milliseconds
const projectileDamage = 100; // points per hit

// Fires a new projectile from the ship's position
function fireProjectile() {
  // Exit guard that prevents firing when the game is not running
  if (!state.gameRunning) return;


// ======= Fire Rate Limiter =======
  const now = performance.now();

  // Enforce a cooldown between shots
  if (now - state.lastShotTime < state.shotCooldown) {
  return; 
  }

  state.lastShotTime = now; // Update last shot time
  // ===============================

  // Creates projectile element
  const projectile = document.createElement("div");
  projectile.className = "projectile";

  // Create and append projectile image
  const projectileImg = document.createElement("img");
  projectileImg.src = "assets/player/projectiles/rocket.gif"; 
  projectileImg.className = "asteroid-img";
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

  // Append to document and track in state
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

    // Update position based on velocity and time delta
    x += parseFloat(p.dataset.velX) * deltaSec;
    y += parseFloat(p.dataset.velY) * deltaSec;

    // Apply new position
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    // Remove projectile if it goes off-screen
    if (x < -10 || x > window.innerWidth + 10 || y < -10 || y > window.innerHeight + 10) {
      p.remove();
      state.projectiles = state.projectiles.filter(b => b !== p);
    }
  });
}

// Check for collisions between projectiles and asteroids
function checkProjectileCollisions() {
  const asteroids = document.querySelectorAll(".asteroid-hitbox");

  // Iterate over a copy of the projectiles array to avoid issues while removing
  [...state.projectiles].forEach(p => {
    const pRect = p.getBoundingClientRect();

    [...asteroids].forEach(a => {
      const aRect = a.getBoundingClientRect();

      // AABB collision detection
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
        // If asteroidWrap is found, reduce health or destroy
        if (asteroidWrap) {
          // multi-hit health system 
          let health = parseInt(asteroidWrap.dataset.health || "1", 10);
          health--;
          asteroidWrap.dataset.health = String(health);

          // If health reaches zero, destroy asteroid
          if (health <= 0) {
            // Only when the asteroid is destroyed does the asteroid explode and score is awarded
            const asteroidImg = asteroidWrap.querySelector(".asteroid-img");
            if (asteroidImg) {
              const newImg = asteroidImg.cloneNode();
              newImg.src = `assets/asteroids/explode.gif?${Date.now()}`;
              asteroidImg.replaceWith(newImg);
            }
            const hitbox = asteroidWrap.querySelector(".asteroid-hitbox");
            // Remove hitbox to prevent further collisions
            if (hitbox) hitbox.remove();
            setTimeout(() => asteroidWrap.remove(), 700);

            // Score awarded on destruction, not each hit
            let score = parseInt(scoreElem.textContent) || 0;
            score += projectileDamage;
            scoreElem.textContent = score;
          }
        }
      }
    });
  });
}

// Check for collisions between projectiles and UFOs
function checkProjectileCollisionsWithUfos() {
  // Get all UFO hitboxes
  const ufos = document.querySelectorAll(".ufo-hitbox");

  // Iterate over a copy of the projectiles array to avoid issues while removing
  [...state.projectiles].forEach(p => {
    const pRect = p.getBoundingClientRect();

    // Check against each UFO
    [...ufos].forEach(u => {
      const aRect = u.getBoundingClientRect(); // UFO hitbox rectangle

      // AABB collision detection
      const hit =
        pRect.left < aRect.right &&
        pRect.right > aRect.left &&
        pRect.top < aRect.bottom &&
        pRect.bottom > aRect.top;

      // If a collision is detected
      if (hit) {
        p.remove(); // Remove projectile
        state.projectiles = state.projectiles.filter(b => b !== p); // Update state

        // Find the UFO wrapper element
        const ufoWrap = u.closest(".ufo");
        if (!ufoWrap) return; // Safety check

        // Reduce UFO health
        let health = parseInt(ufoWrap.dataset.health) || 3;
        health--;
        ufoWrap.dataset.health = health; // Update health

        // If health reaches zero, destroy UFO
        if (health <= 0) {
          ufoWrap.dataset.hit = "true"; // Mark UFO as hit

          // Play destruction animation
          const ufoImg = ufoWrap.querySelector(".ufo-img");
          if (ufoImg) {
            const newImg = ufoImg.cloneNode();
            ufoImg.replaceWith(newImg);
            newImg.src = `assets/enemies/ships/bomber/destruction.gif?${Date.now()}`;
          }

          // Remove hitbox to prevent further collisions
          const hitbox = ufoWrap.querySelector(".ufo-hitbox");
          if (hitbox) hitbox.remove();
          setTimeout(() => ufoWrap.remove(), 1400);
        }

        // Update score for hitting UFO
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