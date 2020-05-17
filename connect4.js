const gameBoard = document.querySelector('#board');
const globalPiece = gameBoard.querySelector('.global-piece');
const stage = document.getElementById('stage');
const stageBoxes = Array.from(stage.querySelectorAll('.col'));
const allBoxes = Array.from(gameBoard.querySelectorAll('.box'));
const stagePiece = stage.querySelector('.stage-piece');
const filled = [];
const board = [];
const HEIGHT = 6;
const WIDTH = 7;
let currentPlayer = 1;
let column = 0;
let boxPiece;
let fillBox;
let color;

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    board.push([]);
    for (let j = 0; j < WIDTH; j++) {
      board[i].push(null);
    }
  }
}

function positionStagePiece(e) {
  let mouseLocation = (e.x - this.offsetLeft) - (stagePiece.offsetWidth / 2);
  if (mouseLocation <= (this.offsetWidth * 0)
    || mouseLocation >= ((this.offsetWidth - stagePiece.offsetWidth) - 8)) return;
  stagePiece.style.left = mouseLocation + 'px';
}

function hideStagePiece() {
  if (stagePiece.classList.contains('hide')) return;
  stagePiece.classList.add('hide');
}

function findSpotForCol(x) {
  for (let j = HEIGHT - 1; j > 0; j--) {
    if (board[j][x] === null) {
      return j;
    }
  }
  return 0;
}

function playPiece() {
  column = this.id; // selected stage column id
  const x = column - 1;
  const y = findSpotForCol(x);
  board[y][x] = currentPlayer;
  if (y === null) return;
  // collect boxes in column from each .row
  columnBoxes = allBoxes.filter(box => box.id === `${column}-${box.id.split('-')[1]}`)
    .reverse();
  for (let box of columnBoxes) { // loop through
    // if filled [] is empty || box.id not found in filled []
    if (!filled.length || filled.indexOf(box.id) == -1) {
      filled.push(box.id); // push played piece
      fillBox = box; // set fillBox
      break; // after setting 1st
    }
  }
  // return if stage piece still has class 'hide' || if box in column already filled
  if (stagePiece.classList.contains('hide') || fillBox.children[0].classList.contains('filled')) return;
  // set color per player #
  color = currentPlayer === 1 ? 'red' : 'blue';
  globalPieceDropAnimation(this, fillBox);
  // setTimeout at 300ms to match CSS transition
  setTimeout(function () {
    positionBoxPieceInCell(color, fillBox);
    checkWinnerOrGameOver();
    switchPlayer();
    resetGlobalAndStagePieces();
  }, 300);
}

function globalPieceDropAnimation(column, fillBox) {
  globalPiece.style.opacity = 1; // show globalPiece
  globalPiece.style.left = (gameBoard.offsetLeft + column.offsetLeft) + 'px'; // move globalPiece
  // +5 to account for margin
  globalPiece.style.marginTop = (fillBox.offsetTop + 5) + 'px'; // drop globalPiece
}

function positionBoxPieceInCell(color, fillBox) {
  // add classes to show box-piece in cell
  boxPiece = fillBox.querySelector('.box-piece');
  boxPiece.classList.add('filled', color);
}

function switchPlayer() {
  currentPlayer = currentPlayer == 1 ? 2 : 1;
}

function resetGlobalAndStagePieces() {
  let addColor = currentPlayer == 1 ? 'red' : 'blue';
  // reset globalPiece position
  globalPiece.style.opacity = 0;
  globalPiece.style.marginTop = gameBoard.offsetTop + 'px';
  globalPiece.style.top = 0;
  globalPiece.style.left = 0;
  stagePiece.classList.remove('hide');
  // update global & stage piece color
  stagePiece.classList.remove(color);
  globalPiece.classList.remove(color);
  stagePiece.classList.add(addColor);
  globalPiece.classList.add(addColor);
}

function checkWinnerOrGameOver() {
  if (filled.length === allBoxes.length) {
    return endGame('Tie Game');
  }
  if (checkForWin()) {
    return endGame(`Player ${currentPlayer} won!`);
  }
}

function endGame(msg) {
  alert(msg);
  window.location.reload();
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currentPlayer
    );
  }
  // TODO: read and understand this code. Add comments to help you.
  for (let y = 0; y < HEIGHT; y++) { // loop through columns
    for (let x = 0; x < WIDTH; x++) { // loop through row boxes
      // get x & y for 4 consecutive cells to check for win
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      // if any condition returns true, win!
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

stage.addEventListener('mousemove', positionStagePiece);
stage.addEventListener('click', hideStagePiece);
stageBoxes.forEach(stageBox => stageBox.addEventListener('click', playPiece));

makeBoard();