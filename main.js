// ============================================================
//                       ASTEROIDS MAIN SCRIPT
// ============================================================
// This JavaScript file runs the entire Asteroids game in the browser.
// It connects to HTML elements, handles user input, moves the spaceship,
// spawns and updates asteroids and bullets, checks for collisions,
// tracks score and lives, and runs the main animation loop using
// requestAnimationFrame (which updates the game ~60 times per second).
// ============================================================


// ================== DOM REFERENCES ==================
// "DOM" means Document Object Model — every HTML element on the page can be
// accessed and controlled through JavaScript. Below we grab references to all
// key UI and gameplay elements by their ID or class name.

const menuScreen = document.getElementById("menu-screen");          // Main menu container
const playBtn = document.querySelector(".play-btn");                // "Play" button in the menu
const highScoresBtn = document.querySelector(".high-scores-btn");   // Button to view high scores
const highScoresScreen = document.getElementById("high-scores-screen"); // High scores list section
const ship = document.getElementById("ship");                       // The player's ship (a div containing an <img>)
const propellantFlame = document.getElementById("propellant");      // The glowing purple flame under the ship
const scoreDisplay = document.getElementById("score-display");      // Small score counter in the corner
const gameRestart = document.getElementById("restart-game");        // “Game Over” overlay section
const rstBtn = document.querySelector(".restart-btn");              // Restart button element
const scoreElem = document.getElementById("score");                 // <span> element that shows numeric score


// ================== GAME STATE VARIABLES ==================
// These variables store all data that describes the current "world state" of the game.
// They are updated continuously as the player moves, shoots, or collides.

let shipX = window.innerWidth / 2;  // Ship's X position in pixels (center of screen)
let shipY = window.innerHeight / 2; // Ship's Y position in pixels (center of screen)
let angle = 0;                      // Ship’s facing direction, measured in degrees (0 = upward)
let velX = 0;                       // Ship’s horizontal velocity (how fast it's moving left/right)
let velY = 0;                       // Ship’s vertical velocity (how fast it's moving up/down)

// --- Gameplay tuning constants ---
const thrust = 600;          // How strong the forward acceleration is when pressing "W"
const rotationSpeed = 180;   // How many degrees per second the ship rotates when pressing A/D
const friction = 0.98;       // Simulates space friction (slows movement slightly each frame)

// --- Runtime management ---
let keys = {};               // Object that stores which keys are currently pressed (e.g. keys["w"] = true)
let gameRunning = false;     // Whether the game is currently active (false during menu/game over)
let loopId;                  // Holds the requestAnimationFrame() ID so we can cancel it
let lastTime = 0;            // Time (in milliseconds) of the previous frame — used for delta-time calculation
let lives = 3;               // Player’s remaining lives
let isInvincible = false;    // Temporary protection after taking damage
let projectiles = [];        // Array to store all bullets currently active on screen

// --- Projectile stats ---
const projectileSpeed = 800;       // Bullet speed in pixels per second
const projectileLifetime = 1500;   // How long a bullet exists before disappearing (milliseconds)
const projectileDamage = 100;      // How many points are earned when an asteroid is destroyed


// ================== LIVES DISPLAY ==================
// This dynamically creates a small "Lives: X" label in the corner.

const livesDisplay = document.createElement("div");  // Create a new <div> element
livesDisplay.className = "lives-display";            // Add CSS class defined in styles.css
document.body.appendChild(livesDisplay);             // Add it to the document so it’s visible

// Function to update the text of the lives counter
function updateLives() {
  livesDisplay.textContent = `Lives: ${lives}`;
}
updateLives(); // Initialize with the starting number of lives


// ================== COLLISION HELPERS ==================
// These functions determine when two objects (like the ship and an asteroid)
// are overlapping on the screen. Collision detection is done using rectangles
// that represent the visible bounds of elements (called "hitboxes").

// Returns true if two rectangles (r1 and r2) overlap each other.
function rectsOverlap(r1, r2) {
  return !(
    r2.left > r1.right ||   // r2 is completely to the right of r1
    r2.right < r1.left ||   // r2 is completely to the left of r1
    r2.top > r1.bottom ||   // r2 is completely below r1
    r2.bottom < r1.top      // r2 is completely above r1
  );
}

// Checks if the ship has collided with any asteroid hitboxes.
function collisionWithAsteroids() {
  const shipRect = ship.getBoundingClientRect();                  // Get ship’s rectangle on the screen
  const hitboxes = document.querySelectorAll(".asteroid-hitbox"); // Each asteroid has an invisible hitbox 
  for (const box of hitboxes) {
    const rect = box.getBoundingClientRect();
    if (rectsOverlap(shipRect, rect)) return true;                // If overlap found → collision occurred
  }
  return false; // No collision
}


// ================== SHIP UPDATE ==================
// Handles rotation, thrust, physics, and screen wrapping for the ship.

function updateShip(deltaSec = 0) {
  // deltaSec = time difference since last frame in seconds.
  // It keeps movement consistent on all computers (even if FPS changes).

  // Only apply controls if the game is active
  if (gameRunning) {

    // A/D rotate the ship left/right. Rotation speed is scaled by deltaSec.
    if (keys["a"]) angle -= rotationSpeed * deltaSec;
    if (keys["d"]) angle += rotationSpeed * deltaSec;

    // W key applies forward thrust in the direction the ship is facing.
    if (keys["w"]) {
      // Convert angle (degrees) to radians, because Math.sin/cos use radians.
      velX += Math.sin(angle * Math.PI / 180) * thrust * deltaSec;
      velY -= Math.cos(angle * Math.PI / 180) * thrust * deltaSec;

      // Make the flame visible and flicker by changing its height slightly.
      propellantFlame.style.opacity = "1";
      propellantFlame.style.height = 25 + Math.random() * 15 + "px";
      propellantFlame.style.transform = "translate(-50%, 0)";
    } else {
      // Hide flame when not pressing thrust.
      propellantFlame.style.opacity = "0";
    }

  } else {
    // When not in-game, flame should always be invisible.
    propellantFlame.style.opacity = "0";
  }

  // --- Apply friction ---
  // Friction gradually reduces velocity so the ship slows down over time.
  velX *= Math.pow(friction, deltaSec * 60);
  velY *= Math.pow(friction, deltaSec * 60);

  // --- Update position based on velocity ---
  shipX += velX * deltaSec;
  shipY += velY * deltaSec;

  // --- Screen wrapping ---
  // When the ship flies off one side of the screen, it reappears on the opposite side.
  if (shipX < 0) shipX = window.innerWidth;
  if (shipX > window.innerWidth) shipX = 0;
  if (shipY < 0) shipY = window.innerHeight;
  if (shipY > window.innerHeight) shipY = 0;

  // --- Apply new position and rotation visually ---
  ship.style.left = shipX + "px";
  ship.style.top = shipY + "px";
  ship.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}


// ================== PROJECTILES ==================
// Bullets are created when the player presses Spacebar.

function fireProjectile() {
  if (!gameRunning) return; // Prevent firing while in menu or after game over.

  const projectile = document.createElement("div"); // Create new <div> for the projectile
  projectile.className = "projectile";              // Assign projectile CSS

  // Calculate where the projectile starts — just in front of the ship’s nose.
  const rad = angle * Math.PI / 180; // Convert angle to radians
  const offset = 30;                 // Distance from ship center to projectile start point
  const startX = shipX + Math.sin(rad) * offset;
  const startY = shipY - Math.cos(rad) * offset;

  // Position and rotate the projectile visually.
  projectile.style.left = `${startX}px`;
  projectile.style.top = `${startY}px`;
  projectile.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

  // Store velocity (in pixels per second) inside the element’s dataset
  projectile.dataset.velX = Math.sin(rad) * projectileSpeed;
  projectile.dataset.velY = -Math.cos(rad) * projectileSpeed;

  // Add to page and list of active projectiles
  document.body.appendChild(projectile);
  projectiles.push(projectile);

  // Automatically remove projectile after a certain lifetime to save memory.
  setTimeout(() => {
    if (projectile.parentNode) {
      projectile.remove();
      projectiles = projectiles.filter(b => b !== projectile);
    }
  }, projectileLifetime);
}


// Moves all active bullets each frame
function updateProjectiles(deltaSec) {
  projectiles.forEach(p => {
    // Get current position
    let x = parseFloat(p.style.left);
    let y = parseFloat(p.style.top);

    // Move bullet according to its velocity and delta time
    x += parseFloat(p.dataset.velX) * deltaSec;
    y += parseFloat(p.dataset.velY) * deltaSec;

    // Apply new position
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    // Remove bullets that go off-screen to prevent buildup
    if (x < -10 || x > window.innerWidth + 10 || y < -10 || y > window.innerHeight + 10) {
      p.remove();
      projectiles = projectiles.filter(b => b !== p);
    }
  });
}


// ================== PROJECTILE COLLISIONS ==================
// Detects bullet-asteroid collisions and handles scoring.
function checkProjectileCollisions() {
  const asteroids = document.querySelectorAll(".asteroid-hitbox");
  [...projectiles].forEach(p => {
    const pRect = p.getBoundingClientRect(); // Bullet’s rectangle
    [...asteroids].forEach(a => {
      const aRect = a.getBoundingClientRect(); // Asteroid’s rectangle

      // Basic AABB (Axis-Aligned Bounding Box) overlap test
      const hit =
        pRect.left < aRect.right &&
        pRect.right > aRect.left &&
        pRect.top < aRect.bottom &&
        pRect.bottom > aRect.top;

      if (hit) {
        // Remove bullet on impact
        p.remove();
        projectiles = projectiles.filter(b => b !== p);

        // Remove the entire asteroid that was hit
        const asteroidWrap = a.closest(".asteroid");
        if (asteroidWrap) asteroidWrap.remove();

        // Add points to score
        let score = parseInt(scoreElem.textContent) || 0;
        score += projectileDamage;
        scoreElem.textContent = score;
      }
    });
  });
}


// ================== COLLISION HANDLER (SHIP) ==================
// Called when the ship touches an asteroid.
function handleCollision() {
  if (isInvincible) return; // Skip if ship is currently immune
  isInvincible = true;      // Enable brief invulnerability

  // Decrease lives (but never below zero)
  lives = Math.max(0, lives - 1);
  updateLives();

  // Flash red for a visual hit effect
  const img = ship.querySelector("img");
  img.style.filter =
    "brightness(0) saturate(100%) invert(38%) sepia(90%) saturate(5342%) hue-rotate(343deg)";
  setTimeout(() => (img.style.filter = "none"), 300);

  if (lives === 0) {
    // Out of lives → game over
    cancelAnimationFrame(loopId);
    gameRunning = false;
    isInvincible = false;
    shipDestroyed();
  } else {
    // Small delay of invulnerability (1.2s) to recover
    setTimeout(() => (isInvincible = false), 1200);
  }
}


// ================== GAME LOOP ==================
// The main loop runs ~60 times per second using requestAnimationFrame.
// Each frame updates movement, physics, collisions, and visuals.

function gameLoop(timestamp) {
  // Calculate delta time (in seconds) since the last frame
  if (lastTime === 0) lastTime = timestamp;
  let deltaSec = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Clamp large frame jumps (prevents huge motion spikes if tab was unfocused)
  if (deltaSec > 0.05) deltaSec = 0.05;

  // --- Update all systems ---
  updateShip(deltaSec);
  updateProjectiles(deltaSec);
  checkProjectileCollisions();
  updateAsteroids(deltaSec);
  respawnAsteroids(2);

  // --- Ship collisions ---
  if (collisionWithAsteroids()) handleCollision();

  // Request the next frame → creates a continuous animation loop
  loopId = requestAnimationFrame(gameLoop);
}


// ================== GAME OVER (SHIP DESTROYED) ==================
function shipDestroyed() {
  cancelAnimationFrame(loopId); // Stop the loop
  gameRunning = false;
  isInvincible = false;

  // Stop all key movement
  Object.keys(keys).forEach(k => (keys[k] = false));

  // Remove all asteroids
  clearAsteroids();

  // Hide flame
  propellantFlame.style.opacity = "0";

  // Show “Game Over” overlay
  gameRestart.style.display = "block";
  scoreDisplay.style.display = "block";
  livesDisplay.style.display = "block";
}


// ================== RESET / START / MENU ==================
// Functions to restart or return to menu.

function resetGame() {
  cancelAnimationFrame(loopId);
  clearAsteroids();
  lastTime = 0;
  gameRunning = false;
  isInvincible = false;
  lives = 3;
  updateLives();
  scoreElem.textContent = "0";

  // Reset ship physics and position
  shipX = window.innerWidth / 2;
  shipY = window.innerHeight / 2;
  velX = velY = 0;
  angle = 0;

  // Remove all bullets
  projectiles.forEach(p => p.remove());
  projectiles = [];

  // Hide game elements
  ship.style.display = "none";
  scoreDisplay.style.display = "none";
  livesDisplay.style.display = "none";
  gameRestart.style.display = "none";

  // Show main menu again
  menuScreen.style.display = "block";
}


// Start a brand new game session
function startGame() {
  // Hide all menu/overlay screens
  menuScreen.style.display = "none";
  highScoresScreen.style.display = "none";
  gameRestart.style.display = "none";

  // Show gameplay elements
  ship.style.display = "block";
  scoreDisplay.style.display = "block";
  livesDisplay.style.display = "block";

  // Reset values
  lives = 3;
  isInvincible = false;
  updateLives();
  scoreElem.textContent = "0";
  clearAsteroids();
  spawnAsteroids(); // Create a random asteroid field
  projectiles = [];
  lastTime = 0;

  // Start the main loop
  if (!gameRunning) {
    gameRunning = true;
    loopId = requestAnimationFrame(gameLoop);
  }
}


// Return to main menu (used by pressing Escape)
function backToMenu() {
  cancelAnimationFrame(loopId);
  clearAsteroids();
  lastTime = 0;
  gameRunning = false;
  isInvincible = false;
  lives = 3;
  updateLives();

  // Reset ship
  shipX = window.innerWidth / 2;
  shipY = window.innerHeight / 2;
  velX = velY = 0;
  angle = 0;

  // Clear bullets
  projectiles.forEach(p => p.remove());
  projectiles = [];

  // Hide gameplay UI
  ship.style.display = "none";
  scoreDisplay.style.display = "none";
  livesDisplay.style.display = "none";

  // Show menu
  menuScreen.style.display = "block";
}


// ================== INPUT & MENU CONTROLS ==================
// Handle keyboard presses and UI button clicks.

// --- Keyboard input ---
document.addEventListener("keydown", e => {
  // Convert key to lowercase so "W" and "w" are treated the same
  keys[e.key.toLowerCase()] = true;

  // Pressing Space fires a bullet
  if (e.code === "Space") fireProjectile();

  // Pressing Escape immediately returns to main menu
  if (e.key === "Escape") backToMenu();
});

// When a key is released, mark it as no longer pressed
document.addEventListener("keyup", e => (keys[e.key.toLowerCase()] = false));


// --- Menu buttons ---
playBtn.addEventListener("click", startGame);   // Start game from menu
rstBtn.addEventListener("click", resetGame);    // Restart game after death
highScoresBtn.addEventListener("click", () => { // Show high score list
  menuScreen.style.display = "none";
  highScoresScreen.style.display = "block";
});



