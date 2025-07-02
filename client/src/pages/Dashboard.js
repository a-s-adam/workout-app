import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { workoutsAPI, workoutPlansAPI } from '../services/api';
import { 
  Calendar, 
  Dumbbell, 
  TrendingUp, 
  Plus, 
  Clock, 
  Target,
  Activity,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedThisWeek: 0,
    totalPlans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [workoutsRes, plansRes] = await Promise.all([
          workoutsAPI.getAll({ limit: 5 }),
          workoutPlansAPI.getAll()
        ]);

        setRecentWorkouts(workoutsRes.workouts || []);
        setWorkoutPlans(plansRes.workout_plans || []);

        // Calculate stats
        const completedThisWeek = workoutsRes.workouts?.filter(
          w => w.status === 'completed' && 
          new Date(w.completed_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0;

        setStats({
          totalWorkouts: workoutsRes.workouts?.length || 0,
          completedThisWeek,
          totalPlans: plansRes.workout_plans?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'badge-warning', text: 'Scheduled' },
      in_progress: { color: 'badge-primary', text: 'In Progress' },
      completed: { color: 'badge-success', text: 'Completed' },
      cancelled: { color: 'badge-danger', text: 'Cancelled' },
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
    return <span className={config.color}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Ready to crush your fitness goals today?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Workouts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-success-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Week</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedThisWeek}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-warning-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Workout Plans</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPlans}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/workouts/create"
          className="card hover:shadow-md transition-shadow duration-200 cursor-pointer group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                <Plus className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Start Workout</p>
              <p className="text-xs text-gray-500">Begin a new session</p>
            </div>
          </div>
        </Link>

        <Link
          to="/workout-plans/create"
          className="card hover:shadow-md transition-shadow duration-200 cursor-pointer group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center group-hover:bg-success-200 transition-colors duration-200">
                <Dumbbell className="w-5 h-5 text-success-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Create Plan</p>
              <p className="text-xs text-gray-500">Design a new routine</p>
            </div>
          </div>
        </Link>

        <Link
          to="/exercises"
          className="card hover:shadow-md transition-shadow duration-200 cursor-pointer group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center group-hover:bg-warning-200 transition-colors duration-200">
                <Activity className="w-5 h-5 text-warning-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Browse Exercises</p>
              <p className="text-xs text-gray-500">Explore movements</p>
            </div>
          </div>
        </Link>

        <Link
          to="/progress"
          className="card hover:shadow-md transition-shadow duration-200 cursor-pointer group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">View Progress</p>
              <p className="text-xs text-gray-500">Track your gains</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Workouts */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Workouts
            </h3>
          </div>
          <div className="space-y-4">
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{workout.name}</h4>
                    <p className="text-xs text-gray-500">
                      {workout.scheduled_date ? 
                        new Date(workout.scheduled_date).toLocaleDateString() : 
                        'No date set'
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(workout.status)}
                    <Link
                      to={`/workouts/${workout.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No workouts yet</p>
                <Link
                  to="/workouts/create"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Start your first workout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Workout Plans */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Dumbbell className="w-5 h-5 mr-2" />
              Your Workout Plans
            </h3>
          </div>
          <div className="space-y-4">
            {workoutPlans.length > 0 ? (
              workoutPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{plan.name}</h4>
                    <p className="text-xs text-gray-500">
                      {plan.exercise_count || 0} exercises
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/workout-plans/${plan.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No workout plans yet</p>
                <Link
                  to="/workout-plans/create"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Create your first plan
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 