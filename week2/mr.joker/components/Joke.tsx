"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"


export default function JokeGenerator() {
  const [jokeParams, setJokeParams] = useState({
    topic: "animals",
    tone: "witty",
    type: "pun",
    temperature: 0.7,
  })

  const [status, setStatus] = useState("ready")
  const [joke, setJoke] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const handleParamChange = (e) => {
    const { name, value } = e.target
    setJokeParams({
      ...jokeParams,
      [name]: value,
    })
  }

  const handleTemperatureChange = (e) => {
    setJokeParams({
      ...jokeParams,
      temperature: Number.parseFloat(e.target.value),
    })
  }

  const generateJoke = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus("streaming")

    // Create prompt
    const prompt = `Create a ${jokeParams.tone} ${jokeParams.type} joke about ${jokeParams.topic}.`

    try {
      const response = await fetch("/api/generate-joke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jokeParameters: jokeParams,
          messages: [{ role: "user", content: prompt }],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate joke")
      }

      const data = await response.json()
      setJoke(data.content)
      setStatus("ready")
    } catch (error) {
      console.error("Error generating joke:", error)
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  // Available options for the joke parameters
  const topics = ["work", "people", "animals", "food", "television", "technology", "sports"]

  const tones = ["witty", "sarcastic", "silly", "dark", "goofy", "clean", "clever"]

  const types = ["pun", "knock-knock", "story", "one-liner", "dad joke", "riddle"]
  // Get the latest AI response (if any)
  // Icons for different joke types
  const getTypeIcon = (type: any) => {
    switch (type) {
      case "pun":
        return "💬"
      case "knock-knock":
        return "🚪"
      case "story":
        return "📖"
      case "one-liner":
        return "🎯"
      case "dad joke":
        return "👨"
      case "riddle":
        return "🧩"
      default:
        return "😄"
    }
  }

  // Get emoji for topics
  const getTopicEmoji = (topic: any) => {
    switch (topic) {
      case "work":
        return "💼"
      case "people":
        return "👥"
      case "animals":
        return "🐾"
      case "food":
        return "🍔"
      case "television":
        return "📺"
      case "technology":
        return "💻"
      case "sports":
        return "🏀"
      default:
        return "🌟"
    }
  }

  // Background animation
  const BackgroundAnimation = () => {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#070b1f]" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-purple-500/10 to-transparent blur-3xl transform translate-y-1/2" />

        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-500/20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    )
  }

  // Animated border component
  const AnimatedBorder = () => {
    const [position, setPosition] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setPosition((prev) => (prev + 3) % 400) // Increased speed from 1 to 3
      }, 20)
      return () => clearInterval(interval)
    }, [])

    return (
      <div className="absolute inset-0 rounded-xl pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            rx="12"
            ry="12"
            strokeWidth="2"
            stroke="url(#neon-gradient)"
            strokeDasharray="120 280" // One long dash (120) and one gap (280)
            strokeDashoffset={position}
            filter="drop-shadow(0 0 6px #00f7ff)" // Added glow effect
          />
          <defs>
            <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f7ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#00f7ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* Additional outer glow effect */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-50">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            rx="12"
            ry="12"
            strokeWidth="4"
            stroke="url(#neon-gradient)"
            strokeDasharray="120 280"
            strokeDashoffset={position}
            filter="blur(8px)"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen p-6 relative overflow-hidden">
      <BackgroundAnimation />

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full mx-auto relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl transform -translate-y-1 scale-105" />

        <div className="relative bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/10">
          <AnimatedBorder />

          <div className="p-6 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <motion.h1
              className="text-3xl font-bold text-white flex items-center gap-2 relative"
              animate={{ textShadow: ["0 0 8px #00f7ff", "0 0 16px #00f7ff", "0 0 8px #00f7ff"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-4xl">🤣</span> AI Joke Generator
            </motion.h1>
            <p className="text-cyan-100 mt-2 relative">Customize your joke and let AI make you laugh!</p>
          </div>

          <form onSubmit={generateJoke} className="p-6 space-y-5 relative">
            <div className="space-y-4">
              {/* Topic selector with emojis */}
              <motion.div
                className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <label className="block mb-2 text-lg font-medium text-white">Topic:</label>
                <div className="relative">
                  <select
                    name="topic"
                    value={jokeParams.topic}
                    onChange={handleParamChange}
                    className="w-full p-3 pl-10 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
                  >
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>
                        {getTopicEmoji(topic)} {topic.charAt(0).toUpperCase() + topic.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-xl">{getTopicEmoji(jokeParams.topic)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Tone selector */}
              <motion.div
                className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <label className="block mb-2 text-lg font-medium text-white">Tone:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tones.map((tone) => (
                    <motion.div
                      key={tone}
                      onClick={() => setJokeParams({ ...jokeParams, tone })}
                      className={`cursor-pointer p-2 rounded-md text-center transition-all ${
                        jokeParams.tone === tone
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20"
                          : "bg-black/50 text-zinc-300 hover:bg-black/70 border border-white/10"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Joke type selector */}
              <motion.div
                className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <label className="block mb-2 text-lg font-medium text-white">Type of Joke:</label>
                <div className="grid grid-cols-2 gap-2">
                  {types.map((type) => (
                    <motion.div
                      key={type}
                      onClick={() => setJokeParams({ ...jokeParams, type })}
                      className={`cursor-pointer p-3 rounded-md flex items-center justify-center gap-2 transition-all ${
                        jokeParams.type === type
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20"
                          : "bg-black/50 text-zinc-300 hover:bg-black/70 border border-white/10"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xl">{getTypeIcon(type)}</span>
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Temperature slider */}
              <motion.div
                className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
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
                  className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-sm mt-2 text-zinc-300">
                  <span className="flex items-center gap-1">
                    <span>🧠</span> Predictable
                  </span>
                  <span className="flex items-center gap-1">
                    Creative <span>🎨</span>
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.button
              type="submit"
              disabled={status === "streaming"}
              className="w-full p-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="relative">
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
              </div>
            </motion.button>
          </form>


{/* Status indicator and joke display */}
<div className="p-6 bg-black/50 backdrop-blur-md">
    <div className="mb-3 flex items-center">
      <motion.div
        animate={status === "streaming" ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
        className={`w-3 h-3 rounded-full mr-2 ${
          status === "streaming"
            ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
            : status === "error"
              ? "bg-red-500"
              : status === "ready" && joke
                ? "bg-green-500"
                : "bg-zinc-500"
        }`}
      ></motion.div>
      <p className="text-sm text-zinc-400">
        {status === "streaming" && "Crafting the perfect joke..."}
        {status === "ready" && joke && "Here's your joke!"}
        {status === "error" && "Error occurred. Please try again."}
        {status === "ready" && !joke && "Ready to generate jokes"}
      </p>
    </div>

    {/* If we have a joke, display it */}
    <AnimatePresence mode="wait">
      {joke && (
        <motion.div
          key={joke}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-4 p-6 bg-black/40 border border-white/10 rounded-xl shadow-inner relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
          <div className="flex items-start mb-4 relative">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-2 rounded-full mr-3"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(0, 247, 255, 0.5)",
                  "0 0 20px rgba(0, 247, 255, 0.5)",
                  "0 0 0px rgba(0, 247, 255, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-xl">🤖</span>
            </motion.div>
            <p className="text-sm text-zinc-400">
              Your {jokeParams.tone} {jokeParams.type} about {jokeParams.topic}
            </p>
          </div>
          <div className="text-white text-lg font-medium whitespace-pre-line leading-relaxed relative">
            {joke}
          </div>

          <div className="mt-6 flex justify-end gap-2 relative">
            <motion.button
              onClick={generateJoke}
              className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-cyan-300 transition-colors border border-cyan-500/30"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-xl">🔄</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>


        </div>
      </motion.div>
    </div>
  )
}

