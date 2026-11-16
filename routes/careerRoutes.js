const express = require("express");
const router = express.Router();
const JobPosting = require("../models/JobPosting");
const protect = require("../middleware/authMiddleware");
const COMPANIES = require("../config/companies");

// CREATE: the company comes from the token, never from the request body
// POST http://localhost:5000/api/career
router.post("/", protect, async (req, res) => {
  try {
    const { companyId, ...data } = req.body; // ignore any companyId sent by the client
    const newJob = new JobPosting({ ...data, companyId: req.admin.companyId });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ (public): the website says which company it wants
// GET http://localhost:5000/api/career?companyId=saptagon
router.get("/", async (req, res) => {
  try {
    const { companyId } = req.query;
    if (typeof companyId !== "string" || !COMPANIES.includes(companyId)) {
      return res.status(400).json({ message: "A valid companyId is required" });
    }
    const jobs = await JobPosting.find({ companyId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE: now protected, and only for your own company's jobs
// PUT http://localhost:5000/api/career/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const { companyId, ...updates } = req.body; // companyId can never be changed
    const updatedJob = await JobPosting.findOneAndUpdate(
      { _id: req.params.id, companyId: req.admin.companyId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: only for your own company's jobs
// DELETE http://localhost:5000/api/career/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedJob = await JobPosting.findOneAndDelete({
      _id: req.params.id,
      companyId: req.admin.companyId,
    });

    if (!deletedJob) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.status(200).json({ message: "Job posting deleted successfully", deletedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;