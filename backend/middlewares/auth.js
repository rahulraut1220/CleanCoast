// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  // ✅ Case 1: Session-based (Google OAuth)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // ✅ Case 2: Token-based (Manual JWT login)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user; // ✅ attach user to req
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  // ❌ If neither session nor token is valid
  return res.status(401).json({ message: "Unauthorized. Please login." });
};
exports.isOrganizer = (req, res, next) => {
  if (req.user?.role !== "organizer") {
    return res.status(403).json({ message: "Forbidden: Organizer access only" });
  }
  next();
};

exports.isVolunteer = (req, res, next) => {
  if (req.user?.role !== "volunteer") {
    return res.status(403).json({ message: "Forbidden: Volunteer access only" });
  }
  next();
};

exports.isSelfOrOrganizer = (req, res, next) => {
  if (req.user.role === "organizer" || req.user._id.toString() === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Access denied" });
};
