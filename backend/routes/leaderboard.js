import express from 'express';
import { getDB } from '../db.js';

const router = express.Router();

// Get leaderboard
router.get('/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const db = getDB();

    const leaderboard = await db.collection('scores')
      .aggregate([
        { $match: { subject } },
        {
          $group: {
            _id: '$userId',
            avgScore: { $avg: '$score' },
            totalAttempts: { $sum: 1 },
            bestScore: { $max: '$score' },
            totalPercentage: { $avg: '$percentage' }
          }
        },
        { $sort: { totalPercentage: -1 } },
        { $limit: 100 }
      ])
      .toArray();

    // Fetch user details
    const leaderboardWithUsers = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await db.collection('users').findOne(
          { _id: entry._id },
          { projection: { name: 1, email: 1 } }
        );
        return {
          userId: entry._id.toString(),
          userName: user?.name || 'Unknown',
          avgScore: Math.round(entry.avgScore * 100) / 100,
          totalAttempts: entry.totalAttempts,
          bestScore: entry.bestScore,
          totalPercentage: Math.round(entry.totalPercentage * 100) / 100
        };
      })
    );

    res.json({ leaderboard: leaderboardWithUsers });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
