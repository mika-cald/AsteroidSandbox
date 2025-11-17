// Function spawning ufos
let ufosActive = true;
// let ufoList = [];


function spawnUfos() {
  if (!ufosActive) return;
  
  const numUfos = 3;
    
  for (let i = 0; i < numUfos; i++) {
    const ufoWrapper = document.createElement("div");
    ufoWrapper.className = "ufo";
    ufoWrapper.dataset.health = 1;
    ufoWrapper.style.position = "absolute"; 

    const size = 75;
    ufoWrapper.dataset.size = size;

    ufoWrapper.dataset.velX = 0;
    ufoWrapper.dataset.velY = 0;
    ufoWrapper.dataset.offset = (Math.random() - 0.5) * 100;

    // spawn edges
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    switch (edge) {
      case 0: x = Math.random() * window.innerWidth; y = -size; break;
      case 1: x = window.innerWidth + size; y = Math.random() * window.innerHeight; break;
      case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + size; break;
      case 3: x = -size; y = Math.random() * window.innerHeight; break;
    }

    ufoWrapper.style.left = x  + "px";
    ufoWrapper.style.top = y + "px";

    // --- ufo image ---
    const ufoImg = document.createElement("img");
    ufoImg.src = "asset-files/enemy_ships/fleet_1/Kla'ed/Base/Kla'ed - Battlecruiser - Base.png";

    ufoImg.className = "ufo-img";

    ufoImg.style.width = size + "px";
    ufoImg.style.height = size + "px";
    ufoImg.style.objectFit = "contain";

    ufoWrapper.appendChild(ufoImg);

    // --- hitbox (scaled with ufo) ---
    const hitbox = document.createElement("div");
    hitbox.className = "ufo-hitbox";
    ufoWrapper.appendChild(hitbox);

    document.body.appendChild(ufoWrapper);
  }
}

// update ufo positions
function updateUfos(deltaSec = 0) {
  const ufos = document.querySelectorAll(".ufo");
  ufos.forEach(ufo => {
    if (ufo.dataset.hit === "true") return;

    let x = parseFloat(ufo.style.left);
    let y = parseFloat(ufo.style.top);
    const speed = 120;

    const dx = shipX - x;
    const dy = shipY - y;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * 180 / Math.PI;

    const ufoImg = ufo.querySelector(".ufo-img");
    if (ufoImg) {
      ufoImg.style.transform = `rotate(${angleDeg + 90}deg)`;
    }

    const dist = Math.hypot(dx, dy);

    if (dist > 0.1) {
      x += (dx / dist) * speed * deltaSec;
      y += (dy / dist) * speed * deltaSec;
    } else {
      x += (Math.random() - 0.5) * 5 * deltaSec;
      y += (Math.random() - 0.5) * 5 * deltaSec;
    }

    ufos.forEach(other => {
      if (other === ufo) return;
      let ox = parseFloat(other.style.left);
      let oy = parseFloat(other.style.top);
      let dx2 = x - ox;
      let dy2 = y - oy;
      let d = Math.hypot(dx2, dy2);
      if (d < 80) {
        x += (dx2 / d) * (80 - d) * 0.1;
        y += (dy2 / d) * (80 - d) * 0.1;
      }
    });

    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = ufo.dataset.size; 

    // wrap around
    if (x < -size * 0.75) x = width;
    if (x > width) x = -size * 0.75 ;
    if (y < -size * 0.75) y = height;
    if (y > height) y = -size * 0.75;

    ufo.style.left = x + "px";
    ufo.style.top = y + "px";
  });
}

function respawnUfos() {
  if (!ufosActive) return;
  const present = document.querySelectorAll(".ufo").length;
  if (present === 0) {
    spawnUfos();
  }

}

function clearUfos() {
  document.querySelectorAll(".ufo").forEach(u => u.remove());
}

function activateUfos(state) {
  ufosActive = state;
}