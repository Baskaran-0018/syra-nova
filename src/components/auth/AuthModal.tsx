import React, { useState, useEffect } from "react";
import {
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
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SyraNovaLogo } from "../common/SyraNovaLogo";

export const AuthModal: React.FC = () => {
  const { setCurrentView, setUser, showToast } = useApp();
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp" | "forgot" | "mfa">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("baskaran.j0018@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [fullName, setFullName] = useState("Dr. Baskaran J.");
  const [phone, setPhone] = useState("+91 98401 23456");
  const [country, setCountry] = useState("India");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [mfaMethod, setMfaMethod] = useState<"authenticator" | "sms" | "email" | "biometric">("biometric");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authMode === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, timer]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setAuthMode("mfa");
    }, 800);
  };

  const handleCompleteAuth = () => {
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
      showToast("Authentication Successful", "Welcome back to SYRA NOVA Cyber Defense!", "success");
      setCurrentView("dashboard");
    }, 1000);
  };

  const handleGuestLogin = () => {
    setUser({
      id: "GUEST-100",
      name: "Guest Explorer",
      email: "guest@syranova.ai",
      phone: "+1 555-0199",
      avatarUrl: "",
      role: "Guest",
      safetyScore: 78,
      privacyScore: 72,
      identityRisk: "Moderate",
      twoFactorEnabled: false,
      biometricsEnabled: false,
      memberSince: "Today",
      plan: "Free",
    });
    showToast("Guest Session Started", "Browsing with standard protection tier.", "info");
    setCurrentView("dashboard");
  };

  return (
    <div
      id="auth-container"
      className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] text-white p-4 sm:p-6 select-none relative overflow-hidden"
    >
      {/* Animated Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl glass-panel z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Logo and Tag */}
        <div className="flex flex-col items-center text-center mb-6">
          <SyraNovaLogo size="md" showSubtitle={false} />
          <span className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase mt-2">
            Secure Authentication Portal
          </span>
        </div>

        {/* 1. LOGIN MODE */}
        {authMode === "login" && (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-400 mt-1">Sign in to your SYRA NOVA identity account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
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
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
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
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Or Continue With
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCompleteAuth}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteAuth}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-white transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.02-.49 2.64-1.24z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2 text-center text-xs">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-slate-400 hover:text-cyan-400 font-medium transition-colors"
              >
                Continue as Guest (Limited Features)
              </button>

              <div className="text-slate-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SIGN UP MODE */}
        {authMode === "signup" && (
          <div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">Create Account</h2>
              <p className="text-xs text-slate-400 mt-0.5">Get 360° AI cyber defense for your digital life</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAuthMode("otp");
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
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
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Singapore</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-2 text-[11px] text-slate-400 pt-1">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-cyan-500 mt-0.5"
                />
                <span>I accept SYRA NOVA Terms of Service & Privacy Policy</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all mt-2"
              >
                Create Account & Verify OTP
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
            <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">Verify 6-Digit OTP</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter verification code sent to <span className="text-cyan-300 font-mono">{phone}</span>
            </p>

            <div className="flex items-center justify-center gap-2 my-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-input-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-10 h-12 bg-slate-800 border border-slate-700 rounded-xl text-center font-mono text-lg font-bold text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
              <span>{timer > 0 ? `Resend code in 00:${timer < 10 ? `0${timer}` : timer}` : "Didn't receive code?"}</span>
              <button
                type="button"
                disabled={timer > 0}
                onClick={() => setTimer(45)}
                className="font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40"
              >
                Resend OTP
              </button>
            </div>

            <button
              type="button"
              onClick={handleCompleteAuth}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              Verify & Complete Setup
            </button>
          </div>
        )}

        {/* 4. FORGOT PASSWORD */}
        {authMode === "forgot" && (
          <div>
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">We will send secure recovery instructions to your email</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Reset Link Dispatched", `Password reset instructions sent to ${email}`, "success");
                setAuthMode("login");
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
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
                Send Reset Link
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
            <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">Two-Factor Verification</h2>
            <p className="text-xs text-slate-400 mt-1">Select an identity verification method to confirm sign-in</p>

            <div className="space-y-2 my-5 text-left">
              {[
                { id: "biometric" as const, title: "Biometric / Face ID", desc: "Instant biometric hardware confirmation", icon: Fingerprint },
                { id: "authenticator" as const, title: "Authenticator App", desc: "Google Authenticator / Authy TOTP code", icon: KeyRound },
                { id: "sms" as const, title: "SMS One-Time Passcode", desc: `Send code to ${phone}`, icon: Smartphone },
                { id: "email" as const, title: "Email Backup OTP", desc: `Send code to ${email}`, icon: Mail },
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
                    <div className={`p-2 rounded-lg ${selected ? "bg-cyan-500 text-slate-950" : "bg-slate-700 text-slate-300"}`}>
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
              onClick={handleCompleteAuth}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
            >
              Verify & Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
