const express = require('express');
const router = express.Router();

const {
  createEvent,
  getAllEventsOfOrganiser,
  getEventById,
  updateEvent,
  deleteEvent,
  markAttendance,
  completeEvent,
  getEventsForUser,
  getAllEvents,
  getUsersRegisteredForEvent
} = require('../controllers/eventController');

const {
  notifyNearbyVolunteers,
  sendRemindersForUpcomingEvents
} = require('../controllers/emailController');

const { isAuthenticated, isOrganizer } = require('../middlewares/auth');

// --- Organizer-only Routes ---
router.post('/create', isAuthenticated, isOrganizer, createEvent);

// My organized events (Organizer only)
router.get('/my-events', isAuthenticated, isOrganizer, getAllEventsOfOrganiser);

// Mark attendance for an event
router.patch('/:id/attendance', isAuthenticated, markAttendance);

// Mark event as complete
router.patch('/:id/complete', isAuthenticated, isOrganizer, completeEvent);

// Update or delete a specific event (Organizer only)
router.put('/:id', isAuthenticated, isOrganizer, updateEvent);
router.delete('/:id', isAuthenticated, isOrganizer, deleteEvent);

// Notify nearby volunteers about an event
router.post('/:id/notify-nearby', isAuthenticated, isOrganizer, notifyNearbyVolunteers);

// Send reminders for all upcoming events
router.get('/reminders/send', isAuthenticated, isOrganizer, sendRemindersForUpcomingEvents);

// --- Authenticated Routes ---
router.get('/user/:userId', isAuthenticated, getEventsForUser); // Events registered/attended by user
router.get('/:id/users', isAuthenticated, getUsersRegisteredForEvent); // Volunteers for specific event

// --- Public Routes ---
router.get('/', getAllEvents); // All public events

// NOTE: Keep this last to avoid route conflicts with above
router.get('/:id', getEventById); // Get event by ID

module.exports = router;
