import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }).then(res => res.data),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  getProfile: () =>
    api.get('/auth/profile').then(res => res.data),
};

// Exercises API
export const exercisesAPI = {
  getAll: (params = {}) =>
    api.get('/exercises', { params }).then(res => res.data),
  
  getById: (id) =>
    api.get(`/exercises/${id}`).then(res => res.data),
  
  getByCategory: (category) =>
    api.get(`/exercises/category/${category}`).then(res => res.data),
  
  getByMuscleGroup: (muscleGroup) =>
    api.get(`/exercises/muscle-group/${muscleGroup}`).then(res => res.data),
  
  getCategories: () =>
    api.get('/exercises/categories/list').then(res => res.data),
  
  getMuscleGroups: () =>
    api.get('/exercises/muscle-groups/list').then(res => res.data),
};

// Workout Plans API
export const workoutPlansAPI = {
  getAll: () =>
    api.get('/workout-plans').then(res => res.data),
  
  getById: (id) =>
    api.get(`/workout-plans/${id}`).then(res => res.data),
  
  create: (data) =>
    api.post('/workout-plans', data).then(res => res.data),
  
  update: (id, data) =>
    api.put(`/workout-plans/${id}`, data).then(res => res.data),
  
  delete: (id) =>
    api.delete(`/workout-plans/${id}`).then(res => res.data),
};

// Workouts API
export const workoutsAPI = {
  getAll: (params = {}) =>
    api.get('/workouts', { params }).then(res => res.data),
  
  getById: (id) =>
    api.get(`/workouts/${id}`).then(res => res.data),
  
  create: (data) =>
    api.post('/workouts', data).then(res => res.data),
  
  update: (id, data) =>
    api.put(`/workouts/${id}`, data).then(res => res.data),
  
  delete: (id) =>
    api.delete(`/workouts/${id}`).then(res => res.data),
  
  addLog: (workoutId, data) =>
    api.post(`/workouts/${workoutId}/logs`, data).then(res => res.data),
  
  getProgress: (days = 30) =>
    api.get('/workouts/reports/progress', { params: { days } }).then(res => res.data),
};

// Workout Logs API
export const workoutLogsAPI = {
  getByWorkoutId: (workoutId) =>
    api.get(`/workout-logs?workout_id=${workoutId}`).then(res => res.data),
  create: (data) =>
    api.post('/workout-logs', data).then(res => res.data),
  update: (id, data) =>
    api.put(`/workout-logs/${id}`, data).then(res => res.data),
  delete: (id) =>
    api.delete(`/workout-logs/${id}`).then(res => res.data),
};

export default api; 