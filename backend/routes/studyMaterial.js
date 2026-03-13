import express from 'express';
import { getDB } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get study materials for a subject
router.get('/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const db = getDB();

    const materials = await db.collection('studyMaterials')
      .find({ subject })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      materials: materials.map(m => ({
        id: m._id.toString(),
        subject: m.subject,
        title: m.title,
        content: m.content,
        topic: m.topic,
        createdAt: m.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ error: 'Failed to fetch study materials' });
  }
});

// Get single study material
router.get('/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const { ObjectId } = await import('mongodb');

    const material = await db.collection('studyMaterials')
      .findOne({ _id: new ObjectId(id) });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({
      id: material._id.toString(),
      subject: material.subject,
      title: material.title,
      content: material.content,
      topic: material.topic,
      createdAt: material.createdAt
    });
  } catch (error) {
    console.error('Error fetching study material:', error);
    res.status(500).json({ error: 'Failed to fetch study material' });
  }
});

export default router;
