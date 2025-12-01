// ========================== INPUT MODULE =================================
// Handles keyboard and button input for controlling the ship and game state.
// =========================================================================

import { state } from "./gameState.js";
import { fireProjectile } from "./projectiles.js";
import { playBtn, rstBtn, highScoresBtn, submitScoreBtn, backToMenuBtn, menuScreen, highScoresScreen, finalScoreElem, nicknameInput } from "./ui.js";
import { startGame, resetGame, backToMenu, goToMenu } from "./game.js";
import { saveHighScore, updateHighScoresDisplay} from "./highscores.js";

function initInputHandlers() {
  // Keyboard
  document.addEventListener("keydown", e => {
    state.keys[e.key.toLowerCase()] = true;

    if (e.code === "Space") fireProjectile();
    if (e.key === "Escape") backToMenu();
  });

  document.addEventListener("keyup", e => {
    state.keys[e.key.toLowerCase()] = false;
  });

  // Buttons
  playBtn.addEventListener("click", startGame);
  rstBtn.addEventListener("click", resetGame);

  highScoresBtn.addEventListener("click", () => {
    updateHighScoresDisplay();
    menuScreen.style.display = "none";
    highScoresScreen.style.display = "block";
  });

  submitScoreBtn.addEventListener("click", () => {
    const nickname = nicknameInput.value.trim() || "Player";
    const score = parseInt(finalScoreElem.textContent, 10) || 0;
    saveHighScore(nickname, score);
    goToMenu();
  });

  backToMenuBtn.addEventListener("click", goToMenu);
}

export { initInputHandlers };
