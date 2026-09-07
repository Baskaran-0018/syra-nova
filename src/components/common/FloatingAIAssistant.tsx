import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const FloatingAIAssistant: React.FC = () => {
  const { isFloatingAIAssistantOpen, setIsFloatingAIAssistantOpen, settings, setCurrentView } = useApp();
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string; time: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I'm **NOVA AI**, your intelligent cybersecurity guardian.\n\nAsk me anything about suspicious messages, fake accounts, UPI fraud, password health, or account recovery.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Scan a suspicious WhatsApp SMS",
    "How to recover a hacked Instagram account?",
    "Check if this email is a bank scam",
    "What to do after UPI / Cyber fraud?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      role: "user" as const,
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          language: settings.language,
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I am analyzing cyber security parameters. Please verify unfamiliar links before opening.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm currently running in offline secure mode. For urgent fraud recovery, immediately call **1930** (Cyber Crime Helpline) and freeze your digital banking access.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate speech recognition
      setTimeout(() => {
        setIsRecording(false);
        setInput("Is it safe to share an OTP if the caller claims to be from electricity department?");
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (when closed) */}
      {!isFloatingAIAssistantOpen && (
        <button
          id="floating-ai-assistant-btn"
          onClick={() => setIsFloatingAIAssistantOpen(true)}
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-[0_4px_25px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_35px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all group flex items-center gap-2 border border-cyan-300/40"
          aria-label="Open NOVA AI Cyber Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="hidden md:inline font-bold text-xs tracking-wide">NOVA AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isFloatingAIAssistantOpen && (
        <div
          id="floating-ai-assistant-window"
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[85vh] bg-slate-950/95 border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden glass-panel animate-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <Bot className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white font-heading">NOVA AI Cyber Core</h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Trained on real-time threat intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setCurrentView("assistant");
                  setIsFloatingAIAssistantOpen(false);
                }}
                className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg hover:bg-slate-800/80 transition-colors"
              >
                Expand View
              </button>
              <button
                onClick={() => setIsFloatingAIAssistantOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="flex-shrink-0 text-[10px] text-slate-300 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m, idx) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${isAssistant ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isAssistant
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`relative max-w-[82%] group`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-md"
                          : "bg-gradient-to-tr from-cyan-600 to-cyan-500 text-slate-950 font-medium rounded-tr-sm shadow-lg shadow-cyan-600/20"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1 px-1 text-[9px] text-slate-500">
                      <span>{m.time}</span>
                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(m.content, idx)}
                          className="opacity-0 group-hover:opacity-100 hover:text-cyan-300 transition-opacity flex items-center gap-0.5"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>NOVA AI is evaluating threat vectors...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-xl transition-all ${
                isRecording
                  ? "bg-red-500/20 text-red-400 border border-red-500 animate-pulse"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
              title="Voice input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={isRecording ? "Listening to your voice..." : "Ask NOVA AI or paste suspicious text..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs rounded-xl px-3 py-2 outline-none focus:border-cyan-500/50 transition-colors"
            />

            <button
              id="floating-ai-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 transition-all shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
