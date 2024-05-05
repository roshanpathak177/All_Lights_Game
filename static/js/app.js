document.addEventListener('DOMContentLoaded', function() {
  const boardSizeSelect = document.getElementById('board-size');
  const gameBoard = document.querySelector('.game-board');
  const resetBtn = document.getElementById('reset-btn');
  const solutionBtn = document.getElementById('solution-btn');
  const solutionContainer = document.createElement('div');
  solutionContainer.classList.add('solution-container');
  solutionContainer.style.display = 'none';

  let board;
  let size;

  function createBoard(newSize) {
    size = newSize;
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.addEventListener('click', () => toggleSquare(i % size, Math.floor(i / size)));
      gameBoard.appendChild(square);
    }

    board = new Board(size);
    renderBoard();
  }

  function toggleSquare(col, row) {
    board.toggleSquare(row, col);
    renderBoard();
  }

  gameBoard.addEventListener('boardSolved', () => {
    document.body.style.backgroundColor = board.isSolved() ? 'white' : 'black';
  });

  function renderBoard() {
    const squares = gameBoard.querySelectorAll('.square');
    for (let i = 0; i < squares.length; i++) {
      const row = Math.floor(i / board.size);
      const col = i % board.size;
      squares[i].classList.toggle('on', board.board[row][col] === 1);
    }
    if (board.isSolved()) {
      gameBoard.dispatchEvent(new Event('boardSolved'));
    }
  }

  function resetBoard() {
    board.reset();
    renderBoard();
  }

  function showSolution() {
    const A = constructMatrix(size);
    const b = Array(size * size).fill(1);
    const solution = mod2GaussianElimination(A, b);
    const reshapedSolution = reshapeArray(solution, size);
    const solutionString = reshapedSolution.map(row => row.join(' | ')).join('\n\n');
    solutionContainer.textContent = `Solution:\n\n${solutionString}`;
    solutionContainer.style.display = solutionContainer.style.display === 'none' ? 'block' : 'none';
  }

  function reshapeArray(array, newShape) {
    const flatArray = array.slice();
    const newArray = [];

    for (let i = 0; i < array.length; i += newShape) {
      newArray.push(flatArray.slice(i, i + newShape));
    }

    return newArray;
  }

  function constructMatrix(N) {
    const A = Array.from({ length: N * N }, () => Array(N * N).fill(0));

    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        const index = row * N + col;

        A[index][index] = 1;

        if (row > 0) {
          A[index][index - N] = 1;
        }
        if (row < N - 1) {
          A[index][index + N] = 1;
        }
        if (col > 0) {
          A[index][index - 1] = 1;
        }
        if (col < N - 1) {
          A[index][index + 1] = 1;
        }
      }
    }

    return A;
  }

  function mod2GaussianElimination(A, b) {
    const n = b.length;
    const newA = A.map(row => [...row]);
    const newB = [...b];

    for (let i = 0; i < n; i++) {
      if (newA[i][i] === 0) {
        for (let j = i + 1; j < n; j++) {
          if (newA[j][i] === 1) {
            [newA[i], newA[j]] = [newA[j], newA[i]];
            [newB[i], newB[j]] = [newB[j], newB[i]];
            break;
          }
        }
      }

      for (let j = 0; j < n; j++) {
        if (j !== i && newA[j][i] === 1) {
          for (let k = 0; k < n; k++) {
            newA[j][k] = (newA[j][k] + newA[i][k]) % 2;
          }
          newB[j] = (newB[j] + newB[i]) % 2;
        }
      }
    }

    return newB;
  }

  boardSizeSelect.addEventListener('change', () => {
    createBoard(parseInt(boardSizeSelect.value));
    solutionContainer.style.display = 'none';
  });

  resetBtn.addEventListener('click', resetBoard);
  solutionBtn.addEventListener('click', showSolution);

  document.body.appendChild(solutionContainer);
  createBoard(5); // Initial board size
});

class Board {
  constructor(size) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(0));
  }

  toggleSquare(row, col) {
    this.board[row][col] = 1 - this.board[row][col];
    if (row > 0) {
      this.board[row - 1][col] = 1 - this.board[row - 1][col];
    }
    if (row < this.size - 1) {
      this.board[row + 1][col] = 1 - this.board[row + 1][col];
    }
    if (col > 0) {
      this.board[row][col - 1] = 1 - this.board[row][col - 1];
    }
    if (col < this.size - 1) {
      this.board[row][col + 1] = 1 - this.board[row][col + 1];
    }
  }

  isSolved() {
    return this.board.every(row => row.every(cell => cell === 1));
  }

  reset() {
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }
}