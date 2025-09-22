const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
  rating: { type: Number, enum: [1, 2, 3, 4, 5], default: 1 },
  topic: { type: String } // optional for filtering
}, { timestamps: true });

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);