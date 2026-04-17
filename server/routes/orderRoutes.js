const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// Place order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, address, paymentMethod } = req.body;
    const order = new Order({ user: req.user.id, items, totalAmount, address, paymentMethod });
    await order.save();
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Error placing order" });
  }
});

// Get user orders
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Get all orders (admin/supplier)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Update order status
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order" });
  }
});

module.exports = router;
