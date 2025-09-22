const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setRoleAndLocation = async (req, res) => {
  const { role, location } = req.body;
  const userId = req.user?._id || req.user?.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role, location },
      { new: true }
    );
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    let user;

    // 🌐 Google login (session-based)
    if (req.user) {
      const { _id, name, email, role, location } = req.user;
      return res.json({ user: { _id, name, email, role, location } });
    }

    // 🔐 JWT login
    if (req.userId) {
      user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const { _id, name, email, role, location } = user;
      return res.json({ user: { _id, name, email, role, location } });
    }

    // ❌ Not authenticated
    return res.status(401).json({ message: 'Not authenticated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


