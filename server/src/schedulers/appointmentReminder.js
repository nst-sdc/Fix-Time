const cron = require('node-cron');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const nodemailer = require('nodemailer');

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const REMINDER_INTERVALS = [
  24 * 60, // 24 hours
  12 * 60, // 12 hours
  6 * 60,  // 6 hours
  60,      // 1 hour
  30,      // 30 minutes
  5,       // 5 minutes
  0        // at time
];

function getMinutesDiff(date1, date2) {
  return Math.round((date1 - date2) / (1000 * 60));
}

async function sendReminderEmail(appointment, minutesBefore) {
  const subject = minutesBefore === 0
    ? 'Your appointment is starting now!'
    : `Reminder: Your appointment is in ${minutesBefore} minutes`;

  const apptTime = new Date(appointment.date);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: appointment.customerEmail,
    subject,
    text: `Dear ${appointment.customerName},\n\nThis is a reminder that your appointment for service is scheduled at ${apptTime.toLocaleString()} UTC.\n\nThank you!`
  };

  await transporter.sendMail(mailOptions);
}

async function checkAndSendReminders() {
  const now = new Date();
  const upcoming = new Date(now.getTime() + 25 * 60 * 60 * 1000); // next 25 hours

  // Only for registered users
  const appointments = await Appointment.find({
    userId: { $ne: null },
    status: 'scheduled',
    date: { $gte: now, $lte: upcoming }
  }).populate('serviceId');

  for (const appt of appointments) {
    const apptTime = new Date(appt.date);
    const diff = getMinutesDiff(apptTime, now);

    for (const interval of REMINDER_INTERVALS) {
      if (diff === interval) {
        await sendReminderEmail(appt, interval);
      }
    }
  }
}

cron.schedule('*/10 * * * *', () => {
  checkAndSendReminders().catch(console.error);
}); 