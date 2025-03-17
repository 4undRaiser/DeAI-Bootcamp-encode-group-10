/*eslint-disable*/
"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function JokeGenerator() {
  const [jokeParams, setJokeParams] = useState({
    topic: "animals",
    tone: "witty",
    type: "pun",
    temperature: 0.7,
  });

  // Use the useChat hook with a placeholder message handler
  const { messages, append, status } = useChat({
    api: "/api/generate-joke",
    id: "joke-generator",
    // Format the joke request in the request body
    experimental_prepareRequestBody: ({ messages }) => {
      return {
        jokeParameters: jokeParams,
        messages: messages,
      };
    },
  });

  // Available options for the joke parameters
  const topics = [
    "work",
    "people",
    "animals",
    "food",
    "television",
    "technology",
    "sports",
  ];

  const tones = [
    "witty",
    "sarcastic",
    "silly",
    "dark",
    "goofy",
    "clean",
    "clever",
  ];

  const types = [
    "pun",
    "knock-knock",
    "story",
    "one-liner",
    "dad joke",
    "riddle",
  ];

  const handleParamChange = (e: any) => {
    const { name, value } = e.target;
    setJokeParams({
      ...jokeParams,
      [name]: value,
    });
  };

  const handleTemperatureChange = (e: any) => {
    setJokeParams({
      ...jokeParams,
      temperature: parseFloat(e.target.value),
    });
  };

  const generateJoke = (e: any) => {
    e.preventDefault();

    // Create prompt
    const prompt = `Create a ${jokeParams.tone} ${jokeParams.type} joke about ${jokeParams.topic}.`;

    // Use append to directly add a message to the chat
    append({
      role: "user",
      content: prompt,
    });
  };

  // Get the latest AI response (if any)
  const latestAiMessage = messages
    .filter((message) => message.role === "assistant")
    .pop();
  const latestUserMessage = messages
    .filter((message) => message.role === "user")
    .pop();

  // Icons for different joke types
  const getTypeIcon = (type: any) => {
    switch (type) {
      case "pun":
        return "💬";
      case "knock-knock":
        return "🚪";
      case "story":
        return "📖";
      case "one-liner":
        return "🎯";
      case "dad joke":
        return "👨";
      case "riddle":
        return "🧩";
      default:
        return "😄";
    }
  };

  // Get emoji for topics
  const getTopicEmoji = (topic: any) => {
    switch (topic) {
      case "work":
        return "💼";
      case "people":
        return "👥";
      case "animals":
        return "🐾";
      case "food":
        return "🍔";
      case "television":
        return "📺";
      case "technology":
        return "💻";
      case "sports":
        return "🏀";
      default:
        return "🌟";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 p-6">
      <div className="max-w-md w-full mx-auto bg-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="text-4xl">🤣</span> AI Joke Generator
          </h1>
          <p className="text-blue-100 mt-2">
            Customize your joke and let AI make you laugh!
          </p>
        </div>

        <form onSubmit={generateJoke} className="p-6 space-y-5">
          <div className="space-y-4">
            {/* Topic selector with emojis */}
            <div className="bg-zinc-700 p-4 rounded-lg">
              <label className="block mb-2 text-lg font-medium text-white">
                Topic:
              </label>
              <div className="relative">
                <select
                  name="topic"
                  value={jokeParams.topic}
                  onChange={handleParamChange}
                  className="w-full p-3 pl-10 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {getTopicEmoji(topic)}{" "}
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-xl">
                    {getTopicEmoji(jokeParams.topic)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tone selector */}
            <div className="bg-zinc-700 p-4 rounded-lg">
              <label className="block mb-2 text-lg font-medium text-white">
                Tone:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tones.map((tone) => (
                  <div
                    key={tone}
                    onClick={() => setJokeParams({ ...jokeParams, tone })}
                    className={`cursor-pointer p-2 rounded-md text-center transition-all ${
                      jokeParams.tone === tone
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-600"
                    }`}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Joke type selector */}
            <div className="bg-zinc-700 p-4 rounded-lg">
              <label className="block mb-2 text-lg font-medium text-white">
                Type of Joke:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {types.map((type) => (
                  <div
                    key={type}
                    onClick={() => setJokeParams({ ...jokeParams, type })}
                    className={`cursor-pointer p-3 rounded-md flex items-center justify-center gap-2 transition-all ${
                      jokeParams.type === type
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-600"
                    }`}
                  >
                    <span className="text-xl">{getTypeIcon(type)}</span>
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Temperature slider */}
            <div className="bg-zinc-700 p-4 rounded-lg">
              <label className="block mb-2 text-lg font-medium text-white">
                Creativity Level: {jokeParams.temperature.toFixed(1)}
              </label>
              <input
                type="range"
                name="temperature"
                min="0"
                max="1"
                step="0.1"
                value={jokeParams.temperature}
                onChange={handleTemperatureChange}
                className="w-full h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-sm mt-2 text-zinc-300">
                <span className="flex items-center gap-1">
                  <span>🧠</span> Predictable
                </span>
                <span className="flex items-center gap-1">
                  Creative <span>🎨</span>
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "streaming"}
            className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {status === "streaming" ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🎭</span> Generate Joke
              </span>
            )}
          </button>
        </form>

        {/* Status indicator and joke display */}
        <div className="p-6 bg-zinc-900">
          <div className="mb-3 flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                status === "streaming"
                  ? "bg-yellow-400 animate-pulse"
                  : status === "error"
                  ? "bg-red-500"
                  : status === "ready" && latestAiMessage
                  ? "bg-green-500"
                  : "bg-zinc-500"
              }`}
            ></div>
            <p className="text-sm text-zinc-400">
              {status === "submitted" && "Processing request..."}
              {status === "streaming" && "Crafting the perfect joke..."}
              {status === "ready" && latestAiMessage && "Here's your joke!"}
              {status === "error" && "Error occurred. Please try again."}
              {status === "ready" &&
                !latestAiMessage &&
                "Ready to generate jokes"}
            </p>
          </div>

          {/* If we have a joke, display it */}
          {latestAiMessage && (
            <div className="mt-4 p-6 bg-zinc-800 border border-zinc-700 rounded-xl shadow-inner">
              <div className="flex items-start mb-4">
                <div className="bg-blue-600 text-white p-2 rounded-full mr-3">
                  <span className="text-xl">🤖</span>
                </div>
                <p className="text-sm text-zinc-400">
                  Your {jokeParams.tone} {jokeParams.type} about{" "}
                  {jokeParams.topic}
                </p>
              </div>
              <p className="text-white text-lg font-medium whitespace-pre-wrap leading-relaxed">
                {latestAiMessage.content}
              </p>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={generateJoke}
                  className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-zinc-300 transition-colors"
                >
                  <span className="text-xl">🔄</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
