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

let playerId;
let selectedPiece;
let pieceRow;
let pieceColumn;
let destinationRow;
let destinationColumn;

let playerTurn = players[0];

document.querySelector("button").addEventListener("click", function (e) {
  setStartPlayer();
  clearBoard();
  clearCaptured();
  setPieces();
  document.querySelector("button").disabled = true;
  document.querySelector("h2").textContent = "";
});

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

function setStartPlayer() {
  document.querySelector("#player-one >.your-turn").style.opacity = 1;
}

// Setting Event Listener //

const gridArray = document.querySelectorAll(".squares");
gridArray.forEach((clickedSquare) => {
  clickedSquare.addEventListener("click", function (e) {
    if (!selectedPiece) {
      if (e.currentTarget.firstChild.classList.contains(playerTurn)) {
        selectPiece(e.currentTarget.firstChild);
        console.log(selectedPiece);
      }
    } else {
      if (
        selectedPiece.classList.contains("capture-tiles") &&
        !e.currentTarget.hasChildNodes()
      ) {
        if (placingCaptured(e.currentTarget)) {
          if (!hasGameEnded()) {
            switchPlayer();
          }
        } else {
          deselectPiece();
          console.log("Here.");
        }
      } else if (
        !selectedPiece.classList.contains("capture-tiles") &&
        !e.currentTarget.hasChildNodes()
      ) {
        if (checkAllowableMoves(e.currentTarget, selectedPiece)) {
          e.currentTarget.append(selectedPiece);
          isManInTerr();
          if (!hasGameEnded()) {
            switchPlayer();
          }
        }
      } else if (e.currentTarget.hasChildNodes()) {
        console.log("restored tile");
        if (
          checkAllowableMoves(e.currentTarget, selectedPiece) &&
          e.currentTarget.firstChild.classList[2] !== playerTurn
        ) {
          capturePiece(e.currentTarget);
          e.currentTarget.append(selectedPiece);
          isManInTerr();
          if (!hasGameEnded()) {
            switchPlayer();
          }
        } else {
          deselectPiece();
          console.log("Here.");
        }
      }
    }
  });
});

// Update Selected Piece //
function selectPiece(piece) {
  console.log(piece.parentNode.id);
  console.log(piece);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === document.querySelector(`#${piece.parentNode.id}`)) {
        pieceRow = i;
        pieceColumn = j;
      }
    }
  }
  selectedPiece = piece;
  console.log(selectedPiece);
  selectedPiece.classList.add("clickedtile");
  console.log(selectedPiece, pieceRow, pieceColumn);
}

function deselectPiece() {
  console.log(selectedPiece.classList);
  selectedPiece.classList.remove("clickedtile");
  console.log(selectedPiece.classList);
  selectedPiece = null;
  console.log("Selected piece: " + selectedPiece);
}

// Switch Player //
function switchPlayer() {
  if (playerTurn == players[0]) {
    playerTurn = players[1];
    document.querySelector("#player-one >.your-turn").style.opacity = 0;
    document.querySelector("#player-two >.your-turn").style.opacity = 1;
  } else {
    playerTurn = players[0];
    document.querySelector("#player-one >.your-turn").style.opacity = 1;
    document.querySelector("#player-two >.your-turn").style.opacity = 0;
  }
  deselectPiece();
  console.log("Here.");
  console.log(`Next is ${playerTurn}'s turn.`);

  if (playerTurn == players[0]) {
    playerId = "player-one";
  } else {
    playerId = "player-two";
  }

  //   Check Possibility of Next Player Starting from Captured Tile //
  if (
    document.querySelector(`#${playerId} >.capture-reserve`).hasChildNodes()
  ) {
    fromCapturedTiles();
    console.log(document.querySelector(`#${playerId} >.capture-reserve`));
  }
}

// Capture Piece //
function capturePiece(square) {
  const capturedPiece = square.firstChild;

  // Special for Feudal Lord //
  if (capturedPiece.classList.contains("feudal-lord")) {
    capturedPiece.classList.replace("feudal-lord", "man");
    capturedPiece.innerText = "man";
  }

  capturedPiece.classList.add("capture-tiles");

  if (playerTurn == players[0]) {
    capturedPiece.classList.replace("player2", "player1");
    document
      .querySelector("#player-one >.capture-reserve")
      .append(capturedPiece);
  } else {
    capturedPiece.classList.replace("player1", "player2");
    document
      .querySelector("#player-two >.capture-reserve")
      .append(capturedPiece);
  }
}

// Check Allowable Moves //
function checkAllowableMoves(square, piece) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === document.querySelector(`#${square.id}`)) {
        destinationRow = i;
        destinationColumn = j;
      }
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
        deselectPiece();
        console.log("Here.");
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
        deselectPiece();
        console.log("Here.");
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
        deselectPiece();
        console.log("Here.");
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
        deselectPiece;
        console.log("Here.");
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
        } else {
          deselectPiece();
          console.log("Here.");
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
        } else {
          deselectPiece();
          console.log("Here.");
        }
      }
      break;

    default:
      break;
  }
}

// Check whether Game has Ended //
function hasGameEnded() {
  let numberOfKings = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j].hasChildNodes()) {
        if (grid[i][j].firstChild.classList.contains("king")) {
          numberOfKings++;
        }
      }
    }
  }
  if (numberOfKings == 2) {
    return false;
  } else {
    alert(`${playerTurn} has won the game!`);
    playerName = document.querySelector(
      `#${playerId} >.player-name`
    ).textContent;
    document.querySelector(
      "h2"
    ).textContent = `${playerName} has won the game! Restart game?`;
    document.querySelector("button").disabled = false;
    return true;
  }
}

// Check Whether Man Reaches Opponent's Territory //
function isManInTerr() {
  for (let i = 0; i < grid.length; i++) {
    if (
      (grid[i][0].hasChildNodes() &&
        grid[i][0].firstChild.matches(".man.player2")) ||
      (grid[i][3].hasChildNodes() &&
        grid[i][3].firstChild.matches(".man.player1"))
    ) {
      manUpgrades(selectedPiece);
    }
  }
}

// Man Upgrades to Feudal Lord //
function manUpgrades(piece) {
  piece.classList.replace("man", "feudal-lord");
  piece.innerText = "feudal lord";
  console.log(piece);
}

// Start Move from Capture System //
function fromCapturedTiles() {
  const capturedContainer = document.querySelector(
    `#${playerId} >.capture-reserve`
  );
  capturedContainer.addEventListener("click", function (e) {
    if (!selectedPiece) {
      console.log(e.target);
      if (e.target.classList.contains(playerTurn)) {
        selectedPiece = e.target;
        selectedPiece.classList.add("clickedtile");
        console.log(selectedPiece);
      }
    }
  });
}

// Placing Captured Tiles to Grid //
function placingCaptured(selectedSquare) {
  if (playerTurn == players[0]) {
    if (
      selectedSquare !== document.querySelector("#square4") &&
      selectedSquare !== document.querySelector("#square8") &&
      selectedSquare !== document.querySelector("#square12")
    ) {
      selectedPiece.classList.remove("capture-tiles");
      selectedSquare.append(selectedPiece);
      return true;
    } else {
      return false;
    }
  } else if (playerTurn == players[1]) {
    if (
      selectedSquare !== document.querySelector("#square1") &&
      selectedSquare !== document.querySelector("#square5") &&
      selectedSquare !== document.querySelector("#square9")
    ) {
      selectedPiece.classList.remove("capture-tiles");
      selectedSquare.append(selectedPiece);
      return true;
    } else {
      return false;
    }
  }
}

function clearCaptured() {
  while (
    document.querySelector(`#player-one >.capture-reserve`).hasChildNodes()
  ) {
    document
      .querySelector(`#player-one >.capture-reserve`)
      .removeChild(
        document.querySelector(`#player-one >.capture-reserve`).firstChild
      );
  }
  while (
    document.querySelector(`#player-two >.capture-reserve`).hasChildNodes()
  ) {
    document
      .querySelector(`#player-two >.capture-reserve`)
      .removeChild(
        document.querySelector(`#player-two >.capture-reserve`).firstChild
      );
  }
}

function clearBoard() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j].hasChildNodes()) {
        grid[i][j].removeChild(grid[i][j].firstElementChild);
      }
    }
  }
}

// Image Overlay to CSS //
// Color Overlay IF POSSIBLE //
// Clickable Mouse? //
// Randomiser on who starts the game //

// Countdown Timer //

// Begin Game & Restart Game Interface //
