const Event = require('../models/Events');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.createEvent = async (req, res) => {
  try {
    const data = {
      ...req.body,
      organizerId: req.user._id 
    };

    console.log(data);

    const event = await Event.create(data);

    // Update user document if they are an organizer
    const user = await User.findById(req.user._id);

    if (user.role === 'organizer') {
      // Defensive check to ensure eventsOrganized is an array
      if (!Array.isArray(user.eventsOrganized)) {
        user.eventsOrganized = [];
      }

      user.eventsOrganized.push(event._id);
      await user.save();
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// get all events created by the organizer
exports.getAllEventsOfOrganiser = async(req, res) => {
  console.log(req.user._id);
  try {
    
    const events = await Event.find({ organizerId: req.user._id }).sort({ date: 1 });
    console.log(events);
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Remove event reference from the organizer's eventsOrganized array
    const user = await User.findById(event.organizerId);
    console.log(user._id);
    if (user && user.role === 'organizer') {
      user.eventsOrganized.pull(event._id);
      await user.save();
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Mark attendance of each volunteer
exports.markAttendance = async (req, res) => {
  const eventId = req.params.id;
  const { volunteerId, status } = req.body;

  if (!['present', 'absent'].includes(status)) {
    return res.status(400).json({ error: 'Invalid attendance status' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const volunteerIndex = event.volunteersRegisteredList.findIndex(
      (v) => v.volunteer.toString() === volunteerId
    );

    if (volunteerIndex === -1) {
      return res.status(404).json({ error: 'Volunteer not registered for this event' });
    }

    // Update status in volunteersRegisteredList
    event.volunteersRegisteredList[volunteerIndex].status = status;

    // If present, update event and user documents accordingly
    if (status === 'present') {
      const user = await User.findById(volunteerId);
      if (!user) return res.status(404).json({ error: 'Volunteer not found' });

      // Add to volunteerList if not already added
      if (!event.volunteerList.includes(volunteerId)) {
        event.volunteerList.push(volunteerId);
        event.volunteersAttended += 1;
      }

      // Add to user.eventsParticipated if not already added
      if (!user.eventsParticipated.includes(eventId)) {
        user.eventsParticipated.push(event._id);
        user.totalEventsAttended += 1;
        await user.save();
      }
    }

    await event.save();

    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




// Complete event with waste distribution
exports.completeEvent = async (req, res) => {
  try {
    const { wasteBreakdown, areaCoveredSqM, hoursSpent } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const totalWaste = Object.values(wasteBreakdown).reduce((sum, val) => sum + (val || 0), 0);

    event.wasteBreakdown = wasteBreakdown;
    event.totalWasteCollectedKg = totalWaste;
    event.areaCoveredSqM = areaCoveredSqM;
    event.hoursSpent = hoursSpent;
    event.status = 'completed';
    event.reportGenerated = true;

    // Distribute waste among attendees
    const perUserWaste = totalWaste / event.volunteersAttended || 0;
    for (const userId of event.volunteerList) {
      const user = await User.findById(userId);
      if (user) {
        user.totalWasteCollectedKg += perUserWaste;
        await user.save();
      }
    }

    await event.save();
    res.json({ message: 'Event marked complete & data saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get events registered and participated by a user
exports.getEventsForUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId)
      .populate('registeredEvents')
      .populate('eventsParticipated');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      registered: user.registeredEvents,
      participated: user.eventsParticipated,
    });
  } catch (err) {
    console.error('Error fetching user events:', err);
    res.status(500).json({ message: 'Failed to fetch user events' });
  }
};

// get users registed for event
exports.getUsersRegisteredForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('volunteersRegisteredList');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event.volunteersRegisteredList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
}
