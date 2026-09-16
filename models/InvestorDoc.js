const mongoose = require("mongoose");

const investorDocSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true, // e.g. "Annual Reports", "CSR"
    },
    title: {
      type: String,
      required: true, // e.g. "Annual Report 2025-26"
    },
    year: {
      type: String, // e.g. "2025-26" — not required, some docs are one-time
    },
    fileUrl: {
      type: String,
      required: true, // where the actual PDF is stored
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("InvestorDoc", investorDocSchema);