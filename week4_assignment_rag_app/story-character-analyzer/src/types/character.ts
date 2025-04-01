export interface Character {
  name: string;
  description: string;
  personality: string;
}

export interface Story {
  title: string;
  content: string;
  characters: Character[];
} 