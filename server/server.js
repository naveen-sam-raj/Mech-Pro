const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const toolRoutes = require("./routes/toolRoutes");
const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const seedDefaultSupplier = require("./seedSupplier");

const app = express();

// MIDDLEWARES
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// ROUTES
app.use("/api/tools", toolRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/uploads", express.static("uploads"));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Mech Pro Tool Backend Running 🔧");
});

// MONGODB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected ✅");
    await seedDefaultSupplier();
  })
  .catch((err) => {
    console.log("MongoDB Error ❌", err);
  });

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
