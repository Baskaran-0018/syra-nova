import React, { useState, useEffect } from "react";
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
  EyeOff,
  Sliders,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SyraNovaLogo } from "../common/SyraNovaLogo";
import { SettingsState } from "../../types";

export const SettingsPage: React.FC = () => {
  const {
    navigateBack,
    setIsNotificationOpen,
    user,
    setUser,
    settings,
    updateSetting,
    updateSettings,
    setIsLogoutModalOpen,
    setCurrentView,
    showToast,
  } = useApp();

  // Active sub-modals for specific account and security actions
  const [activeModal, setActiveModal] = useState<
    | "edit-profile"
    | "change-password"
    | "email-prefs"
    | "phone-number"
    | "login-activity"
    | "manage-devices"
    | "support-contact"
    | null
  >(null);

  // Edit Profile Form State
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileAvatar, setProfileAvatar] = useState(user.avatarUrl);
  const [profileRole, setProfileRole] = useState(user.role);

  // Sync state whenever user changes
  useEffect(() => {
    setProfileName(user.name);
    setProfileEmail(user.email);
    setProfilePhone(user.phone);
    setProfileAvatar(user.avatarUrl);
    setProfileRole(user.role);
  }, [user]);

  // Password State
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Email Preferences State
  const [emailFrequency, setEmailFrequency] = useState<"instant" | "daily" | "weekly">("daily");
  const [emailBreachAlerts, setEmailBreachAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  // Phone Preferences State
  const [phone2FA, setPhone2FA] = useState(true);
  const [phoneSosAlerts, setPhoneSosAlerts] = useState(true);

  // Support Ticket Form State
  const [ticketCategory, setTicketCategory] = useState("Fraud / Scam Incident");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketSeverity, setTicketSeverity] = useState("High");

  // Sessions state
  const [sessions, setSessions] = useState([
    { id: "sess-1", device: "Chrome / Windows 11 (Current Device)", ip: "110.224.90.171", location: "Chennai, India", time: "Active Now", isCurrent: true },
    { id: "sess-2", device: "SYRA NOVA Mobile App / iOS 18", ip: "152.58.12.90", location: "Bangalore, India", time: "Yesterday, 18:42", isCurrent: false },
    { id: "sess-3", device: "Firefox / Ubuntu Linux", ip: "103.211.54.12", location: "Singapore (Cloud VPN)", time: "3 days ago", isCurrent: false },
  ]);

  // Devices state
  const [devices, setDevices] = useState([
    { id: "dev-1", name: "Windows Workstation (Current)", type: "Laptop", lastActive: "Just now", icon: Laptop, isCurrent: true },
    { id: "dev-2", name: "Apple iPhone 16 Pro", type: "Smartphone", lastActive: "2 hours ago", icon: Smartphone, isCurrent: false },
    { id: "dev-3", name: "iPad Pro 12.9\"", type: "Tablet", lastActive: "4 days ago", icon: Laptop, isCurrent: false },
  ]);

  const languages: { code: SettingsState["language"]; name: string; native: string }[] = [
    { code: "English", name: "English (US)", native: "English" },
    { code: "Tamil", name: "Tamil", native: "தமிழ்" },
    { code: "Hindi", name: "Hindi", native: "हिन्दी" },
    { code: "Telugu", name: "Telugu", native: "తెలుగు" },
    { code: "Kannada", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "Malayalam", name: "Malayalam", native: "മലയാളം" },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: profileName.trim() || user.name,
      email: profileEmail.trim() || user.email,
      phone: profilePhone.trim() || user.phone,
      avatarUrl: profileAvatar.trim() || user.avatarUrl,
      role: profileRole,
    };
    setUser(updatedUser);
    showToast("Profile Updated", "Your account credentials and details have been saved.", "success");
    setActiveModal(null);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass) {
      showToast("Current Password Required", "Please enter your current password.", "warning");
      return;
    }
    if (newPass.length < 8) {
      showToast("Password Too Weak", "New password must be at least 8 characters long.", "error");
      return;
    }
    if (newPass !== confirmPass) {
      showToast("Password Mismatch", "New password and confirmation do not match.", "error");
      return;
    }
    showToast("Password Changed", "Security master credentials successfully updated.", "success");
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setActiveModal(null);
  };

  const handleSaveEmailPrefs = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Email Preferences Saved", `Digest frequency set to ${emailFrequency.toUpperCase()}`, "success");
    setActiveModal(null);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, phone: profilePhone });
    showToast("Phone Verified", "Emergency contact and 2FA number updated.", "success");
    setActiveModal(null);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) {
      showToast("Missing Fields", "Please provide a subject and description.", "warning");
      return;
    }
    showToast("Support Ticket Dispatched", `Ticket #${Math.floor(100000 + Math.random() * 900000)} created with priority ${ticketSeverity}.`, "success");
    setTicketSubject("");
    setTicketDesc("");
    setActiveModal(null);
  };

  const handleTerminateSession = (id: string, name: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session Terminated", `Logged out from ${name}`, "info");
  };

  const handleRevokeDevice = (id: string, name: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    showToast("Device Revoked", `Hardware token invalidated for ${name}`, "warning");
  };

  const handleCheckUpdates = () => {
    showToast("Checking AI Signatures", "SYRA NOVA AI Cyber Core v1.0.0 is up to date (Zero-day threat heuristics verified).", "success");
  };

  const handleFreezeAccount = () => {
    showToast("Emergency Freeze Initiated", "Digital authorization tokens temporarily paused. Call 1930 for banking recovery.", "error");
  };

  // Safe notification toggles list mapping directly to flat keys on SettingsState
  const notificationItems = [
    {
      key: "scamAlerts" as const,
      label: "Scam Detection Alerts",
      desc: "Instant notice when suspicious SMS, WhatsApp, or phishing message is analyzed",
      checked: settings.scamAlerts ?? true,
    },
    {
      key: "aiSecurityAlerts" as const,
      label: "AI Security Intelligence Alerts",
      desc: "Predictive threat warnings from live threat intelligence",
      checked: settings.aiSecurityAlerts ?? true,
    },
    {
      key: "securityUpdates" as const,
      label: "Security & Signature Updates",
      desc: "Zero-day vulnerability advisories and threat pattern updates",
      checked: settings.securityUpdates ?? true,
    },
    {
      key: "pushNotifications" as const,
      label: "Push Notifications",
      desc: "Real-time system tray and mobile push notifications",
      checked: settings.pushNotifications ?? true,
    },
    {
      key: "emailNotifications" as const,
      label: "Email Security Digest",
      desc: "Weekly identity security reports and critical breach alerts",
      checked: settings.emailNotifications ?? false,
    },
  ];

  return (
    <div id="settings-page" className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Header */}
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
              Settings & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Manage your profile, neural security heuristics, and app preferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <div
            onClick={() => setCurrentView("profile")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 cursor-pointer hover:border-cyan-400 transition-all"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-800 flex-shrink-0">
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-cyan-400 font-medium">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 1: USER ACCOUNT OVERVIEW CARD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 glass-panel shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-500/50 bg-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex-shrink-0">
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif]">
                      {user.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                      {user.plan}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{user.phone} • Member since {user.memberSince}</p>
                </div>
              </div>

              <button
                id="settings-edit-profile-top-btn"
                onClick={() => setActiveModal("edit-profile")}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 self-start sm:self-center"
              >
                <User className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: ACCOUNT MANAGEMENT */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Account Credentials & Security
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
                      Edit Personal Profile
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Name, avatar image, role & identity details ({user.name})
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
                      Change Security Password
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Strengthen master auth password & cryptographic recovery
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
                      Email Preferences & Breach Alerts
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user.email} • Breach digests, alert frequency & report routing
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
                      Phone Number & SOS Contact
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user.phone} • Used for SMS 2FA and Emergency SOS Dispatch
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </button>
            </div>
          </div>

          {/* SECTION 3: PRIVACY & AUTHENTICATION */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Privacy & Hardware Authentication
            </h3>
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden glass-panel divide-y divide-slate-800/80">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Require OTP verification code from authenticator app or SMS on new logins
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth ?? true}
                    onChange={(e) => {
                      if (updateSettings) {
                        updateSettings({ twoFactorAuth: e.target.checked });
                      } else {
                        updateSetting("twoFactorAuth", e.target.checked);
                      }
                      setUser({ ...user, twoFactorEnabled: e.target.checked });
                      showToast("Security Setting", `Two-Factor Authentication ${e.target.checked ? "Enabled" : "Disabled"}`, "info");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
                </label>
              </div>

              {/* Biometrics */}
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-center gap-3.5 min-w-0 pr-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Fingerprint / Windows Hello / Face ID</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Fast biometrics unlock for instant security verification
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.biometricLogin ?? true}
                    onChange={(e) => {
                      if (updateSettings) {
                        updateSettings({ biometricLogin: e.target.checked });
                      } else {
                        updateSetting("biometricLogin", e.target.checked);
                      }
                      setUser({ ...user, biometricsEnabled: e.target.checked });
                      showToast("Biometrics Setting", `Biometrics Login ${e.target.checked ? "Enabled" : "Disabled"}`, "info");
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
                      Active Login Activity & Sessions
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {sessions.length} active sessions • IP addresses, locations & telemetry logs
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
                      Authorized Hardware Devices
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {devices.length} verified devices linked to this account
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
              </button>
            </div>
          </div>

          {/* SECTION 4: AI NEURAL PROTECTION ENGINE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-1 font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Neural Protection Engine
            </h3>

            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] glass-panel overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-6 right-6 opacity-15 hidden sm:block pointer-events-none">
                <Shield className="w-36 h-36 text-cyan-400" />
              </div>

              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] flex-shrink-0">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif]">
                      Autonomous AI Shield Heuristics
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase tracking-wider">
                      Active AI Core
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                    Real-time neural heuristics inspect incoming messages, zero-day links, impersonation profiles, synthetic voice clones, and deepfake media.
                  </p>
                </div>
              </div>

              {/* Toggles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {[
                  {
                    id: "autoScanMessages" as const,
                    label: "Auto Scan Messages",
                    desc: "Analyze incoming SMS, email & WhatsApp alerts for fraud triggers",
                    checked: settings.autoScanMessages ?? true,
                  },
                  {
                    id: "autoScanLinks" as const,
                    label: "Auto Scan Links & URLs",
                    desc: "Real-time DNS & zero-day phishing link blocker",
                    checked: settings.autoScanLinks ?? true,
                  },
                  {
                    id: "fakeProfileDetection" as const,
                    label: "Fake Profile Detection",
                    desc: "Flag impersonators and bot accounts across social platforms",
                    checked: settings.fakeProfileDetection ?? true,
                  },
                  {
                    id: "deepfakeDetection" as const,
                    label: "Deepfake Detection",
                    desc: "Examine video media for GAN facial manipulation",
                    checked: settings.deepfakeDetection ?? true,
                  },
                  {
                    id: "aiVoiceScamDetection" as const,
                    label: "AI Voice Scam Detection",
                    desc: "Identify synthesized voice clones during audio & phone calls",
                    checked: settings.aiVoiceScamDetection ?? true,
                  },
                  {
                    id: "autoThreatAlerts" as const,
                    label: "Automatic Threat Alerts",
                    desc: "Instant high-priority alerts during detected active attacks",
                    checked: settings.autoThreatAlerts ?? true,
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
                          if (updateSettings) {
                            updateSettings({ [item.id]: e.target.checked });
                          } else {
                            updateSetting(item.id, e.target.checked);
                          }
                          showToast("AI Shield", `${item.label} ${e.target.checked ? "Enabled" : "Disabled"}`, "info");
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

          {/* SECTION 5: NOTIFICATIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Notification Channels
            </h3>
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden glass-panel divide-y divide-slate-800/80">
              {notificationItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 sm:p-5">
                  <div className="min-w-0 pr-4">
                    <h4 className="text-sm font-bold text-white">{item.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => {
                        if (updateSettings) {
                          updateSettings({ [item.key]: e.target.checked });
                        } else {
                          updateSetting(item.key, e.target.checked);
                        }
                        showToast("Notification Setting", `${item.label} ${e.target.checked ? "Enabled" : "Disabled"}`, "info");
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: APPEARANCE & THEME */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Theme & Visual Appearance
            </h3>
            <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800 rounded-3xl glass-panel space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "dark" as const, label: "Dark Cyber", icon: Moon },
                  { id: "light" as const, label: "Light Clean", icon: Sun },
                  { id: "system" as const, label: "System Default", icon: Monitor },
                ].map((themeOpt) => {
                  const Icon = themeOpt.icon;
                  const isSelected = settings.theme === themeOpt.id;
                  return (
                    <button
                      key={themeOpt.id}
                      type="button"
                      onClick={() => {
                        if (updateSettings) {
                          updateSettings({ theme: themeOpt.id });
                        } else {
                          updateSetting("theme", themeOpt.id);
                        }
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

          {/* SECTION 7: LANGUAGE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
              Language & Regional Localization
            </h3>
            <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800 rounded-3xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Interface & AI Analysis Language</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Select preferred regional language for threat reports</p>
                </div>
              </div>

              <select
                value={settings.language ?? "English"}
                onChange={(e) => {
                  const newLang = e.target.value as SettingsState["language"];
                  if (updateSettings) {
                    updateSettings({ language: newLang });
                  } else {
                    updateSetting("language", newLang);
                  }
                  showToast("Language Updated", `Set interface language to ${newLang}`, "success");
                }}
                className="bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-cyan-400 transition-colors"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.native})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Support, Emergency, Legal, About & Logout (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* EMERGENCY FRAUD SOS */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-red-950/40 to-slate-900 border border-red-500/30 glass-panel space-y-4 shadow-lg shadow-red-950/20">
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

          {/* HELP & 24/7 SUPPORT */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Help & 24/7 Support
            </h4>
            <div className="space-y-1">
              {[
                { title: "Contact 24/7 Support Desk", icon: Headphones, modal: "support-contact" as const },
                { title: "Help Center & FAQs", icon: HelpCircle, view: "learning" as const },
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
              Feedback & Intel Community
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
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">Join Threat Intel Feed</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => showToast("Rating Submitted", "Thank you for rating SYRA NOVA 5 Stars!", "success")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">Rate SYRA NOVA</span>
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
                onClick={() => showToast("Privacy Policy", "SYRA NOVA uses end-to-end encrypted storage with zero unauthorized tracking.", "info")}
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
                onClick={() => showToast("Terms of Service", "Standard Enterprise & Consumer Cybersecurity service terms apply.", "info")}
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
                onClick={() => showToast("Certifications", "ISO/IEC 27001, SOC 2 Type II, and CERT-In compliance compliant.", "success")}
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
              <span className="text-emerald-400 font-semibold">Build 2026.09</span>
            </div>

            <button
              id="check-updates-btn"
              type="button"
              onClick={handleCheckUpdates}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition-colors border border-slate-700"
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

      {/* 1. EDIT PROFILE MODAL */}
      {activeModal === "edit-profile" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Edit User Profile</h3>
                <p className="text-xs text-slate-400">Modify your personal contact and identity details</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Account Tier</label>
                <select
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="User">User</option>
                  <option value="Enterprise Admin">Enterprise Admin</option>
                  <option value="Government Officer">Government Officer</option>
                  <option value="Cyber Expert">Cyber Expert</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CHANGE PASSWORD MODAL */}
      {activeModal === "change-password" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Change Security Password</h3>
                <p className="text-xs text-slate-400">Create a strong, unique alphanumeric passphrase</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPass ? "text" : "password"}
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Master Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="At least 8 characters..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-white outline-none focus:border-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
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

      {/* 3. EMAIL PREFERENCES MODAL */}
      {activeModal === "email-prefs" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Email Preferences</h3>
                <p className="text-xs text-slate-400">Configure security digest and threat alerts for {user.email}</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEmailPrefs} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Digest Delivery Schedule</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["instant", "daily", "weekly"] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setEmailFrequency(freq)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                        emailFrequency === freq
                          ? "bg-blue-500/20 border-blue-500 text-blue-300 shadow-sm shadow-blue-500/20"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Zero-Day Breach Alerts</p>
                    <p className="text-[10px] text-slate-400">Immediate email when your email or data leaks</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailBreachAlerts}
                    onChange={(e) => setEmailBreachAlerts(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Weekly Security Summary</p>
                    <p className="text-[10px] text-slate-400">Threat intelligence & score improvement tips</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </div>
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
                  className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PHONE NUMBER MODAL */}
      {activeModal === "phone-number" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">Phone Number & Emergency SOS</h3>
                <p className="text-xs text-slate-400">Used for hardware 2FA and Emergency SOS notifications</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">SMS 2FA Authentication</p>
                    <p className="text-[10px] text-slate-400">Receive 6-digit verification code on login</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={phone2FA}
                    onChange={(e) => setPhone2FA(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Emergency SOS Broadcast</p>
                    <p className="text-[10px] text-slate-400">Auto SMS location and alert to emergency contacts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={phoneSosAlerts}
                    onChange={(e) => setPhoneSosAlerts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </div>
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
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Verify & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. LOGIN ACTIVITY MODAL */}
      {activeModal === "login-activity" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
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
                className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {sessions.map((sess) => (
                <div key={sess.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{sess.device}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sess.ip} • {sess.location}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      sess.isCurrent ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                    }`}>
                      {sess.time}
                    </span>
                    {!sess.isCurrent && (
                      <button
                        onClick={() => handleTerminateSession(sess.id, sess.device)}
                        className="text-[10px] text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-500/10 border border-red-500/20"
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. MANAGE DEVICES MODAL */}
      {activeModal === "manage-devices" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
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
                className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5">
              {devices.map((dev) => {
                const Icon = dev.icon;
                return (
                  <div key={dev.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-850 text-cyan-400 flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{dev.name}</p>
                        <p className="text-[10px] text-slate-400">{dev.type} • {dev.lastActive}</p>
                      </div>
                    </div>
                    {!dev.isCurrent && (
                      <button
                        onClick={() => handleRevokeDevice(dev.id, dev.name)}
                        className="text-[10px] text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 flex-shrink-0 transition-colors"
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

      {/* 7. CONTACT 24/7 SUPPORT MODAL */}
      {activeModal === "support-contact" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-heading">24/7 Cyber Security Support</h3>
                <p className="text-xs text-slate-400">Priority assistance for active fraud, breaches & AI incident response</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="Fraud / Scam Incident">Fraud / Scam Incident</option>
                  <option value="Identity Theft / Data Leak">Identity Theft / Data Leak</option>
                  <option value="Deepfake or Voice Clone">Deepfake or Voice Clone</option>
                  <option value="Account & Auth Recovery">Account & Auth Recovery</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent: Suspicious APK file received via SMS"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the scammer's contact, URL, message, or financial loss..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 resize-none"
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
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Incident Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
