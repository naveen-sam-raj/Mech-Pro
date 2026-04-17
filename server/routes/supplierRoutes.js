const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Supplier = require("../models/Supplier");

// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "All fields are required" });
    const existing = await Supplier.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const supplier = new Supplier({ name, email, phone, password: hashed });
    await supplier.save();
    res.status(201).json({ message: "Supplier registered successfully! Please login." });
  } catch (err) {
    console.error("Supplier signup error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });
    const supplier = await Supplier.findOne({ email });
    if (!supplier) return res.status(401).json({ message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign(
      { id: supplier._id, role: "supplier", name: supplier.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ message: "Login successful", token, name: supplier.name, email: supplier.email });
  } catch (err) {
    console.error("Supplier login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
