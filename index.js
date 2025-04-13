const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_CODE = process.env.SECRET_CODE;

app.use(cors());
app.use(express.json());

app.post('/validate', async (req, res) => {
  const { input } = req.body;

  if (input !== SECRET_CODE) {
    return res.status(401).json({ success: false, message: 'Incorrect input' });
  }

  // Send email
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password
      },
    });

    await transporter.sendMail({
      from: `"Secret Puzzle" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: '🎉 Someone got the correct input!',
      text: 'Someone solved the puzzle and entered the correct input!',
    });

    return res.json({ success: true, message: 'Input correct. Email sent.' });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
