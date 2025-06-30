const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail');

// Future: import sendSMS, sendPushNotification here

const REMINDER_INTERVALS = [
  { label: '24h', ms: 24 * 60 * 60 * 1000 },
  { label: '12h', ms: 12 * 60 * 60 * 1000 },
  { label: '6h', ms: 6 * 60 * 60 * 1000 },
  { label: '1h', ms: 1 * 60 * 60 * 1000 },
  { label: '30m', ms: 30 * 60 * 1000 },
  { label: '5m', ms: 5 * 60 * 1000 },
  { label: '0m', ms: 0 }
];

// Helper to combine date and time fields into a UTC Date object
function getAppointmentUTCDate(appointment) {
  // appointment.date is a Date, appointment.time is a string like '10:00 AM'
  const [hourStr, minuteStr, period] = appointment.time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  const date = new Date(appointment.date);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}

cron.schedule('*/10 * * * *', async () => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Find appointments scheduled in the next 24 hours
  const appointments = await Appointment.find({
    date: { $gte: now, $lte: in24h },
    status: 'scheduled'
  });

  for (const appt of appointments) {
    const apptUTC = getAppointmentUTCDate(appt);
    for (const interval of REMINDER_INTERVALS) {
      const diff = apptUTC - now;
      if (
        diff <= interval.ms &&
        !appt.remindersSent.includes(interval.label) &&
        diff > interval.ms - 15 * 60 * 1000 // Only send once in the 15-min window
      ) {
        // Email content
        const subject = `Reminder: Your appointment is coming up!`;
        const timeStr = interval.label === '0m' ? 'now' : interval.label.replace('m', ' minutes').replace('h', ' hours');
        const body = `Hi ${appt.customerName},\n\nThis is a reminder that your appointment is ${timeStr === 'now' ? 'starting now' : 'in ' + timeStr}.\n\nService: ${appt.serviceId}\nDate: ${apptUTC.toUTCString()}\n\nThank you for using FixTime!`;
        await sendEmail(appt.customerEmail, subject, body);
        // Future: await sendSMS(...), await sendPushNotification(...)
        appt.remindersSent.push(interval.label);
        await appt.save();
      }
    }
  }
}); 