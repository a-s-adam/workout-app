import React, { useState, useEffect } from 'react';
import { exercisesAPI } from '../services/api';
import { Search, Filter, Dumbbell, Target } from 'lucide-react';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const [exercisesRes, categoriesRes, muscleGroupsRes] = await Promise.all([
          exercisesAPI.getAll(),
          exercisesAPI.getCategories(),
          exercisesAPI.getMuscleGroups()
        ]);

        setExercises(exercisesRes.exercises || []);
        setCategories(categoriesRes.categories || []);
        setMuscleGroups(muscleGroupsRes.muscle_groups || []);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    const matchesMuscleGroup = !selectedMuscleGroup || exercise.muscle_group === selectedMuscleGroup;
    
    return matchesSearch && matchesCategory && matchesMuscleGroup;
  });

  const getCategoryColor = (category) => {
    const colors = {
      cardio: 'bg-red-100 text-red-800',
      strength: 'bg-blue-100 text-blue-800',
      flexibility: 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getMuscleGroupColor = (muscleGroup) => {
    const colors = {
      chest: 'bg-pink-100 text-pink-800',
      back: 'bg-indigo-100 text-indigo-800',
      legs: 'bg-purple-100 text-purple-800',
      shoulders: 'bg-yellow-100 text-yellow-800',
      arms: 'bg-orange-100 text-orange-800',
      core: 'bg-teal-100 text-teal-800',
      full_body: 'bg-gray-100 text-gray-800',
    };
    return colors[muscleGroup] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Exercises</h1>
        <p className="mt-2 text-gray-600">
          Browse and discover exercises for your workout routines
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Exercises
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="search"
                className="input pl-10"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Muscle Group Filter */}
          <div>
            <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-2">
              Muscle Group
            </label>
            <select
              id="muscleGroup"
              className="input"
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map((muscleGroup) => (
                <option key={muscleGroup} value={muscleGroup}>
                  {muscleGroup.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </p>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {exercise.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {exercise.description}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Dumbbell className="w-6 h-6 text-primary-600" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`badge ${getCategoryColor(exercise.category)}`}>
                {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
              </span>
              {exercise.muscle_group && (
                <span className={`badge ${getMuscleGroupColor(exercise.muscle_group)}`}>
                  {exercise.muscle_group.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default Exercises; 