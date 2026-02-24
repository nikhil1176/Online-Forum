// middleware/adminMiddleware.js
module.exports = function (req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    next(); // ✅ allow request to continue
  } catch (err) {
    console.error("Admin middleware error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
