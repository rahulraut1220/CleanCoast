const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const Event = require('../models/Events');
const User = require('../models/User');



exports.generateCertificate = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ message: 'User or Event not found' });
    }

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=certificate-${user.name}.pdf`
    );

    doc.pipe(res);

    // 1️⃣ Background Template
    const bgPath = path.join(__dirname, '../assets/certificate_template.png');
    if (fs.existsSync(bgPath)) {
      doc.image(bgPath, 0, 0, {
        width: 841.89,
        height: 595.28,
      });
    }

    // 2️⃣ Participant Name
    doc
      .font('Times-Bold')
      .fontSize(30)
      .fillColor('#000000')
      .text(user.name.toUpperCase(), 0, 180, { align: 'center' });

    // 3️⃣ Certificate Body (multi-line with extra text)
    const centerY = 240;
    doc
      .font('Times-Roman')
      .fontSize(18)
      .fillColor('#000')
      .text(
        `is hereby awarded this certificate of appreciation for their`,
        0,
        centerY,
        { align: 'center' }
      )
      .text(
        `valuable contribution and active participation in the`,
        0,
        centerY + 25,
        { align: 'center' }
      );

    doc
      .font('Times-BoldItalic')
      .fontSize(20)
      .fillColor('#007B5E')
      .text(`"${event.title}"`, 0, centerY + 55, { align: 'center' });

    doc
      .font('Times-Roman')
      .fontSize(16)
      .fillColor('#000')
      .text(
        `organized in ${event.location.city}, ${event.location.state} on ${new Date(
          event.date
        ).toDateString()}.`,
        0,
        centerY + 85,
        { align: 'center' }
      )
      .text(
        `Your dedication and environmental responsibility have helped make a`,
        0,
        centerY + 115,
        { align: 'center' }
      )
      .text(
        `positive impact in preserving our coastal ecosystem.`,
        0,
        centerY + 140,
        { align: 'center' }
      );

    // 4️⃣ Signature Block (bottom-right)
    doc
  .font('Times-Bold')
  .fontSize(16)
  .fillColor('#000')
  .text('Organiser', 540, 450)  // ⬇️ Moved down (was 420)
  .font('Times-Roman')
  .text('Beach Warriors', 540, 520);  // ⬇️ Moved down (was 440)


    doc.end();
  } catch (error) {
    console.error('❌ Certificate Generation Error:', error.message);
    res.status(500).json({ message: 'Certificate generation failed' });
  }
};



// GET all certificates for a user
exports.getCertificates = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);

    const events = await Event.find({
      "volunteersRegisteredList": {
        $elemMatch: {
          volunteer: userId,
          status: "present"
        }
      }
    });

    const certificates = events.map(event => ({
      title: `${event.title}`,
      issuedAt: event.date.toISOString().split('T')[0],
      downloadLink: `/api/certificates/${event._id}?userId=${userId}`
    }));

    res.json(certificates);
  } catch (err) {
    console.error('❌ Certificate Fetch Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

