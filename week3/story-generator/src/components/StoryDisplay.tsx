import { useState } from 'react';
import { Character } from '@/types';

interface StoryDisplayProps {
  story: string;
  characterSummaries: Record<string, string>;
  characters: Character[];
}

export default function StoryDisplay({ story, characterSummaries, characters }: StoryDisplayProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'summaries'>('story');

  if (!story) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('story')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'story'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Story
          </button>
          <button
            onClick={() => setActiveTab('summaries')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'summaries'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Character Summaries
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'story' ? (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Your Generated Story</h2>
            <div className="whitespace-pre-wrap">{story}</div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Character Summaries</h2>
            {Object.keys(characterSummaries).length > 0 ? (
              <div className="space-y-6">
                {characters.map((character) => (
                  <div key={character.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="text-xl font-semibold mb-2">{character.name}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {characterSummaries[character.id] || 'No summary available for this character.'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No character summaries available yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
