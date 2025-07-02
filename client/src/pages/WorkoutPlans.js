import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutPlansAPI } from '../services/api';
import { Plus, Dumbbell, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkoutPlans = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await workoutPlansAPI.getAll();
      setWorkoutPlans(response.workout_plans || []);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      toast.error('Failed to load workout plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await workoutPlansAPI.delete(id);
        toast.success('Workout plan deleted successfully');
        fetchWorkoutPlans();
      } catch (error) {
        console.error('Error deleting workout plan:', error);
        toast.error('Failed to delete workout plan');
      }
    }
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workout Plans</h1>
          <p className="mt-2 text-gray-600">
            Create and manage your workout routines
          </p>
        </div>
        <Link
          to="/workout-plans/create"
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Link>
      </div>

      {/* Workout Plans Grid */}
      {workoutPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map((plan) => (
            <div key={plan.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {plan.description}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Dumbbell className="w-4 h-4 mr-1" />
                    {plan.exercise_count || 0} exercises
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Created {new Date(plan.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/workout-plans/${plan.id}`}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    title="View Plan"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/workout-plans/${plan.id}/edit`}
                    className="p-2 text-gray-400 hover:text-warning-600 transition-colors duration-200"
                    title="Edit Plan"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(plan.id, plan.name)}
                    className="p-2 text-gray-400 hover:text-danger-600 transition-colors duration-200"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workout plans yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first workout plan to get started with your fitness journey.
          </p>
          <Link
            to="/workout-plans/create"
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Plan
          </Link>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlans; 