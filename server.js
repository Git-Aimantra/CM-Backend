require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const investorRoutes = require("./routes/InvestorRoutes");
const careerRoutes = require("./routes/careerRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");


connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/investor", investorRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("CivilMantra backend is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
