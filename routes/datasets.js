const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { readJSON, writeJSON } = require("../utils/fileDB");
const verifyToken = require("../middleware/auth");

const router = express.Router();
const DATASETS_PATH = path.join(__dirname, "..", "data", "datasets.json");

const ALLOWED_CATEGORIES = [
  "Multilingual Understanding and Generation Benchmarks", 
  "Cultural Knowledge and Reasoning Datasets", 
  "Social Bias and Stereotype Evaluation Datasets",
  "Legal, Governance, and Institutional Datasets", 
  "Code-Switching and Informal Language Datasets5", 
  "Pre-training and Instruction-Tuning Corpora",
]; 


router.get("/", verifyToken, (req, res) => {
  const datasets = readJSON(DATASETS_PATH, []);
  res.json(datasets);
});


router.get("/:id", verifyToken, (req, res) => {
  const datasets = readJSON(DATASETS_PATH, []);
  const dataset = datasets.find((d) => d.id === req.params.id);
  if (!dataset) return res.status(404).json({ error: "Dataset not found" });
  res.json(dataset);
});

// POST /api/datasets — create a new dataset entry
router.post("/", verifyToken, (req, res) => {
  const {
    name,
    category,
    description,
    source,
    isUnifiedSchema,
    sampleUsedForUnifiedSchema,
    schemaJsonUrl,
    hasDifficultyLabel,
    difficultyLabelJsonUrl,
    methodology,
  } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "name and category are required" });
  }
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${ALLOWED_CATEGORIES.join(", ")}` });
  }

  const datasets = readJSON(DATASETS_PATH, []);

  const newDataset = {
    id: crypto.randomUUID(),
    name,
    category,
    description: description || "",
    source: source || "",
    isUnifiedSchema: !!isUnifiedSchema,
    sampleUsedForUnifiedSchema: sampleUsedForUnifiedSchema || "",
    schemaJsonUrl: schemaJsonUrl || "",
    hasDifficultyLabel: !!hasDifficultyLabel,
    difficultyLabelJsonUrl: difficultyLabelJsonUrl || "",
    methodology: methodology || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  datasets.push(newDataset);
  writeJSON(DATASETS_PATH, datasets);

  res.status(201).json(newDataset);
});

// PUT /api/datasets/:id — update an existing dataset
router.put("/:id", verifyToken, (req, res) => {
  const datasets = readJSON(DATASETS_PATH, []);
  const index = datasets.findIndex((d) => d.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: "Dataset not found" });

  if (req.body.category && !ALLOWED_CATEGORIES.includes(req.body.category)) {
    return res.status(400).json({ error: `category must be one of: ${ALLOWED_CATEGORIES.join(", ")}` });
  }

  datasets[index] = {
    ...datasets[index],
    ...req.body,
    id: datasets[index].id, // id is immutable
    updatedAt: new Date().toISOString(),
  };

  writeJSON(DATASETS_PATH, datasets);
  res.json(datasets[index]);
});

// DELETE /api/datasets/:id
router.delete("/:id", verifyToken, (req, res) => {
  const datasets = readJSON(DATASETS_PATH, []);
  const index = datasets.findIndex((d) => d.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: "Dataset not found" });

  const [removed] = datasets.splice(index, 1);
  writeJSON(DATASETS_PATH, datasets);
  res.json(removed);
});

module.exports = router;