// send-sms.js (Express route handler)
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
require('dotenv').config();

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

router.post('/api/send-sms', async (req, res) => {
  const { to, body } = req.body;
  try {
    await client.messages.create({
      body,
      from:"+19473004716",
      to:"+94751170942",
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Twilio error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
