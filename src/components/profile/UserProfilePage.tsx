import React from "react";
import { User, ArrowLeft, Bell, Shield, Award, Mail, Phone, Calendar, KeyRound, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const UserProfilePage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, user, setCurrentView } = useApp();

  return (
    <div id="user-profile-page" className="space-y-6 animate-in fade-in duration-200 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={navigateBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              User Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Digital identity tier, security badges, and account metadata.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex-shrink-0 bg-slate-800">
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-xl font-black text-white font-heading">{user.name}</h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
              {user.role}
            </span>
          </div>

          <p className="text-xs text-slate-400">{user.email} • {user.phone}</p>
          <div className="flex items-center gap-3 pt-2 justify-center sm:justify-start text-xs text-slate-300">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-cyan-400" /> Plan: {user.plan}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-400" /> Member: {user.memberSince}</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentView("settings")}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
        >
          Manage in Settings
        </button>
      </div>
    </div>
  );
};
