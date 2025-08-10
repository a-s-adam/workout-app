# Workout Tracker App

A full-stack workout tracking application built with React frontend and Node.js backend, featuring JWT authentication, workout plan management, and progress tracking.

## Features

### User Management
- User registration and login with JWT authentication
- Secure password handling with bcrypt
- Protected routes for authenticated users

### Exercise Management
- Pre-populated database with 50+ exercises
- Categorized by muscle groups and exercise types
- Search and filter functionality

### Workout Planning
- Create custom workout plans with multiple exercises
- Set reps, sets, and weight targets
- Edit and delete workout plans
- Personal workout plan library

### Workout Tracking
- Log workout sessions from existing plans
- Track actual performance (reps, sets, weight)
- Add notes and comments to workouts
- View workout history

### Progress Analytics
- Visual progress charts and reports
- Performance tracking over time
- Workout frequency analysis
- Strength progression monitoring

## Tech Stack

### Frontend
- **React 18** with React Router for navigation
- **Tailwind CSS** for modern, responsive UI
- **React Hook Form** for form management
- **Axios** for API communication
- **Recharts** for data visualization
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with connection pooling
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **Joi** for request validation
- **Swagger/OpenAPI** documentation

### Development Tools
- **Jest** and **Supertest** for testing
- **Nodemon** for development server
- **Concurrently** for running frontend/backend
- **GitHub Pages** deployment ready

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 3. Database Setup
```bash
# Start PostgreSQL service
brew services start postgresql@14

# Create database and user (if not exists)
psql postgres
CREATE DATABASE workoutdb;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE workoutdb TO postgres;
\q

# Setup database schema and seed data
cd server
npm run db:setup
npm run db:seed
```

### 4. Environment Configuration
Create a `.env` file in the `server/` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=workoutdb
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 5. Start Development Servers
```bash
# From root directory
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

## Usage

### Getting Started
1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Explore Exercises**: Browse the exercise library by category or muscle group
4. **Create Workout Plan**: Design your first workout plan with exercises, sets, and reps
5. **Start Working Out**: Begin a workout session from your plan
6. **Track Progress**: Log your performance and view progress over time

### Key Workflows

#### Creating a Workout Plan
1. Navigate to "Workout Plans" → "Create New Plan"
2. Enter plan name and description
3. Add exercises with target sets, reps, and weight
4. Save your plan

#### Starting a Workout
1. Go to "Workouts" → "Start New Workout"
2. Select a workout plan
3. Log your actual performance for each exercise
4. Add notes and save your workout

#### Viewing Progress
1. Visit the "Progress" page
2. Select time range (week, month, year)
3. Analyze your workout frequency and performance trends

## API Documentation

The API documentation is available at `/api-docs` when the backend server is running.

### Main Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/exercises` - List all exercises
- `POST /api/workout-plans` - Create workout plan
- `POST /api/workouts` - Start workout session
- `POST /api/workouts/:id/logs` - Log workout progress

## Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run server:test

# Run frontend tests only
npm run client:test
```

## Building for Production

```bash
# Build frontend for production
npm run client:build

# Build backend for production
npm run server:build

# Build both
npm run build
```

## Deployment

### Local Demo
The app is designed to work locally for portfolio demonstration purposes. Ensure PostgreSQL is running and the database is properly configured.

### GitHub Pages (Frontend Only)
```bash
cd client
npm run deploy
```

**Note**: GitHub Pages only hosts static frontend files. For a full demo, you'll need to:
1. Deploy the backend to a hosting service (Heroku, Railway, etc.)
2. Update the frontend API base URL to point to your deployed backend
3. Deploy the updated frontend to GitHub Pages

## Privacy & Security

- All user data is stored locally in PostgreSQL
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- No data is shared with third parties
- Users can only access their own workout data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

---

**Built with passion for fitness enthusiasts and developers**
