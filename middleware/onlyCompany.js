// Usage: router.post("/", protect, onlyCompany("civilmantra"), ...)
// It must come AFTER protect, because it reads req.admin.
const onlyCompany = (companyId) => (req, res, next) => {
  if (req.admin && req.admin.companyId === companyId) return next();
  res.status(403).json({ message: "Forbidden for your company" });
};

module.exports = onlyCompany;