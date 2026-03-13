import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get subjects
router.get('/subjects', async (req, res) => {
  try {
    res.json({
      subjects: ['C++', 'Java']
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get questions for a subject
router.get('/questions/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const db = getDB();

    const questions = await db.collection('questions')
      .find({ subject })
      .project({ answer: 0 }) // Don't send answer to client
      .toArray();

    res.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Submit quiz answers
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { subject, answers } = req.body;
    const db = getDB();

    if (!subject || !answers) {
      return res.status(400).json({ error: 'Subject and answers are required' });
    }

    // Get all questions for the subject
    const questions = await db.collection('questions')
      .find({ subject })
      .toArray();

    // Calculate score
    let score = 0;
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    for (const [questionId, userAnswer] of Object.entries(answers)) {
      const question = questionMap.get(questionId);
      if (question && question.answer === userAnswer) {
        score++;
      }
    }

    // Save score
    const scoreRecord = {
      userId: new ObjectId(req.user.userId),
      subject,
      score,
      totalQuestions: questions.length,
      percentage: (score / questions.length) * 100,
      completedAt: new Date()
    };

    await db.collection('scores').insertOne(scoreRecord);

    res.json({
      score,
      totalQuestions: questions.length,
      percentage: scoreRecord.percentage
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get user's quiz history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const history = await db.collection('scores')
      .find({ userId: new ObjectId(req.user.userId) })
      .sort({ completedAt: -1 })
      .toArray();

    res.json({ history: history.map(h => ({
      ...h,
      id: h._id.toString()
    })) });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
