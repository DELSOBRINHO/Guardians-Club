import React, { useState } from 'react';
import { BookOpen, Loader } from 'lucide-react';

interface StoryGeneratorProps {
  onStoryGenerated?: (story: { title: string, content: string }) => void;
}

export function StoryGenerator({ onStoryGenerated }: StoryGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [age, setAge] = useState('5-8');
  const [theme, setTheme] = useState('faith');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a story prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // This is a placeholder for actual API integration
      // In a real implementation, you would call your OpenAI API here
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockStory = {
        title: `The ${prompt.split(' ')[0]}'s Journey`,
        content: `Once upon a time, there was a ${prompt}. This is a story about faith, courage, and friendship, appropriate for children aged ${age}. The story explores themes of ${theme} in a way that's engaging and educational.

In the beginning, our hero faced many challenges. But with prayer and perseverance, they overcame each obstacle.

"Always remember," said the wise old owl, "that God is with you in every step of your journey."

The ${prompt.split(' ')[0]} nodded and continued forward, now confident that no matter what happened, they were never truly alone.

THE END`
      };
      
      onStoryGenerated?.(mockStory);
      
      // Reset form
      setPrompt('');
      
    } catch (err) {
      console.error('Error generating story:', err);
      setError('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <BookOpen className="h-6 w-6 text-indigo-600" />
        <h2 className="ml-2 text-xl font-semibold">Christian Story Generator</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Story Prompt
            </label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., brave lion who learns to trust God"
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age Range
              </label>
              <select
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={loading}
              >
                <option value="3-5">Preschool (3-5)</option>
                <option value="5-8">Early Elementary (5-8)</option>
                <option value="8-12">Upper Elementary (8-12)</option>
                <option value="12-16">Teen (12-16)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={loading}
              >
                <option value="faith">Faith</option>
                <option value="prayer">Prayer</option>
                <option value="kindness">Kindness</option>
                <option value="forgiveness">Forgiveness</option>
                <option value="courage">Courage</option>
                <option value="honesty">Honesty</option>
                <option value="gratitude">Gratitude</option>
              </select>
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Generating Story...
              </>
            ) : (
              'Generate Story'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}