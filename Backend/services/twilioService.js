const twilio = require('twilio');
require('dotenv').config(); 


const accountSid = process.env.TWILIO_ACCOUNT_SID; // From .env
const authToken = process.env.TWILIO_AUTH_TOKEN;   // From .env
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // From .env




const sendSMS = async (to, message) => {
    console.log("service",message)
  try {
    const response = await client.messages.create({
      body: message,       
      from: twilioPhoneNumber,
      to: to,               
    });
    console.log('Message sent:', response.sid);
    return response.sid;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error; 
  }
};

const sendBulksms = async(recipients,message) =>{
  try{
    const promises = recipients.map((phonenumbers) => client.messages.create({
      body : message,
      from : twilioPhoneNumber,
      to : phonenumbers,

    }));
    const response = await Promise.all(promises);

    console.log('Message sent:', response.sid);
    return response.sid;
  }
  catch (error) {
    console.error('Error sending SMS:', error);
    throw error; 
  }
  
}


module.exports = { sendSMS,sendBulksms };
