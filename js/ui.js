// ui.js
import { state } from "./gameState.js";

// ========= Core UI elements =========
export const menuScreen       = document.getElementById("menu-screen");
export const highScoresScreen = document.getElementById("high-scores-screen");
export const endScreen        = document.getElementById("end-screen");

export const playBtn        = document.querySelector(".play-btn");
export const highScoresBtn  = document.querySelector(".high-scores-btn");
export const rstBtn         = document.querySelector(".restart-btn");
export const submitScoreBtn = document.getElementById("submit-score-btn");
export const backToMenuBtn  = document.getElementById("back-to-menu-btn");

export const scoreDisplay   = document.getElementById("score-display");
export const scoreElem      = document.getElementById("score");
export const finalScoreElem = document.getElementById("final-score");
export const nicknameInput  = document.getElementById("nickname");

export const gameRestart = document.getElementById("restart-game");

// Ship & engine
export const ship   = document.getElementById("ship");
export const engine = document.getElementById("engine");

// Audio toggle UI
export const musicToggle = document.getElementById("musicToggle");
export const iconOn      = document.getElementById("icon-sound-on");
export const iconOff     = document.getElementById("icon-sound-off");

// ========= Dynamic lives display =========
export const livesDisplay = document.createElement("div");
livesDisplay.className = "lives-display";
document.body.appendChild(livesDisplay);

export function updateLives() {
  livesDisplay.textContent = `Lives: ${state.lives}`;

  const img = ship.querySelector("img");
  switch (true) {
    case state.lives === 3:
      img.src = "asset-files/player_ship/Main Ship/Main Ship - Bases/Main Ship - Base - Full health.png";
      break;
    case state.lives === 2:
      img.src = "asset-files/player_ship/Main Ship/Main Ship - Bases/Main Ship - Base - Slight damage.png";
      break;
    case state.lives === 1:
      img.src = "asset-files/player_ship/Main Ship/Main Ship - Bases/Main Ship - Base - Damaged.png";
      break;
    case state.lives === 0:
      img.src = "asset-files/player_ship/Main Ship/Main Ship - Bases/Main Ship - Base - Very damaged.png";
      break;
  }
}
