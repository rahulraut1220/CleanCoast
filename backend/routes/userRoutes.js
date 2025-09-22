const express = require('express');
const router = express.Router();
const {
  getUser,
  updateUser,
  getBadges,
  getCertificates,
  getLeaderboard,
  registerForEvent
} = require('../controllers/userController');

const {
  isAuthenticated,
  isOrganizer,
  isVolunteer,
  isSelfOrOrganizer
} = require('../middlewares/auth');

// ✅ Public leaderboard
router.get('/leaderboard', getLeaderboard);

// ✅ Allow user or organizer to view/update their own data
router.get('/:id', isAuthenticated, isSelfOrOrganizer, getUser);
router.put('/:id',updateUser);
router.get('/:id/badges', isAuthenticated, isSelfOrOrganizer, getBadges);
router.get('/:id/certificates', isAuthenticated, isSelfOrOrganizer, getCertificates);

// ✅ Volunteer event registration
router.post('/register/:eventId', isAuthenticated, isVolunteer, registerForEvent);

module.exports = router;
