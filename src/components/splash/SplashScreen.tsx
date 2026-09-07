import React, { useState, useEffect } from "react";
import { Shield, Sparkles, Lock, Cpu, Globe, ArrowRight } from "lucide-react";
import { SyraNovaLogo } from "../common/SyraNovaLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Initializing Secure Environment...");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText("Verifying Neural Scam Signatures...");
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStatusText("Connecting to Digital Identity Guardian...");
    }, 1300);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Environment Secured. Welcome to SYRA NOVA.");
    }, 2000);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div
      id="splash-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0B0F19] text-white overflow-hidden p-6 select-none"
    >
      {/* Animated Cyber Grid & Glowing Particle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-transparent rounded-full blur-3xl animate-pulse" />
        
        {/* Subtle Binary Code lines */}
        <div className="absolute inset-0 opacity-5 font-mono text-[10px] leading-4 text-cyan-400 overflow-hidden select-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap">
              01010011 01011001 01010010 01000001 00100000 01001110 01001111 01010110 01000001 00100000 01010011 01000101 01000011 01010101 01010010 01000101
            </div>
          ))}
        </div>

        {/* Cyber Circuit Lines */}
        <svg className="absolute inset-0 w-full h-full stroke-cyan-500/10" fill="none">
          <pattern id="circuit-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 40h80M40 0v80M20 20h40v40H20z" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="2" className="fill-cyan-400/20" />
            <circle cx="60" cy="60" r="2" className="fill-purple-400/20" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      {/* Top Header Placeholder */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-cyan-400 font-mono">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>256-BIT QUANTUM SHIELD</span>
        </div>
        <button
          onClick={onComplete}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-1 rounded-full hover:bg-slate-800/60 transition-colors"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
          <SyraNovaLogo size="xl" showText={false} />
        </div>

        <h1 className="font-['Outfit',sans-serif] text-4xl sm:text-5xl font-black tracking-wider text-white">
          SYRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400">NOVA</span>
        </h1>

        <p className="font-['Outfit',sans-serif] text-lg sm:text-xl font-bold text-cyan-300 mt-2 tracking-wide uppercase">
          Protect. Detect. Defend.
        </p>

        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
          AI-Powered Cyber Security & Digital Identity Protection
        </p>

        {/* Circular Progress & Loading Indicator */}
        <div className="mt-10 flex flex-col items-center w-full max-w-xs">
          <div className="relative w-16 h-16 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#1F2937"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#06B6D4"
                strokeWidth="4"
                strokeDasharray="163.36"
                strokeDashoffset={163.36 - (progress / 100) * 163.36}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300"
                style={{ filter: "drop-shadow(0 0 6px rgba(6,182,212,0.8))" }}
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-cyan-300">
              {progress}%
            </span>
          </div>

          <p className="text-xs font-medium text-slate-300 tracking-wide animate-pulse">
            {statusText}
          </p>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full z-10 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] font-medium border-t border-slate-900 pt-4 gap-2">
        <span className="font-mono">Version 1.0.0</span>
        <span className="text-slate-400 text-center">
          Privacy First • AI Powered • Trusted Protection
        </span>
        <span>© 2026 SYRA NOVA</span>
      </div>
    </div>
  );
};
