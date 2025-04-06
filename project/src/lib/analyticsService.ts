import { supabase } from './supabaseClient';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

export interface UserInsight {
  userId: string;
  interests: string[];
  engagementLevel: 'high' | 'medium' | 'low';
  recommendedContent: string[];
  lastActive: Date;
}

export interface ContentInsight {
  contentId: string;
  performance: {
    views: number;
    engagement: number;
    conversion: number;
  };
  audience: {
    demographics: Record<string, number>;
    interests: string[];
  };
  recommendations: string[];
}

export interface EngagementMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  retentionRate: number;
}

class AnalyticsService {
  async getUserInsights(userId: string): Promise<UserInsight> {
    // Fetch user data
    const { data: userData } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId);

    // Fetch user profile
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Analyze user behavior using OpenAI
    const analysis = await this.analyzeUserBehavior(userData, profileData);

    return {
      userId,
      interests: analysis.interests,
      engagementLevel: this.calculateEngagementLevel(userData),
      recommendedContent: await this.getRecommendedContent(userId, analysis.interests),
      lastActive: new Date(userData[userData.length - 1]?.created_at || Date.now()),
    };
  }

  async getContentInsights(contentId: string): Promise<ContentInsight> {
    // Fetch content metrics
    const { data: metricsData } = await supabase
      .from('content_metrics')
      .select('*')
      .eq('content_id', contentId);

    // Fetch audience data
    const { data: audienceData } = await supabase
      .from('content_audience')
      .select('*')
      .eq('content_id', contentId);

    // Analyze content performance
    const analysis = await this.analyzeContentPerformance(metricsData, audienceData);

    return {
      contentId,
      performance: {
        views: metricsData?.views || 0,
        engagement: this.calculateEngagementScore(metricsData),
        conversion: this.calculateConversionRate(metricsData),
      },
      audience: {
        demographics: this.aggregateDemographics(audienceData),
        interests: analysis.interests,
      },
      recommendations: await this.getContentRecommendations(contentId, analysis),
    };
  }

  async getEngagementMetrics(timeRange: 'day' | 'week' | 'month'): Promise<EngagementMetrics> {
    const { data: metricsData } = await supabase
      .from('engagement_metrics')
      .select('*')
      .gte('created_at', this.getDateRange(timeRange));

    return {
      dailyActiveUsers: this.calculateActiveUsers(metricsData, 'day'),
      weeklyActiveUsers: this.calculateActiveUsers(metricsData, 'week'),
      monthlyActiveUsers: this.calculateActiveUsers(metricsData, 'month'),
      averageSessionDuration: this.calculateAverageSessionDuration(metricsData),
      bounceRate: this.calculateBounceRate(metricsData),
      retentionRate: this.calculateRetentionRate(metricsData),
    };
  }

  private async analyzeUserBehavior(userData: any[], profileData: any) {
    const prompt = `Analyze the following user behavior data and provide insights about their interests and preferences:
      User Activities: ${JSON.stringify(userData)}
      Profile Data: ${JSON.stringify(profileData)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private async analyzeContentPerformance(metricsData: any, audienceData: any) {
    const prompt = `Analyze the following content performance data and provide insights:
      Metrics: ${JSON.stringify(metricsData)}
      Audience: ${JSON.stringify(audienceData)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private calculateEngagementLevel(userData: any[]): 'high' | 'medium' | 'low' {
    const engagementScore = userData.reduce((score, activity) => {
      return score + (activity.interaction_weight || 1);
    }, 0);

    if (engagementScore > 100) return 'high';
    if (engagementScore > 50) return 'medium';
    return 'low';
  }

  private async getRecommendedContent(userId: string, interests: string[]) {
    const { data: recommendations } = await supabase
      .from('content')
      .select('*')
      .contains('tags', interests)
      .limit(5);

    return recommendations?.map(content => content.id) || [];
  }

  private calculateEngagementScore(metricsData: any): number {
    if (!metricsData) return 0;
    const { views, likes, comments, shares } = metricsData;
    return (views * 1 + likes * 2 + comments * 3 + shares * 4) / 10;
  }

  private calculateConversionRate(metricsData: any): number {
    if (!metricsData || !metricsData.views) return 0;
    return (metricsData.conversions / metricsData.views) * 100;
  }

  private aggregateDemographics(audienceData: any[]): Record<string, number> {
    return audienceData?.reduce((acc, curr) => {
      acc[curr.demographic_group] = (acc[curr.demographic_group] || 0) + curr.count;
      return acc;
    }, {}) || {};
  }

  private async getContentRecommendations(contentId: string, analysis: any) {
    const { data: recommendations } = await supabase
      .from('content_recommendations')
      .select('*')
      .eq('content_id', contentId)
      .limit(5);

    return recommendations?.map(rec => rec.recommendation) || [];
  }

  private getDateRange(timeRange: 'day' | 'week' | 'month'): string {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        return new Date(now.setDate(now.getDate() - 1)).toISOString();
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
  }

  private calculateActiveUsers(metricsData: any[], timeRange: 'day' | 'week' | 'month'): number {
    if (!metricsData) return 0;
    return metricsData.reduce((acc, curr) => acc + curr.active_users, 0);
  }

  private calculateAverageSessionDuration(metricsData: any[]): number {
    if (!metricsData || metricsData.length === 0) return 0;
    const totalDuration = metricsData.reduce((acc, curr) => acc + curr.session_duration, 0);
    return totalDuration / metricsData.length;
  }

  private calculateBounceRate(metricsData: any[]): number {
    if (!metricsData || metricsData.length === 0) return 0;
    const totalSessions = metricsData.reduce((acc, curr) => acc + curr.total_sessions, 0);
    const bounceSessions = metricsData.reduce((acc, curr) => acc + curr.bounce_sessions, 0);
    return (bounceSessions / totalSessions) * 100;
  }

  private calculateRetentionRate(metricsData: any[]): number {
    if (!metricsData || metricsData.length === 0) return 0;
    const totalUsers = metricsData.reduce((acc, curr) => acc + curr.total_users, 0);
    const retainedUsers = metricsData.reduce((acc, curr) => acc + curr.retained_users, 0);
    return (retainedUsers / totalUsers) * 100;
  }
}

export const analyticsService = new AnalyticsService(); 