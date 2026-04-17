const Supplier = require("./models/Supplier");
const bcrypt = require("bcryptjs");

const seedDefaultSupplier = async () => {
  try {
    const existing = await Supplier.findOne({ email: "admin@mechpro.com" });
    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);
      await Supplier.create({
        name: "Admin Supplier",
        email: "admin@mechpro.com",
        phone: "9000000000",
        password: hashed,
        role: "supplier",
      });
      console.log("Default supplier seeded ✅");
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

module.exports = seedDefaultSupplier;
