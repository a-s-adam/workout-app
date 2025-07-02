const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  userRegistration: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  workoutPlan: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().optional(),
    exercises: Joi.array().items(
      Joi.object({
        exercise_id: Joi.number().integer().positive().required(),
        sets: Joi.number().integer().min(1).max(20).default(3),
        reps: Joi.number().integer().min(1).max(100).default(10),
        weight: Joi.number().positive().optional(),
        rest_time: Joi.number().integer().min(0).max(600).default(60),
        order_index: Joi.number().integer().min(0).required()
      })
    ).min(1).required()
  }),

  workout: Joi.object({
    workout_plan_id: Joi.number().integer().positive().optional(),
    name: Joi.string().min(1).max(100).required(),
    scheduled_date: Joi.date().iso().optional(),
    notes: Joi.string().optional()
  }),

  workoutLog: Joi.object({
    exercise_id: Joi.number().integer().positive().required(),
    sets: Joi.number().integer().min(1).max(20).required(),
    reps: Joi.number().integer().min(1).max(100).required(),
    weight: Joi.number().positive().optional(),
    rest_time: Joi.number().integer().min(0).max(600).optional(),
    notes: Joi.string().optional()
  }),

  updateWorkout: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    scheduled_date: Joi.date().iso().optional(),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled').optional(),
    notes: Joi.string().optional()
  })
};

module.exports = {
  validate,
  schemas
}; 