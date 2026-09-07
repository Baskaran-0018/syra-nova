import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Shield,
  MessageSquareWarning,
  UserCheck,
  Fingerprint,
  Video,
  Globe,
  Bot,
  GraduationCap,
  ShieldAlert,
  Settings as SettingsIcon,
  ChevronRight,
  KeyRound,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppView } from "../../types";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  description: string;
  view: AppView;
  icon: React.ElementType;
}

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setCurrentView } = useApp();
  const [query, setQuery] = useState("");

  const searchItems: SearchResult[] = [
    {
      id: "s0",
      title: "Password & Data Vault",
      category: "Privacy & Credentials",
      description: "Store Instagram, emails, banking passwords, notes, and login screenshots with AES-256 encryption",
      view: "vault",
      icon: KeyRound,
    },
    {
      id: "s1",
      title: "Scam Message Detector",
      category: "Tools",
      description: "Analyze SMS, WhatsApp chats, emails, and copied text using AI",
      view: "message-detector",
      icon: MessageSquareWarning,
    },
    {
      id: "s2",
      title: "Fake Profile Detector",
      category: "Tools",
      description: "Analyze suspicious Instagram, X, LinkedIn, or Facebook accounts",
      view: "profile-detector",
      icon: UserCheck,
    },
    {
      id: "s3",
      title: "Digital Identity Guardian",
      category: "Privacy",
      description: "Monitor data breaches, leaked passwords, and footprint exposure",
      view: "identity-guardian",
      icon: Fingerprint,
    },
    {
      id: "s4",
      title: "Deepfake & AI Voice Clone Detection",
      category: "AI Security",
      description: "Detect synthetic voices, manipulated video frames, and AI images",
      view: "deepfake-detection",
      icon: Video,
    },
    {
      id: "s5",
      title: "Browser Shield Protection",
      category: "Web Security",
      description: "Real-time phishing website blockers, shopping and banking protection",
      view: "browser-shield",
      icon: Globe,
    },
    {
      id: "s6",
      title: "Emergency SOS & Incident Recovery",
      category: "Emergency",
      description: "Immediate step-by-step guidance for bank fraud, hacks, and Cyber Helpline 1930",
      view: "emergency-sos",
      icon: ShieldAlert,
    },
    {
      id: "s7",
      title: "NOVA AI Cyber Assistant",
      category: "AI",
      description: "Ask questions, get incident checklists, and analyze files",
      view: "assistant",
      icon: Bot,
    },
    {
      id: "s8",
      title: "Cyber Learning Hub & Quizzes",
      category: "Education",
      description: "Interactive simulations, courses, certifications, and daily XP streak",
      view: "learning",
      icon: GraduationCap,
    },
    {
      id: "s9",
      title: "Settings & AI Preferences",
      category: "Preferences",
      description: "Manage 2FA, biometrics, language, AI protection toggles, and appearance",
      view: "settings",
      icon: SettingsIcon,
    },
  ];

  // Listen to Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? searchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  const handleSelect = (view: AppView) => {
    setCurrentView(view);
    setIsSearchOpen(false);
    setQuery("");
  };

  return (
    <div
      id="global-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Type a cyber threat, tool name, or security action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Shield className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium">No cyber security tools matching "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for "SMS", "phishing", "deepfake", "password", or "helpline"</p>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`search-result-${item.id}`}
                  onClick={() => handleSelect(item.view)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/20 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 transition-colors flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-slate-800 text-slate-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
