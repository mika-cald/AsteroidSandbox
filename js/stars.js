// stars.js

const starsContainer = document.getElementById("stars-container");

function createStars(numStars = 100) {
  starsContainer.innerHTML = "";
  const width  = window.innerWidth;
  const height = window.innerHeight;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top  = Math.random() * height + "px";
    star.style.left = Math.random() * width  + "px";
    starsContainer.appendChild(star);
  }
}

createStars();

window.addEventListener("resize", () => {
  createStars();
});

// optional export
export { createStars };
