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
        // 1. Show the game section (CP03)
        document.getElementById('game-section').style.display = 'block';

        // 2. Hide the login/register forms
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'none';

        // 3. Add welcome message safely
        const welcomeDiv = document.createElement('div');
        welcomeDiv.id = "welcome-area";
        welcomeDiv.innerHTML = `
            <p>Welcome, <strong>${data.username}</strong>!</p>
            <button id="logout-btn">Log Out</button>
        `;
        document.body.prepend(welcomeDiv);

        // 4. Handle Logout
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await fetch('/logout', { method: 'POST' });
            location.reload();
        });
    }
}

const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal 1
    [2, 4, 6]  // Diagonal 2
];


// --- GAME LOGIC (CP03) ---

let currentPlayer = 'X';
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];

const statusDisplay = document.getElementById('status');

function handleCellClick(e) {
    const clickedCell = e.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Only allow click if cell is empty and game is active
    if (boardState[cellIndex] !== "" || !gameActive) return;

    // Update state and UI
        boardState[cellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;

        // Swap turns
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerText = `Player ${currentPlayer}'s Turn`;

        // ADD THIS LINE:
        checkResult(); 

    function restartGame() {
        currentPlayer = "X";
        gameActive = true;
        boardState = ["", "", "", "", "", "", "", "", ""];
        statusDisplay.innerText = "Player X's Turn";
        document.querySelectorAll('.cell').forEach(cell => cell.innerText = "");
    }

    document.getElementById('reset-btn').addEventListener('click', restartGame);
    }

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === "" || boardState[b] === "" || boardState[c] === "") {
            continue;
        }
        if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        // We have a winner!
        // Swap back to the player who actually made the winning move for the announcement
        const winner = currentPlayer === "X" ? "O" : "X"; 
        statusDisplay.innerText = `Player ${winner} Wins!`;
        gameActive = false;
        return;
    }

    // Check for a Draw
    if (!boardState.includes("")) {
        statusDisplay.innerText = "It's a Draw!";
        gameActive = false;
        return;
    }
}

// Initialize Cell Listeners
document.querySelectorAll('.cell').forEach(cell => 
    cell.addEventListener('click', handleCellClick)
);

// --- STARTUP ---
// Run the auth check as soon as the script loads
checkAuth();