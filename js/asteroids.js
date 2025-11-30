// ================ ASTEROIDS MODULE =================
// Manages spawning, movement, updating, and clearing asteroids in the game.
// ====================================================

// Internal state to track if asteroids are active
let asteroidsActive = true;

// Function to spawn a specified number of asteroids
function spawnAsteroids(numAsteroids = Math.floor(Math.random() * 6) + 8) {
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

    // Spawn at a random edge of the screen
    const edge = Math.floor(Math.random() * 4);
    let x, y;

    // Determine position based on chosen edge
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
    asteroidWrapper.style.left = x + "px";
    asteroidWrapper.style.top  = y + "px";

    // Create and append asteroid image
    const asteroidImg = document.createElement("img");
    asteroidImg.src = "asset-files/enviroment/Asteroids/Asteroid 01 - Base.png";
    asteroidImg.className = "asteroid-img";
    asteroidWrapper.appendChild(asteroidImg);

    // Create and append hitbox for collision detection
    const hitbox = document.createElement("div");
    hitbox.className = "asteroid-hitbox";
    asteroidWrapper.appendChild(hitbox);

    // Assign random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 125;

    asteroidWrapper.dataset.velX = Math.cos(angle) * speed;
    asteroidWrapper.dataset.velY = Math.sin(angle) * speed;
    asteroidWrapper.dataset.size = size;

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
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const size   = asteroid.dataset.size;

    if (x < -size * 0.75) 
      x = width;

    if (x > width)        
      x = -size * 0.75;

    if (y < -size * 0.75) 
      y = height;

    if (y > height)       
      y = -size * 0.75;

    asteroid.style.left = x + "px";
    asteroid.style.top  = y + "px";
  });
}

// Function to respawn asteroids if below a minimum amount
function respawnAsteroids(minAmount = 2) {
  if (!asteroidsActive) return;
  const present = document.querySelectorAll(".asteroid").length;
  if (present < minAmount) {
    spawnAsteroids(minAmount - present);
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
