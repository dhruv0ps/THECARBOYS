const twilio = require('twilio');
require('dotenv').config(); // Load environment variables

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // From .env
const authToken = process.env.TWILIO_AUTH_TOKEN;   // From .env
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // From .env

const client = twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = async (to, message) => {
    console.log("service",message)
  try {
    const response = await client.messages.create({
      body: message,       
      from: twilioPhoneNumber, // From .env
      to: to,                // Recipient's phone number
    });
    console.log('Message sent:', response.sid);
    return response.sid;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error; 
  }
};

// Export the function
module.exports = { sendSMS };
