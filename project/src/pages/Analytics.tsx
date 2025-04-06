import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsData {
  userEngagement: {
    date: string;
    activeUsers: number;
    contentInteractions: number;
  }[];
  contentPerformance: {
    category: string;
    views: number;
    likes: number;
    shares: number;
  }[];
  userDemographics: {
    ageGroup: string;
    count: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch user engagement data
      const { data: engagementData } = await supabase
        .from('user_activities')
        .select('*')
        .gte('created_at', getDateRange());

      // Fetch content performance data
      const { data: contentData } = await supabase
        .from('content_metrics')
        .select('*');

      // Fetch user demographics
      const { data: demographicsData } = await supabase
        .from('user_profiles')
        .select('age_group, count');

      // Process and transform data
      const processedData = processAnalyticsData(engagementData, contentData, demographicsData);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
    }
  };

  const processAnalyticsData = (engagement: any[], content: any[], demographics: any[]) => {
    // Process and aggregate data
    return {
      userEngagement: processEngagementData(engagement),
      contentPerformance: processContentData(content),
      userDemographics: processDemographicsData(demographics)
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading analytics...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`px-4 py-2 rounded ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`px-4 py-2 rounded ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Engagement Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Engagement</h2>
          <LineChart width={500} height={300} data={analyticsData?.userEngagement}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" />
            <Line type="monotone" dataKey="contentInteractions" stroke="#82ca9d" />
          </LineChart>
        </div>

        {/* Content Performance Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Content Performance</h2>
          <BarChart width={500} height={300} data={analyticsData?.contentPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#8884d8" />
            <Bar dataKey="likes" fill="#82ca9d" />
            <Bar dataKey="shares" fill="#ffc658" />
          </BarChart>
        </div>

        {/* User Demographics Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Demographics</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={analyticsData?.userDemographics}
              cx={250}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {analyticsData?.userDemographics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Key Metrics */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <h3 className="text-lg font-medium">Total Users</h3>
              <p className="text-2xl font-bold">{calculateTotalUsers(analyticsData?.userDemographics)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <h3 className="text-lg font-medium">Avg. Engagement</h3>
              <p className="text-2xl font-bold">{calculateAverageEngagement(analyticsData?.userEngagement)}%</p>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <h3 className="text-lg font-medium">Content Views</h3>
              <p className="text-2xl font-bold">{calculateTotalViews(analyticsData?.contentPerformance)}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded">
              <h3 className="text-lg font-medium">Growth Rate</h3>
              <p className="text-2xl font-bold">{calculateGrowthRate(analyticsData?.userEngagement)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for calculations
const calculateTotalUsers = (demographics: any[] | undefined) => {
  if (!demographics) return 0;
  return demographics.reduce((acc, curr) => acc + curr.count, 0);
};

const calculateAverageEngagement = (engagement: any[] | undefined) => {
  if (!engagement || engagement.length === 0) return 0;
  const total = engagement.reduce((acc, curr) => acc + curr.contentInteractions, 0);
  return Math.round(total / engagement.length);
};

const calculateTotalViews = (content: any[] | undefined) => {
  if (!content) return 0;
  return content.reduce((acc, curr) => acc + curr.views, 0);
};

const calculateGrowthRate = (engagement: any[] | undefined) => {
  if (!engagement || engagement.length < 2) return 0;
  const first = engagement[0].activeUsers;
  const last = engagement[engagement.length - 1].activeUsers;
  return Math.round(((last - first) / first) * 100);
};

export default Analytics; 