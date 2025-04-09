import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ContentCard } from '../components/ContentCard';
import { FeedbackForm } from '../components/FeedbackForm';
import { FeedbackList } from '../components/FeedbackList';
import { FavoriteButton } from '../components/FavoriteButton';
import { Filter, Search, XCircle } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'story' | 'video' | 'quiz';
  url: string;
  created_at: string;
}

export function npm() {
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContentData(data || []);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleContentSelect = (item: ContentItem) => {
    setSelectedContent(item);
  };

  const filteredContent = contentData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Educational Content</h1>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            <h3 className="text-lg font-medium mb-3">Filter by Type</h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'story', 'video', 'quiz'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-md ${
                    filterType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading content...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <XCircle className="h-12 w-12 mx-auto mb-4" />
            {error}
            <button
              onClick={loadContent}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            {searchQuery || filterType !== 'all'
              ? 'No content matches your search or filters'
              : 'No content available'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div key={item.id} className="relative">
                <div onClick={() => handleContentSelect(item)} className="cursor-pointer">
                  <ContentCard content={item} />
                </div>
                <div className="absolute top-2 right-2">
                  <FavoriteButton contentId={item.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedContent.title}</h2>
                    <p className="text-gray-500 capitalize">{selectedContent.type}</p>
                  </div>
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✖
                  </button>
                </div>

                <div className="mt-6">
                  {selectedContent.type === 'video' ? (
                    <iframe
                      src={selectedContent.url}
                      allowFullScreen
                      className="w-full h-64 md:h-96 rounded-lg"
                    ></iframe>
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-gray-700">Preview of the {selectedContent.type} content.</p>
                      <a
                        href={selectedContent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                      >
                        View Full {selectedContent.type} →
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeedbackForm contentId={selectedContent.id} />
                  <FeedbackList contentId={selectedContent.id} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
