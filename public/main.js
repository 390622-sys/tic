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
    if (response.ok) location.reload(); // Refresh to show logged-in state
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

async function checkAuth() {
    const response = await fetch('/me');
    const data = await response.json();

    if (data.loggedIn) {
        // Hide forms and show a welcome message + logout button
        document.body.innerHTML += `
            <div>
                <p>Welcome, ${data.username}!</p>
                <button id="logout-btn">Log Out</button>
            </div>
        `;
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'none';

        document.getElementById('logout-btn').addEventListener('click', async () => {
            await fetch('/logout', { method: 'POST' });
            location.reload();
        });
    }
}

checkAuth();