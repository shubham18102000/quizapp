import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../db.js';
import { sendOTP, verifyOTP } from '../services/otpService.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await sendOTP(email);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Register/Login with OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const db = getDB();
    const usersCollection = db.collection('users');

    let user = await usersCollection.findOne({ email });

    if (!user) {
      // New user registration
      if (!name) {
        return res.status(400).json({ error: 'Name is required for new users' });
      }

      const newUser = {
        email,
        name,
        role: 'user',
        createdAt: new Date()
      };

      const result = await usersCollection.insertOne(newUser);
      user = { _id: result.insertedId, ...newUser };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: { $oid: req.user.userId } },
      { projection: { _id: 1, email: 1, name: 1, role: 1 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
