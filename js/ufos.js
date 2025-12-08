// ============================= UFOS MODULE ===============================
// Manages UFO spawning, movement, and interactions with the player's ship.
// =========================================================================

import { state } from "./gameState.js";
import { fireUfoProjectile } from "./ufoProjectiles.js";

let ufosActive = true;

// Spawn UFOs at random edges of the screen
function spawnUfos() {
  if (!ufosActive) return;

  // Number of UFOs to spawn
  const numUfos = 3;

  // Create each UFO
  for (let i = 0; i < numUfos; i++) {
    const ufoWrapper = document.createElement("div");
    ufoWrapper.className = "ufo";
    ufoWrapper.dataset.health = 1;
    ufoWrapper.style.position = "absolute";

    const size = 75;
    ufoWrapper.dataset.size = size;

    const edge = Math.floor(Math.random() * 4);

    let x, y;

    // Determine spawn position based on edge
    // 0: top, 1: right, 2: bottom, 3: left
    switch (edge) {
      case 0: 
        x = Math.random() * window.innerWidth;      
        y = -size;                  
        break;

      case 1: 
        x = window.innerWidth + size;               
        y = Math.random() * window.innerHeight; 
        break;

      case 2: 
        x = Math.random() * window.innerWidth;      
        y = window.innerHeight + size; 
        break;

      case 3: 
        x = -size;                                  
        y = Math.random() * window.innerHeight; 
        break;
    }

    // Set initial position
    ufoWrapper.style.left = x + "px";
    ufoWrapper.style.top = y + "px";

    // Create and append UFO image
    const ufoImg = document.createElement("img");
    ufoImg.src = "assets/enemies/ships/bomber/base.png";
    ufoImg.className = "ufo-img";
    ufoImg.style.width = size + "px";
    ufoImg.style.height = size + "px";
    ufoImg.style.objectFit = "contain";
    ufoWrapper.appendChild(ufoImg);

    // Create and append hitbox for collision detection
    const hitbox = document.createElement("div");
    hitbox.className = "ufo-hitbox";
    ufoWrapper.appendChild(hitbox);

    document.body.appendChild(ufoWrapper);
  }
}

// Update UFO positions and behavior
function updateUfos(deltaSec = 0) {
  const ufos = document.querySelectorAll(".ufo");
  ufos.forEach(ufo => {
    if (ufo.dataset.hit === "true") return;

    // Current position
    let x = parseFloat(ufo.style.left);
    let y = parseFloat(ufo.style.top);
    
    // UFO speed
    const speed = 120;

    // Vector towards the ship
    const dx = state.shipX - x;
    const dy = state.shipY - y;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * 180 / Math.PI;

    // Rotate UFO to face the ship
    const ufoImg = ufo.querySelector(".ufo-img");
    if (ufoImg) {
      ufoImg.style.transform = `rotate(${angleDeg + 90}deg)`;
    }

    // Distance to the ship
    const dist = Math.hypot(dx, dy);

    // Move towards the ship
    if (dist > 0.1) {
      x += (dx / dist) * speed * deltaSec;
      y += (dy / dist) * speed * deltaSec;
    } else {
      x += (Math.random() - 0.5) * 5 * deltaSec;
      y += (Math.random() - 0.5) * 5 * deltaSec;
    }

    // Avoid overlapping with other UFOs
    ufos.forEach(other => {
      if (other === ufo) return;
      let ox = parseFloat(other.style.left);
      let oy = parseFloat(other.style.top);
      let dx2 = x - ox;
      let dy2 = y - oy;
      let d = Math.hypot(dx2, dy2);

      // If too close, push apart
      if (d < 80) {
        x += (dx2 / d) * (80 - d) * 0.1;
        y += (dy2 / d) * (80 - d) * 0.1;
      }
    });

    // Screen wrapping
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const size   = ufo.dataset.size;

    // Wrap around screen edges
    if (x < -size * 0.75) 
      x = width;

    if (x > width)        
      x = -size * 0.75;

    if (y < -size * 0.75) 
      y = height;

    if (y > height)       
      y = -size * 0.75;

    ufo.style.left = x + "px";
    ufo.style.top  = y + "px";

    // UFO Shooting Logic
    if (!ufo.dataset.lastShotTime) ufo.dataset.lastShotTime = 0;
    const now = performance.now();
    if (now - ufo.dataset.lastShotTime > 3000) { // fire every 3s
      fireUfoProjectile(ufo);
      ufo.dataset.lastShotTime = now;
    }
  });
}

// Ensure a minimum number of UFOs are present
function respawnUfos(minAmount = 1) {
  if (!ufosActive) return;
  const present = document.querySelectorAll(".ufo").length;
  if (present < minAmount) spawnUfos();
}

// Clear all UFOs from the screen
function clearUfos() {
  document.querySelectorAll(".ufo").forEach(u => u.remove());
}

// Activate or deactivate UFO spawning and movement
function activateUfos(state) {
  ufosActive = state;
}

export { spawnUfos, updateUfos, respawnUfos, clearUfos, activateUfos };
