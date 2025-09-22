const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

// Route Imports
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const newsRoutes = require('./routes/newsRoute');
const certificateRoutes = require('./routes/certificateRoutes');

// Env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Passport Google Strategy Setup
require('./auth/google');

const app = express();

// ----------------------------------
// 🔐 CORS Setup for React Frontend
// ----------------------------------
app.use(cors({
  origin: 'http://localhost:5173', // React frontend
  credentials: true, // allow cookies
}));

// -----------------------------
// 🔧 Express Middlewares
// -----------------------------
app.use(express.json());

// --------------------------------
// 🧠 Session Configuration
// --------------------------------
app.use(session({
  secret: process.env.SESSION_SECRET || "beach_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
}));

// -----------------------------
// 🛂 Passport Middlewares
// -----------------------------
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------
// 🌐 API Routes
// -----------------------------
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/quiz', quizRoutes);
app.use('/api/news', newsRoutes);
app.use('/api', certificateRoutes);

// -----------------------------
// 🔁 Root Route
// -----------------------------
app.get('/', (req, res) => {
  res.send('🌊 Beach Cleanup API Running');
});

// -----------------------------
// 🚀 Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
