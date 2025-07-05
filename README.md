# Workout Tracker

A full-stack workout tracker application to manage workouts, plans, exercises, and progress. Built with Node.js, Express, PostgreSQL, React, and Tailwind CSS.

## Features
- User registration and login with JWT authentication
- Create, read, update, and delete (CRUD) for:
  - Exercises
  - Workout plans
  - Workouts
  - Progress reports
- Track workout logs and progress
- Responsive, modern UI with React and Tailwind CSS
- API documentation with Swagger
- Input validation with Joi
- Unit tests with Jest and Supertest

## Tech Stack
- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React, Tailwind CSS
- **Authentication:** JWT
- **Validation:** Joi
- **Testing:** Jest, Supertest
- **API Docs:** Swagger

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd workout-tracker
   ```
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
3. Copy the example environment file and edit as needed:
   ```bash
   cp env.example .env
   # Edit .env with your DB credentials and JWT secret
   ```
4. Create the PostgreSQL database and tables (see schema or migrations).
5. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   The API will be available at `http://localhost:5000/api`.

### Frontend Setup
1. Open a new terminal and go to the client directory:
   ```bash
   cd client
   npm install
   npm start
   ```
2. The frontend will be available at `http://localhost:3000`.

## Usage
- Register a new account or log in.
- Create exercises, workout plans, and workouts.
- Track your progress and view reports.

## Project Structure
```
workout-tracker/
  client/      # React frontend
  server/      # Express backend
  .env         # Environment variables (not committed)
  .gitignore
  README.md
```

## License
MIT
