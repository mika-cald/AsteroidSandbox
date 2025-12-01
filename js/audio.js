// ========================= AUDIO MODULE ==========================
// Manages background music playback and cross-fading between tracks.
// =================================================================

import { state } from "./gameState.js";
import { musicToggle, iconOn, iconOff } from "./ui.js";

const menuTrack = document.getElementById("menuTrack");
const gameTrack = document.getElementById("gameTrack");

const MASTER_VOLUME = 0.1;

menuTrack.volume = MASTER_VOLUME;
gameTrack.volume = MASTER_VOLUME;

let musicEnabled = false;

function initAudio() {
  // Try to start menu music (may be blocked until user interaction)
  menuTrack.play().catch(() => {});

  musicToggle.addEventListener("click", () => {
    musicEnabled = !musicEnabled;

    if (musicEnabled) {
      iconOn.style.display = "block";
      iconOff.style.display = "none";

      if (state.gameRunning) {
        gameTrack.play();
      } else {
        menuTrack.play();
      }
    } else {
      iconOn.style.display = "none";
      iconOff.style.display = "block";
      menuTrack.pause();
      gameTrack.pause();
    }
  });
}

function crossFadeAudio(oldAudio, newAudio, duration = 1000) {
  if (oldAudio === newAudio) return;

  const steps       = 30;
  const interval    = duration / steps;
  const volumeStep  = MASTER_VOLUME / steps;

  newAudio.volume = 0;
  newAudio.play();

  const fade = setInterval(() => {
    if (oldAudio.volume > 0) {
      oldAudio.volume = Math.max(0, oldAudio.volume - volumeStep);
    }
    if (newAudio.volume < MASTER_VOLUME) {
      newAudio.volume = Math.min(MASTER_VOLUME, newAudio.volume + volumeStep);
    }
    if (oldAudio.volume === 0 && newAudio.volume === MASTER_VOLUME) {
      oldAudio.pause();
      clearInterval(fade);
    }
  }, interval);
}

// handy exports in case game.js needs them
export { menuTrack, gameTrack, MASTER_VOLUME, musicEnabled, initAudio, crossFadeAudio };
