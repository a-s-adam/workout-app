import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { workoutPlansAPI, exercisesAPI } from '../services/api';
import { Plus, X, Dumbbell, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateWorkoutPlan = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exercisesLoading, setExercisesLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await exercisesAPI.getAll();
      setExercises(response.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Failed to load exercises');
    } finally {
      setExercisesLoading(false);
    }
  };

  const addExercise = () => {
    const newExercise = {
      id: Date.now(),
      exercise_id: '',
      sets: 3,
      reps: 10,
      weight: '',
      rest_time: 60,
      order_index: selectedExercises.length,
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const removeExercise = (index) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    // Update order_index for remaining exercises
    const reordered = updated.map((exercise, i) => ({
      ...exercise,
      order_index: i,
    }));
    setSelectedExercises(reordered);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const onSubmit = async (data) => {
    if (selectedExercises.length === 0) {
      toast.error('Please add at least one exercise to your workout plan');
      return;
    }

    const invalidExercises = selectedExercises.filter(ex => !ex.exercise_id);
    if (invalidExercises.length > 0) {
      toast.error('Please select an exercise for all items');
      return;
    }

    setLoading(true);
    try {
      const workoutPlanData = {
        name: data.name,
        description: data.description,
        exercises: selectedExercises,
      };

      await workoutPlansAPI.create(workoutPlanData);
      toast.success('Workout plan created successfully!');
      navigate('/workout-plans');
    } catch (error) {
      console.error('Error creating workout plan:', error);
      toast.error('Failed to create workout plan');
    } finally {
      setLoading(false);
    }
  };

  if (exercisesLoading) {
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
        <h1 className="text-3xl font-bold text-gray-900">Create Workout Plan</h1>
        <p className="mt-2 text-gray-600">
          Design your custom workout routine
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Basic Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Plan Name *
              </label>
              <input
                type="text"
                id="name"
                className="input mt-1"
                placeholder="e.g., Upper Body Strength"
                {...register('name', { required: 'Plan name is required' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="input mt-1"
                placeholder="Describe your workout plan..."
                {...register('description')}
              />
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="card-title">Exercises</h3>
              <button
                type="button"
                onClick={addExercise}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Exercise
              </button>
            </div>
          </div>

          {selectedExercises.length === 0 ? (
            <div className="text-center py-8">
              <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No exercises added yet</p>
              <p className="text-sm text-gray-400">Click "Add Exercise" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedExercises.map((exercise, index) => (
                <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Exercise {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-gray-400 hover:text-danger-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Exercise Selection */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exercise *
                      </label>
                      <select
                        value={exercise.exercise_id}
                        onChange={(e) => updateExercise(index, 'exercise_id', e.target.value)}
                        className="input"
                        required
                      >
                        <option value="">Select an exercise</option>
                        {exercises.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name} ({ex.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sets */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                        className="input"
                      />
                    </div>

                    {/* Reps */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                        className="input"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                        className="input"
                        placeholder="Optional"
                      />
                    </div>

                    {/* Rest Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rest (seconds)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="600"
                        value={exercise.rest_time}
                        onChange={(e) => updateExercise(index, 'rest_time', parseInt(e.target.value))}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/workout-plans')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Create Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkoutPlan; 