const grid = [
  [
    document.querySelector("#square1"),
    document.querySelector("#square2"),
    document.querySelector("#square3"),
    document.querySelector("#square4"),
  ],
  [
    document.querySelector("#square5"),
    document.querySelector("#square6"),
    document.querySelector("#square7"),
    document.querySelector("#square8"),
  ],
  [
    document.querySelector("#square9"),
    document.querySelector("#square10"),
    document.querySelector("#square11"),
    document.querySelector("#square12"),
  ],
];

const pieceNames = ["king", "man", "general", "minister", "feudal-lord"];
const players = ["player1", "player2"];
let playerTurn = players[0];

// Set starting pieces //
function setPieces() {
  for (let i = 0; i < pieceNames.length - 1; i++) {
    for (let j = 0; j < players.length; j++) {
      const piece = document.createElement("div");
      piece.innerText = pieceNames[i];
      piece.classList.add("tiles", `${pieceNames[i]}`, `${players[j]}`);

      switch (pieceNames[i]) {
        case "minister":
          if (players[j] == "player1") {
            grid[0][0].append(piece);
          } else {
            grid[2][3].append(piece);
          }
          break;
        case "king":
          if (players[j] == "player1") {
            grid[1][0].append(piece);
          } else {
            grid[1][3].append(piece);
          }
          break;
        case "man":
          if (players[j] == "player1") {
            grid[1][1].append(piece);
          } else {
            grid[1][2].append(piece);
          }
          break;
        case "general":
          if (players[j] == "player1") {
            grid[2][0].append(piece);
          } else {
            grid[0][3].append(piece);
          }
          break;
        default:
          break;
      }
    }
  }
}

setPieces();

let selectedPiece;
let pieceRow;
let pieceColumn;
let destinationRow;
let destinationColumn;

// Setting Event Listener //
const gridArray = document.querySelectorAll(".squares");
gridArray.forEach((clickedSquare) => {
  clickedSquare.addEventListener("click", function (e) {
    if (!selectedPiece) {
      if (e.currentTarget.firstChild.classList.contains(playerTurn)) {
        selectPiece(e.currentTarget.firstChild);
      }
    } else {
      if (!e.currentTarget.hasChildNodes()) {
        if (checkAllowableMoves(e.currentTarget, selectedPiece)) {
          e.currentTarget.append(selectedPiece);
          switchPlayer();
        }
      } else {
        if (
          checkAllowableMoves(e.currentTarget, selectedPiece) &&
          e.currentTarget.firstChild.classList[2] !== playerTurn
        ) {
          capturePiece(e.currentTarget);
          e.currentTarget.append(selectedPiece);
          switchPlayer();
        } else {
          selectedPiece = null;
          console.log(selectedPiece);
        }
      }
    }
  });
});

// Update Selected Piece //
function selectPiece(piece) {
  console.log(piece.parentNode.id);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++)
      if (grid[i][j] === document.querySelector(`#${piece.parentNode.id}`)) {
        pieceRow = i;
        pieceColumn = j;
      }
  }
  selectedPiece = piece;
  console.log(selectedPiece, pieceRow, pieceColumn);
}

// Switch Player //
function switchPlayer() {
  if (playerTurn == players[0]) {
    playerTurn = players[1];
  } else {
    playerTurn = players[0];
  }
  selectedPiece = null;
  console.log(`Next is ${playerTurn}'s turn.`);
}

// Capture Piece //
function capturePiece(square) {
  const capturedPiece = square.firstChild;
  capturedPiece.classList.add("capture-tiles");
  if (playerTurn == players[0]) {
    capturedPiece.classList.replace("player2", "player1");
    document.querySelector(".capture-reserve#player-one").append(capturedPiece);
  } else {
    capturedPiece.classList.replace("player1", "player2");
    document.querySelector(".capture-reserve#player-two").append(capturedPiece);
  }
}

// Check Allowable Moves //
function checkAllowableMoves(square, piece) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++)
      if (grid[i][j] === document.querySelector(`#${square.id}`)) {
        destinationRow = i;
        destinationColumn = j;
      }
  }

  console.log(piece.classList[1], square.id, destinationRow, destinationColumn);

  switch (piece.classList[1]) {
    case "general":
      if (
        (destinationRow == pieceRow &&
          (destinationColumn == pieceColumn + 1 ||
            destinationColumn == pieceColumn - 1)) ||
        (destinationColumn == pieceColumn &&
          (destinationRow == pieceRow + 1 || destinationRow == pieceRow - 1))
      ) {
        console.log("Move successful.");
        return true;
      } else {
        selectedPiece = null;
      }
      break;

    case "minister":
      if (
        (destinationRow == pieceRow + 1 || destinationRow == pieceRow - 1) &&
        (destinationColumn == pieceColumn + 1 ||
          destinationColumn == pieceColumn - 1)
      ) {
        console.log("Move successful.");
        return true;
      } else {
        selectedPiece = null;
      }
      break;

    case "man":
      if (
        piece.classList[2] == "player1" &&
        destinationRow == pieceRow &&
        destinationColumn == pieceColumn + 1
      ) {
        console.log("Move successful.");
        return true;
      } else if (
        piece.classList[2] == "player2" &&
        destinationRow == pieceRow &&
        destinationColumn == pieceColumn - 1
      ) {
        console.log("Move successful.");
        return true;
      } else {
        selectedPiece = null;
      }
      break;

    case "king":
      if (
        (destinationRow == pieceRow &&
          (destinationColumn == pieceColumn + 1 ||
            destinationColumn == pieceColumn - 1)) ||
        (destinationColumn == pieceColumn &&
          (destinationRow == pieceRow + 1 || destinationRow == pieceRow - 1)) ||
        ((destinationRow == pieceRow + 1 || destinationRow == pieceRow - 1) &&
          (destinationColumn == pieceColumn + 1 ||
            destinationColumn == pieceColumn - 1))
      ) {
        console.log("Move successful.");
        return true;
      } else {
        selectedPiece = null;
      }
      break;

    case "feudal-lord":
      if (piece.classList[2] == "player1") {
        if (
          (destinationRow == pieceRow &&
            (destinationColumn == pieceColumn + 1 ||
              destinationColumn == pieceColumn - 1)) ||
          (destinationColumn == pieceColumn &&
            (destinationRow == pieceRow + 1 ||
              destinationRow == pieceRow - 1)) ||
          ((destinationRow == pieceRow + 1 || destinationRow == pieceRow - 1) &&
            destinationColumn == pieceColumn + 1)
        ) {
          console.log("Move successful.");
          return true;
        }
      } else if (piece.classList[2] == "player2") {
        if (
          (destinationRow == pieceRow &&
            (destinationColumn == pieceColumn + 1 ||
              destinationColumn == pieceColumn - 1)) ||
          (destinationColumn == pieceColumn &&
            (destinationRow == pieceRow + 1 ||
              destinationRow == pieceRow - 1)) ||
          ((destinationRow == pieceRow + 1 || destinationRow == pieceRow - 1) &&
            destinationColumn == pieceColumn - 1)
        ) {
          console.log("Move successful.");
          return true;
        }
      } else {
        selectedPiece = null;
      }
      break;

    default:
      break;
  }
}

// Check Whether Man Reaches Opponent's Territory //
// Check Game End //
// Start Move from Capture System //

// Image Overlay to CSS //
// Color Overlay IF POSSIBLE //
// Adjust 'It's your Turn Now punya Opacity //
// Clickable Mouse? //
// Randomiser on who starts the game //
// Countdown Timer //
