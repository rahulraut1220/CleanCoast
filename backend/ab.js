// scripts/importQuiz.js
const mongoose = require('mongoose');
const QuizQuestion = require('./models/QuizQuestion');
const fs = require('fs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beach-cleanup';

async function importQuizData() {
  try {
    await mongoose.connect(MONGO_URI);
    const raw = fs.readFileSync('./question.json');
    const questions = JSON.parse(raw);

    await QuizQuestion.insertMany(questions);
    console.log(`✅ Successfully inserted ${questions.length} quiz questions`);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err.message);
    mongoose.disconnect();
  }
}

importQuizData();
