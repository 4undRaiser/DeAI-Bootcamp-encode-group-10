import { v4 as uuidv4 } from 'uuid';
import { Character } from '@/types';

// Since we're not using a database, we'll store characters in localStorage
// This is a client-side only service

class CharacterService {
  private getCharacters(): Character[] {
    if (typeof window === 'undefined') return [];
    
    const charactersJson = localStorage.getItem('characters');
    return charactersJson ? JSON.parse(charactersJson) : [];
  }

  private saveCharacters(characters: Character[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('characters', JSON.stringify(characters));
  }

  public getAllCharacters(): Character[] {
    return this.getCharacters();
  }

  public getCharacterById(id: string): Character | undefined {
    const characters = this.getCharacters();
    return characters.find(character => character.id === id);
  }

  public createCharacter(character: Omit<Character, 'id' | 'createdAt'>): Character {
    const characters = this.getCharacters();
    
    const newCharacter: Character = {
      id: uuidv4(),
      ...character,
      createdAt: new Date().toISOString(),
    };
    
    this.saveCharacters([...characters, newCharacter]);
    return newCharacter;
  }

  public updateCharacter(id: string, updates: Partial<Omit<Character, 'id' | 'createdAt'>>): Character | null {
    const characters = this.getCharacters();
    const characterIndex = characters.findIndex(character => character.id === id);
    
    if (characterIndex === -1) return null;
    
    const updatedCharacter = {
      ...characters[characterIndex],
      ...updates,
    };
    
    characters[characterIndex] = updatedCharacter;
    this.saveCharacters(characters);
    
    return updatedCharacter;
  }

  public deleteCharacter(id: string): boolean {
    const characters = this.getCharacters();
    const filteredCharacters = characters.filter(character => character.id !== id);
    
    if (filteredCharacters.length === characters.length) {
      return false;
    }
    
    this.saveCharacters(filteredCharacters);
    return true;
  }

  public generateStoryPrompt(customPrompt?: string): string {
    const characters = this.getCharacters();
    
    if (characters.length === 0) {
      return customPrompt || 'Write a creative and engaging short story.';
    }
    
    const charactersDescription = characters.map(character => {
      return `- ${character.name}: ${character.description}. Personality: ${character.personality}`;
    }).join('\n');
    
    const basePrompt = customPrompt || 'Write a creative and engaging short story';
    
    return `${basePrompt} featuring the following characters:\n\n${charactersDescription}\n\nMake sure each character's personality is reflected in their actions and dialogue. The story should be coherent and have a clear beginning, middle, and end.`;
  }
}

// Export as singleton
export const characterService = new CharacterService();
