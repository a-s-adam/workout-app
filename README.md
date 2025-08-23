---

### **`workout-app`**

```md
# Workout Tracker App

A full‑stack workout tracking application built with a React frontend and Node.js backend, featuring JWT authentication, workout plan management, progress tracking, and data visualization.

## Features

- **User Management**: Register/login with JWT; secure password handling via bcrypt  
- **Exercise Library**: 50+ pre‑populated exercises with search and filters  
- **Workout Planning**: Create/edit/delete custom workout plans with sets, reps, and weights  
- **Workout Tracking**: Log sessions from saved plans, add notes, and view history  
- **Analytics**: Visual charts for progress over time and workout frequency  

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS, Axios, Recharts  
- **Backend**: Node.js, Express, PostgreSQL, JWT, bcryptjs, Joi, Swagger/OpenAPI  
- **Testing**: Jest, Supertest  
- **Utilities**: Nodemon, Concurrently, GitHub Pages for static deployment

## Prerequisites

- Node.js v16+  
- PostgreSQL v12+  
- npm or Yarn package manager

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/a-s-adam/workout-app.git
cd workout-app

# Install root dependencies
npm install

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
Database Setup
Follow the steps in the README of the server/ directory to start PostgreSQL, create a database and user, and seed the data:

bash
Copy
Edit
# Example (adjust credentials as needed)
brew services start postgresql@14
psql postgres
CREATE DATABASE workoutdb;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE workoutdb TO postgres;
\q

cd server
npm run db:setup
npm run db:seed
Environment Configuration
Create a .env file in the server/ directory with your database credentials and JWT settings. See .env.example for guidance.

Running the App
bash
Copy
Edit
# From the project root
npm run dev
This starts both the backend (on port 5000) and the frontend (on port 3000).

Usage
Register a new account.

Login with your credentials.

Browse Exercises by category or muscle group.

Create a workout plan with desired exercises.

Start a workout from your plan and log your actual performance.

View your progress via charts and history.

For API details and additional workflows, see the Swagger documentation available at /api-docs when the backend server is running.
