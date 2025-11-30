import "./stars.js";
import { updateLives } from "./ui.js";
import { initAudio } from "./audio.js";
import { initInputHandlers } from "./input.js";

// Initialize UI state
updateLives();
initAudio();
initInputHandlers();
