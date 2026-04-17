const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const address = new Address({ ...req.body, user: req.user.id });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: "Error saving address" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching addresses" });
  }
});

module.exports = router;
