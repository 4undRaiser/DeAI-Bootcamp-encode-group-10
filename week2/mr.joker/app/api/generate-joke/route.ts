import { generateText } from "ai"
import { google } from '@ai-sdk/google';
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { jokeParameters, messages } = await req.json()
    const { topic, tone, type, temperature } = jokeParameters

    // Get the last user message
    const lastUserMessage = messages.filter((message: any) => message.role === "user").pop()

    // Create system prompt
    const systemPrompt = `You are a comedy AI assistant specialized in generating jokes.
Always format your jokes with proper spacing and line breaks.
Do not use markdown formatting in your responses.
Keep your jokes appropriate for all audiences.`

    // Generate the joke using Gemini
    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: lastUserMessage?.content || `Create a ${tone} ${type} joke about ${topic}.`,
      system: systemPrompt,
      temperature: temperature,
    })

    // Return the generated joke
    return NextResponse.json({
      role: "assistant",
      content: text,
    })
  } catch (error) {
    console.error("Error generating joke:", error)
    return NextResponse.json({ error: "Failed to generate joke" }, { status: 500 })
  }
}

