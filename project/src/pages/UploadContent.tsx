import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, Video, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';

export function UploadContent() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'story' | 'quiz' | 'video'>('story');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect non-teacher/admin users
  React.useEffect(() => {
    if (profile && !['teacher', 'admin'].includes(profile.user_type)) {
      navigate('/');
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('content')
        .insert({
          title: title.trim(),
          type,
          url: url.trim(),
        });
      
      if (error) throw error;
      
      setSuccess(true);
      setTitle('');
      setUrl('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error uploading content:', err);
      setError('Failed to upload content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (profile && !['teacher', 'admin'].includes(profile.user_type))) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Upload className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Upload Content</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Content uploaded successfully!
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter content title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Content Type <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 grid grid-cols-3 gap-3">
                  <div
                    className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                      type === 'story'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setType('story')}
                  >
                    <BookOpen className={`h-6 w-6 ${type === 'story' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="mt-2 text-sm font-medium">Story</span>
                  </div>
                  
                  <div
                    className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                      type === 'video'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setType('video')}
                  >
                    <Video className={`h-6 w-6 ${type === 'video' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="mt-2 text-sm font-medium">Video</span>
                  </div>
                  
                  <div
                    className={`flex flex-col items-center p-4 border rounded-md cursor-pointer ${
                      type === 'quiz'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setType('quiz')}
                  >
                    <HelpCircle className={`h-6 w-6 ${type === 'quiz' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="mt-2 text-sm font-medium">Quiz</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  Content URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder={
                    type === 'video'
                      ? 'Enter YouTube or Vimeo URL'
                      : type === 'quiz'
                      ? 'Enter quiz URL'
                      : 'Enter story URL'
                  }
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  {type === 'video'
                    ? 'Paste a YouTube or Vimeo URL for the video content.'
                    : type === 'quiz'
                    ? 'Provide a link to the interactive quiz.'
                    : 'Provide a link to the story content.'}
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}