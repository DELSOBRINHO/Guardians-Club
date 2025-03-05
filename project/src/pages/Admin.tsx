import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserTable } from '../components/UserTable';
import { ContentModeration } from '../components/ContentModeration';
import { Users, FileText, Shield } from 'lucide-react';

export function Admin() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'users' | 'content'>('users');

  // Redirect non-admin users
  React.useEffect(() => {
    if (profile && profile.user_type !== 'admin') {
      navigate('/');
    }
  }, [profile, navigate]);

  if (!profile || profile.user_type !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 inline-flex items-center ${
                  activeTab === 'users'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                User Management
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-6 inline-flex items-center ${
                  activeTab === 'content'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Content Moderation
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' ? <UserTable /> : <ContentModeration />}
          </div>
        </div>
      </div>
    </div>
  );
}