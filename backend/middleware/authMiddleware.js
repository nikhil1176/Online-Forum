// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // 1. Get token from header (Check both 'Authorization' and 'x-auth-token')
    let token = req.header("Authorization") || req.header("x-auth-token");

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({ msg: "No authentication token, access denied" });
    }

    // 3. ROBUST CLEANUP (Fixes 'Bearer Bearer' or 'null' issues)
    // Replace "Bearer " (case insensitive) globally to handle double prefixes
    token = token.replace(/Bearer\s+/gi, "");

    // Trim whitespace
    token = token.trim();

    // Remove surrounding quotes if they exist (common localStorage bug)
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    // Check if we are left with a garbage string
    if (token === "null" || token === "undefined" || token === "") {
      return res.status(401).json({ msg: "Token is invalid/empty" });
    }

    // 4. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ msg: "Token is not valid", error: err.message });
  }
};