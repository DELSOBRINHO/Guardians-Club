/*
  # Create functions for feedback metrics

  1. New Functions
    - `get_content_with_feedback_metrics` - Returns content with feedback count and average rating
  
  2. Purpose
    - Provides an efficient way to get content with aggregated feedback metrics
    - Used by the admin dashboard for content moderation
*/

-- Function to get content with feedback metrics
CREATE OR REPLACE FUNCTION get_content_with_feedback_metrics()
RETURNS TABLE (
  id uuid,
  title text,
  type text,
  url text,
  created_at timestamptz,
  updated_at timestamptz,
  feedback_count bigint,
  avg_rating numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.type::text,
    c.url,
    c.created_at,
    c.updated_at,
    COUNT(f.id) AS feedback_count,
    AVG(f.rating)::numeric(10,1) AS avg_rating
  FROM 
    content c
  LEFT JOIN 
    feedback f ON c.id = f.content_id
  GROUP BY 
    c.id
  ORDER BY 
    c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;