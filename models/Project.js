const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true, // e.g. "Completed Projects", "Ongoing Projects"
    },
    location: {
      type: String,
      required: true,
    },
    head: {
      type: String, // e.g. "4-Lane"
    },
    km: {
      type: String, // e.g. "48.32 Km"
    },
    work: {
      type: String, // e.g. "Highway" (sector)
    },
    duration: {
      type: String,
    },
    client: {
      type: String,
    },
    department: {
      type: String,
    },
    paragraph: {
      type: String,
      required: true, // the description text
    },
    image: {
      type: String,
      required: false, 
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);