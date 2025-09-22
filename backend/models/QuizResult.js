const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: Number,
  total: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  questions: [
    {
      question: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
    },
  ],
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
