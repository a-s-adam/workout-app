import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { workoutPlansAPI, workoutsAPI } from '../services/api';
import { Play, Calendar, Clock, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateWorkout = () => {
  const navigate = useNavigate();
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const watchPlanId = watch('plan_id');

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  useEffect(() => {
    if (watchPlanId) {
      const plan = workoutPlans.find(p => p.id === parseInt(watchPlanId));
      setSelectedPlan(plan || null);
    } else {
      setSelectedPlan(null);
    }
  }, [watchPlanId, workoutPlans]);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await workoutPlansAPI.getAll();
      setWorkoutPlans(response.workout_plans || []);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      toast.error('Failed to load workout plans');
    } finally {
      setPlansLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedPlan) {
      toast.error('Please select a workout plan');
      return;
    }

    setLoading(true);
    try {
      const workoutData = {
        plan_id: selectedPlan.id,
        name: data.name || selectedPlan.name,
        notes: data.notes,
        scheduled_date: data.scheduled_date,
      };

      await workoutsAPI.create(workoutData);
      toast.success('Workout created successfully!');
      navigate('/workouts');
    } catch (error) {
      console.error('Error creating workout:', error);
      toast.error('Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = () => {
    if (!selectedPlan) {
      toast.error('Please select a workout plan first');
      return;
    }
    navigate(`/workout/${selectedPlan.id}`);
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/workouts')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Workout</h1>
            <p className="mt-2 text-gray-600">
              Start a new workout session from your plans
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Workout Plan Selection */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Select Workout Plan</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="plan_id" className="block text-sm font-medium text-gray-700">
                    Workout Plan *
                  </label>
                  <select
                    id="plan_id"
                    className="input mt-1"
                    {...register('plan_id', { required: 'Please select a workout plan' })}
                  >
                    <option value="">Choose a workout plan</option>
                    {workoutPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  {errors.plan_id && (
                    <p className="mt-1 text-sm text-danger-600">{errors.plan_id.message}</p>
                  )}
                </div>

                {workoutPlans.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No workout plans available</p>
                    <button
                      type="button"
                      onClick={() => navigate('/workout-plans/create')}
                      className="btn-primary"
                    >
                      Create Your First Plan
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Workout Details */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Workout Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input mt-1"
                    placeholder="Leave empty to use plan name"
                    {...register('name')}
                  />
                </div>

                <div>
                  <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700">
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduled_date"
                    className="input mt-1"
                    {...register('scheduled_date')}
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="input mt-1"
                    placeholder="Any notes for this workout session..."
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/workouts')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedPlan}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Create Workout
              </button>
            </div>
          </form>
        </div>

        {/* Plan Preview */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="card-header">
              <h3 className="card-title">Plan Preview</h3>
            </div>
            <div className="space-y-4">
              {selectedPlan ? (
                <>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedPlan.name}</h4>
                    {selectedPlan.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedPlan.description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{selectedPlan.exercises?.length || 0} exercises</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Created {new Date(selectedPlan.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {selectedPlan.exercises && selectedPlan.exercises.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h5>
                      <div className="space-y-2">
                        {selectedPlan.exercises.slice(0, 5).map((exercise, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {index + 1}. {exercise.exercise_name || 'Exercise'}
                          </div>
                        ))}
                        {selectedPlan.exercises.length > 5 && (
                          <div className="text-sm text-gray-500">
                            +{selectedPlan.exercises.length - 5} more exercises
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={startWorkout}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout Now
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Select a workout plan to see details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkout; 