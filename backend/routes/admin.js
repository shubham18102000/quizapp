import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Add question
router.post('/questions', verifyAdmin, async (req, res) => {
  try {
    const { subject, question, options, answer, topic } = req.body;

    if (!subject || !question || !options || !answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getDB();
    const newQuestion = {
      subject,
      question,
      options,
      answer,
      topic: topic || '',
      createdAt: new Date()
    };

    const result = await db.collection('questions').insertOne(newQuestion);

    res.json({
      message: 'Question added successfully',
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Get all questions
router.get('/questions', verifyAdmin, async (req, res) => {
  try {
    const db = getDB();
    const questions = await db.collection('questions').find({}).toArray();

    res.json({
      questions: questions.map(q => ({
        id: q._id.toString(),
        subject: q.subject,
        question: q.question,
        options: q.options,
        answer: q.answer,
        topic: q.topic,
        createdAt: q.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Delete question
router.delete('/questions/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const result = await db.collection('questions').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// Add study material
router.post('/study-materials', verifyAdmin, async (req, res) => {
  try {
    const { subject, title, content, topic } = req.body;

    if (!subject || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getDB();
    const newMaterial = {
      subject,
      title,
      content,
      topic: topic || '',
      createdAt: new Date()
    };

    const result = await db.collection('studyMaterials').insertOne(newMaterial);

    res.json({
      message: 'Study material added successfully',
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Error adding study material:', error);
    res.status(500).json({ error: 'Failed to add study material' });
  }
});

// Delete study material
router.delete('/study-materials/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const result = await db.collection('studyMaterials').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({ message: 'Study material deleted successfully' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    res.status(500).json({ error: 'Failed to delete study material' });
  }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('users').find({}).toArray();

    res.json({
      users: users.map(u => ({
        id: u._id.toString(),
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.put('/users/:id/role', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const db = getDB();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

export default router;
