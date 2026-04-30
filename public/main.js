// --- REGISTRATION LOGIC ---
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from reloading

        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        // Send the data to our server's /register route
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message); // Show a popup with the server's response
    });
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from reloading

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Send the data to our server's /login route
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message); // Show a popup with the server's response
    });
}