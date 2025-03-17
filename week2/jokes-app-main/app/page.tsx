"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, append, isLoading } = useChat();

  const topics = [
    { emoji: "🧙", value: "Work" },
    { emoji: "🕵️", value: "Animal" },
    { emoji: "💑", value: "Food" },
    { emoji: "🚀", value: "Television" },
  ];

  const tones = [
    { emoji: "😊", value: "Happy" },
    { emoji: "😢", value: "Sad" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "😂", value: "Funny" },
  ];

  const types = [
    { emoji: "🧙", value: "Pun" },
    { emoji: "🕵️", value: "Knock-Knock" },
    { emoji: "💑", value: "Story" },
    { emoji: "🚀", value: "Poem" },
  ];
 
  const temperature = [
    { emoji: "🧙", value: "0.5" },
    { emoji: "🕵️", value: "0.7" },
    { emoji: "💑", value: "0.9" },
    { emoji: "🚀", value: "1.0" },
  ];

 

  const [state, setState] = useState({
    topic: "",
    tone: "",
    type: "",
    temperature: 0.7,
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };


     return (
       <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
         <div className="max-w-4xl mx-auto">
           <div className="flex flex-col items-center justify-center space-y-8">
             <div className="text-center space-y-4">
               <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                 Joke Generator
               </h1>
               <p className="text-gray-300 text-lg">
                 Create hilarious jokes by customizing your preferences below
               </p>
             </div>

             <div className="w-full space-y-6">
               <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
                 <h3 className="text-xl font-semibold text-blue-400 mb-4">Topics</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {topics.map(({ value, emoji }) => (
                     <div
                       key={value}
                       className="relative group"
                     >
                       <input
                         id={value}
                         type="radio"
                         value={value}
                         name="topic"
                         onChange={handleChange}
                         className="peer sr-only"
                       />
                       <label 
                         className="flex items-center justify-center p-4 bg-gray-700/50 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-500/20 peer-checked:bg-blue-500/30 peer-checked:ring-2 peer-checked:ring-blue-400"
                         htmlFor={value}
                       >
                         <span className="text-2xl mr-2">{emoji}</span>
                         <span className="text-gray-200">{value}</span>
                       </label>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
                 <h3 className="text-xl font-semibold text-purple-400 mb-4">Tones</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {tones.map(({ value, emoji }) => (
                     <div
                       key={value}
                       className="relative group"
                     >
                       <input
                         id={value}
                         type="radio"
                         name="tone"
                         value={value}
                         onChange={handleChange}
                         className="peer sr-only"
                       />
                       <label 
                         className="flex items-center justify-center p-4 bg-gray-700/50 rounded-lg cursor-pointer transition-all duration-200 hover:bg-purple-500/20 peer-checked:bg-purple-500/30 peer-checked:ring-2 peer-checked:ring-purple-400"
                         htmlFor={value}
                       >
                         <span className="text-2xl mr-2">{emoji}</span>
                         <span className="text-gray-200">{value}</span>
                       </label>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
                 <h3 className="text-xl font-semibold text-pink-400 mb-4">Types</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {types.map(({ value, emoji }) => (
                     <div
                       key={value}
                       className="relative group"
                     >
                       <input
                         id={value}
                         type="radio"
                         name="type"
                         value={value}
                         onChange={handleChange}
                         className="peer sr-only"
                       />
                       <label 
                         className="flex items-center justify-center p-4 bg-gray-700/50 rounded-lg cursor-pointer transition-all duration-200 hover:bg-pink-500/20 peer-checked:bg-pink-500/30 peer-checked:ring-2 peer-checked:ring-pink-400"
                         htmlFor={value}
                       >
                         <span className="text-2xl mr-2">{emoji}</span>
                         <span className="text-gray-200">{value}</span>
                       </label>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
                 <h3 className="text-xl font-semibold text-green-400 mb-4">Temperature</h3>
                 <div className="space-y-4">
                   <div className="flex items-center space-x-4">
                     <input
                       type="range"
                       min="0"
                       max="1"
                       step="0.1"
                       value={state.temperature || 0.7}
                       onChange={(e) => setState(prev => ({...prev, temperature: parseFloat(e.target.value)}))}
                       className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-400"
                     />
                     <span className="text-gray-200 font-mono">{state.temperature || 0.7}</span>
                   </div>
                   <p className="text-sm text-gray-400">
                     Higher values make jokes more random, while lower values make them more focused
                   </p>
                 </div>
               </div>

               <button
                 className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                 disabled={isLoading || !state.topic || !state.tone || !state.type || !state.temperature}
                 onClick={() =>
                   append({
                     role: "user",
                     content: `Generate a ${state.type} joke about ${state.topic} in a ${state.tone} tone with a temperature of ${state.temperature}`
                   })
                 }
               >
                 {isLoading ? 'Generating...' : 'Generate Joke'}
               </button>

               <div
                 hidden={
                   messages.length === 0 ||
                   messages[messages.length - 1]?.content.startsWith("Generate")
                 }
                 className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700"
               >
                 <div className="prose prose-invert max-w-none">
                   {messages[messages.length - 1]?.content}
                 </div>
               </div>
             </div>
           </div>
         </div>
       </main>
     );
   }