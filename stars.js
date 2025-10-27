// Reference to the element that holds the background stars
const starsContainer = document.getElementById("stars-container");

// Function to place stars randomly on the screen
function createStars(numStars = 100) {
  // Clear only stars, not other elements
  starsContainer.innerHTML = ""; 

  // Aqquire window dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Loop to create stars
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div"); // Each star is a div
    star.className = "star"; // CSS
    star.style.top = Math.random() * height + "px"; // Random vertical position
    star.style.left = Math.random() * width + "px"; // Random horizontal position
    starsContainer.appendChild(star); // Adds star to the container
  }
}

// Creates stars on page load
createStars();

// Regenerate stars on resize
window.addEventListener("resize", () => {
  createStars();
});