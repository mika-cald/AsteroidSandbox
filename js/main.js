// main.js
import "./stars.js";                 // side-effect import
import { updateLives } from "./ui.js";
import { initAudio } from "./audio.js";
import { initInputHandlers } from "./input.js";

// Initialize UI state
updateLives();
initAudio();
initInputHandlers();
