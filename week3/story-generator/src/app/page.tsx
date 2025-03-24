'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CharacterForm from '@/components/CharacterForm';
import CharacterTable from '@/components/CharacterTable';
import StoryForm from '@/components/StoryForm';
import StoryDisplay from '@/components/StoryDisplay';
import ApiDiagnostic from '@/components/ApiDiagnostic';
import { Character, StoryGenerationParams } from '@/types';
import { characterService } from '@/lib/character-service';
import { generateStory, generateCharacterSummary } from '@/lib/lmstudio-api';

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [characterSummaries, setCharacterSummaries] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Load characters from localStorage on component mount
  useEffect(() => {
    try {
      const loadedCharacters = characterService.getAllCharacters();
      setCharacters(loadedCharacters);
    } catch (err) {
      console.error('Error loading characters:', err);
    }
  }, []);

  const handleCreateCharacter = (characterData: Omit<Character, 'id' | 'createdAt'>) => {
    try {
      const newCharacter = characterService.createCharacter(characterData);
      setCharacters([...characters, newCharacter]);
      setShowCharacterForm(false);
    } catch (err) {
      console.error('Error creating character:', err);
      setError('Failed to create character');
    }
  };

  const handleUpdateCharacter = (characterData: Omit<Character, 'id' | 'createdAt'>) => {
    if (!editingCharacter) return;
    
    try {
      const updatedCharacter = characterService.updateCharacter(editingCharacter.id, characterData);
      if (updatedCharacter) {
        setCharacters(characters.map(char => 
          char.id === updatedCharacter.id ? updatedCharacter : char
        ));
      }
      setEditingCharacter(null);
      setShowCharacterForm(false);
    } catch (err) {
      console.error('Error updating character:', err);
      setError('Failed to update character');
    }
  };

  const handleDeleteCharacter = (id: string) => {
    try {
      const success = characterService.deleteCharacter(id);
      if (success) {
        setCharacters(characters.filter(char => char.id !== id));
        
        // Also remove from summaries if exists
        if (characterSummaries[id]) {
          const newSummaries = { ...characterSummaries };
          delete newSummaries[id];
          setCharacterSummaries(newSummaries);
        }
      }
    } catch (err) {
      console.error('Error deleting character:', err);
      setError('Failed to delete character');
    }
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setShowCharacterForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCharacter(null);
    setShowCharacterForm(false);
  };

  const handleGenerateStory = async (customPrompt: string, params: Partial<StoryGenerationParams>) => {
    setError('');
    setIsGenerating(true);
    
    try {
      // Generate the story prompt using characters
      const prompt = characterService.generateStoryPrompt(customPrompt);
      
      // Generate the story
      const story = await generateStory(prompt, params);
      setGeneratedStory(story);
      
      // Generate summaries for each character
      if (characters.length > 0) {
        const summaries: Record<string, string> = {};
        
        // Generate summaries sequentially to avoid overwhelming the API
        for (const character of characters) {
          try {
            const summary = await generateCharacterSummary(story, character.name);
            summaries[character.id] = summary;
          } catch (err) {
            console.error(`Error generating summary for ${character.name}:`, err);
            summaries[character.id] = `Could not generate summary for ${character.name}.`;
          }
        }
        
        setCharacterSummaries(summaries);
      }
    } catch (err: any) {
      console.error('Error generating story:', err);
      setError(err.message || 'Failed to generate story. Make sure LMStudio is running at http://172.22.144.1:1234.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Characters</h2>
            {!showCharacterForm && (
              <button
                onClick={() => setShowCharacterForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-600"
              >
                Add Character
              </button>
            )}
          </div>
          
          {showCharacterForm ? (
            <CharacterForm
              character={editingCharacter || undefined}
              onSubmit={editingCharacter ? handleUpdateCharacter : handleCreateCharacter}
              onCancel={handleCancelEdit}
            />
          ) : (
            <CharacterTable
              characters={characters}
              onEdit={handleEditCharacter}
              onDelete={handleDeleteCharacter}
            />
          )}
          
          <div className="mt-8">
            <StoryForm
              onGenerate={handleGenerateStory}
              isGenerating={isGenerating}
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Story Output</h2>
          {isGenerating ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">Generating your story...</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            </div>
          ) : generatedStory ? (
            <StoryDisplay
              story={generatedStory}
              characterSummaries={characterSummaries}
              characters={characters}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">
                Your generated story will appear here. Add characters and click "Generate Story" to begin.
              </p>
            </div>
          )}
        </div>
        
        {/* API Diagnostic Tool */}
        <div className="mb-8">
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">
              LMStudio API Diagnostic
            </summary>
            <div className="mt-4">
              <ApiDiagnostic />
            </div>
          </details>
        </div>
      </div>
    </Layout>
  );
}
