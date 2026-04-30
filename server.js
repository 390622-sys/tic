const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(
    session({
        secret: "tic-tac-toe-super-secret-key",
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(express.static(path.join(__dirname, "public")));

const usersFilePath = path.join(__dirname, "data", "users.json");

function getUsers() {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
}

function saveUsers(usersArray) {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersArray, null, 2));
}

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    }
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
        return res.status(400).json({ message: "Username is already taken!" });
    }
    users.push({ username, password });
    saveUsers(users);
    req.session.user = username;
    res.json({ message: "Registration successful! You are logged in." });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    }
    const users = getUsers();
    const match = users.find(
        (u) => u.username === username && u.password === password,
    );
    if (!match) {
        return res
            .status(401)
            .json({ message: "Invalid username or password!" });
    }
    req.session.user = username;
    res.json({ message: "Login successful! Welcome back." });
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out." });
    });
});

app.get("/me", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
