const statusDisplay = document.getElementById("status");
const modeSelect = document.getElementById("mode");
const cells = document.querySelectorAll(".cell");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Handle clicks on cells
function handleCellClick(event) {
  const index = Number(event.target.dataset.index);
  if (board[index] !== "" || !gameActive) return;

  // read mode fresh (in case user changed it)
  const mode = modeSelect.value;

  if (mode === "pvp") {
    // PvP: make the move for the current player (makeMove handles switching)
    makeMove(index, currentPlayer);
  } else {
    // vs AI: allow human only when it's X's turn
    if (currentPlayer !== "X") return;
    makeMove(index, "X");
    if (gameActive) {
      // give a tiny delay so player sees their move before AI responds
      setTimeout(aiMove, 400);
    }
  }
}

// Apply a move to board and UI, handle win/tie and turn switching
function makeMove(index, player) {
  if (!gameActive || board[index] !== "") return;

  board[index] = player;
  cells[index].textContent = player;

  if (checkWinnerOnBoard(board, player)) {
    statusDisplay.textContent = `🎉 Player ${player} wins!`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusDisplay.textContent = "🤝 It's a tie!";
    gameActive = false;
    return;
  }

  // switch turn
  currentPlayer = player === "X" ? "O" : "X";
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Check winner for an arbitrary board state (used by minimax too)
function checkWinnerOnBoard(boardState, player) {
  return winningConditions.some(condition =>
    condition.every(idx => boardState[idx] === player)
  );
}

// AI move (uses Minimax, unbeatable)
function aiMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move === -1) return; // safety
  makeMove(move, "O");
}

// Minimax algorithm (evaluates the passed board state)
function minimax(newBoard, depth, isMaximizing) {
  if (checkWinnerOnBoard(newBoard, "O")) return 10 - depth;
  if (checkWinnerOnBoard(newBoard, "X")) return depth - 10;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Reset game and update mode/readiness
function resetGame() {
  board = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  statusDisplay.textContent = `Player X's turn`;
  cells.forEach(cell => (cell.textContent = ""));
}

// Attach listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
modeSelect.addEventListener("change", resetGame);
//EOF