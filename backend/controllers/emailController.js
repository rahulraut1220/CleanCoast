const User = require('../models/User');
const Event = require('../models/Events');
const sendMail = require('../utils/sendEmail');
const { getDistance } = require('geolib');

// Send to all volunteers within 10 km
exports.notifyNearbyVolunteers = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { lat, lng } = event.location.coordinates;
    const volunteers = await User.find({ role: 'volunteer' });

    const nearbyVolunteers = volunteers.filter(user => {
      if (user.location?.coordinates?.lat && user.location?.coordinates?.lng) {
        const distance = getDistance(
          { latitude: lat, longitude: lng },
          {
            latitude: user.location.coordinates.lat,
            longitude: user.location.coordinates.lng
          }
        );
        return distance <= 10000; // 10 km
      }
      return false;
    });

    const subject = `🌊 Beach Cleanup Nearby: ${event.title}`;
    const html = `
      <h3>Join Us for ${event.title}!</h3>
      <p><strong>Where:</strong> ${event.location.name} (${event.location.city})</p>
      <p><strong>When:</strong> ${new Date(event.date).toDateString()} at ${event.startTime}</p>
      <p>Let’s clean the beach together! 🌍</p>
    `;

    for (const v of nearbyVolunteers) {
      await sendMail(v.email, subject, '', html);
    }

    res.json({ message: `✅ Sent to ${nearbyVolunteers.length} nearby volunteers.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendRemindersForUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const events = await Event.find({
      date: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0),
        $lte: nextDay
      },
      status: 'upcoming'
    }).populate('volunteerList');

    let totalMails = 0;

    for (const event of events) {
      const html = `
        <h3>Reminder: ${event.title}</h3>
        <p>Date: ${new Date(event.date).toDateString()}</p>
        <p>Time: ${event.startTime} - ${event.endTime}</p>
        <p>Location: ${event.location.name}</p>
        <p>Thank you for being part of the movement! 🌊</p>
      `;

      for (const volunteer of event.volunteerList) {
        await sendMail(volunteer.email, `⏰ Reminder: ${event.title}`, '', html);
        totalMails++;
      }
    }

    res.json({ message: `✅ Reminders sent to ${totalMails} volunteers.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
