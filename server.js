require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// ensure data/ folder exists before anything else runs
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ensure datasets.json exists
const datasetsPath = path.join(dataDir, "datasets.json");
if (!fs.existsSync(datasetsPath)) {
  fs.writeFileSync(datasetsPath, "[]", "utf-8");
}

const authRoutes = require("./routes/auth");
const datasetRoutes = require("./routes/datasets");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/datasets", datasetRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});