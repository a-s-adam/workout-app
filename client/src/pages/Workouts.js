import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutsAPI } from '../services/api';
import { Plus, Calendar, Clock, Target, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, [statusFilter]);

  const fetchWorkouts = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await workoutsAPI.getAll(params);
      setWorkouts(response.workouts || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await workoutsAPI.delete(id);
        toast.success('Workout deleted successfully');
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
        toast.error('Failed to delete workout');
      }
    }
  };

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

  const getStatusIcon = (status) => {
    const icons = {
      scheduled: Clock,
      in_progress: Target,
      completed: Calendar,
      cancelled: Trash2,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
          <p className="mt-2 text-gray-600">
            Track and manage your workout sessions
          </p>
        </div>
        <Link
          to="/workouts/create"
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Start Workout
        </Link>
      </div>

      {/* Status Filter */}
      <div className="card mb-8">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              statusFilter === '' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Workouts
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              statusFilter === 'scheduled' 
                ? 'bg-warning-100 text-warning-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              statusFilter === 'in_progress' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              statusFilter === 'completed' 
                ? 'bg-success-100 text-success-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Workouts List */}
      {workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(workout.status)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {workout.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      {workout.plan_name && (
                        <span>Plan: {workout.plan_name}</span>
                      )}
                      {workout.scheduled_date && (
                        <span>
                          {new Date(workout.scheduled_date).toLocaleDateString()}
                        </span>
                      )}
                      {workout.completed_date && (
                        <span>
                          Completed: {new Date(workout.completed_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {workout.notes && (
                      <p className="text-sm text-gray-600 mt-2">{workout.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusBadge(workout.status)}
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/workouts/${workout.id}`}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                      title="View Workout"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/workouts/${workout.id}/edit`}
                      className="p-2 text-gray-400 hover:text-warning-600 transition-colors duration-200"
                      title="Edit Workout"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(workout.id, workout.name)}
                      className="p-2 text-gray-400 hover:text-danger-600 transition-colors duration-200"
                      title="Delete Workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
          <p className="text-gray-500 mb-6">
            {statusFilter 
              ? `No ${statusFilter} workouts found.` 
              : 'Start your fitness journey by creating your first workout.'
            }
          </p>
          <Link
            to="/workouts/create"
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start Your First Workout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Workouts; 