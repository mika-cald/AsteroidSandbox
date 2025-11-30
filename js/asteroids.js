// asteroids.js
let asteroidsActive = true;

function spawnAsteroids(numAsteroids = Math.floor(Math.random() * 6) + 8) {
  if (!asteroidsActive) return;

  numAsteroids = Math.max(numAsteroids, 10);

  for (let i = 0; i < numAsteroids; i++) {
    const asteroidWrapper = document.createElement("div");
    asteroidWrapper.className = "asteroid";

    const size = 140 + Math.random() * 90;
    asteroidWrapper.style.width = size + "px";
    asteroidWrapper.style.height = size + "px";

    const edge = Math.floor(Math.random() * 4);
    let x, y;
    switch (edge) {
      case 0: x = Math.random() * window.innerWidth;      y = -size;                  break;
      case 1: x = window.innerWidth + size;               y = Math.random() * window.innerHeight; break;
      case 2: x = Math.random() * window.innerWidth;      y = window.innerHeight + size; break;
      case 3: x = -size;                                  y = Math.random() * window.innerHeight; break;
    }

    asteroidWrapper.style.left = x + "px";
    asteroidWrapper.style.top  = y + "px";

    const asteroidImg = document.createElement("img");
    asteroidImg.src = "asset-files/enviroment/Asteroids/Asteroid 01 - Base.png";
    asteroidImg.className = "asteroid-img";
    asteroidWrapper.appendChild(asteroidImg);

    const hitbox = document.createElement("div");
    hitbox.className = "asteroid-hitbox";
    asteroidWrapper.appendChild(hitbox);

    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 125;
    asteroidWrapper.dataset.velX = Math.cos(angle) * speed;
    asteroidWrapper.dataset.velY = Math.sin(angle) * speed;
    asteroidWrapper.dataset.size = size;

    document.body.appendChild(asteroidWrapper);
  }
}

function updateAsteroids(deltaSec = 0) {
  const asteroids = document.querySelectorAll(".asteroid");
  asteroids.forEach(asteroid => {
    let x = parseFloat(asteroid.style.left);
    let y = parseFloat(asteroid.style.top);

    const velX = parseFloat(asteroid.dataset.velX);
    const velY = parseFloat(asteroid.dataset.velY);

    x += velX * deltaSec;
    y += velY * deltaSec;

    const width  = window.innerWidth;
    const height = window.innerHeight;
    const size   = asteroid.dataset.size;

    if (x < -size * 0.75) x = width;
    if (x > width)        x = -size * 0.75;
    if (y < -size * 0.75) y = height;
    if (y > height)       y = -size * 0.75;

    asteroid.style.left = x + "px";
    asteroid.style.top  = y + "px";
  });
}

function respawnAsteroids(minAmount = 2) {
  if (!asteroidsActive) return;
  const present = document.querySelectorAll(".asteroid").length;
  if (present < minAmount) {
    spawnAsteroids(minAmount - present);
  }
}

function clearAsteroids() {
  document.querySelectorAll(".asteroid").forEach(a => a.remove());
}

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
