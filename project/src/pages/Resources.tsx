import React from 'react';
import { StoryGenerator } from '../components/StoryGenerator';
import { BookOpen, Video, HelpCircle, Download } from 'lucide-react';

export function Resources() {
  const [generatedStory, setGeneratedStory] = React.useState<{ title: string, content: string } | null>(null);

  const handleStoryGenerated = (story: { title: string, content: string }) => {
    setGeneratedStory(story);
  };

  const resourceCategories = [
    {
      title: 'Bible Stories',
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      description: 'Interactive Bible stories for children of all ages',
      resources: [
        { name: 'Noah\'s Ark', type: 'PDF', url: '#' },
        { name: 'David and Goliath', type: 'PDF', url: '#' },
        { name: 'The Good Samaritan', type: 'PDF', url: '#' },
      ]
    },
    {
      title: 'Educational Videos',
      icon: <Video className="h-8 w-8 text-indigo-600" />,
      description: 'Videos that teach important Christian values',
      resources: [
        { name: 'Prayer for Beginners', type: 'Video', url: '#' },
        { name: 'Understanding the Bible', type: 'Video', url: '#' },
        { name: 'Kindness in Action', type: 'Video', url: '#' },
      ]
    },
    {
      title: 'Interactive Activities',
      icon: <HelpCircle className="h-8 w-8 text-indigo-600" />,
      description: 'Fun activities to reinforce learning',
      resources: [
        { name: 'Bible Verse Memory Game', type: 'Activity', url: '#' },
        { name: 'Character Building Worksheets', type: 'PDF', url: '#' },
        { name: 'Family Discussion Guide', type: 'PDF', url: '#' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Downloadable Resources</h2>
              <p className="text-gray-600 mb-6">
                Access our collection of free resources to support your child's Christian education journey.
              </p>
              
              <div className="space-y-8">
                {resourceCategories.map((category) => (
                  <div key={category.title}>
                    <div className="flex items-center mb-4">
                      {category.icon}
                      <h3 className="ml-3 text-xl font-semibold">{category.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    
                    <div className="bg-gray-50 rounded-lg">
                      {category.resources.map((resource, index) => (
                        <div 
                          key={resource.name}
                          className={`flex items-center justify-between p-4 ${
                            index !== category.resources.length - 1 ? 'border-b border-gray-200' : ''
                          }`}
                        >
                          <div>
                            <h4 className="font-medium">{resource.name}</h4>
                            <p className="text-sm text-gray-500">{resource.type}</p>
                          </div>
                          <a
                            href={resource.url}
                            className="flex items-center text-indigo-600 hover:text-indigo-800"
                          >
                            <Download className="h-5 w-5 mr-1" />
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <StoryGenerator onStoryGenerated={handleStoryGenerated} />
            
            {generatedStory && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">{generatedStory.title}</h3>
                <div className="prose">
                  {generatedStory.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setGeneratedStory(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would download the story as a PDF or text file
                      alert('Download functionality would be implemented here');
                    }}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <Download className="h-5 w-5 mr-1" />
                    Save Story
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}