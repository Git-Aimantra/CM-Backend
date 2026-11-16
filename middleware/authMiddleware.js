const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Tokens are sent as: "Authorization: Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Old tokens (issued before multi-company) have no companyId.
    // Make those admins log in again.
    if (!decoded.companyId) {
      return res.status(401).json({ message: "Session outdated, please log in again" });
    }

    req.admin = decoded; // { id, username, companyId }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;