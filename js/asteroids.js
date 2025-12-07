// =========================== ASTEROIDS MODULE ============================
// Manages spawning, movement, updating, and clearing asteroids in the game.
// =========================================================================

// Internal state to track if asteroids are active
let asteroidsActive = true;

// Function to spawn a specified number of asteroids
function spawnAsteroids(numAsteroids = Math.floor(Math.random() * 12) + 14) {
  // Do nothing if asteroids are not active
  if (!asteroidsActive) return;

  // Ensure a minimum number of asteroids
  numAsteroids = Math.max(numAsteroids, 10);

  // Create each asteroid
  for (let i = 0; i < numAsteroids; i++) {

    // Create asteroid wrapper element
    const asteroidWrapper = document.createElement("div");
    asteroidWrapper.className = "asteroid";

    // Random size between 140px and 230px
    const size = 140 + Math.random() * 90;
    asteroidWrapper.style.width = size + "px";
    asteroidWrapper.style.height = size + "px";

    // --- NEW: assign health based on size ---
    // tweak thresholds if you want tougher/easier rocks
    let health = 1;
    if (size >= 210) {
      health = 3;        // biggest rocks → 3 hits
    } else if (size >= 175) {
      health = 2;        // medium rocks → 2 hits
    } else {
      health = 1;        // small rocks → 1 hit (same as before)
    }
    asteroidWrapper.dataset.health = String(health);
    // ----------------------------------------

    // Spawn at a random edge of the screen
    const edge = Math.floor(Math.random() * 4);
    let x, y;

  // Determine position based on chosen edge
  // 0: top, 1: right, 2: bottom, 3: left
  // Spawn asteroid fully outside screen so it floats inward naturally
  switch (edge) {
    case 0: // top
      x = Math.random() * window.innerWidth;
      y = -size * 6; // further above screen
      break;

    case 1: // right
      x = window.innerWidth + size * 6;
      y = Math.random() * window.innerHeight;
      break;

    case 2: // bottom
      x = Math.random() * window.innerWidth;
      y = window.innerHeight + size * 6;
      break;

    case 3: // left
      x = -size * 6;
      y = Math.random() * window.innerHeight;
      break;
}

    // Set initial position
    asteroidWrapper.style.left = x + "px";
    asteroidWrapper.style.top = y + "px";

    // Create and append asteroid image
    const asteroidImg = document.createElement("img");
    asteroidImg.src = "assets/asteroids/base.png";
    asteroidImg.className = "asteroid-img";
    asteroidWrapper.appendChild(asteroidImg);

    // Create and append hitbox for collision detection
    const hitbox = document.createElement("div");
    hitbox.className = "asteroid-hitbox";
    asteroidWrapper.appendChild(hitbox);

    // Assign random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 125;

    // Store velocity and size in dataset for later use
    asteroidWrapper.dataset.velX = Math.cos(angle) * speed;
    asteroidWrapper.dataset.velY = Math.sin(angle) * speed;
    asteroidWrapper.dataset.size = size;

    // Random rotation and speed
    asteroidWrapper.dataset.rotation = 0;
    asteroidWrapper.dataset.rotSpeed = (Math.random() * 120 - 30);

    document.body.appendChild(asteroidWrapper);
  }
}

// Function to update positions of all asteroids
function updateAsteroids(deltaSec = 0) {
  const asteroids = document.querySelectorAll(".asteroid");

  // Update each asteroid's position
  asteroids.forEach(asteroid => {
    let x = parseFloat(asteroid.style.left);
    let y = parseFloat(asteroid.style.top);

    const velX = parseFloat(asteroid.dataset.velX);
    const velY = parseFloat(asteroid.dataset.velY);

    // Update position based on velocity and time delta
    x += velX * deltaSec;
    y += velY * deltaSec;

    // Screen wrapping logic
    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = asteroid.dataset.size;

    if (x < -size * 0.7) 
      x = width;

    if (x > width)        
      x = -size * 0.7;

    if (y < -size * 0.7) 
      y = height;

    if (y > height)       
      y = -size * 0.7;

    asteroid.style.left = x + "px";
    asteroid.style.top = y + "px";

    // Rotation update 
    let rotation = parseFloat(asteroid.dataset.rotation);
    let rotSpeed = parseFloat(asteroid.dataset.rotSpeed);
    
    rotation += rotSpeed * deltaSec;
    asteroid.dataset.rotation = rotation;

    const img = asteroid.querySelector(".asteroid-img");
    img.style.transform = `rotate(${rotation}deg)`;
  });
}

// Function to respawn asteroids if below a minimum amount
function respawnAsteroids(minAmount = 3) {
  if (!asteroidsActive) return;

  const present = document.querySelectorAll(".asteroid").length;

  // When asteroid count gets too low, spawn a *full new wave*
  if (present < minAmount) {
    spawnAsteroids();   // no parameter → use your default (18 to 33)
  }
}

// Function to clear all asteroids from the game
function clearAsteroids() {
  document.querySelectorAll(".asteroid").forEach(a => a.remove());
}

// Function to activate or deactivate asteroids
function activateAsteroids(state) {
  asteroidsActive = state;
}

export {
  spawnAsteroids,
  updateAsteroids,
  respawnAsteroids,
  clearAsteroids,
  activateAsteroids
};