function saveHighScore(name, score) {
  const highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
  highScores.push({ name, score });
  highScores.sort((a, b) => b.score - a.score);
  if (highScores.length > 3) highScores.length = 3;
  localStorage.setItem("highScores", JSON.stringify(highScores));
  updateHighScoresDisplay();
}

function updateHighScoresDisplay() {
  const highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
  for (let i = 0; i < 3; i++) {
    const elem = document.getElementById(`hs${i + 1}`);
    elem.textContent = highScores[i]
      ? `${highScores[i].name}: ${highScores[i].score}`
      : "Name: ---";
  }
}

export { saveHighScore, updateHighScoresDisplay };
