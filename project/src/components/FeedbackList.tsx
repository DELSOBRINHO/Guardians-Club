import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackItem {
  id: string;
  user_id: string;
  content_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    name: string;
    avatar_url: string | null;
  };
  feedback_responses?: {
    id: string;
    response: string;
    created_at: string;
    admin_id: string;
    admin: {
      name: string;
    };
  }[];
}

interface FeedbackListProps {
  contentId: string;
}

export function FeedbackList({ contentId }: FeedbackListProps) {
  const { profile } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [submittingResponse, setSubmittingResponse] = useState(false);

  const isAdmin = profile?.user_type === 'admin';

  useEffect(() => {
    loadFeedback();
    
    // Subscribe to feedback changes
    const feedbackSubscription = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback',
          filter: `content_id=eq.${contentId}`,
        },
        () => {
          loadFeedback();
        }
      )
      .subscribe();
      
    // Subscribe to feedback response changes
    const responseSubscription = supabase
      .channel('feedback-response-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback_responses',
        },
        () => {
          loadFeedback();
        }
      )
      .subscribe();
    
    return () => {
      feedbackSubscription.unsubscribe();
      responseSubscription.unsubscribe();
    };
  }, [contentId]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles:user_id (name, avatar_url),
          feedback_responses (
            id,
            response,
            created_at,
            admin_id,
            admin:admin_id (name)
          )
        `)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFeedback(data as FeedbackItem[]);
    } catch (err) {
      console.error('Error loading feedback:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (feedbackId: string) => {
    if (!responseText.trim() || !isAdmin || !profile) {
      return;
    }
    
    setSubmittingResponse(true);
    
    try {
      const { error } = await supabase
        .from('feedback_responses')
        .insert({
          feedback_id: feedbackId,
          admin_id: profile.id,
          response: responseText.trim(),
        });
      
      if (error) throw error;
      
      setResponseText('');
      setRespondingTo(null);
      await loadFeedback();
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response');
    } finally {
      setSubmittingResponse(false);
    }
  };

  if (loading && feedback.length === 0) {
    return <div className="text-center py-8 text-gray-500">Loading feedback...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (feedback.length === 0) {
    return <div className="text-center py-8 text-gray-500">No feedback yet</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">User Feedback</h3>
      
      {feedback.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {item.profiles.avatar_url ? (
                <img
                  src={item.profiles.avatar_url}
                  alt={item.profiles.name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              )}
            </div>
            
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">{item.profiles.name}</h4>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-1">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
              
              {item.comment && (
                <p className="mt-3 text-gray-700">{item.comment}</p>
              )}
              
              {/* Admin response section */}
              {item.feedback_responses && item.feedback_responses.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-indigo-100">
                  {item.feedback_responses.map((response) => (
                    <div key={response.id} className="mb-3">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 text-indigo-600" />
                        <span className="ml-2 font-medium text-indigo-600">
                          {response.admin.name} (Admin)
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(response.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{response.response}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Admin response form */}
              {isAdmin && (
                <div className="mt-4">
                  {respondingTo === item.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Write your response..."
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseText('');
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitResponse(item.id)}
                          disabled={submittingResponse || !responseText.trim()}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {submittingResponse ? 'Submitting...' : 'Submit Response'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingTo(item.id)}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Respond to feedback
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}