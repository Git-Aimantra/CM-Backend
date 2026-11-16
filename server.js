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

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // No origin = Postman / server-to-server, allow it.
      // Otherwise the website must be on the allowed list.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(null, false);
    },
  })
);
// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
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
