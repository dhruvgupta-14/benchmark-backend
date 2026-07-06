const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { readJSON } = require("../utils/fileDB");

const router = express.Router();
const USERS_PATH = path.join(__dirname, "..", "data", "users.json");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const users = readJSON(USERS_PATH, []);
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordMatches = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );

  res.json({ token });
});

module.exports = router;