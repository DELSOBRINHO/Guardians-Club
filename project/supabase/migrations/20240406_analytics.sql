-- Verificar se o tipo content_type existe e criar se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
        CREATE TYPE content_type AS ENUM ('article', 'video', 'activity', 'resource');
    END IF;
END$$;

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    activity_type VARCHAR(50) NOT NULL,
    content_id UUID,
    interaction_weight INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Create content_metrics table
CREATE TABLE IF NOT EXISTS content_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_audience table
CREATE TABLE IF NOT EXISTS content_audience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID,
    demographic_group VARCHAR(50),
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create engagement_metrics table
CREATE TABLE IF NOT EXISTS engagement_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    active_users INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    bounce_sessions INTEGER DEFAULT 0,
    session_duration INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    retained_users INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_recommendations table
CREATE TABLE IF NOT EXISTS content_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID,
    recommendation TEXT NOT NULL,
    score FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_content_metrics_content_id ON content_metrics(content_id);
CREATE INDEX IF NOT EXISTS idx_content_audience_content_id ON content_audience(content_id);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_created_at ON engagement_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_content_id ON content_recommendations(content_id);

-- Create function to update content metrics
CREATE OR REPLACE FUNCTION update_content_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO content_metrics (content_id, views, likes, comments, shares, conversions)
    VALUES (NEW.id, 0, 0, 0, 0, 0)
    ON CONFLICT (content_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create content metrics
DROP TRIGGER IF EXISTS create_content_metrics ON content;
CREATE TRIGGER create_content_metrics
AFTER INSERT ON content
FOR EACH ROW
EXECUTE FUNCTION update_content_metrics();

-- Create function to track user activity
CREATE OR REPLACE FUNCTION track_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_activities (user_id, activity_type, content_id, interaction_weight)
    VALUES (NEW.user_id, NEW.activity_type, NEW.content_id, NEW.interaction_weight);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update engagement metrics
CREATE OR REPLACE FUNCTION update_engagement_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO engagement_metrics (
        active_users,
        total_sessions,
        bounce_sessions,
        session_duration,
        total_users,
        retained_users
    )
    VALUES (
        NEW.active_users,
        NEW.total_sessions,
        NEW.bounce_sessions,
        NEW.session_duration,
        NEW.total_users,
        NEW.retained_users
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_audience ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON user_activities;
DROP POLICY IF EXISTS "Anyone can view content metrics" ON content_metrics;
DROP POLICY IF EXISTS "Only admins can update content metrics" ON content_metrics;
DROP POLICY IF EXISTS "Anyone can view content audience" ON content_audience;
DROP POLICY IF EXISTS "Anyone can view engagement metrics" ON engagement_metrics;
DROP POLICY IF EXISTS "Anyone can view content recommendations" ON content_recommendations;
DROP POLICY IF EXISTS "Only admins can update content recommendations" ON content_recommendations;

-- Policy for user_activities
CREATE POLICY "Users can view their own activities"
    ON user_activities FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
    ON user_activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy for content_metrics
CREATE POLICY "Anyone can view content metrics"
    ON content_metrics FOR SELECT
    USING (true);

CREATE POLICY "Only admins can update content metrics"
    ON content_metrics FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Policy for content_audience
CREATE POLICY "Anyone can view content audience"
    ON content_audience FOR SELECT
    USING (true);

-- Policy for engagement_metrics
CREATE POLICY "Anyone can view engagement metrics"
    ON engagement_metrics FOR SELECT
    USING (true);

-- Policy for content_recommendations
CREATE POLICY "Anyone can view content recommendations"
    ON content_recommendations FOR SELECT
    USING (true);

CREATE POLICY "Only admins can update content recommendations"
    ON content_recommendations FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')); 