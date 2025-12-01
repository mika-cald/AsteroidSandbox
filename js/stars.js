// ============================= STARS MODULE ==============================
// Creates and animates a starfield background for the game.
// =========================================================================

const starsContainer = document.getElementById("stars-container");

// Create stars with random positions and twinkling animations
function createStars(numStars = 100) {
  starsContainer.innerHTML = "";
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Generate stars
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";

    star.style.top = Math.random() * height + "px";
    star.style.left = Math.random() * width  + "px";

    // Randomize animation properties for twinkling effect
    const duration = (Math.random() * 0.5 + 0.8).toFixed(2); 
    const delay = (Math.random() * 0.4).toFixed(2);       
    const opacity = Math.random() * 0.3 + 0.7;              

    // Apply styles
    star.style.animationDuration = duration + "s";
    star.style.animationDelay = delay + "s";
    star.style.opacity = opacity;

    starsContainer.appendChild(star);
  }
}

createStars();

// Recreate stars on window resize
window.addEventListener("resize", () => {
  createStars();
});

// optional export
export { createStars };
