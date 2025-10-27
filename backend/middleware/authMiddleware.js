const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Get the full Authorization header
  const authHeader = req.header("Authorization");

  // Check if it exists
  if (!authHeader) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  // Check if it's in the correct 'Bearer <token>' format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token format is invalid" });
  }

  try {
    // 1. Split the "Bearer " prefix off to get the actual token
    const token = authHeader.split(" ")[1];

    // 2. Verify just the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; // contains {id: ...}
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
};

module.exports = auth;