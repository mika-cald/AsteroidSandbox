// Function spawning asteroids
function spawnAsteroids(numAsteroids = Math.floor(Math.random() * 6) + 8) {
  numAsteroids = Math.max(numAsteroids, 10); // at least 10 asteroids

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
    
  for (let i = 0; i < numAsteroids; i++) {
    const asteroidWrapper = document.createElement("div");
    asteroidWrapper.className = "asteroid";

    // spawn edges
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    switch (edge) {
      case 0: x = Math.random() * window.innerWidth; y = 50; break;
      case 1: x = window.innerWidth + 50; y = Math.random() * window.innerHeight; break;
      case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + 50; break;
      case 3: x = 50; y = Math.random() * window.innerHeight; break;
    }

    asteroidWrapper.style.left = x + "px";
    asteroidWrapper.style.top = y + "px";

    // --- asteroid image ---
    const asteroidImg = document.createElement("img");
    asteroidImg.src = "asset-files/enviroment/Asteroids/Asteroid 01 - Base.png";
    asteroidImg.className = "asteroid-img";
    asteroidWrapper.appendChild(asteroidImg);

    // --- inner invisible hitbox ---
    const hitbox = document.createElement("div");
    hitbox.className = "asteroid-hitbox";
    asteroidWrapper.appendChild(hitbox);

    // --- velocity data ---
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 100;
    asteroidWrapper.dataset.velX = Math.cos(angle) * speed;
    asteroidWrapper.dataset.velY = Math.sin(angle) * speed;

    document.body.appendChild(asteroidWrapper);
  }
}

// update asteroid positions
function updateAsteroids(deltaSec = 0) {
  const asteroids = document.querySelectorAll(".asteroid");
  asteroids.forEach(asteroid => {
    let x = parseFloat(asteroid.style.left);
    let y = parseFloat(asteroid.style.top);

    let velX = parseFloat(asteroid.dataset.velX);
    let velY = parseFloat(asteroid.dataset.velY);

    x += velX * deltaSec;
    y += velY * deltaSec;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = 150;

    // wrap around
    if (x < -size) x = width;
    if (x > width) x = -size;
    if (y < -size) y = height;
    if (y > height) y = -size;

    asteroid.style.left = x + "px";
    asteroid.style.top = y + "px";
  });
}

function respawnAsteroids(minAmount = 2) {
  const present = document.querySelectorAll(".asteroid").length;
  if (present < minAmount) {
    spawnAsteroids(minAmount - present);
  }

}

function clearAsteroids() {
  document.querySelectorAll(".asteroid").forEach(a => a.remove());
}
