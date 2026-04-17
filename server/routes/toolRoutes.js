const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Tool = require("../models/Tool");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET all tools
router.get("/", async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 });
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tools" });
  }
});

// GET single tool
router.get("/:id", async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });
    res.json(tool);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tool" });
  }
});

// POST add tool (supplier only)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const tool = new Tool({ name, price, category, description, image, supplier: req.user.id });
    await tool.save();
    res.status(201).json(tool);
  } catch (err) {
    res.status(500).json({ message: "Error adding tool" });
  }
});

// PUT update tool
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    const tool = await Tool.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(tool);
  } catch (err) {
    res.status(500).json({ message: "Error updating tool" });
  }
});

// DELETE tool
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: "Tool deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting tool" });
  }
});

module.exports = router;
