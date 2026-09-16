const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");


// CREATE — add a new project
// POST http://localhost:5000/api/projects
router.post("/", protect, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ — get all projects
// GET http://localhost:5000/api/projects
router.get("/",  async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE — edit an existing project by its ID
// PUT http://localhost:5000/api/projects/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE — remove a project by its ID
// DELETE http://localhost:5000/api/projects/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully", deletedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;