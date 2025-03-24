import { useState } from 'react';
import { StoryGenerationParams } from '@/types';

interface StoryFormProps {
  onGenerate: (customPrompt: string, params: Partial<StoryGenerationParams>) => void;
  isGenerating: boolean;
}

export default function StoryForm({ onGenerate, isGenerating }: StoryFormProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [topP, setTopP] = useState(0.95);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onGenerate(customPrompt, {
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Generate Story</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Prompt (Optional)
          </label>
          <textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Enter a custom prompt to guide the story generation. Your characters will be automatically included."
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to use the default prompt with your characters.
          </p>
        </div>
        
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>
        
        {showAdvanced && (
          <div className="mb-6 space-y-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                id="temperature"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Higher values make output more random, lower values more deterministic.
              </p>
            </div>
            
            <div>
              <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-1">
                Max Tokens: {maxTokens}
              </label>
              <input
                type="range"
                id="maxTokens"
                min="500"
                max="4000"
                step="100"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Maximum length of the generated story.
              </p>
            </div>
            
            <div>
              <label htmlFor="topP" className="block text-sm font-medium text-gray-700 mb-1">
                Top P: {topP}
              </label>
              <input
                type="range"
                id="topP"
                min="0"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Controls diversity via nucleus sampling.
              </p>
            </div>
            
            <div>
              <label htmlFor="frequencyPenalty" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency Penalty: {frequencyPenalty}
              </label>
              <input
                type="range"
                id="frequencyPenalty"
                min="0"
                max="2"
                step="0.1"
                value={frequencyPenalty}
                onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Reduces repetition of token sequences.
              </p>
            </div>
            
            <div>
              <label htmlFor="presencePenalty" className="block text-sm font-medium text-gray-700 mb-1">
                Presence Penalty: {presencePenalty}
              </label>
              <input
                type="range"
                id="presencePenalty"
                min="0"
                max="2"
                step="0.1"
                value={presencePenalty}
                onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Encourages the model to talk about new topics.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className={`px-4 py-2 text-sm font-medium text-white bg-primary rounded-md ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Story'}
          </button>
        </div>
      </form>
    </div>
  );
}
