const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const { category, muscle_group } = req.query;
    let query = 'SELECT * FROM exercises';
    let params = [];
    let conditions = [];

    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }

    if (muscle_group) {
      conditions.push(`muscle_group = $${params.length + 1}`);
      params.push(muscle_group);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY name';

    const result = await db.query(query, params);
    res.json({ exercises: result.rows });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM exercises WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({ exercise: result.rows[0] });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get exercises by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await db.query(
      'SELECT * FROM exercises WHERE category = $1 ORDER BY name',
      [category]
    );

    res.json({ exercises: result.rows });
  } catch (error) {
    console.error('Get exercises by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get exercises by muscle group
router.get('/muscle-group/:muscleGroup', async (req, res) => {
  try {
    const { muscleGroup } = req.params;
    const result = await db.query(
      'SELECT * FROM exercises WHERE muscle_group = $1 ORDER BY name',
      [muscleGroup]
    );

    res.json({ exercises: result.rows });
  } catch (error) {
    console.error('Get exercises by muscle group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get exercise categories
router.get('/categories/list', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT category FROM exercises ORDER BY category'
    );

    const categories = result.rows.map(row => row.category);
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get muscle groups
router.get('/muscle-groups/list', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT muscle_group FROM exercises WHERE muscle_group IS NOT NULL ORDER BY muscle_group'
    );

    const muscleGroups = result.rows.map(row => row.muscle_group);
    res.json({ muscle_groups: muscleGroups });
  } catch (error) {
    console.error('Get muscle groups error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 