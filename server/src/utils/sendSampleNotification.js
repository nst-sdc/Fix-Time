const path = require('path');
// Load environment variables from the .env file in the server directory
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sendEmail = require('./sendEmail');

async function sendTestNotification() {
  try {
    // Make sure EMAIL_USER and EMAIL_PASS are set in your .env file
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Error: EMAIL_USER and EMAIL_PASS must be set in your .env file.');
      console.error('Please ensure a .env file exists in the /server directory with these values.');
      return;
    }

    console.log(`Sending sample notification from ${process.env.EMAIL_USER} to ngdell734@gmail.com...`);
    await sendEmail(
      'ngdell734@gmail.com', // The recipient's email
      'Test Appointment Reminder from FixTime',
      'This is a sample notification from FixTime. Your appointment is coming up soon!'
    );
    console.log('✅ Sample notification sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send sample notification:', error);
  }
}

sendTestNotification(); 