const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true, // e.g. "Software Engineer"
        },
        description: {
            type: String,
            required: true, // e.g. "We are looking for a skilled software engineer..." 
        },
        location: {
            type: String,
            required: true, // e.g. "New York, NY"
        },
        salary: {
            type: String,
            required: true, // e.g. "$80,000 - $100,000"
        },
        requirements: {
            type: [String], // e.g. ["Bachelor's degree in Computer Science", "3+ years of experience"]
        },
        company: {
            type: String,
            required: true, // e.g. "TechCorp Inc."
        },
        postedDate: {
            type: Date,
            default: Date.now, // automatically set to the current date when a new job posting is created
        },
        applyLink: {
            type: String, // optional — some postings might not have an external link
        },
    },
    {
        timestamps: true, // automatically adds createdAt and updatedAt fields
    }
);
module.exports = mongoose.model("JobPosting", jobPostingSchema);