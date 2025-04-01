'use client';

import { useState } from 'react';
import { Character } from '../types/character';
import { CharacterExtractor } from '../utils/ragPipeline';

export default function Home() {
  const [fileContent, setFileContent] = useState<string>('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setFileContent(text);
      setError('');
    } catch (err) {
      setError('Error reading file. Please try again.');
    }
  };

  const extractCharacters = async () => {
    if (!fileContent) {
      setError('Please upload a file first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const extractor = new CharacterExtractor();
      const extractedCharacters = await extractor.processDocument(fileContent);
      setCharacters(extractedCharacters);
    } catch (err) {
      console.error('Extraction error:', err);
      setError(err instanceof Error ? err.message : 'Error extracting characters. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Story Character Analyzer</h1>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Text File
          </label>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={extractCharacters}
          disabled={isLoading || !fileContent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Extracting...' : 'Extract Characters'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {characters.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Extracted Characters</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personality</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {characters.map((character, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{character.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{character.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{character.personality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
