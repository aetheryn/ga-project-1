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

document.querySelector("button").addEventListener("click", function (e) {
  setStartPlayer();
  clearBoard();
  clearCaptured();
  setPieces();
  selectedPiece = null;
  document.querySelector("button").disabled = true;
  document.querySelector("h2").textContent = "";
});

// Reset for Player 1 to start the game //
function setStartPlayer() {
  playerTurn = players[0];
  document.querySelector("#player-one >.your-turn").style.opacity = 1;
  document.querySelector("#player-two >.your-turn").style.opacity = 0;
}

// Clear both players' capture reserves //
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

// Clear board's tiles //
function clearBoard() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j].hasChildNodes()) {
        grid[i][j].removeChild(grid[i][j].firstElementChild);
      }
    }
  }
}

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

// Setting event listener for the game//
const gridArray = document.querySelectorAll(".squares");
gridArray.forEach((clickedSquare) => {
  clickedSquare.addEventListener("click", function (e) {
    if (!selectedPiece) {
      if (e.currentTarget.firstChild.classList.contains(playerTurn)) {
        selectPiece(e.currentTarget.firstChild);
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
        }
      }
    }
  });
});

// Reading selected piece & its location on grid //
function selectPiece(piece) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === document.querySelector(`#${piece.parentNode.id}`)) {
        pieceRow = i;
        pieceColumn = j;
      }
    }
  }
  selectedPiece = piece;
  selectedPiece.classList.add("clickedtile");
}

// Deselect the selected piece //
function deselectPiece() {
  selectedPiece.classList.remove("clickedtile");
  selectedPiece = null;
}

// Switch player //
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
  console.log(`Next is ${playerTurn}'s turn.`);

  if (playerTurn == players[0]) {
    playerId = "player-one";
  } else {
    playerId = "player-two";
  }

  //   Check possibility of next Player starting from captured reserves //
  if (
    document.querySelector(`#${playerId} >.capture-reserve`).hasChildNodes()
  ) {
    fromCapturedTiles();
  }
}

// Capture opponent's piece //
function capturePiece(square) {
  const capturedPiece = square.firstChild;

  // Special case for Feudal Lord //
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

// Check allowable moves //
function checkAllowableMoves(square, piece) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === document.querySelector(`#${square.id}`)) {
        destinationRow = i;
        destinationColumn = j;
      }
    }
  }

  switch (piece.classList[1]) {
    case "general":
      if (
        (destinationRow == pieceRow &&
          (destinationColumn == pieceColumn + 1 ||
            destinationColumn == pieceColumn - 1)) ||
        (destinationColumn == pieceColumn &&
          (destinationRow == pieceRow + 1 || destinationRow == pieceRow - 1))
      ) {
        return true;
      } else {
        deselectPiece();
      }
      break;

    case "minister":
      if (
        (destinationRow == pieceRow + 1 || destinationRow == pieceRow - 1) &&
        (destinationColumn == pieceColumn + 1 ||
          destinationColumn == pieceColumn - 1)
      ) {
        return true;
      } else {
        deselectPiece();
      }
      break;

    case "man":
      if (
        piece.classList[2] == "player1" &&
        destinationRow == pieceRow &&
        destinationColumn == pieceColumn + 1
      ) {
        return true;
      } else if (
        piece.classList[2] == "player2" &&
        destinationRow == pieceRow &&
        destinationColumn == pieceColumn - 1
      ) {
        return true;
      } else {
        deselectPiece();
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
        return true;
      } else {
        deselectPiece;
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
          return true;
        } else {
          deselectPiece();
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
          return true;
        } else {
          deselectPiece();
        }
      }
      break;

    default:
      break;
  }
}

// Check whether game has ended //
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
    // alert(`${playerTurn} has won the game!`);
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

// Check whether man reaches opponent's territory //
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

// Man upgrades to Feudal Lord //
function manUpgrades(piece) {
  piece.classList.replace("man", "feudal-lord");
  piece.innerText = "feudal lord";
}

// Select tile from capture reserves //
function fromCapturedTiles() {
  const capturedContainer = document.querySelector(
    `#${playerId} >.capture-reserve`
  );
  capturedContainer.addEventListener("click", function (e) {
    if (!selectedPiece) {
      if (e.target.classList.contains(playerTurn)) {
        selectedPiece = e.target;
        selectedPiece.classList.add("clickedtile");
      }
    }
  });
}

// Place selected tile to grid, not in opponent's territory //
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
