const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  setRoleAndLocation,
  getMe
} = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// 🔐 Manual Auth Routes
router.post('/register', register);
router.post('/login', login);
router.put('/complete-profile', isAuthenticated, setRoleAndLocation);
router.get('/me', isAuthenticated, getMe);

// 🌐 Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),
  (req, res) => {
    res.redirect('http://localhost:5173/');
  }
);

// 🔓 Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// ❌ Login Failure
router.get('/failure', (req, res) => {
  res.status(401).send('❌ Google Login Failed');
});

module.exports = router;
