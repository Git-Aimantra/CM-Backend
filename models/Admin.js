const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const COMPANIES = require("../config/companies");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true, // this will store the HASHED password, never the real one
    },
    companyId: {
      type: String,
      required: true,
      enum: COMPANIES,
    },
  },
  {
    timestamps: true,
  }
);

// Username must be unique only WITHIN a company
adminSchema.index({ username: 1, companyId: 1 }, { unique: true });

// This runs automatically right before an admin document is saved.
// If the password field was changed (or this is a new admin), hash it.
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return; // password wasn't changed, skip re-hashing it
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// A helper method we can call later: comparePassword("whatTheyTyped")
// returns true/false depending on whether it matches the stored hash.
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);