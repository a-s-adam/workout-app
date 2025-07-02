import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workoutsAPI, workoutLogsAPI } from '../services/api';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Play, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Circle,
  Plus,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState({});

  useEffect(() => {
    fetchWorkout();
    fetchWorkoutLogs();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      const response = await workoutsAPI.getById(id);
      setWorkout(response.workout);
    } catch (error) {
      console.error('Error fetching workout:', error);
      toast.error('Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutLogs = async () => {
    try {
      const response = await workoutLogsAPI.getByWorkoutId(id);
      const logsMap = {};
      response.workout_logs?.forEach(log => {
        logsMap[log.exercise_id] = log;
      });
      setWorkoutLogs(logsMap);
    } catch (error) {
      console.error('Error fetching workout logs:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await workoutsAPI.delete(id);
      toast.success('Workout deleted successfully');
      navigate('/workouts');
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    }
  };

  const startWorkout = () => {
    navigate(`/workout/${workout.plan_id}`);
  };

  const updateLog = (exerciseId, field, value) => {
    setWorkoutLogs(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      }
    }));
  };

  const saveLogs = async () => {
    setSaving(true);
    try {
      const logsToSave = Object.values(workoutLogs).filter(log => 
        log.sets && log.reps && log.weight !== undefined
      );

      for (const log of logsToSave) {
        if (log.id) {
          await workoutLogsAPI.update(log.id, log);
        } else {
          await workoutLogsAPI.create({
            ...log,
            workout_id: parseInt(id),
          });
        }
      }

      toast.success('Workout progress saved!');
      setEditing(false);
      fetchWorkoutLogs(); // Refresh logs
    } catch (error) {
      console.error('Error saving workout logs:', error);
      toast.error('Failed to save workout progress');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (exerciseId) => {
    const log = workoutLogs[exerciseId];
    if (log && log.completed) {
      return <CheckCircle className="w-5 h-5 text-success-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Workout Not Found</h2>
          <p className="text-gray-600 mb-4">The workout you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="btn-primary"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/workouts')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{workout.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(workout.created_at).toLocaleDateString()}</span>
                </div>
                {workout.scheduled_date && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{new Date(workout.scheduled_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={startWorkout}
              className="btn-primary flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </button>
            <button
              onClick={() => setEditing(!editing)}
              className="btn-secondary flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Workout Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Exercises */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="card-title">Exercises</h3>
                {editing && (
                  <button
                    onClick={saveLogs}
                    disabled={saving}
                    className="btn-primary flex items-center"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Progress
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {workout.exercises && workout.exercises.length > 0 ? (
                workout.exercises.map((exercise, index) => {
                  const log = workoutLogs[exercise.exercise_id] || {};
                  return (
                    <div key={exercise.exercise_id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {getStatusIcon(exercise.exercise_id)}
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">
                              {index + 1}. {exercise.exercise_name}
                            </h4>
                            <p className="text-sm text-gray-600">{exercise.category}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sets
                          </label>
                          {editing ? (
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={log.sets || exercise.sets || ''}
                              onChange={(e) => updateLog(exercise.exercise_id, 'sets', parseInt(e.target.value) || 0)}
                              className="input"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {log.sets || exercise.sets || 0}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reps
                          </label>
                          {editing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={log.reps || exercise.reps || ''}
                              onChange={(e) => updateLog(exercise.exercise_id, 'reps', parseInt(e.target.value) || 0)}
                              className="input"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {log.reps || exercise.reps || 0}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weight (lbs)
                          </label>
                          {editing ? (
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={log.weight || exercise.weight || ''}
                              onChange={(e) => updateLog(exercise.exercise_id, 'weight', parseFloat(e.target.value) || 0)}
                              className="input"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {log.weight || exercise.weight || 0}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rest (sec)
                          </label>
                          <div className="text-sm text-gray-900">
                            {exercise.rest_time || 60}
                          </div>
                        </div>
                      </div>

                      {editing && (
                        <div className="mt-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={log.completed || false}
                              onChange={(e) => updateLog(exercise.exercise_id, 'completed', e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Mark as completed</span>
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No exercises found for this workout</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Workout Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Workout Info</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      workout.status === 'completed' 
                        ? 'bg-success-100 text-success-800'
                        : workout.status === 'in_progress'
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workout.status?.replace('_', ' ') || 'not started'}
                    </span>
                  </div>
                </div>

                {workout.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-sm text-gray-900">{workout.notes}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan</label>
                  <p className="mt-1 text-sm text-gray-900">{workout.plan_name}</p>
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Progress Summary</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Exercises</span>
                  <span className="text-sm font-medium text-gray-900">
                    {workout.exercises?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Object.values(workoutLogs).filter(log => log.completed).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {workout.exercises?.length 
                      ? Math.round((Object.values(workoutLogs).filter(log => log.completed).length / workout.exercises.length) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail; 