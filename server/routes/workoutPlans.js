const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const db = require('../config/database');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all workout plans for the authenticated user
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT wp.*, 
              COUNT(we.id) as exercise_count
       FROM workout_plans wp
       LEFT JOIN workout_exercises we ON wp.id = we.workout_plan_id
       WHERE wp.user_id = $1
       GROUP BY wp.id
       ORDER BY wp.created_at DESC`,
      [req.user.id]
    );

    res.json({ workout_plans: result.rows });
  } catch (error) {
    console.error('Get workout plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get workout plan by ID with exercises
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get workout plan
    const planResult = await db.query(
      'SELECT * FROM workout_plans WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    // Get exercises for this plan
    const exercisesResult = await db.query(
      `SELECT we.*, e.name, e.description, e.category, e.muscle_group
       FROM workout_exercises we
       JOIN exercises e ON we.exercise_id = e.id
       WHERE we.workout_plan_id = $1
       ORDER BY we.order_index`,
      [id]
    );

    const workoutPlan = planResult.rows[0];
    workoutPlan.exercises = exercisesResult.rows;

    res.json({ workout_plan: workoutPlan });
  } catch (error) {
    console.error('Get workout plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new workout plan
router.post('/', validate(schemas.workoutPlan), async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');

    const { name, description, exercises } = req.body;

    // Create workout plan
    const planResult = await client.query(
      'INSERT INTO workout_plans (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, name, description]
    );

    const workoutPlan = planResult.rows[0];

    // Add exercises to the plan
    for (const exercise of exercises) {
      await client.query(
        `INSERT INTO workout_exercises 
         (workout_plan_id, exercise_id, sets, reps, weight, rest_time, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          workoutPlan.id,
          exercise.exercise_id,
          exercise.sets,
          exercise.reps,
          exercise.weight,
          exercise.rest_time,
          exercise.order_index
        ]
      );
    }

    await client.query('COMMIT');

    // Get the complete workout plan with exercises
    const exercisesResult = await db.query(
      `SELECT we.*, e.name, e.description, e.category, e.muscle_group
       FROM workout_exercises we
       JOIN exercises e ON we.exercise_id = e.id
       WHERE we.workout_plan_id = $1
       ORDER BY we.order_index`,
      [workoutPlan.id]
    );

    workoutPlan.exercises = exercisesResult.rows;

    res.status(201).json({
      message: 'Workout plan created successfully',
      workout_plan: workoutPlan
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create workout plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Update workout plan
router.put('/:id', validate(schemas.workoutPlan), async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { name, description, exercises } = req.body;

    // Check if workout plan exists and belongs to user
    const existingPlan = await client.query(
      'SELECT id FROM workout_plans WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existingPlan.rows.length === 0) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    // Update workout plan
    await client.query(
      'UPDATE workout_plans SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [name, description, id]
    );

    // Remove existing exercises
    await client.query('DELETE FROM workout_exercises WHERE workout_plan_id = $1', [id]);

    // Add new exercises
    for (const exercise of exercises) {
      await client.query(
        `INSERT INTO workout_exercises 
         (workout_plan_id, exercise_id, sets, reps, weight, rest_time, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          id,
          exercise.exercise_id,
          exercise.sets,
          exercise.reps,
          exercise.weight,
          exercise.rest_time,
          exercise.order_index
        ]
      );
    }

    await client.query('COMMIT');

    // Get updated workout plan
    const planResult = await db.query(
      'SELECT * FROM workout_plans WHERE id = $1',
      [id]
    );

    const exercisesResult = await db.query(
      `SELECT we.*, e.name, e.description, e.category, e.muscle_group
       FROM workout_exercises we
       JOIN exercises e ON we.exercise_id = e.id
       WHERE we.workout_plan_id = $1
       ORDER BY we.order_index`,
      [id]
    );

    const workoutPlan = planResult.rows[0];
    workoutPlan.exercises = exercisesResult.rows;

    res.json({
      message: 'Workout plan updated successfully',
      workout_plan: workoutPlan
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update workout plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Delete workout plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM workout_plans WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error('Delete workout plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 