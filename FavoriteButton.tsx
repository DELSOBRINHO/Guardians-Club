import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FavoriteButtonProps {
  contentId: string;
  initialIsFavorited?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  contentId,
  initialIsFavorited = false,
  onToggle,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId);
        
        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            content_id: contentId,
          });
        
        if (error) throw error;
      }

      setIsFavorited(!isFavorited);
      onToggle?.(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isFavorited
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-400 hover:text-red-600'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart
        className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`}
      />
    </button>
  );
}