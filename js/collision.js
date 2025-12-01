// collision.js
import { ship } from "./ui.js";

function rectsOverlap(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

function collisionWithAsteroids() {
  const shipRect = ship.getBoundingClientRect();
  const hitboxes = document.querySelectorAll(".asteroid-hitbox");

  for (const box of hitboxes) {
    const rect = box.getBoundingClientRect();
    if (rectsOverlap(shipRect, rect)) return true;
  }
  return false;
}

function collisionWithUfos() {
  const shipRect = ship.getBoundingClientRect();
  const hitboxes = document.querySelectorAll(".ufo-hitbox");

  for (const box of hitboxes) {
    const rect = box.getBoundingClientRect();
    if (rectsOverlap(shipRect, rect)) return true;
  }
  return false;
}

export {
  rectsOverlap,
  collisionWithAsteroids,
  collisionWithUfos,
};
