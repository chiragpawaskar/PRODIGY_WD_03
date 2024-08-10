let board;
let currentPlayer;
let gameMode;
const playerSymbols = ['X', 'O'];

function startGame(mode) {
    gameMode = mode;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 0; // 0 for 'X', 1 for 'O'
    document.getElementById('mode-selection').classList.add('hidden');
    document.getElementById('board').classList.remove('hidden');
    document.getElementById('message').classList.add('hidden');
    document.getElementById('reset').classList.add('hidden');
    updateBoard();
}

function makeMove(cell) {
    const index = Array.from(cell.parentNode.children).indexOf(cell);

    if (board[index] === '' && !isGameOver()) {
        board[index] = playerSymbols[currentPlayer];
        updateBoard();

        if (isGameOver()) {
            displayMessage(`${playerSymbols[currentPlayer]} Wins!`);
        } else if (!board.includes('')) {
            displayMessage('It\'s a Draw!');
        } else {
            currentPlayer = (currentPlayer + 1) % 2;
            if (gameMode === 'PvAI' && currentPlayer === 1) {
                setTimeout(aiMove, 500); // Delay AI move to simulate thinking
            }
        }
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('#board .cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

function displayMessage(message) {
    document.getElementById('message').textContent = message;
    document.getElementById('message').classList.remove('hidden');
    document.getElementById('reset').classList.remove('hidden');
}

function isGameOver() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function aiMove() {
    const bestMove = minimax(board, 1);
    board[bestMove.index] = playerSymbols[1];
    updateBoard();
    
    if (isGameOver()) {
        displayMessage('O Wins!');
    } else if (!board.includes('')) {
        displayMessage('It\'s a Draw!');
    } else {
        currentPlayer = (currentPlayer + 1) % 2;
    }
}

function minimax(board, depth) {
    const scores = { X: -10, O: 10, draw: 0 };
    const emptyIndices = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);

    if (isWinning(board, 'O')) return { score: scores.O };
    if (isWinning(board, 'X')) return { score: scores.X };
    if (emptyIndices.length === 0) return { score: scores.draw };

    let bestMove = { score: -Infinity };
    if (depth % 2 === 0) {
        bestMove.score = Infinity;
    }

    for (let i = 0; i < emptyIndices.length; i++) {
        const index = emptyIndices[i];
        board[index] = playerSymbols[depth % 2];
        const moveScore = minimax(board, depth + 1).score;
        board[index] = '';

        if (depth % 2 === 0) {
            if (moveScore < bestMove.score) {
                bestMove.score = moveScore;
                bestMove.index = index;
            }
        } else {
            if (moveScore > bestMove.score) {
                bestMove.score = moveScore;
                bestMove.index = index;
            }
        }
    }
    return bestMove;
}

function isWinning(board, player) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
    });
}

function resetGame() {
    document.getElementById('mode-selection').classList.remove('hidden');
    document.getElementById('board').classList.add('hidden');
    document.getElementById('message').classList.add('hidden');
    document.getElementById('reset').classList.add('hidden');
}
