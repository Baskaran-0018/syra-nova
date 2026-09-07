import React, { useState } from "react";
import {
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  ShieldAlert,
  Menu,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut,
  ArrowLeft,
  Activity,
  FileText,
  HelpCircle,
  History as HistoryIcon,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SyraNovaLogo } from "./SyraNovaLogo";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentView,
    setCurrentView,
    navigateBack,
    previousView,
    user,
    settings,
    updateSetting,
    unreadAlertsCount,
    setIsSearchOpen,
    setIsNotificationOpen,
    setIsFloatingAIAssistantOpen,
    setIsLogoutModalOpen,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleTheme = () => {
    updateSetting("theme", settings.theme === "dark" ? "light" : "dark");
  };

  const isHome = currentView === "dashboard";

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-colors"
    >
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-3">
        {/* Left Side: Sidebar toggle + Logo or Back Button */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              id="sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {!isHome && previousView && (
            <button
              id="header-back-btn"
              onClick={navigateBack}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/60 text-xs sm:text-sm font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <div onClick={() => setCurrentView("dashboard")} className="cursor-pointer">
            <SyraNovaLogo size="sm" showSubtitle={false} />
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <button
            id="global-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:border-cyan-500/40 hover:text-slate-300 transition-all text-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search threats, tools, scam history, help...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Icon */}
          <button
            id="mobile-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800/60 transition-colors"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Emergency SOS Quick Trigger */}
          <button
            id="quick-sos-btn"
            onClick={() => setCurrentView("emergency-sos")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/15 border border-red-500/40 text-red-400 hover:bg-red-600/25 hover:border-red-500 font-semibold text-xs transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
          >
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* AI Cyber Assistant Trigger */}
          <button
            id="ai-assistant-header-btn"
            onClick={() => setIsFloatingAIAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-medium text-xs transition-all"
            title="Open NOVA AI Cyber Assistant"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="hidden sm:inline">NOVA AI</span>
          </button>

          {/* Search & Threat History Button */}
          <button
            id="header-history-btn"
            onClick={() => setCurrentView("history")}
            className={`p-2 rounded-xl transition-colors ${
              currentView === "history"
                ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
            title="Search & Scan History"
            aria-label="View search & scan history"
          >
            <HistoryIcon className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <button
            id="header-notification-btn"
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="View security notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-[0_0_6px_rgba(239,68,68,0.6)]">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            id="header-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle theme"
          >
            {settings.theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-purple-400" />
            )}
          </button>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              id="header-user-avatar-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-800">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to placeholder avatar
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-cyan-900/60 text-cyan-200 text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-2 z-50 glass-panel animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {user.plan}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Protected
                      </span>
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setCurrentView("profile");
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>User Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView("settings");
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4 text-purple-400" />
                      <span>Settings & Preferences</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView("history");
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <HistoryIcon className="w-4 h-4 text-cyan-400" />
                      <span>Search & Scan History</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView("reports");
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Security Reports</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView("learning");
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span>Cyber Learning Hub</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView("login");
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Switch Account / Sign In</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
