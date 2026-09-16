const express = require("express");
const router = express.Router();
const JobPosting = require("../models/JobPosting");
const protect = require("../middleware/authMiddleware");


// CREATE — add a new job posting
// POST http://localhost:5000/api/career
router.post("/", protect, async (req, res) => {
  try {
    const newJob = new JobPosting(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ — get all job postings
// GET http://localhost:5000/api/career
router.get("/", async (req, res) => {
  try {
    const jobs = await JobPosting.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE — edit an existing job posting by its ID
// PUT http://localhost:5000/api/career/:id
router.put("/:id", async (req, res) => {
  try {
    const updatedJob = await JobPosting.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// DELETE — remove a job posting by its ID
// DELETE http://localhost:5000/api/career/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedJob = await JobPosting.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.status(200).json({ message: "Job posting deleted successfully", deletedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;