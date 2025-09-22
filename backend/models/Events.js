const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // 1. Basic Event Details
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  location: {
    name: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    meetingPoint: { type: String }
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // 2. Volunteer and Participation Info
  volunteersRegistered: {
    type: Number,
    default: 0,
  },
  volunteersRegisteredList: [
    {
      volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'absent',
      }
    }
  ],
  volunteersAttended: {
    type: Number,
    default: 0,
  },
  volunteerList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

  // 3. Waste Collection Data
  totalWasteCollectedKg: {
    type: Number,
    default: 0,
  },
  wasteBreakdown: {
    plastic: { type: Number, default: 0 },
    glass: { type: Number, default: 0 },
    metal: { type: Number, default: 0 },
    organic: { type: Number, default: 0 },
    eWaste: { type: Number, default: 0 },
  },

  // 4. Impact Metrics
  areaCoveredSqM: {
    type: Number,
    default: 0,
  },
  hoursSpent: {
    type: Number,
    default: 0,
  },

  // 5. Status and Reports
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  reportGenerated: {
    type: Boolean,
    default: false,
  },
  socialPosts: [
    {
      type: {
        type: String,
        enum: ['pre-event', 'post-event'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      platform: {
        type: String
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
