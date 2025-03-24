# Story Generator with LMStudio

A Next.js application that uses LMStudio's local models to create characters and generate stories.

## Features

- Create, edit, and delete characters with names, descriptions, and personalities
- Generate stories featuring your created characters
- Customize generation parameters (temperature, max tokens, etc.)
- Get AI-generated summaries of each character's role in the story
- Fully client-side application that works with your local LMStudio instance

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- [LMStudio](https://lmstudio.ai/) installed and running locally

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```
3. Start LMStudio and load a model
4. In LMStudio, start the local server (typically runs on http://localhost:1234)
5. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## LMStudio Configuration

1. Open LMStudio
2. Load a model (recommended: a model with at least 7B parameters for better story generation)
3. Go to the "Local Server" tab
4. Click "Start Server" (the default API endpoint is http://localhost:1234)
5. Ensure the server is running before using the Story Generator application

## How to Use

1. Add characters by clicking the "Add Character" button
2. Fill in the character's name, description, and personality
3. Create multiple characters to make your story more interesting
4. Use the "Generate Story" section to create a story featuring your characters
5. Optionally, provide a custom prompt to guide the story generation
6. Adjust advanced parameters if needed
7. View the generated story and character summaries in the "Story Output" section

## Technical Details

- Built with Next.js and TypeScript
- Uses Tailwind CSS for styling
- Communicates with LMStudio's local API
- Stores characters in the browser's localStorage

## License

MIT
