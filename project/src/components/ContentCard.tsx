import React from 'react';
import { BookOpen, Video, HelpCircle } from 'lucide-react';
import { Content } from '../types';

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const getIcon = () => {
    switch (content.type) {
      case 'story':
        return <BookOpen className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'quiz':
        return <HelpCircle className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            {getIcon()}
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-900">{content.title}</h3>
        </div>
        <div className="mt-4">
          <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            View {content.type}
          </button>
        </div>
      </div>
    </div>
  );
}