require("dotenv").config();
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const Project = require("../models/Project"); // adjust if your model file is named/located differently

const MONGO_URI = process.env.MONGO_URI;
const EXCEL_PATH = path.join(__dirname, "../../website_civilmantra_new-main/public/Excel/Ongoing Project List CIPL.xlsx");

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // rows[0] is the header row — skip it
  const dataRows = rows.slice(1);

  let inserted = 0;
  let skipped = 0;

  for (const row of dataRows) {
    const [srNo, projectName, state, period, services, client] = row;

    if (!projectName || !state) {
      skipped++;
      continue;
    }

    try {
      await Project.create({
        category: "DPR Projects",
        location: state,
        duration: period || "",
        work: services || "",
        client: client || "",
        paragraph: projectName,
        image: "", // no image data in the spreadsheet
      });
      inserted++;
    } catch (err) {
      console.error(`Row ${srNo} failed:`, err.message);
      skipped++;
    }
  }

  console.log(`Done. Inserted: ${inserted}, Skipped: ${skipped}, Total rows read: ${dataRows.length}`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});