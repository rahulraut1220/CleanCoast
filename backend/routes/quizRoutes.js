const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const {
  getNextQuestion,
  submitQuizResult,
  submitAnswer,
  getQuizHistory
} = require('../controllers/quizController');

router.get('/next', isAuthenticated, getNextQuestion);
router.post('/:id/submit', isAuthenticated, submitAnswer);
router.post('/submit', isAuthenticated, submitQuizResult);
router.get('/history', isAuthenticated, getQuizHistory);

module.exports = router;