const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 1. Basic Profile Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  password: {
    type: String,
    default: 'oauth' // placeholder for Google login
  },

  // 2. Location Info
  location: {
    city: { type: String },
    state: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },

  // 3. Role
  role: {
    type: String,
    enum: ['volunteer', 'organizer'],
    default: 'volunteer'
  },

  // 4. Participation
  eventsParticipated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],
  registeredEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],
  totalEventsAttended: {
    type: Number,
    default: 0
  },
  totalWasteCollectedKg: {
    type: Number,
    default: 0
  },

  // 5. Organization (only for organizers)
  eventsOrganized: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],

  // 6. Badges
  badges: [
    {
      name: {
        type: String,
        enum: [
          'EcoStarter',
          'BeachBuddy',
          'OceanSaver',
          'PlasticPatrol',
          'TideTurner',
          'CleanupChamp',
          'StreakMaster'
        ]
      },
      awardedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // 7. Quizzes (for future)
  quizScores: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      },
      score: Number
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
