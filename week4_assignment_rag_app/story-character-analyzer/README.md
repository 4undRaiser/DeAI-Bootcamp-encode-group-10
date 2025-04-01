# Story Character Analyzer

A Next.js application that uses LlamaIndex and OpenAI to analyze text files and extract character information. The application can process uploaded text files and generate structured character descriptions, which can then be used for story generation.

## Features

- Upload and process .txt files
- Extract character information using RAG (Retrieval Augmented Generation)
- Display character information in a structured table format
- Modern UI with Tailwind CSS
- TypeScript support for type safety

## Prerequisites

- Node.js 18.x or later
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Upload a .txt file containing story content
3. Click "Extract Characters" to analyze the text
4. View the extracted character information in the table below

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- LlamaIndex
- OpenAI API

## License

MIT
