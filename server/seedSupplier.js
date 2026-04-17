const Supplier = require("./models/Supplier");
const bcrypt = require("bcryptjs");

const seedDefaultSupplier = async () => {
  try {
    // Migrate old entry (admin@mechpro.com → supplier@mechpro.com)
    const oldEntry = await Supplier.findOne({ email: "admin@mechpro.com" });
    if (oldEntry) {
      await Supplier.deleteOne({ email: "admin@mechpro.com" });
      console.log("Old admin@mechpro.com supplier removed. Migrating...");
    }

    const existing = await Supplier.findOne({ email: "supplier@mechpro.com" });
    if (!existing) {
      const hashed = await bcrypt.hash("supplier123", 10);
      await Supplier.create({
        name: "MechPro Supplier",
        email: "supplier@mechpro.com",
        phone: "9000000000",
        password: hashed,
        role: "supplier",
      });
      console.log("Default supplier seeded ✅ (supplier@mechpro.com / supplier123)");
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

module.exports = seedDefaultSupplier;
