export interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  createdAt: string;
}

export interface StoryGenerationParams {
  prompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface StoryResponse {
  text: string;
  characterSummaries?: Record<string, string>;
}

export interface LMStudioResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: null;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
