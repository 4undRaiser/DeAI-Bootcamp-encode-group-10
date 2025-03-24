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
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </span>
        Generate Story
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customPrompt" className="block text-sm font-semibold text-gray-700 mb-2">
            Custom Prompt
          </label>
          <textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            rows={4}
            placeholder="Enter a custom prompt to guide the story generation. Your characters will be automatically included."
          />
          <p className="mt-2 text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Leave empty to use the default prompt with your characters
          </p>
        </div>
        
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
          >
            <svg className={`w-4 h-4 mr-1.5 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>
        
        {showAdvanced && (
          <div className="space-y-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
            {[
              { id: 'temperature', label: 'Temperature', value: temperature, min: 0, max: 1, step: 0.1, setter: setTemperature,
                description: 'Higher values make output more random, lower values more deterministic.' },
              { id: 'maxTokens', label: 'Max Tokens', value: maxTokens, min: 500, max: 4000, step: 100, setter: setMaxTokens,
                description: 'Maximum length of the generated story.' },
              { id: 'topP', label: 'Top P', value: topP, min: 0, max: 1, step: 0.05, setter: setTopP,
                description: 'Controls diversity via nucleus sampling.' },
              { id: 'frequencyPenalty', label: 'Frequency Penalty', value: frequencyPenalty, min: 0, max: 2, step: 0.1, setter: setFrequencyPenalty,
                description: 'Reduces repetition of token sequences.' },
              { id: 'presencePenalty', label: 'Presence Penalty', value: presencePenalty, min: 0, max: 2, step: 0.1, setter: setPresencePenalty,
                description: 'Encourages the model to talk about new topics.' }
            ].map((param) => (
              <div key={param.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor={param.id} className="text-sm font-semibold text-gray-700">
                    {param.label}
                  </label>
                  <span className="text-sm font-medium text-primary">{param.value}</span>
                </div>
                <input
                  type="range"
                  id={param.id}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) => param.setter(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-gray-500">{param.description}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className={`
              px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg
              transform transition-all duration-200
              ${isGenerating 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow'}
            `}
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Story
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
