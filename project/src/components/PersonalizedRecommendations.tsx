import React, { useEffect, useState } from 'react';
import { analyticsService, UserInsight, ContentInsight } from '../lib/analyticsService';
import { supabase } from '../lib/supabaseClient';

interface RecommendationProps {
  userId: string;
  contentType?: 'all' | 'articles' | 'videos' | 'activities';
}

const PersonalizedRecommendations: React.FC<RecommendationProps> = ({ userId, contentType = 'all' }) => {
  const [userInsights, setUserInsights] = useState<UserInsight | null>(null);
  const [contentInsights, setContentInsights] = useState<ContentInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [userId, contentType]);

  const fetchRecommendations = async () => {
    try {
      // Get user insights
      const insights = await analyticsService.getUserInsights(userId);
      setUserInsights(insights);

      // Get recommended content
      const { data: recommendedContent } = await supabase
        .from('content')
        .select('*')
        .in('id', insights.recommendedContent)
        .eq(contentType === 'all' ? 'type' : 'type', contentType);

      // Get content insights for each recommended item
      const contentInsightsPromises = recommendedContent?.map(content =>
        analyticsService.getContentInsights(content.id)
      ) || [];

      const insightsResults = await Promise.all(contentInsightsPromises);
      setContentInsights(insightsResults);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Personalized Recommendations</h2>
        {userInsights && (
          <div className="text-gray-600">
            <p>Based on your interests: {userInsights.interests.join(', ')}</p>
            <p>Engagement Level: {userInsights.engagementLevel}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentInsights.map((insight) => (
          <div key={insight.contentId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {insight.performance.views} views
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Engagement Score:</span>
                  <span className="font-medium">{insight.performance.engagement.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conversion Rate:</span>
                  <span className="font-medium">{insight.performance.conversion.toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Audience Interests:</h4>
                <div className="flex flex-wrap gap-2">
                  {insight.audience.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {insight.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contentInsights.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No recommendations available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations; 