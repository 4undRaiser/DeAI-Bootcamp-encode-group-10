import { useState, useEffect } from 'react';
import { Character } from '@/types';

interface CharacterFormProps {
  character?: Character;
  onSubmit: (character: Omit<Character, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function CharacterForm({ character, onSubmit, onCancel }: CharacterFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (character) {
      setName(character.name);
      setDescription(character.description);
      setPersonality(character.personality);
    }
  }, [character]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!personality.trim()) {
      newErrors.personality = 'Personality is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        personality: personality.trim(),
      });
      
      // Reset form if not editing
      if (!character) {
        setName('');
        setDescription('');
        setPersonality('');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {character ? 'Edit Character' : 'Create New Character'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Character name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="Brief description of the character"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-1">
            Personality
          </label>
          <textarea
            id="personality"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.personality ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="Character's personality traits"
          />
          {errors.personality && <p className="mt-1 text-sm text-red-500">{errors.personality}</p>}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-600"
          >
            {character ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
