require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database...");

    const existing = await Admin.findOne({ username: "admin" });
    if (existing) {
      console.log("An admin with this username already exists. Stopping.");
      return process.exit(0);
    }

    // CHANGE THIS PASSWORD before running — this is just an example.
    const newAdmin = new Admin({
      username: "admin",
      password: "CivilMantraa@123",
    });

    await newAdmin.save();
    console.log("✅ Admin account created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();