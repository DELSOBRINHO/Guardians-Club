import React, { useState } from 'react';
import { Puzzle, Award, Clock, Filter } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'craft' | 'game' | 'lesson' | 'outdoor';
  image: string;
}

export function Activities() {
  const [filter, setFilter] = useState({
    ageRange: 'all',
    difficulty: 'all',
    category: 'all',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sample activities data
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Noah\'s Ark Animal Craft',
      description: 'Create paper animals to fill your own miniature ark while learning about Noah\'s story.',
      ageRange: '3-6',
      duration: '30 min',
      difficulty: 'easy',
      category: 'craft',
      image: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: '2',
      title: 'Bible Verse Memory Game',
      description: 'A fun matching game to help children memorize important Bible verses.',
      ageRange: '7-12',
      duration: '20 min',
      difficulty: 'medium',
      category: 'game',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: '3',
      title: 'Parable of the Sower',
      description: 'Interactive lesson about the Parable of the Sower with real planting activity.',
      ageRange: '5-10',
      duration: '45 min',
      difficulty: 'medium',
      category: 'lesson',
      image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: '4',
      title: 'David and Goliath Outdoor Game',
      description: 'Recreate the famous biblical battle with safe, soft "stones" and targets.',
      ageRange: '7-12',
      duration: '40 min',
      difficulty: 'easy',
      category: 'outdoor',
      image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
    {
      id: '5',
      title: 'Creation Week Diorama',
      description: 'Create a 7-part diorama showing each day of creation as described in Genesis.',
      ageRange: '8-12',
      duration: '60 min',
      difficulty: 'hard',
      category: 'craft',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1741&q=80',
    },
    {
      id: '6',
      title: 'Good Samaritan Role Play',
      description: 'Learn about helping others through interactive role play scenarios.',
      ageRange: '5-10',
      duration: '30 min',
      difficulty: 'medium',
      category: 'lesson',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'craft':
        return <Puzzle className="h-5 w-5" />;
      case 'game':
        return <Award className="h-5 w-5" />;
      case 'lesson':
        return <BookOpen className="h-5 w-5" />;
      case 'outdoor':
        return <Sun className="h-5 w-5" />;
      default:
        return <Puzzle className="h-5 w-5" />;
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAge = filter.ageRange === 'all' || activity.ageRange === filter.ageRange;
    const matchesDifficulty = filter.difficulty === 'all' || activity.difficulty === filter.difficulty;
    const matchesCategory = filter.category === 'all' || activity.category === filter.category;
    
    return matchesSearch && matchesAge && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Activities</h1>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                <select
                  value={filter.ageRange}
                  onChange={(e) => setFilter({...filter, ageRange: e.target.value})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Ages</option>
                  <option value="3-6">3-6 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="7-12">7-12 years</option>
                  <option value="8-12">8-12 years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={filter.difficulty}
                  onChange={(e) => setFilter({...filter, difficulty: e.target.value as any})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filter.category}
                  onChange={(e) => setFilter({...filter, category: e.target.value as any})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="craft">Crafts</option>
                  <option value="game">Games</option>
                  <option value="lesson">Lessons</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Puzzle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No activities found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters to find activities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-gray-600">{activity.description}</p>
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <div className="flex items-center mr-4">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.duration}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Ages {activity.ageRange}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-indigo-600">
                      {getCategoryIcon(activity.category)}
                      <span className="ml-1 text-sm capitalize">{activity.category}</span>
                    </div>
                    
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
                      View Activity
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// These components are used in the Activities page
function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}