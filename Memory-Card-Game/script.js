const board = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restart");
const message = document.getElementById("message");
const difficultySelect = document.getElementById("difficulty");

let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer;
let seconds = 0;
let cardValues = [];

const emojis = [
  "🍎","🍌","🍇","🍒","🍉","🥑","🍍","🥝","🍑","🥥","🥕","🍆",
  "🍔","🍟","🍕","🌭","🍿","🥨","🥓","🥩","🥗","🍪","🍩","🍫",
  "⚽","🏀","🏈","🎾","🎲","🎯","🎵","🎸","🎹","🎮","🎧","🎤"
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startGame() {
  board.innerHTML = "";
  message.style.display = "none";
  moves = 0;
  matches = 0;
  movesDisplay.textContent = moves;
  seconds = 0;
  timerDisplay.textContent = "0s";
  clearInterval(timer);

  let gridSize;
  if (difficultySelect.value === "easy") {
    gridSize = 4;
  } else if (difficultySelect.value === "medium") {
    gridSize = 6;
  } else {
    gridSize = 8;
  }

  const numCards = gridSize * gridSize;
  const chosen = emojis.slice(0, numCards / 2);
  cardValues = [...chosen, ...chosen];
  const shuffled = shuffle(cardValues);

  //Adjust grid
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  shuffled.forEach(value => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;
    card.textContent = "?";
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `${seconds}s`;
  }, 1000);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  this.textContent = this.dataset.value;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.textContent = moves;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.value === secondCard.dataset.value;
  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  matches++;
  resetBoard();

  if (matches === cardValues.length / 2) {
    clearInterval(timer);
    message.style.display = "block";
    message.textContent = `🎉 Congratulations! You finished in ${moves} moves and ${seconds}s`;
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard.textContent = "?";
    secondCard.textContent = "?";
    resetBoard();
  }, 800);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

restartBtn.addEventListener("click", startGame);
difficultySelect.addEventListener("change", startGame);

startGame();

//EOF