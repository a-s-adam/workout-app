const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const db = require('../config/database');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all workouts for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    let query = `
      SELECT w.*, wp.name as plan_name
      FROM workouts w
      LEFT JOIN workout_plans wp ON w.workout_plan_id = wp.id
      WHERE w.user_id = $1
    `;
    let params = [req.user.id];
    let paramIndex = 1;

    if (status) {
      paramIndex++;
      query += ` AND w.status = $${paramIndex}`;
      params.push(status);
    }

    query += ` ORDER BY w.scheduled_date DESC, w.created_at DESC
               LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);
    res.json({ workouts: result.rows });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get workout by ID with logs
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get workout
    const workoutResult = await db.query(
      `SELECT w.*, wp.name as plan_name
       FROM workouts w
       LEFT JOIN workout_plans wp ON w.workout_plan_id = wp.id
       WHERE w.id = $1 AND w.user_id = $2`,
      [id, req.user.id]
    );

    if (workoutResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Get workout logs
    const logsResult = await db.query(
      `SELECT wl.*, e.name as exercise_name, e.description, e.category, e.muscle_group
       FROM workout_logs wl
       JOIN exercises e ON wl.exercise_id = e.id
       WHERE wl.workout_id = $1
       ORDER BY wl.created_at`,
      [id]
    );

    const workout = workoutResult.rows[0];
    workout.logs = logsResult.rows;

    res.json({ workout });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new workout
router.post('/', validate(schemas.workout), async (req, res) => {
  try {
    const { workout_plan_id, name, scheduled_date, notes } = req.body;

    // Verify workout plan belongs to user if provided
    if (workout_plan_id) {
      const planResult = await db.query(
        'SELECT id FROM workout_plans WHERE id = $1 AND user_id = $2',
        [workout_plan_id, req.user.id]
      );

      if (planResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid workout plan' });
      }
    }

    const result = await db.query(
      `INSERT INTO workouts (user_id, workout_plan_id, name, scheduled_date, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, workout_plan_id, name, scheduled_date, notes]
    );

    res.status(201).json({
      message: 'Workout created successfully',
      workout: result.rows[0]
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update workout
router.put('/:id', validate(schemas.updateWorkout), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, scheduled_date, status, notes } = req.body;

    const result = await db.query(
      `UPDATE workouts 
       SET name = COALESCE($1, name),
           scheduled_date = COALESCE($2, scheduled_date),
           status = COALESCE($3, status),
           notes = COALESCE($4, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [name, scheduled_date, status, notes, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json({
      message: 'Workout updated successfully',
      workout: result.rows[0]
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete workout
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add workout log entry
router.post('/:id/logs', validate(schemas.workoutLog), async (req, res) => {
  try {
    const { id } = req.params;
    const { exercise_id, sets, reps, weight, rest_time, notes } = req.body;

    // Verify workout belongs to user
    const workoutResult = await db.query(
      'SELECT id FROM workouts WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (workoutResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const result = await db.query(
      `INSERT INTO workout_logs (workout_id, exercise_id, sets, reps, weight, rest_time, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, exercise_id, sets, reps, weight, rest_time, notes]
    );

    res.status(201).json({
      message: 'Workout log added successfully',
      log: result.rows[0]
    });
  } catch (error) {
    console.error('Add workout log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get workout progress report
router.get('/reports/progress', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Get completed workouts in the last N days
    const workoutsResult = await db.query(
      `SELECT w.id, w.name, w.completed_date, w.notes,
              COUNT(wl.id) as total_exercises,
              SUM(wl.sets * wl.reps) as total_volume
       FROM workouts w
       LEFT JOIN workout_logs wl ON w.id = wl.workout_id
       WHERE w.user_id = $1 
         AND w.status = 'completed'
         AND w.completed_date >= $2
       GROUP BY w.id, w.name, w.completed_date, w.notes
       ORDER BY w.completed_date DESC`,
      [req.user.id, daysAgo]
    );

    // Get exercise progress (weight progression)
    const progressResult = await db.query(
      `SELECT e.name as exercise_name,
              MAX(wl.weight) as max_weight,
              AVG(wl.weight) as avg_weight,
              COUNT(DISTINCT w.id) as workout_count
       FROM workout_logs wl
       JOIN workouts w ON wl.workout_id = w.id
       JOIN exercises e ON wl.exercise_id = e.id
       WHERE w.user_id = $1 
         AND w.status = 'completed'
         AND w.completed_date >= $2
         AND wl.weight IS NOT NULL
       GROUP BY e.id, e.name
       ORDER BY max_weight DESC`,
      [req.user.id, daysAgo]
    );

    res.json({
      period_days: parseInt(days),
      completed_workouts: workoutsResult.rows,
      exercise_progress: progressResult.rows
    });
  } catch (error) {
    console.error('Get progress report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 