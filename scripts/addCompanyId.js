require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const JobPosting = require("../models/JobPosting");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected...");

    // 1. Tag all existing records as CivilMantra's
    const a = await Admin.updateMany(
      { companyId: { $exists: false } },
      { $set: { companyId: "civilmantra" } }
    );
    const j = await JobPosting.updateMany(
      { companyId: { $exists: false } },
      { $set: { companyId: "civilmantra" } }
    );
    console.log(`Admins updated: ${a.modifiedCount}, Jobs updated: ${j.modifiedCount}`);

    // 2. Make the database indexes match the new schemas
    //    (drops the old unique 'username' index, creates username + companyId)
    await Admin.syncIndexes();
    await JobPosting.syncIndexes();
    console.log("Indexes synced.");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
};

run();