// --- ACCOUNT LOGIC (CP02) ---

// Handle Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) location.reload();
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) location.reload();
});

// Check Session & Update UI
async function checkAuth() {
    const response = await fetch('/me');
    const data = await response.json();

    if (data.loggedIn) {
        document.getElementById('game-section').style.display = 'block';
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'none';

        const welcomeDiv = document.createElement('div');
        welcomeDiv.id = "welcome-area";
        welcomeDiv.innerHTML = `
            <p>Welcome, <strong>${data.username}</strong>!</p>
            <button id="logout-btn">Log Out</button>
        `;
        document.body.prepend(welcomeDiv);

        document.getElementById('logout-btn').addEventListener('click', async () => {
            await fetch('/logout', { method: 'POST' });
            location.reload();
        });
    }
}

// --- GAME LOGIC (CP03 & CP04) ---

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

let currentPlayer = 'X';
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];
const statusDisplay = document.getElementById('status');

function handleCellClick(e) {
    const clickedCell = e.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[cellIndex] !== "" || !gameActive) return;

    boardState[cellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;

    // Swap turns
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerText = `Player ${currentPlayer}'s Turn`;

    checkResult(); 
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === "" || boardState[b] === "" || boardState[c] === "") continue;
        if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        const winner = currentPlayer === "X" ? "O" : "X"; 
        statusDisplay.innerText = `Player ${winner} Wins!`;
        gameActive = false;

        // --- CP05: SEND WIN/LOSS TO SERVER ---
        if (winner === 'X') {
            sendResultToServer('win');
        } else {
            sendResultToServer('loss');
        }
        return;
    }

    if (!boardState.includes("")) {
        statusDisplay.innerText = "It's a Draw!";
        gameActive = false;

        // --- CP05: SEND DRAW TO SERVER ---
        sendResultToServer('draw');
        return;
    }
}

function restartGame() {
    currentPlayer = "X";
    gameActive = true;
    boardState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerText = "Player X's Turn";
    document.querySelectorAll('.cell').forEach(cell => cell.innerText = "");
}

// --- CP05: STATS LOGIC ---

async function sendResultToServer(result) {
    await fetch('/update-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: result })
    });
}

// --- INITIALIZATION ---

document.getElementById('reset-btn').addEventListener('click', restartGame);

document.querySelectorAll('.cell').forEach(cell => 
    cell.addEventListener('click', handleCellClick)
);

checkAuth();