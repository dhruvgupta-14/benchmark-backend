require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const datasetRoutes = require("./routes/datasets");

const app = express();

// Only allow requests from your frontend's origin, not from anywhere.
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

// Mount routes
app.use("/api", authRoutes);           // -> POST /api/login
app.use("/api/datasets", datasetRoutes); // -> GET/POST/PUT/DELETE /api/datasets...

// Simple health check, handy for confirming the server is up after deploy
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});