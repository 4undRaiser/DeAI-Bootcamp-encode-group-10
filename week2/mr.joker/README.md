# Mr. Joker - AI-Powered Joke Generator

Mr. Joker is a Next.js application that generates customized jokes using OpenAI's GPT-3.5 model. Users can specify various parameters to get jokes tailored to their preferences, and the AI will evaluate the jokes for humor, appropriateness, and potential offensiveness.

## Features

- Customizable joke parameters:
  - Topic selection (work, people, animals, food, television, etc.)
  - Tone selection (witty, sarcastic, silly, dark, goofy, etc.)
  - Joke type selection (pun, knock-knock, story, one-liner, etc.)
  - Creativity level adjustment
- Real-time joke generation using OpenAI
- AI-powered joke evaluation system
- Modern, responsive UI with Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- OpenAI API key

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd mr.joker
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app` - Next.js app directory
  - `/api` - API routes for joke generation and evaluation
  - `/components` - React components
  - `page.tsx` - Main page component
- `public/` - Static assets
- `tailwind.config.js` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration

## Technologies Used

- Next.js 14
- React 18
- OpenAI API
- Tailwind CSS
- TypeScript
- Vercel AI SDK

## Contributing

Feel free to submit issues and enhancement requests!
