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
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {character ? 'Edit Character' : 'Create New Character'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
              errors.name ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Enter character name..."
          />
          {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
              errors.description ? 'border-red-500' : 'border-gray-200'
            }`}
            rows={4}
            placeholder="Describe your character's appearance and background..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-500 font-medium">{errors.description}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="personality" className="block text-sm font-semibold text-gray-700">
            Personality
          </label>
          <textarea
            id="personality"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
              errors.personality ? 'border-red-500' : 'border-gray-200'
            }`}
            rows={4}
            placeholder="Describe your character's traits, behaviors, and motivations..."
          />
          {errors.personality && <p className="mt-1 text-sm text-red-500 font-medium">{errors.personality}</p>}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transform hover:scale-[1.02] transition-all duration-200 shadow-sm"
          >
            {character ? 'Update Character' : 'Create Character'}
          </button>
        </div>
      </form>
    </div>
  );
}
