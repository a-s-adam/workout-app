import React, { useState, useEffect } from 'react';
import { workoutsAPI } from '../services/api';
import { TrendingUp, Calendar, Target, Activity, BarChart3 } from 'lucide-react';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchProgressData();
  }, [timeRange]);

  const fetchProgressData = async () => {
    try {
      const response = await workoutsAPI.getProgress(timeRange);
      setProgressData(response);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Progress & Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track your fitness journey and see your improvements over time
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="card mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Time Period</h3>
          <div className="flex space-x-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  timeRange === days
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Workouts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {progressData?.completed_workouts?.length || 0}
              </p>
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
              <p className="text-sm font-medium text-gray-500">Total Volume</p>
              <p className="text-2xl font-semibold text-gray-900">
                {progressData?.completed_workouts?.reduce((sum, w) => sum + (w.total_volume || 0), 0) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-warning-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Exercises Tracked</p>
              <p className="text-2xl font-semibold text-gray-900">
                {progressData?.exercise_progress?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Workouts/Week</p>
              <p className="text-2xl font-semibold text-gray-900">
                {timeRange > 0 ? Math.round((progressData?.completed_workouts?.length || 0) / (timeRange / 7) * 10) / 10 : 0}
              </p>
            </div>
          </div>
        </div>
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
            {progressData?.completed_workouts?.length > 0 ? (
              progressData.completed_workouts.slice(0, 5).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{workout.name}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(workout.completed_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {workout.total_exercises || 0} exercises
                    </p>
                    <p className="text-xs text-gray-500">
                      {workout.total_volume || 0} total volume
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No completed workouts in this period</p>
              </div>
            )}
          </div>
        </div>

        {/* Exercise Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Exercise Progress
            </h3>
          </div>
          <div className="space-y-4">
            {progressData?.exercise_progress?.length > 0 ? (
              progressData.exercise_progress.slice(0, 5).map((exercise) => (
                <div
                  key={exercise.exercise_name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{exercise.exercise_name}</h4>
                    <p className="text-xs text-gray-500">
                      {exercise.workout_count} workouts
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Max: {exercise.max_weight || 'N/A'} lbs
                    </p>
                    <p className="text-xs text-gray-500">
                      Avg: {exercise.avg_weight ? Math.round(exercise.avg_weight) : 'N/A'} lbs
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No exercise progress data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Insights */}
      {progressData?.completed_workouts?.length > 0 && (
        <div className="card mt-8">
          <div className="card-header">
            <h3 className="card-title">Progress Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Most Active Day</p>
              <p className="text-lg font-semibold text-gray-900">
                {(() => {
                  const dayCounts = {};
                  progressData.completed_workouts.forEach(workout => {
                    const day = new Date(workout.completed_date).toLocaleDateString('en-US', { weekday: 'long' });
                    dayCounts[day] = (dayCounts[day] || 0) + 1;
                  });
                  const mostActiveDay = Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0];
                  return mostActiveDay ? mostActiveDay[0] : 'N/A';
                })()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Average Workout Duration</p>
              <p className="text-lg font-semibold text-gray-900">
                {progressData.completed_workouts.length > 0 
                  ? Math.round(progressData.completed_workouts.reduce((sum, w) => sum + (w.total_exercises || 0), 0) / progressData.completed_workouts.length)
                  : 0} exercises
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Consistency Score</p>
              <p className="text-lg font-semibold text-gray-900">
                {timeRange > 0 
                  ? Math.round((progressData.completed_workouts.length / (timeRange / 7)) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress; 