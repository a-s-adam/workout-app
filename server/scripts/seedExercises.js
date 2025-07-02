const { Pool } = require('pg');
require('dotenv').config();

const exercises = [
  // Cardio exercises
  {
    name: 'Running',
    description: 'Cardiovascular exercise that improves endurance and burns calories',
    category: 'cardio',
    muscle_group: 'legs'
  },
  {
    name: 'Cycling',
    description: 'Low-impact cardio exercise that strengthens legs and improves cardiovascular health',
    category: 'cardio',
    muscle_group: 'legs'
  },
  {
    name: 'Swimming',
    description: 'Full-body cardio workout that is easy on the joints',
    category: 'cardio',
    muscle_group: 'full_body'
  },
  {
    name: 'Jump Rope',
    description: 'High-intensity cardio exercise that improves coordination and endurance',
    category: 'cardio',
    muscle_group: 'legs'
  },

  // Strength exercises - Chest
  {
    name: 'Push-ups',
    description: 'Bodyweight exercise that targets chest, shoulders, and triceps',
    category: 'strength',
    muscle_group: 'chest'
  },
  {
    name: 'Bench Press',
    description: 'Compound exercise that primarily targets the chest muscles',
    category: 'strength',
    muscle_group: 'chest'
  },
  {
    name: 'Dumbbell Flys',
    description: 'Isolation exercise that targets the chest muscles',
    category: 'strength',
    muscle_group: 'chest'
  },
  {
    name: 'Incline Press',
    description: 'Upper chest focused pressing movement',
    category: 'strength',
    muscle_group: 'chest'
  },

  // Strength exercises - Back
  {
    name: 'Pull-ups',
    description: 'Bodyweight exercise that targets back and biceps',
    category: 'strength',
    muscle_group: 'back'
  },
  {
    name: 'Deadlift',
    description: 'Compound exercise that targets the entire posterior chain',
    category: 'strength',
    muscle_group: 'back'
  },
  {
    name: 'Bent-over Rows',
    description: 'Compound exercise that targets the middle back',
    category: 'strength',
    muscle_group: 'back'
  },
  {
    name: 'Lat Pulldowns',
    description: 'Machine exercise that targets the latissimus dorsi',
    category: 'strength',
    muscle_group: 'back'
  },

  // Strength exercises - Legs
  {
    name: 'Squats',
    description: 'Compound exercise that targets the entire lower body',
    category: 'strength',
    muscle_group: 'legs'
  },
  {
    name: 'Lunges',
    description: 'Unilateral exercise that targets legs and improves balance',
    category: 'strength',
    muscle_group: 'legs'
  },
  {
    name: 'Leg Press',
    description: 'Machine exercise that targets the quadriceps',
    category: 'strength',
    muscle_group: 'legs'
  },
  {
    name: 'Romanian Deadlift',
    description: 'Hip hinge exercise that targets hamstrings and glutes',
    category: 'strength',
    muscle_group: 'legs'
  },

  // Strength exercises - Shoulders
  {
    name: 'Overhead Press',
    description: 'Compound exercise that targets the shoulders',
    category: 'strength',
    muscle_group: 'shoulders'
  },
  {
    name: 'Lateral Raises',
    description: 'Isolation exercise that targets the lateral deltoids',
    category: 'strength',
    muscle_group: 'shoulders'
  },
  {
    name: 'Front Raises',
    description: 'Isolation exercise that targets the anterior deltoids',
    category: 'strength',
    muscle_group: 'shoulders'
  },

  // Strength exercises - Arms
  {
    name: 'Bicep Curls',
    description: 'Isolation exercise that targets the biceps',
    category: 'strength',
    muscle_group: 'arms'
  },
  {
    name: 'Tricep Dips',
    description: 'Bodyweight exercise that targets the triceps',
    category: 'strength',
    muscle_group: 'arms'
  },
  {
    name: 'Hammer Curls',
    description: 'Variation of bicep curls that also targets forearms',
    category: 'strength',
    muscle_group: 'arms'
  },

  // Core exercises
  {
    name: 'Plank',
    description: 'Isometric exercise that targets the core muscles',
    category: 'strength',
    muscle_group: 'core'
  },
  {
    name: 'Crunches',
    description: 'Isolation exercise that targets the abdominal muscles',
    category: 'strength',
    muscle_group: 'core'
  },
  {
    name: 'Russian Twists',
    description: 'Rotational exercise that targets the obliques',
    category: 'strength',
    muscle_group: 'core'
  },
  {
    name: 'Leg Raises',
    description: 'Exercise that targets the lower abdominal muscles',
    category: 'strength',
    muscle_group: 'core'
  },

  // Flexibility exercises
  {
    name: 'Stretching',
    description: 'General stretching to improve flexibility and range of motion',
    category: 'flexibility',
    muscle_group: 'full_body'
  },
  {
    name: 'Yoga',
    description: 'Mind-body practice that improves flexibility, strength, and balance',
    category: 'flexibility',
    muscle_group: 'full_body'
  },
  {
    name: 'Foam Rolling',
    description: 'Self-myofascial release technique to improve muscle recovery',
    category: 'flexibility',
    muscle_group: 'full_body'
  }
];

const seedExercises = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'workoutdb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  try {
    console.log('Seeding exercises...');

    // Clear existing exercises
    await pool.query('DELETE FROM exercises');

    // Insert exercises
    for (const exercise of exercises) {
      await pool.query(
        'INSERT INTO exercises (name, description, category, muscle_group) VALUES ($1, $2, $3, $4)',
        [exercise.name, exercise.description, exercise.category, exercise.muscle_group]
      );
    }

    console.log(`Successfully seeded ${exercises.length} exercises!`);
  } catch (error) {
    console.error('Error seeding exercises:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  seedExercises()
    .then(() => {
      console.log('Exercise seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Exercise seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedExercises; 