import React from "react";
import {
  LayoutDashboard,
  Shield,
  MessageSquareWarning,
  UserCheck,
  Fingerprint,
  Video,
  Globe,
  Bot,
  Users,
  GraduationCap,
  LifeBuoy,
  Building2,
  Landmark,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  FileCheck,
  User,
  ChevronRight,
  ShieldAlert,
  History as HistoryIcon,
  KeyRound,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppView } from "../../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, setIsLogoutModalOpen, unreadAlertsCount } = useApp();

  const navItems: NavItem[] = [
    // Core
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Core Protection" },
    { id: "vault", label: "Password & Data Vault", icon: KeyRound, badge: "Vault", badgeColor: "bg-purple-500/20 text-purple-300", category: "Core Protection" },
    { id: "history", label: "Search & Scan History", icon: HistoryIcon, badge: "Live", badgeColor: "bg-cyan-500/20 text-cyan-300", category: "Core Protection" },
    { id: "scam-shield", label: "Scam Shield AI", icon: Shield, category: "Core Protection" },
    { id: "message-detector", label: "Scam Message Detector", icon: MessageSquareWarning, category: "Core Protection" },
    { id: "profile-detector", label: "Fake Profile Detector", icon: UserCheck, category: "Core Protection" },
    { id: "identity-guardian", label: "Digital Identity Guardian", icon: Fingerprint, category: "Core Protection" },
    { id: "deepfake-detection", label: "Deepfake & Voice AI", icon: Video, category: "Advanced AI" },
    { id: "browser-shield", label: "Browser Shield", icon: Globe, category: "Advanced AI" },
    { id: "assistant", label: "AI Cyber Assistant", icon: Bot, badge: "AI", badgeColor: "bg-cyan-500/20 text-cyan-300", category: "Advanced AI" },

    // Community & Learning
    { id: "community", label: "Threat Intelligence", icon: Users, category: "Ecosystem" },
    { id: "learning", label: "Learning Hub", icon: GraduationCap, badge: "XP", badgeColor: "bg-amber-500/20 text-amber-300", category: "Ecosystem" },
    { id: "emergency-sos", label: "Emergency SOS", icon: ShieldAlert, badge: "SOS", badgeColor: "bg-red-500/20 text-red-400", category: "Ecosystem" },

    // Portals
    { id: "enterprise", label: "Enterprise Center", icon: Building2, category: "Organization & Gov" },
    { id: "government", label: "Gov Cyber Intelligence", icon: Landmark, category: "Organization & Gov" },

    // Management
    { id: "reports", label: "Security Reports", icon: FileCheck, category: "Account" },
    { id: "profile", label: "User Profile", icon: User, category: "Account" },
    { id: "settings", label: "Settings", icon: SettingsIcon, category: "Account" },
    { id: "login", label: "Login & Auth Portal", icon: LogIn, category: "Account" },
  ];

  const handleNavClick = (id: AppView) => {
    setCurrentView(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Group items by category
  const categories = Array.from(new Set(navItems.map((item) => item.category)));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-heading">
                {category}
              </p>
              <div className="space-y-0.5 mt-1.5">
                {navItems
                  .filter((item) => item.category === category)
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`sidebar-nav-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/15 via-purple-500/10 to-transparent text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-400"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                                item.badgeColor || "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section with Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <button
            id="sidebar-logout-btn"
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all group"
          >
            <LogOut className="w-4 h-4 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
