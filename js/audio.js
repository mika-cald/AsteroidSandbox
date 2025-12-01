// ========================= AUDIO MODULE ==========================
// Manages background music playback and cross-fading between tracks.
// =================================================================

import { state } from "./gameState.js";
import { musicToggle, iconOn, iconOff } from "./ui.js";

// Audio elements
const menuTrack = document.getElementById("menuTrack");
const gameTrack = document.getElementById("gameTrack");

// Master volume level
const MASTER_VOLUME = 0.1;

// Set initial volumes
menuTrack.volume = MASTER_VOLUME;
gameTrack.volume = MASTER_VOLUME;

// Music enabled flag
let musicEnabled = false;

// Initialize audio system and UI
function initAudio() {
  // Try to start menu music (may be blocked until user interaction)
  menuTrack.play().catch(() => {});

  musicToggle.addEventListener("click", () => {
    musicEnabled = !musicEnabled;

    // Update UI and play/pause tracks accordingly
    if (musicEnabled) {
      iconOn.style.display = "block";
      iconOff.style.display = "none";

      // Play the appropriate track based on game state
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

// Cross-fade between two audio tracks over a specified duration
function crossFadeAudio(oldAudio, newAudio, duration = 1000) {
  if (oldAudio === newAudio) return;

  const steps = 30;
  const interval = duration / steps;
  const volumeStep = MASTER_VOLUME / steps;

  newAudio.volume = 0;
  newAudio.play();

  // Perform the cross-fade
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
