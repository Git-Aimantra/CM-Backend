require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const COMPANIES = require("./config/companies");

// Usage: node seedAdmin.js <username> <password> <companyId>
const [username, password, companyId] = process.argv.slice(2);

const createAdmin = async () => {
  if (!username || !password || !COMPANIES.includes(companyId)) {
    console.log("Usage: node seedAdmin.js <username> <password> <" + COMPANIES.join("|") + ">");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database...");

    const existing = await Admin.findOne({ username, companyId });
    if (existing) {
      console.log("This admin already exists for that company. Stopping.");
      return process.exit(0);
    }

    await new Admin({ username, password, companyId }).save();
    console.log(`✅ Admin '${username}' created for ${companyId}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();