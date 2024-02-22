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

// Switching players //
let playerTurn = "player1";
let playerIndex = 1;

// Set starting pieces //
function setPieces() {
  for (let i = 0; i < pieceNames.length; i++) {
    const piece = document.createElement("div");
    piece.innerText = pieceNames[i];
    piece.classList.add("tiles", `${pieceNames[i]}`);

    if (pieceNames[i] == "minister") {
      piece.classList.add(`${players[0]}`);
      grid[0][0].append(piece);
    } else if (pieceNames[i] == "king") {
      piece.classList.add(`${players[0]}`);
      grid[1][0].append(piece);
    } else if (pieceNames[i] == "man") {
      piece.classList.add(`${players[0]}`);
      grid[1][1].append(piece);
    } else if (pieceNames[i] == "general") {
      piece.classList.add(`${players[0]}`);
      grid[2][0].append(piece);
    }

    const pieceOpp = document.createElement("div");
    pieceOpp.innerText = pieceNames[i];
    pieceOpp.classList.add("tiles", `${pieceNames[i]}`);

    if (pieceNames[i] == "minister") {
      pieceOpp.classList.add(`${players[1]}`);
      grid[2][3].append(pieceOpp);
    } else if (pieceNames[i] == "king") {
      pieceOpp.classList.add(`${players[1]}`);
      grid[1][3].append(pieceOpp);
    } else if (pieceNames[i] == "man") {
      pieceOpp.classList.add(`${players[1]}`);
      grid[1][2].append(pieceOpp);
    } else if (pieceNames[i] == "general") {
      pieceOpp.classList.add(`${players[1]}`);
      grid[0][3].append(pieceOpp);
    }
  }
}

setPieces();

let piecePossession = "player1";
let pieceName = pieceNames[0];
let movingPiece = document.querySelector(".tiles");

// // Listen to clicked piece on grid - ONE //
// function selectPiece(cb) {
//   const tileArray = document.querySelectorAll(".tiles");
//   tileArray.forEach((clickedPiece) => {
//     clickedPiece.addEventListener("click", function (e) {
//       console.log(e.target.classList);
//       if (e.target.classList[2] == playerTurn) {
//         piecePossession = e.target.classList[2]; // register piece possession
//         pieceName = e.target.classList[1];
//         oldTile = e.target;
//         console.log(
//           `${pieceName} of ${piecePossession}, where are you moving to?`
//         );
//         cb();
//         // make conditional if piece is allowed to move to the next direction //
//       } else {
//         console.log("This is not your piece!");
//       }
//     });
//   });
// }

// // Moving to clicked square on grid - ONE //
// function selectDestination(cb) {
//   const gridArray = document.querySelectorAll(".squares");
//   gridArray.forEach((clickedSquare) => {
//     clickedSquare.addEventListener("click", function (e) {
//       if (!e.currentTarget.hasChildNodes()) {
//         // + If square is an allowed movement for the read piece //
//         console.log("Hi, I'm moving here!");
//         cb();
//         const newTile = document.createElement("div");
//         newTile.classList.add("tiles", `${pieceName}`, `${piecePossession}`);
//         newTile.innerText = pieceName;
//         e.currentTarget.append(newTile);
//       }
//       // If square has opponent's tile => capture function
//       // If square has same player's tile => you cannot move here
//     });
//   });
//   playerIndex = playerIndex * -1;
//   console.log(playerIndex);
//   if (playerIndex === 1) {
//     playerTurn = players[0];
//   } else {
//     playerTurn = players[1];
//   }
// }

// // Listening to clicked piece - TWO //
// function selectPiece(cb) {
//   const tileArray = document.querySelectorAll(".tiles");
//   tileArray.forEach((clickedPiece) => {
//     clickedPiece.addEventListener("click", function (e) {
//       console.log(e.target.classList);
//       if (e.target.classList[2] == playerTurn) {
//         // make conditional if piece is allowed to move to the next direction //
//         let movingPiece = e.currentTarget.cloneNode(true);
//         const gridArray = document.querySelectorAll(".squares");
//         gridArray.forEach((clickedSquare) => {
//           clickedSquare.addEventListener("click", function (e) {
//             if (!e.currentTarget.hasChildNodes()) {
//               // + If square is an allowed movement for the read piece //
//               console.log("Hi, I'm moving here!");
//               e.currentTarget.append(movingPiece);
//               console.log(this.currentTarget);
//             }
//           });
//         });
//       } else {
//         console.log("This is not your piece!");
//       }
//     });
//   });
// }

// // Moving to clicked square on grid - TWO //
// function selectDestination(cb) {
//   const gridArray = document.querySelectorAll(".squares");
//   gridArray.forEach((clickedSquare) => {
//     clickedSquare.addEventListener("click", function (e) {
//       if (!e.currentTarget.hasChildNodes()) {
//         // + If square is an allowed movement for the read piece //
//         console.log("Hi, I'm moving here!");
//         e.currentTarget.append(movingPiece);
//         cb();
//       }
//       // If square has opponent's tile => capture function
//       // If square has same player's tile => you cannot move here
//     });
//   });
//   playerIndex = playerIndex * -1;
//   console.log(playerIndex);
//   if (playerIndex === 1) {
//     playerTurn = players[0];
//   } else {
//     playerTurn = players[1];
//   }
// }

// // Remove tile from old position //
// function deleteOldTile(cb) {
//   if (oldTile.parentNode) {
//     oldTile.parentNode.removeChild(oldTile);
//   }
//   cb();
// }

// Set allowable movements //

// selectPiece(() =>
//   selectDestination(() =>
//     deleteOldTile(() => console.log(`This is ${playerTurn}`))
//   )
// );

// selectPiece();

// Listening to clicked piece - THREE //
function selectPiece(cbFn) {
  const tileArray = document.querySelectorAll(".tiles");
  tileArray.forEach((clickedPiece) => {
    clickedPiece.addEventListener("click", function (e) {
      console.log(e.target.classList);
      if (e.target.classList[2] == playerTurn) {
        // make conditional if piece is allowed to move to the next direction //
        movingPiece = e.currentTarget;
        cbFn();
      } else {
        console.log("This is not your piece!");
      }
    });
  });
}

function selectDestination(cbFn) {
  const gridArray = document.querySelectorAll(".squares");
  gridArray.forEach((clickedSquare) => {
    clickedSquare.addEventListener("click", function (e) {
      if (!e.currentTarget.hasChildNodes()) {
        // + If square is an allowed movement for the read piece //
        console.log("Hi, I'm moving here!");
        e.currentTarget.append(movingPiece);
        cbFn();
      }
    });
  });
}

// Change Players //
function changePlayer(cbFn) {
  playerIndex = playerIndex * -1;
  console.log(playerIndex);
  if (playerIndex === 1) {
    playerTurn = players[0];
  } else {
    playerTurn = players[1];
  }
  cbFn();
}

selectPiece(() =>
  selectDestination(() =>
    changePlayer(() => console.log(`This is ${playerTurn}'s turn.`))
  )
);
