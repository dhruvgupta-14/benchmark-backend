const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const bcrypt = require("bcryptjs");
const fs = require("fs");
const { writeJSON } = require("./fileDB");

const users = [
  { username: process.env.USER1_NAME, password: process.env.USER1_PASS },
  { username: process.env.USER2_NAME, password: process.env.USER2_PASS },
];

const SALT_ROUNDS = 10;

function seed() {
  // create data/ folder if it doesn't exist
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log("Created data/ directory");
  }

  const hashed = users.map((u) => ({
    username: u.username,
    passwordHash: bcrypt.hashSync(u.password, SALT_ROUNDS),
  }));

  const outPath = path.join(dataDir, "users.json");
  writeJSON(outPath, hashed);
  console.log(`Seeded ${hashed.length} users to ${outPath}`);
}

seed();