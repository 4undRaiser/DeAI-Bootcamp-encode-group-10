import axios from 'axios';
import { StoryGenerationParams, LMStudioResponse } from '@/types';

// Updated LMStudio API configuration with the correct IP address
const API_BASE_URL = 'http://172.22.144.1:1234';
const COMPLETIONS_ENDPOINT = `${API_BASE_URL}/v1/completions`;

// Helper function to handle API errors
const handleApiError = (error: any, operation: string): never => {
  console.error(`Error ${operation}:`, error);
  
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      throw new Error(`Failed to ${operation}. API responded with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error(`Failed to ${operation}. No response received from LMStudio at ${API_BASE_URL}. Is the server running?`);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Failed to ${operation}. Error setting up request: ${error.message}`);
    }
  }
  
  throw new Error(`Failed to ${operation}. Unexpected error: ${error}`);
};

export async function generateStory(
  prompt: string,
  params: Partial<StoryGenerationParams> = {}
): Promise<string> {
  try {
    console.log('Generating story with prompt:', prompt);
    console.log('Using endpoint:', COMPLETIONS_ENDPOINT);
    
    const requestData = {
      prompt: `Write a story with the following details:\n\n${prompt}`,
      temperature: params.temperature || 0.7,
      max_tokens: params.maxTokens || 2000,
      top_p: params.topP || 0.95,
      frequency_penalty: params.frequencyPenalty || 0,
      presence_penalty: params.presencePenalty || 0,
      stream: false
    };
    
    console.log('Request data:', JSON.stringify(requestData, null, 2));
    
    const response = await axios.post<LMStudioResponse>(
      COMPLETIONS_ENDPOINT,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Response received:', JSON.stringify(response.data, null, 2));
    
    if (!response.data.choices || !response.data.choices.length) {
      throw new Error('Invalid response format: No choices returned from API');
    }
    
    return response.data.choices[0].text.trim();
  } catch (error) {
    return handleApiError(error, 'generate story');
  }
}

export async function generateCharacterSummary(
  story: string,
  character: string
): Promise<string> {
  try {
    console.log(`Generating summary for character: ${character}`);
    
    const prompt = `Given the following story, provide a brief summary of the character "${character}" and their role in the narrative. Focus on their actions, development, and significance to the plot:\n\n${story}`;
    
    const requestData = {
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.95,
      stream: false
    };
    
    const response = await axios.post<LMStudioResponse>(
      COMPLETIONS_ENDPOINT,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.data.choices || !response.data.choices.length) {
      throw new Error('Invalid response format: No choices returned from API');
    }
    
    return response.data.choices[0].text.trim();
  } catch (error) {
    return handleApiError(error, 'generate character summary');
  }
}
