// ✅ controllers/quizController.js
const QuizQuestion = require('../models/QuizQuestion');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

// Return one question at a specific difficulty level
exports.getNextQuestion = async (req, res) => {
  try {
    const level = parseInt(req.query.level) || 1;
    const question = await QuizQuestion.aggregate([
      { $match: { rating: level } },
      { $sample: { size: 1 } }
    ]);

    if (!question.length) {
      return res.status(404).json({ message: `No question found for level ${level}` });
    }

    res.json({ question: question[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  const { id } = req.params;
  const { selectedAnswer } = req.body;

  try {
    const question = await QuizQuestion.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const correctAnswer = question.options[question.correctAnswerIndex];
    const isCorrect = selectedAnswer === correctAnswer;

    res.json({ correct: isCorrect, correctAnswer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Submit quiz and score
exports.submitQuizResult = async (req, res) => {
  const { score, total, questions } = req.body;
  const userId = req.user._id;

  try {
    // Optional: Validate each question object
    const detailedQuestions = questions.map((q) => ({
      question: q.question,
      selectedAnswer: q.selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: q.isCorrect,
    }));

    const result = await QuizResult.create({
      user: userId,
      score,
      total,
      questions: detailedQuestions,
      date: new Date(),
    });

    console.log(result);

    res.status(200).json({
      message: '✅ Quiz submitted successfully',
      resultId: result._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get quiz results for the logged-in user
exports.getQuizHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await QuizResult.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quiz history" });
  }
};
