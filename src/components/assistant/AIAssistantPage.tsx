import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  ArrowLeft,
  Bell,
  RefreshCw,
  Copy,
  Check,
  User,
  Shield,
  Lightbulb,
  FileCheck,
  PhoneCall,
  Lock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AIAssistantPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, settings, user } = useApp();
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string; time: string }>>([
    {
      role: "assistant",
      content:
        "Welcome to **NOVA AI Cyber Intelligence Core**.\n\nI am your dedicated cybersecurity analyst. You can paste suspicious messages, ask about fraud techniques, request incident recovery checklists, or verify digital security best practices.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      role: "user" as const,
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
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
          content: data.reply || "Security audit complete. Ensure MFA is activated on all primary gateways.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Operating in emergency fallback mode. If you are experiencing bank fraud, dial **1930** immediately.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div id="ai-assistant-page" className="flex flex-col h-[calc(100vh-6rem)] max-h-[850px] animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={navigateBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              NOVA AI Cyber Assistant
            </h1>
            <p className="text-xs text-slate-400">Intelligent conversational security analyst</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold font-mono">
            GEMINI 3.7 FLASH CORE
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 my-2">
        {messages.map((m, idx) => {
          const isAI = m.role === "assistant";
          return (
            <div key={idx} className={`flex items-start gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isAI
                    ? "bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : "bg-purple-600 text-white"
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className="max-w-2xl group">
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? "bg-slate-900/95 text-slate-200 border border-slate-800 rounded-tl-sm shadow-xl"
                      : "bg-cyan-500 text-slate-950 font-medium rounded-tr-sm shadow-lg shadow-cyan-500/20"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1 px-2 text-[10px] text-slate-500">
                  <span>{m.time}</span>
                  {isAI && (
                    <button
                      onClick={() => handleCopy(m.content, idx)}
                      className="opacity-0 group-hover:opacity-100 hover:text-cyan-300 transition-opacity flex items-center gap-1"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIdx === idx ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse p-3 bg-slate-900/60 rounded-2xl w-max">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>NOVA AI is evaluating cyber threat vectors...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar flex-shrink-0">
        {[
          "How to verify if a job offer on WhatsApp is legit?",
          "Check if an electricity disconnection SMS is fake",
          "What should I do if my bank account was debited via UPI?",
          "How does SIM swap fraud work?",
        ].map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="flex-shrink-0 text-xs text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl glass-panel flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Ask NOVA AI about cyber threats, suspicious links, or recovery procedures..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className="flex-1 bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm outline-none px-2 font-medium"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
