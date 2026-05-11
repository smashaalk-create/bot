/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Sparkles, 
  User, 
  Compass, 
  MessageSquare, 
  RotateCcw, 
  ThumbsUp, 
  Copy,
  ChevronDown,
  Terminal,
  Zap,
  BookOpen
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sendMessageStream, type ChatMessage } from "./services/geminiService";
import { cn } from "./lib/utils";

const STARTER_PROMPTS = [
  {
    icon: <Zap className="w-4 h-4" />,
    label: "Explain Quantum Physics",
    text: "Can you explain Quantum Physics to me like I'm five? Use a simple analogy."
  },
  {
    icon: <Terminal className="w-4 h-4" />,
    label: "Debug some code",
    text: "I have a React bug where my state isn't updating correctly. Can you help me troubleshoot it?"
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Study plan for Python",
    text: "Create a 30-day study plan to learn Python from scratch. Make it easy to follow."
  }
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleSubmit = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text: messageText }]
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);
    setCurrentResponse("");

    try {
      const stream = sendMessageStream(newHistory);
      let fullResponse = "";
      for await (const chunk of stream) {
        fullResponse += chunk;
        setCurrentResponse(fullResponse);
      }

      setMessages(prev => [
        ...prev,
        { role: "model", parts: [{ text: fullResponse }] }
      ]);
      setCurrentResponse("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [
        ...prev,
        { role: "model", parts: [{ text: "I'm sorry, I encountered an error. Please check your connectivity and try again." }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentResponse("");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans antialiased">
      {/* App Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center rounded-sm">
            <div className="w-4 h-4 bg-white transform rotate-45"></div>
          </div>
          <span className="font-black tracking-tighter text-xl uppercase">UNIVERSAL_GUIDE v1.0</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM OPTIMIZED
          </div>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-slate-800 transition-all active:scale-95"
          >
            Clear Buffer
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-1 overflow-hidden relative">
        
        {/* Configuration Panel (Geometric & Structured) */}
        <aside className="hidden lg:flex w-[420px] bg-white border-r border-slate-200 flex-col overflow-hidden shrink-0">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Architecture</h2>
            <p className="text-xs text-slate-400 font-medium tracking-tight">System configuration & operational logic.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Identity Kernel</label>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm font-mono text-[11px] text-slate-600 leading-relaxed border-l-4 border-l-indigo-600">
                Highly advanced AI assistant designed to solve complex problems with 100% accuracy and extreme clarity.
              </div>
            </section>

            <section>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Directives</label>
              <div className="space-y-2">
                {[
                  { id: "01", label: "Extreme Functionality" },
                  { id: "02", label: "Simplicity First (ELI5)" },
                  { id: "03", label: "Zero-Jargon Protocol", active: true }
                ].map((item) => (
                  <div 
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-2 border rounded-sm transition-colors",
                      item.active ? "border-indigo-200 bg-indigo-50/50" : "border-slate-100 bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 flex items-center justify-center text-[10px] font-black",
                      item.active ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
                    )}>{item.id}</div>
                    <span className={cn(
                      "text-[11px] font-bold uppercase tracking-wider",
                      item.active ? "text-indigo-900" : "text-slate-700"
                    )}>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tone Matrix</label>
              <div className="grid grid-cols-2 gap-2">
                {["CONFIDENT", "EMPATHETIC", "WITTY", "DIRECT"].map((tone, i) => (
                  <div 
                    key={tone}
                    className={cn(
                      "py-2 px-3 border text-center text-[10px] font-black rounded-sm transition-all tracking-widest",
                      i % 2 === 0 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-200"
                    )}
                  >
                    {tone}
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-4 border-t border-slate-100">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Quick Load Patterns</label>
              <div className="space-y-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button 
                    key={prompt.label}
                    onClick={() => handleSubmit(undefined, prompt.text)}
                    className="w-full group p-3 bg-white border border-slate-100 rounded-sm hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left flex items-center gap-3"
                  >
                    <div className="p-1.5 bg-slate-50 rounded-sm text-slate-400 group-hover:bg-white group-hover:text-indigo-600">
                      {prompt.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-indigo-900">{prompt.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-widest">Memory Link</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black tracking-widest rounded-full uppercase">VOLATILE</span>
            </div>
          </div>
        </aside>

        {/* Interaction Preview */}
        <section className="flex-1 flex flex-col bg-slate-100 relative">
          <div className="flex-1 overflow-y-auto px-6 py-12">
            <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-32">
              <AnimatePresence mode="popLayout">
                {messages.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-[50vh] text-center"
                  >
                    <div className="w-16 h-16 bg-white border border-slate-200 flex items-center justify-center rounded-sm rotate-45 mb-10 shadow-sm">
                      <div className="transform -rotate-45">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                      Protocol Init Complete.
                    </h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] max-w-xs leading-loose">
                      The Guide is ready. Bridge the gap between complexity and clarity.
                    </p>
                  </motion.div>
                )}

                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex flex-col",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "text-[9px] font-black uppercase tracking-[0.2em] mb-2 px-1",
                      msg.role === "user" ? "text-slate-400" : "text-slate-900"
                    )}>
                      {msg.role === "user" ? "User Uplink" : "Guide Response"}
                    </div>
                    <div className={cn(
                      "max-w-[90%] p-6 rounded-lg text-sm transition-all shadow-sm border",
                      msg.role === "user" 
                        ? "bg-white border-slate-200 text-slate-700" 
                        : "bg-indigo-600 border-indigo-700 text-white shadow-xl shadow-indigo-100/50"
                    )}>
                      <div className={cn(
                        "markdown-body",
                        msg.role === "model" && "text-white prose-invert"
                      )}>
                        <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {currentResponse && (
                  <motion.div
                    key="streaming"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
                      <div className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">Processing Stream...</div>
                    </div>
                    <div className="max-w-[90%] bg-indigo-600 text-white p-6 rounded-lg shadow-xl shadow-indigo-100/50 border border-indigo-700 text-sm overflow-hidden">
                      <div className="markdown-body">
                        <ReactMarkdown>{currentResponse}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isLoading && !currentResponse && (
                  <div className="flex flex-col items-start gap-4">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural Pathing...</div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1 h-1 bg-slate-300 rounded-full" />
                      ))}
                    </div>
                  </div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Bar */}
          <div className="h-28 bg-white border-t border-slate-200 p-6 z-10">
            <div className="max-w-2xl mx-auto">
              <form 
                onSubmit={handleSubmit}
                className="flex gap-3 h-12"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a logic query or problem to solve..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-sm px-4 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-slate-700 placeholder:text-slate-300 italic"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-sm transition-all",
                    input.trim() && !isLoading
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  )}
                >
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-current ml-1"></div>
                </button>
              </form>
              <div className="flex justify-center mt-3">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural Interface v1.0 • Ready</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
