import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Fingerprint,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Globe,
  Check,
  AlertTriangle,
  Zap,
  ChevronRight,
  ArrowLeft,
  X,
  RefreshCw,
  Cpu,
  Layers,
  Key,
  HelpCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SyraNovaLogo } from "../common/SyraNovaLogo";

export const LoginPage: React.FC = () => {
  const { currentView, setCurrentView, setUser, showToast, user } = useApp();

  // Auth Modes: login, signup, forgot, otp, mfa
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot" | "otp" | "mfa">("login");
  const [activeTab, setActiveTab] = useState<"quick" | "email">("quick");

  // Form Fields
  const [email, setEmail] = useState(user?.email || "baskaran.j0018@gmail.com");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+91 98401 23456");
  const [country, setCountry] = useState("India");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(45);

  // MFA State
  const [mfaMethod, setMfaMethod] = useState<"biometric" | "authenticator" | "sms" | "email">("biometric");

  // Interactive Modals for Social Login
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showAppleModal, setShowAppleModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // Apple relay email option
  const [appleShareEmail, setAppleShareEmail] = useState<"share" | "hide">("share");

  // Language state
  const [language, setLanguage] = useState<"English" | "Tamil" | "Hindi">("English");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authMode === "otp" && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, otpTimer]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`login-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // 1. Gmail / Google Login Flow
  const handleGoogleSignIn = (selectedEmail?: string) => {
    setLoadingProvider("gmail");
    setIsVerifying(true);
    setShowGoogleModal(false);

    setTimeout(() => {
      setIsVerifying(false);
      setLoadingProvider(null);
      const chosenEmail = selectedEmail || "baskaran.j0018@gmail.com";
      setUser({
        id: "USR-GGL-8421",
        name: chosenEmail.includes("baskaran") ? "Dr. Baskaran J." : "Google User",
        email: chosenEmail,
        phone: "+91 98401 23456",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Cyber Expert",
        safetyScore: 94,
        privacyScore: 90,
        identityRisk: "Low",
        twoFactorEnabled: true,
        biometricsEnabled: true,
        memberSince: "January 2025",
        plan: "Pro Cyber Shield",
      });
      showToast("Gmail Authenticated", `Signed in securely via Google as ${chosenEmail}`, "success");
      setCurrentView("dashboard");
    }, 1000);
  };

  // 2. Apple Login Flow
  const handleAppleSignIn = () => {
    setLoadingProvider("apple");
    setIsVerifying(true);
    setShowAppleModal(false);

    setTimeout(() => {
      setIsVerifying(false);
      setLoadingProvider(null);
      const emailToUse = appleShareEmail === "share" ? "baskaran.j0018@privaterelay.appleid.com" : "user_8913@privaterelay.appleid.com";
      setUser({
        id: "USR-APL-9021",
        name: "Dr. Baskaran J. (Apple)",
        email: emailToUse,
        phone: "+91 98401 23456",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Cyber Expert",
        safetyScore: 96,
        privacyScore: 98,
        identityRisk: "Low",
        twoFactorEnabled: true,
        biometricsEnabled: true,
        memberSince: "February 2025",
        plan: "Pro Cyber Shield",
      });
      showToast("Apple ID Verified", "Signed in securely with Apple Face ID & Private Relay.", "success");
      setCurrentView("dashboard");
    }, 1100);
  };

  // 3. Guest Login Flow
  const handleGuestSignIn = () => {
    setLoadingProvider("guest");
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setLoadingProvider(null);
      setUser({
        id: "GUEST-DEMO-001",
        name: "Guest Defender",
        email: "guest.explorer@syranova.ai",
        phone: "+1 555-0199",
        avatarUrl: "",
        role: "Guest",
        safetyScore: 78,
        privacyScore: 75,
        identityRisk: "Moderate",
        twoFactorEnabled: false,
        biometricsEnabled: false,
        memberSince: "Today",
        plan: "Free",
      });
      showToast("Guest Session Active", "Welcome to SYRA NOVA! Full scanning tools are unlocked for you.", "info");
      setCurrentView("dashboard");
    }, 600);
  };

  // Standard Email Login Submit
  const handleEmailPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setAuthMode("mfa");
    }, 700);
  };

  // Complete Auth after MFA
  const handleCompleteMfaAuth = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setUser({
        id: "USR-94821",
        name: fullName || "Dr. Baskaran J.",
        email: email || "baskaran.j0018@gmail.com",
        phone: phone || "+91 98401 23456",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Cyber Expert",
        safetyScore: 92,
        privacyScore: 88,
        identityRisk: "Low",
        twoFactorEnabled: true,
        biometricsEnabled: true,
        memberSince: "January 2025",
        plan: "Pro Cyber Shield",
      });
      showToast("Access Granted", "Identity verified via hardware 2FA. Neural shields activated.", "success");
      setCurrentView("dashboard");
    }, 800);
  };

  // Biometric Fast Pass
  const handleBiometricFastPass = () => {
    setIsVerifying(true);
    setLoadingProvider("biometric");
    setTimeout(() => {
      setIsVerifying(false);
      setLoadingProvider(null);
      setUser({
        id: "USR-94821",
        name: "Dr. Baskaran J.",
        email: "baskaran.j0018@gmail.com",
        phone: "+91 98401 23456",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Cyber Expert",
        safetyScore: 95,
        privacyScore: 92,
        identityRisk: "Low",
        twoFactorEnabled: true,
        biometricsEnabled: true,
        memberSince: "January 2025",
        plan: "Pro Cyber Shield",
      });
      showToast("Biometric Sensor Approved", "Face ID / Fingerprint match confirmed.", "success");
      setCurrentView("dashboard");
    }, 900);
  };

  return (
    <div
      id="login-page-container"
      className="min-h-screen w-full bg-[#0B0F19] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden"
    >
      {/* Background Cyber Defense Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-3xl" />
        
        {/* Subtle Cyber Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div onClick={() => setCurrentView("dashboard")} className="cursor-pointer">
            <SyraNovaLogo size="sm" showSubtitle={false} />
          </div>
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Neural Shield v2.4 Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="English" className="bg-slate-900">English</option>
              <option value="Tamil" className="bg-slate-900">தமிழ் (Tamil)</option>
              <option value="Hindi" className="bg-slate-900">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Quick Direct to Dashboard (For testing/preview) */}
          <button
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800/70 transition-colors"
          >
            <span>Skip to Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Login Center Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-4">
        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-9 shadow-2xl glass-panel relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Card Accent Top Light */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          {/* 1. LOGIN MODE */}
          {authMode === "login" && (
            <div>
              {/* Header Title */}
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <ShieldCheck className="w-7 h-7 text-cyan-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
                  Sign In to SYRA NOVA
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Quantum-encrypted AI cyber defense & digital identity protection portal
                </p>
              </div>

              {/* Mode Tabs: Social/Quick vs Email/Pass */}
              <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("quick")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === "quick"
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("email")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === "email"
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* TAB 1: QUICK SOCIAL & GUEST LOGIN (GMAIL, APPLE, GUEST) */}
              {activeTab === "quick" && (
                <div className="space-y-3.5">
                  {/* 1. GMAIL / GOOGLE LOGIN BUTTON */}
                  <button
                    id="gmail-login-btn"
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    disabled={isVerifying}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-cyan-500/60 hover:bg-slate-800 text-white transition-all group shadow-lg active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Official Google Multicolor G Logo */}
                      <div className="w-9 h-9 rounded-xl bg-white p-2 flex items-center justify-center shadow-md flex-shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            Continue with Gmail / Google
                          </p>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Fast Sign In
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Instant sync with baskaran.j0018@gmail.com
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>

                  {/* 2. APPLE LOGIN BUTTON */}
                  <button
                    id="apple-login-btn"
                    type="button"
                    onClick={() => setShowAppleModal(true)}
                    disabled={isVerifying}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-black border border-slate-700/90 hover:border-slate-500 hover:bg-neutral-900 text-white transition-all group shadow-lg active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Apple Logo */}
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center shadow-md flex-shrink-0">
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.02-.49 2.64-1.24z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-white group-hover:text-slate-200 transition-colors">
                            Continue with Apple ID
                          </p>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                            Face ID / Touch ID
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Privacy Relay & biometric hardware authorization
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>

                  {/* 3. GUEST LOGIN BUTTON */}
                  <button
                    id="guest-login-btn"
                    type="button"
                    onClick={handleGuestSignIn}
                    disabled={isVerifying}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/70 hover:bg-slate-800 text-white transition-all group shadow-lg active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 p-2 flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            Continue as Guest
                          </p>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            No Password Needed
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Instant demo access with full scam & deepfake scanners
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </button>

                  {/* Biometric Passkey Fast Login */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleBiometricFastPass}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-all"
                    >
                      <Fingerprint className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>Use Passkey / Biometrics Sensor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: EMAIL & PASSWORD FORM */}
              {activeTab === "email" && (
                <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthMode("forgot")}
                        className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your secure password"
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>Remember this browser for 30 days</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In with Email</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Bottom Switch to Sign Up */}
              <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-between">
                <span>New to SYRA NOVA?</span>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>Create Account</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 2. SIGN UP MODE */}
          {authMode === "signup" && (
            <div>
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                  Create SYRA NOVA Account
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Join millions protected by neural AI cyber defense
                </p>
              </div>

              {/* Quick Social Options in Sign Up */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                    />
                  </svg>
                  <span>Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAppleModal(true)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.02-.49 2.64-1.24z" />
                  </svg>
                  <span>Apple</span>
                </button>

                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-emerald-400 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Guest</span>
                </button>
              </div>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative bg-slate-900 px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Or register with details
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setAuthMode("otp");
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Baskaran J."
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="baskaran.j0018@gmail.com"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98401..."
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-8 pr-2.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Singapore</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Create Master Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 text-[11px] text-slate-400 pt-1">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-cyan-500 mt-0.5"
                  />
                  <span>
                    I agree to SYRA NOVA Zero-Trust Terms & Autonomous AI Defense protocols
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all mt-2"
                >
                  Proceed to 6-Digit Mobile Verification
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* 3. OTP VERIFICATION */}
          {authMode === "otp" && (
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                Verify 6-Digit Mobile Code
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We dispatched an encrypted SMS OTP to <span className="text-cyan-300 font-mono">{phone}</span>
              </p>

              <div className="flex items-center justify-center gap-2 my-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`login-otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-10 h-12 bg-slate-800 border border-slate-700 rounded-xl text-center font-mono text-lg font-bold text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                <span>
                  {otpTimer > 0 ? `Resend code in 00:${otpTimer < 10 ? `0${otpTimer}` : otpTimer}` : "Didn't receive code?"}
                </span>
                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={() => setOtpTimer(45)}
                  className="font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="button"
                onClick={handleCompleteMfaAuth}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
              >
                Verify & Enter Cyber Dashboard
              </button>

              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="mt-4 text-xs text-slate-400 hover:text-white"
              >
                Cancel and return to login
              </button>
            </div>
          )}

          {/* 4. FORGOT PASSWORD */}
          {authMode === "forgot" && (
            <div>
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                  Account Recovery
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered Gmail or phone to receive a cryptographic reset token
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Recovery Token Dispatched", `Secure reset link sent to ${email}`, "success");
                  setAuthMode("login");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registered Email / Gmail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                >
                  Send Recovery Link
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="w-full text-center text-xs text-slate-400 hover:text-white font-medium"
                >
                  Back to Sign In
                </button>
              </form>
            </div>
          )}

          {/* 5. MULTI-FACTOR AUTHENTICATION */}
          {authMode === "mfa" && (
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                Hardware 2FA Required
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Zero-Trust security active for <span className="text-cyan-300 font-mono">{email}</span>
              </p>

              <div className="space-y-2 my-5 text-left">
                {[
                  {
                    id: "biometric" as const,
                    title: "Biometric / Touch & Face ID",
                    desc: "Instant hardware biometric confirmation",
                    icon: Fingerprint,
                  },
                  {
                    id: "authenticator" as const,
                    title: "Google / Microsoft Authenticator",
                    desc: "6-digit TOTP code generated on your phone",
                    icon: KeyRound,
                  },
                  {
                    id: "sms" as const,
                    title: "SMS Passcode",
                    desc: `Dispatched to ${phone}`,
                    icon: Smartphone,
                  },
                  {
                    id: "email" as const,
                    title: "Gmail Backup Code",
                    desc: `Dispatched to ${email}`,
                    icon: Mail,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const selected = mfaMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMfaMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selected
                          ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                          : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          selected ? "bg-cyan-500 text-slate-950" : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{m.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{m.desc}</p>
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleCompleteMfaAuth}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
              >
                Authenticate & Launch SYRA NOVA
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Security & Threat Metrics Live Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Quantum Encryption</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Zero-Knowledge Architecture</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>2.4M+ Threats Neutralized Today</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast("Privacy Standard", "SYRA NOVA operates with zero user logging.", "info"); }} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); showToast("Security Terms", "Certified compliance ISO 27001 / SOC-2.", "info"); }} className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#support" onClick={(e) => { e.preventDefault(); showToast("Support Line", "24/7 Incident Helpline: 1930 / support@syranova.ai", "info"); }} className="hover:text-white transition-colors">Emergency Support</a>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* GOOGLE ACCOUNT SELECTION MODAL (SIMULATION) */}
      {/* ============================================================ */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
              <svg className="w-7 h-7 mb-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
              </svg>
              <h3 className="text-base font-bold text-slate-800">Sign in with Google</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                to continue to <span className="font-semibold text-slate-700">SYRA NOVA Cyber Defense</span>
              </p>
            </div>

            {/* Account List */}
            <div className="py-4 space-y-2">
              {/* Account 1: Dr. Baskaran J */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn("baskaran.j0018@gmail.com")}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Dr. Baskaran J.
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">baskaran.j0018@gmail.com</p>
                </div>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  Primary
                </span>
              </button>

              {/* Account 2: Alternative Google account */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn("cyber.security.lab@gmail.com")}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                  C
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Cyber Security Lab
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">cyber.security.lab@gmail.com</p>
                </div>
              </button>

              {/* Use Another Account */}
              <button
                type="button"
                onClick={() => {
                  const inputEmail = prompt("Enter your Gmail address:", "user.cyber@gmail.com");
                  if (inputEmail) handleGoogleSignIn(inputEmail);
                }}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all text-left text-xs font-medium text-slate-600"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <span>Use another Google account</span>
              </button>
            </div>

            {/* Google Permissions footnote */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
              To continue, Google will share your name, email address, and profile picture with SYRA NOVA. See our{" "}
              <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* APPLE ID AUTHENTICATION MODAL (SIMULATION) */}
      {/* ============================================================ */}
      {showAppleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-neutral-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl relative border border-neutral-700 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowAppleModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Apple Header */}
            <div className="flex flex-col items-center text-center pb-5 border-b border-neutral-800">
              <div className="w-12 h-12 rounded-2xl bg-black border border-neutral-700 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.02-.49 2.64-1.24z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white">Sign In with Apple ID</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Do you want to sign in to <span className="font-semibold text-white">SYRA NOVA</span> with your Apple ID?
              </p>
            </div>

            {/* Privacy Email Relay Options */}
            <div className="py-4 space-y-3 text-xs">
              <p className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                Email Options
              </p>

              <label
                onClick={() => setAppleShareEmail("share")}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  appleShareEmail === "share"
                    ? "bg-neutral-800 border-white text-white"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400"
                }`}
              >
                <div>
                  <p className="font-bold text-white">Share My Email</p>
                  <p className="text-[11px] text-neutral-400">baskaran.j0018@gmail.com</p>
                </div>
                {appleShareEmail === "share" && <Check className="w-4 h-4 text-white" />}
              </label>

              <label
                onClick={() => setAppleShareEmail("hide")}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  appleShareEmail === "hide"
                    ? "bg-neutral-800 border-white text-white"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400"
                }`}
              >
                <div>
                  <p className="font-bold text-white">Hide My Email</p>
                  <p className="text-[11px] text-neutral-400">Forward to your personal address via private relay</p>
                </div>
                {appleShareEmail === "hide" && <Check className="w-4 h-4 text-white" />}
              </label>
            </div>

            {/* Biometric Confirmation button */}
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <button
                type="button"
                onClick={handleAppleSignIn}
                className="w-full py-3 rounded-2xl bg-white text-black hover:bg-neutral-200 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Fingerprint className="w-4 h-4 text-black" />
                <span>Confirm with Face ID / Touch ID</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAppleModal(false)}
                className="w-full text-center text-xs text-neutral-400 hover:text-white py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
