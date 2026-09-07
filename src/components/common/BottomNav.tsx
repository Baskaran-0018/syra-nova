import React from "react";
import {
  LayoutDashboard,
  Shield,
  Bot,
  ShieldAlert,
  Settings as SettingsIcon,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppView } from "../../types";

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const items = [
    { id: "dashboard" as AppView, label: "Home", icon: LayoutDashboard },
    { id: "scam-shield" as AppView, label: "Scam Shield", icon: Shield },
    { id: "emergency-sos" as AppView, label: "Emergency", icon: ShieldAlert, isSpecial: true },
    { id: "assistant" as AppView, label: "NOVA AI", icon: Bot },
    { id: "settings" as AppView, label: "Settings", icon: SettingsIcon },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-2xl lg:hidden safe-area-pb"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                id="bottom-nav-sos-btn"
                onClick={() => setCurrentView(item.id)}
                className="relative -top-3 flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-[0_4px_16px_rgba(239,68,68,0.5)] active:scale-95 transition-transform border border-red-400/40"
                aria-label="Emergency SOS"
              >
                <Icon className="w-6 h-6 animate-pulse" />
                <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">SOS</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
                isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400 scale-110" : "text-slate-400"} transition-all`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#06B6D4]" />
                )}
              </div>
              <span className="text-[10px] font-medium mt-1 truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
