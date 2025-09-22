const User = require('../models/User');
const Event = require('../models/Events');

// @desc Get User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, role, location } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (role) updateData.role = role;

    if (location) {
      updateData.location = {};
      if (location.city) updateData.location.city = location.city;
      if (location.state) updateData.location.state = location.state;

      if (location.coordinates) {
        updateData.location.coordinates = {};
        if (location.coordinates.lat !== undefined) {
          updateData.location.coordinates.lat = location.coordinates.lat;
        }
        if (location.coordinates.lng !== undefined) {
          updateData.location.coordinates.lng = location.coordinates.lng;
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Register logged-in user for an event
exports.registerForEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.eventId;

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ message: 'User or Event not found' });
    }

    // Already registered?
    const alreadyRegistered = event.volunteersRegisteredList.some(
      (entry) => entry.volunteer.toString() === userId.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Register user
    user.registeredEvents.push(eventId);
    await user.save();

    // Add user to event's registered list with default status 'absent'
    event.volunteersRegisteredList.push({
      volunteer: userId,
      status: 'absent'
    });
    event.volunteersRegistered += 1;

    await event.save();

    res.status(200).json({ message: 'Successfully registered for the event' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};



// @desc Get Badges
exports.getBadges = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('badges');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get Certificates (Mock)
exports.getCertificates = async (req, res) => {
  try {
    const dummy = [
      {
        title: "Juhu Beach Cleanup - July",
        issuedAt: "2025-07-10",
        downloadLink: `/downloads/certificates/${req.params.id}-juhu.pdf`
      }
    ];
    res.json(dummy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({ role: 'volunteer' })
      .sort({ totalEventsAttended: -1, totalWasteCollectedKg: -1 })
      .limit(10)
      .select('name totalEventsAttended totalWasteCollectedKg badges');
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
