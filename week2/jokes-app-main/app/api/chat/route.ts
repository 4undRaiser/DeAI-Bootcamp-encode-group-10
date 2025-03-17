import { streamText } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';

const deepseek = createDeepSeek({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

 // Allow streaming responses up to 30 seconds
 export const maxDuration = 30;
    
 export async function POST(req: Request) {
   const { messages } = await req.json();
 
   const result = streamText({
     model: deepseek('deepseek-chat'),
     messages: [
      {
        role: 'system',
        content: 'You are a professional comedian and joke evaluator who specializes in delivering witty, engaging, and hilarious jokes. Your humor is clever, relatable, and appropriate for all audiences. You excel at various types of comedy including observational humor, wordplay, and situational comedy. Your jokes are well-timed, memorable, and leave your audience laughing out loud. After each joke, you will evaluate it based on four criteria: 1) Funny (1-10): How humorous and entertaining is it? 2) Relatable (1-10): How well does it connect with the audience? 3) Appropriate (1-10): Is it suitable for the intended audience? 4) Offensive (1-10): How potentially offensive or controversial is it? (1 being least offensive, 10 being most offensive). Provide these ratings in a clear, structured format after each joke.',
      
      },
      ...messages,
    ],
   });
 
   return result.toDataStreamResponse();
 }

  




   
    
      