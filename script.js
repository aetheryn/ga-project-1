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

const pieceNames = ["king", "man", "general", "minister"];
const players = ["player1", "player2"];
let playerTurn = players[0];

// Set starting pieces //
function setPieces() {
  for (let i = 0; i < pieceNames.length; i++) {
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

// Setting Event Listener //
const gridArray = document.querySelectorAll(".squares");
gridArray.forEach((clickedSquare) => {
  clickedSquare.addEventListener("click", function (e) {
    if (!selectedPiece) {
      if (e.currentTarget.firstChild.classList.contains(playerTurn)) {
        selectPiece(e.currentTarget.firstChild);
      }
    } else {
      // everything will still go haywire if we click on our own tile LMAO
      if (!e.currentTarget.hasChildNodes()) {
        checkAllowableMoves(e.currentTarget, selectedPiece);
        e.currentTarget.append(selectedPiece);
        switchPlayer();
      } else {
        capturePiece(e.currentTarget);
        e.currentTarget.append(selectedPiece);
        switchPlayer();
      }
    }
  });
});

// Update Selected Piece //
function selectPiece(piece) {
  selectedPiece = piece;
  console.log(selectedPiece);
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
  console.log(piece.classList[1]);
  console.log(square.id);
}
