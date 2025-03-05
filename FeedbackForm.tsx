import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackFormProps {
  contentId: string;
  onSubmit?: () => void;
}

export function FeedbackForm({ contentId, onSubmit }: FeedbackFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to submit feedback');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('feedback')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          rating,
          comment: comment.trim() || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,content_id'
        });
      
      if (error) throw error;
      
      setSuccess(true);
      setComment('');
      onSubmit?.();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">Please sign in to leave feedback</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Share Your Feedback</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    (hoveredRating ? value <= hoveredRating : value <= rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share your thoughts about this content..."
          />
        </div>
        
        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}
        
        {success && (
          <div className="mb-4 text-green-600 text-sm">
            Thank you for your feedback!
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}