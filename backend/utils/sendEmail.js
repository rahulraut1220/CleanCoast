const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // e.g. rahulraut1220@gmail.com
    pass: process.env.EMAIL_PASS        // App password
  }
});

// Core reusable function
const sendMail = async (to, subject, text, html = '') => {
  try {
    const info = await transporter.sendMail({
      from: `"Beach Cleanup Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log('✅ Email sent:', info.response);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

module.exports = sendMail;
