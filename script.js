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

// Starting position //
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

// querySelector(".general.player1");

setPieces();

// // To create new tile in clicked grid //
// for (let i = 0; i < 3; i++) {
//   for (let j = 0; j < 4; j++) {
//     grid[i][j].addEventListener("click", function (e) {
//       const newTile = document.createElement("div");
//       newTile.classList = "tiles";
//       e.currentTarget.append(newTile);
//     });
//   }
// }
