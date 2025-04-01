import OpenAI from 'openai/index.mjs';
import { Character } from '../types/character';

export class CharacterExtractor {
  private openai: OpenAI;

  constructor() {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables.');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async processDocument(fileContent: string): Promise<Character[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that extracts character information from text. Provide the information in a structured JSON format."
          },
          {
            role: "user",
            content: `Extract all characters from this text. For each character, provide:
            1. Their name
            2. A physical description
            3. Their personality traits and characteristics
            
            Text: ${fileContent}
            
            Format the response as a JSON array of objects with the following structure:
            {
              "characters": [
                {
                  "name": string,
                  "description": string,
                  "personality": string
                }
              ]
            }`
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{"characters": []}');
      return result.characters || [];
    } catch (error) {
      console.error('Error processing document:', error);
      throw error; // Re-throw the error to handle it in the UI
    }
  }
} 