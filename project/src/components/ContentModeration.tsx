import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'story' | 'quiz' | 'video';
  url: string;
  created_at: string;
  feedback_count: number;
  avg_rating: number | null;
}

export function ContentModeration() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Get content with feedback metrics
      const { data, error } = await supabase
        .rpc('get_content_with_feedback_metrics');
      
      if (error) throw error;
      
      setContent(data || []);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const loadFeedbackForContent = async (contentId: string) => {
    if (selectedContent === contentId) {
      setSelectedContent(null);
      return;
    }
    
    try {
      setLoadingFeedback(true);
      setSelectedContent(contentId);
      
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles:user_id (name, avatar_url),
          feedback_responses (
            id,
            response,
            created_at,
            admin:admin_id (name)
          )
        `)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFeedbackData(data || []);
    } catch (err) {
      console.error('Error loading feedback:', err);
      setError('Failed to load feedback');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return <div className="text-center py-8">Loading content...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Content Moderation</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feedback
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Rating
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.feedback_count} reviews</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getRatingColor(item.avg_rating)}`}>
                      {item.avg_rating ? item.avg_rating.toFixed(1) : 'No ratings'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => loadFeedbackForContent(item.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {selectedContent === item.id ? 'Hide Feedback' : 'View Feedback'}
                    </button>
                  </td>
                </tr>
                
                {selectedContent === item.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Feedback for "{item.title}"</h3>
                          <button
                            onClick={() => setSelectedContent(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {loadingFeedback ? (
                          <div className="text-center py-4">Loading feedback...</div>
                        ) : feedbackData.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">No feedback available</div>
                        ) : (
                          <div className="space-y-4">
                            {feedbackData.map((feedback) => (
                              <div key={feedback.id} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between">
                                  <div className="flex items-center">
                                    <div className="font-medium">{feedback.profiles.name}</div>
                                    <div className="ml-2 flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <svg
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                          }`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(feedback.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                                
                                {feedback.comment && (
                                  <div className="mt-2 text-gray-700">{feedback.comment}</div>
                                )}
                                
                                {feedback.feedback_responses && feedback.feedback_responses.length > 0 && (
                                  <div className="mt-3 pl-4 border-l-2 border-indigo-100">
                                    {feedback.feedback_responses.map((response: any) => (
                                      <div key={response.id} className="mt-2">
                                        <div className="flex items-center">
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                          <span className="ml-2 text-sm font-medium text-gray-900">
                                            Response from {response.admin.name}
                                          </span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-700">{response.response}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {feedback.feedback_responses?.length === 0 && (
                                  <div className="mt-2 flex items-center text-sm text-amber-600">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    No response yet
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}