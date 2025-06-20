// routes/api.js
const express = require('express');
const router = express.Router();
const db = require('../db');


// /api/dogs
router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.name AS dog_name, d.size, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve dogs', details: err.message });
  }
});

// /api/walkrequests/open
router.get('/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve open walk requests', details: err.message });
  }
});

// /api/walkers/summary
router.get('/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.username AS walker_username,
        COUNT(r.rating_id) AS total_ratings,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(DISTINCT wr.request_id) AS completed_walks
      FROM Users u
      LEFT JOIN WalkRequests wr ON u.user_id = wr.walker_id AND wr.status = 'completed'
      LEFT JOIN Ratings r ON wr.request_id = r.request_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve walker summary', details: err.message });
  }
});

module.exports = router;
