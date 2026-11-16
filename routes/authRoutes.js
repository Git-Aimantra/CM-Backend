const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const COMPANIES = require("../config/companies");

// LOGIN: check credentials, return a token if correct
// POST http://localhost:5000/api/auth/login
// body: { username, password, companyId }
router.post("/login", async (req, res) => {
  try {
    const { username, password, companyId } = req.body;

    // All three must be plain strings, and companyId must be a known company.
    // (Blocks tricks like sending {"$ne": ""} instead of a username.)
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof companyId !== "string" ||
      !COMPANIES.includes(companyId)
    ) {
      return res
        .status(400)
        .json({ message: "username, password and a valid companyId are required" });
    }

    const admin = await Admin.findOne({ username, companyId });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Credentials are correct: issue a token that carries the company.
    const token = jwt.sign(
      { id: admin._id, username: admin.username, companyId: admin.companyId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, companyId: admin.companyId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;