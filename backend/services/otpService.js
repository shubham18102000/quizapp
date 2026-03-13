import nodemailer from 'nodemailer';

// Store OTPs in memory (in production, use Redis or database)
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(email) {
  const otp = generateOTP();
  
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Quiz App OTP',
      html: `
        <h2>Quiz App - OTP Verification</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    // Store OTP with expiration (10 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

export function verifyOTP(email, otp) {
  const stored = otpStore.get(email);
  
  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return false;
  }

  if (stored.otp !== otp) {
    return false;
  }

  otpStore.delete(email);
  return true;
}
