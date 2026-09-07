import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  User,
  KeyRound,
  Mail,
  Phone,
  Shield,
  Fingerprint,
  Activity,
  Laptop,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Globe,
  HelpCircle,
  Headphones,
  AlertTriangle,
  BookOpen,
  PhoneCall,
  Users,
  Lock,
  MessageSquare,
  Network,
  Star,
  FileText,
  Award,
  RefreshCw,
  LogOut,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Check,
  Smartphone,
  Eye,
  Sliders,
  Share2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SyraNovaLogo } from "../common/SyraNovaLogo";

export const SettingsPage: React.FC = () => {
  const {
    navigateBack,
    setIsNotificationOpen,
    user,
    setUser,
    settings,
    updateSettings,
    setIsLogoutModalOpen,
    setCurrentView,
    showToast,
  } = useApp();

  // Active sub-modals or drawers for specific account items
  const [activeModal, setActiveModal] = useState<
    "edit-profile" | "change-password" | "email-prefs" | "phone-number" | "login-activity" | "manage-devices" | "support-contact" | null
  >(null);

  // Edit Profile Form State
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);

  // Password State
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const languages = [
    { code: "en", name: "English (US)" },
    { code: "es", name: "Español" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語 (Japanese)" },
    { code: "zh", name: "中文 (Chinese)" },
    { code: "ar", name: "العربية (Arabic)" },
    { code: "pt", name: "Português" },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
    });
    showToast("Profile Updated", "Your account credentials have been saved.", "success");
    setActiveModal(null);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast("Password Mismatch", "New passwords do not match.", "error");
      return;
    }
    showToast("Password Changed", "Security credentials successfully updated.", "success");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setActiveModal(null);
  };

  const handleCheckUpdates = () => {
    showToast("Checking Updates", "SYRA NOVA AI core is at latest v1.0.0 (Quantum Threat Signatures up-to-date).", "info");
  };

  const handleFreezeAccount = () => {
    showToast("Emergency Freeze Initiated", "Temporary digital token lock activated across linked devices.", "warning");
  };

  return (
    <div id="settings-page" className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="settings-back-btn"
            onClick={navigateBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Manage your account, security, and app preferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <div
            onClick={() => setCurrentView("profile")}
            className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-500/30 cursor-pointer bg-slate-800"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 1: ACCOUNT */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Account
            </h3>
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden glass-panel divide-y divide-slate-800/80">
              {/* Edit Profile */}
              <button
                id="settings-edit-profile-btn"
                onClick={() => setActiveModal("edit-profile")}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-800/60 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Edit Profile
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Update your name ({user.name}), avatar, and role credentials
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </button>

              {/* Change Password */}
              <button
                id="settings-change-password-btn"
                onClick={() => setActiveModal("change-password")}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-800/60 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      Change Password
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Strengthen your master authentication passphrase
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </button>

              {/* Email Preferences */}
              <button
                id="settings-email-prefs-btn"
                onClick={() => setActiveModal("email-prefs")}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-800/60 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      Email Preferences
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user.email} • Breach digests and alert frequency
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </button>

              {/* Phone Number */}
              <button
                id="settings-phone-number-btn"
                onClick={() => setActiveModal("phone-number")}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-800/60 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Phone Number
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user.phone} • Used for SMS 2FA and Emergency SOS
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </button>
            </div>
          </div>

          {/* SECTION 2: PRIVACY & SECURITY */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Privacy & Security
            </h3>
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden glass-panel divide-y divide-slate-800/80">
              {/* Two-Factor Authentication (Toggle) */}
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Require OTP code from authenticator app or SMS on every new login
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => {
                      updateSettings({ twoFactorAuth: e.target.checked });
                      showToast("Security Setting", `2FA ${e.target.checked ? "Enabled" : "Disabled"}`, "info");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
                </label>
              </div>

              {/* Fingerprint / Face ID Login (Toggle) */}
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Fingerprint / Face ID Login</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Fast biometrics unlock for instant security verification
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.biometricsLogin}
                    onChange={(e) => {
                      updateSettings({ biometricsLogin: e.target.checked });
                      showToast("Biometrics Setting", `Biometrics ${e.target.checked ? "Enabled" : "Disabled"}`, "info");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500 shadow-inner"></div>
                </label>
              </div>

              {/* Login Activity */}
              <button
                id="settings-login-activity-btn"
                onClick={() => setActiveModal("login-activity")}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-800/60 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      Login Activity
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Review recent sessions, IP addresses, and geolocation logs
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </button>

              {/* Manage Devices */}
              <button
                id="settings-manage-devices-btn"
                onClick={() => setActiveModal("manage-devices")}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-800/60 transition-colors text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      Manage Devices
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      3 active devices authorized on this account
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </button>
            </div>
          </div>

          {/* SECTION 3: AI PROTECTION (HIGHLIGHTED PREMIUM CARD WITH SHIELD ILLUSTRATION) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-1 font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Neural Protection Engine
            </h3>

            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] glass-panel overflow-hidden">
              {/* Background Shield Vector / Glow */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-6 right-6 opacity-15 hidden sm:block pointer-events-none">
                <Shield className="w-36 h-36 text-cyan-400" />
              </div>

              {/* Card Banner Header */}
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] flex-shrink-0">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif]">
                      Autonomous AI Shield
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase tracking-wider">
                      Active AI Core
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                    Real-time neural heuristics automatically inspect messages, URLs, phone numbers, fake accounts, and synthetic voices.
                  </p>
                </div>
              </div>

              {/* Toggles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {[
                  {
                    id: "autoScanMessages",
                    label: "Auto Scan Messages",
                    desc: "Analyze incoming SMS and chat alerts for scam triggers",
                    checked: settings.autoScanMessages,
                  },
                  {
                    id: "autoScanLinks",
                    label: "Auto Scan Links",
                    desc: "Real-time DNS & zero-day phishing link blocker",
                    checked: settings.autoScanLinks,
                  },
                  {
                    id: "fakeProfileDetection",
                    label: "Fake Profile Detection",
                    desc: "Flag impersonators and bot accounts across social apps",
                    checked: settings.fakeProfileDetection,
                  },
                  {
                    id: "deepfakeDetection",
                    label: "Deepfake Detection",
                    desc: "Examine video media for GAN facial manipulation",
                    checked: settings.deepfakeDetection,
                  },
                  {
                    id: "aiVoiceScamDetection",
                    label: "AI Voice Scam Detection",
                    desc: "Identify synthesized voice clones on phone calls",
                    checked: settings.aiVoiceScamDetection,
                  },
                  {
                    id: "automaticThreatAlerts",
                    label: "Automatic Threat Alerts",
                    desc: "Instant high-priority alerts during active attacks",
                    checked: settings.automaticThreatAlerts,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center justify-between gap-3 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white">{item.label}</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => {
                          updateSettings({ [item.id]: e.target.checked });
                          showToast("AI Protection Updated", `${item.label} ${e.target.checked ? "Enabled" : "Disabled"}`, "info");
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-400"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: NOTIFICATIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Notifications
            </h3>
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden glass-panel divide-y divide-slate-800/80">
              {[
                { key: "scamDetectionAlerts", label: "Scam Detection Alerts", desc: "Instant push notice when high-risk text or file is flagged" },
                { key: "aiSecurityAlerts", label: "AI Security Alerts", desc: "Predictive threat forecasts from community cyber intelligence" },
                { key: "securityUpdates", label: "Security Updates", desc: "New zero-day patch alerts and CVE advisory notices" },
                { key: "pushNotifications", label: "Push Notifications", desc: "Operating system mobile & desktop push messages" },
                { key: "emailNotifications", label: "Email Notifications", desc: "Weekly identity security digest and critical account alerts" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 sm:p-5">
                  <div className="min-w-0 pr-4">
                    <h4 className="text-sm font-bold text-white">{item.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={(settings.notifications as any)[item.key]}
                      onChange={(e) => {
                        updateSettings({
                          notifications: {
                            ...settings.notifications,
                            [item.key]: e.target.checked,
                          },
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: APPEARANCE & THEME */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Appearance
            </h3>
            <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800 rounded-3xl glass-panel space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "dark" as const, label: "Dark Mode", icon: Moon },
                  { id: "light" as const, label: "Light Mode", icon: Sun },
                  { id: "system" as const, label: "System Default", icon: Monitor },
                ].map((themeOpt) => {
                  const Icon = themeOpt.icon;
                  const isSelected = settings.theme === themeOpt.id;
                  return (
                    <button
                      key={themeOpt.id}
                      type="button"
                      onClick={() => {
                        updateSettings({ theme: themeOpt.id });
                        showToast("Theme Changed", `Applied ${themeOpt.label}`, "info");
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-2" />
                      <span className="text-xs font-bold">{themeOpt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 6: LANGUAGE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Language
            </h3>
            <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800 rounded-3xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Interface & AI Response Language</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Select preferred language for scanner reports</p>
                </div>
              </div>

              <select
                value={settings.language}
                onChange={(e) => {
                  updateSettings({ language: e.target.value });
                  showToast("Language Updated", `Set interface language to ${e.target.value}`, "success");
                }}
                className="bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-cyan-400 transition-colors"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Support, Emergency, Legal, About & Logout (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* EMERGENCY SECTION */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-red-950/40 to-slate-900 border border-red-500/30 glass-panel space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <h4 className="text-sm font-black uppercase tracking-wider font-heading">
                Emergency Fraud SOS
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If you suspect active banking fraud or unauthorized money withdrawal:
            </p>

            <div className="space-y-2">
              <a
                href="tel:1930"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-white hover:bg-red-600/30 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="text-xs font-bold">Cyber Helpline 1930</p>
                    <p className="text-[10px] text-red-300">National Financial Fraud Line</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <button
                type="button"
                onClick={handleFreezeAccount}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-900 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Instant Account Freeze</span>
              </button>
            </div>
          </div>

          {/* HELP & SUPPORT */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Help & Support
            </h4>
            <div className="space-y-1">
              {[
                { title: "Help Center & FAQs", icon: HelpCircle, view: "learning" as const },
                { title: "Contact 24/7 Support", icon: Headphones, modal: "support-contact" as const },
                { title: "Report a New Scam Vector", icon: AlertTriangle, view: "community" as const },
                { title: "Security Guidelines", icon: BookOpen, view: "learning" as const },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (item.view) setCurrentView(item.view);
                      if (item.modal) setActiveModal(item.modal);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* FEEDBACK & COMMUNITY */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Feedback & Community
            </h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => showToast("Feedback Received", "Thank you for helping improve SYRA NOVA!", "success")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">Send Feedback</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView("community")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Network className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">Join Threat Intel Network</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => showToast("5 Stars!", "Thank you for rating SYRA NOVA!", "success")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">Rate the App</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>

          {/* LEGAL & COMPLIANCE */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Legal & Compliance
            </h4>
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => showToast("Privacy Policy", "SYRA NOVA operates with strict zero-knowledge encryption.", "info")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Privacy Policy
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => showToast("Terms of Service", "Enterprise and consumer security terms apply.", "info")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Terms of Service
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => showToast("Certifications", "ISO/IEC 27001 & SOC 2 Type II Certified Architecture.", "success")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Certifications (SOC2, ISO27001)
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* ABOUT SYRA NOVA */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel text-center space-y-3">
            <div className="flex justify-center">
              <SyraNovaLogo size="md" showSubtitle={false} />
            </div>

            <p className="text-xs text-slate-300">
              AI-Powered Cyber Security & Digital Identity Protection
            </p>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Build 2026.08</span>
            </div>

            <button
              id="check-updates-btn"
              type="button"
              onClick={handleCheckUpdates}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check for Updates</span>
            </button>
          </div>

          {/* LOGOUT BUTTON */}
          <div className="pt-2">
            <button
              id="settings-logout-btn"
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/10 transition-all group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {activeModal === "edit-profile" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white mb-1 font-heading">Edit Profile</h3>
            <p className="text-xs text-slate-400 mb-4">Modify your personal contact and identity details</p>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {activeModal === "change-password" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white mb-1 font-heading">Change Password</h3>
            <p className="text-xs text-slate-400 mb-4">Create a strong, unique alphanumeric passphrase</p>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md shadow-purple-500/20"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGIN ACTIVITY MODAL */}
      {activeModal === "login-activity" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Recent Login Sessions</h3>
                <p className="text-xs text-slate-400">Track device telemetry and IP locations</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {[
                { device: "Chrome / macOS Sequoia (Current Device)", ip: "49.207.194.88", location: "Chennai, India", time: "Active Now", status: "Current" },
                { device: "SYRA NOVA Mobile App / iOS 18", ip: "152.58.12.90", location: "Bangalore, India", time: "Yesterday, 18:42", status: "Verified" },
                { device: "Firefox / Ubuntu Linux", ip: "103.211.54.12", location: "Singapore (VPN)", time: "3 days ago", status: "Verified" },
              ].map((sess, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{sess.device}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sess.ip} • {sess.location}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    {sess.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MANAGE DEVICES MODAL */}
      {activeModal === "manage-devices" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Authorized Hardware</h3>
                <p className="text-xs text-slate-400">Revoke sessions from lost or unfamiliar devices</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "Apple MacBook Pro 16\"", type: "Laptop", lastActive: "Just now", icon: Laptop },
                { name: "iPhone 16 Pro Max", type: "Smartphone", lastActive: "2 hours ago", icon: Smartphone },
                { name: "iPad Air 5th Gen", type: "Tablet", lastActive: "4 days ago", icon: Laptop },
              ].map((dev, idx) => {
                const Icon = dev.icon;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{dev.name}</p>
                        <p className="text-[10px] text-slate-400">{dev.type} • {dev.lastActive}</p>
                      </div>
                    </div>
                    {idx > 0 && (
                      <button
                        onClick={() => showToast("Device Revoked", `De-authorized ${dev.name}`, "info")}
                        className="text-[10px] text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded bg-red-500/10 border border-red-500/20"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
