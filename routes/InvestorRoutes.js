const express = require("express");
const router = express.Router();
const InvestorDoc = require("../models/InvestorDoc");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// CREATE — add a new investor document with a PDF file
// POST http://localhost:5000/api/investor
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newDoc = new InvestorDoc({
      category: req.body.category,
      title: req.body.title,
      year: req.body.year,
      fileUrl,
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ — get all investor documents
router.get("/", async (req, res) => {
  try {
    const docs = await InvestorDoc.find();
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE — remove an investor document by its ID
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedDoc = await InvestorDoc.findByIdAndDelete(req.params.id);
    if (!deletedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully", deletedDoc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;