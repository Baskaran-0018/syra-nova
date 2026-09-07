import React, { useState } from "react";
import {
  Shield,
  Scan,
  Fingerprint,
  Zap,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
} from "lucide-react";
import { SyraNovaLogo } from "../common/SyraNovaLogo";

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to SYRA NOVA",
      description:
        "Your AI-powered cybersecurity companion that protects your digital life from scams, phishing, fake websites, deepfakes, and identity theft.",
      icon: Shield,
      gradient: "from-cyan-500 to-blue-600",
      accent: "cyan",
      badge: "Intelligent Cyber Defense",
    },
    {
      title: "Detect Threats Instantly",
      description:
        "Scan suspicious SMS messages, emails, websites, QR codes, phone numbers, and social media profiles using neural AI fraud models.",
      icon: Scan,
      gradient: "from-purple-500 to-indigo-600",
      accent: "purple",
      badge: "Real-Time Neural Scanner",
    },
    {
      title: "Protect Your Digital Identity",
      description:
        "Monitor data breaches, privacy exposures, password health, and unauthorized account access with Digital Identity Guardian.",
      icon: Fingerprint,
      gradient: "from-emerald-500 to-cyan-600",
      accent: "emerald",
      badge: "Identity Guardian Engine",
    },
    {
      title: "Stay One Step Ahead",
      description:
        "Receive real-time cyber alerts, automated AI recommendations, emergency fraud recovery assistance, and 24/7 scam protection wherever you go.",
      icon: Zap,
      gradient: "from-amber-500 to-red-600",
      accent: "amber",
      badge: "24/7 Active Protection",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <div
      id="onboarding-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19] text-white p-4 sm:p-6 select-none overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-xl bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl glass-panel flex flex-col justify-between min-h-[540px]">
        {/* Top bar with Logo & Skip */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <SyraNovaLogo size="sm" showSubtitle={false} />
          <button
            onClick={onComplete}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            Skip to App
          </button>
        </div>

        {/* Center Illustration & Content */}
        <div className="my-auto py-6 flex flex-col items-center text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-cyan-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {current.badge}
          </span>

          {/* Animated Illustration Bubble */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-center mb-6 shadow-2xl group">
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-tr ${current.gradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}
            />
            <div className={`p-5 sm:p-7 rounded-2xl bg-gradient-to-tr ${current.gradient} text-white shadow-xl transform transition-transform group-hover:scale-105 duration-300`}>
              <StepIcon className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-md" />
            </div>
          </div>

          <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {current.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-md leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Bottom Navigation & Progress Dots */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === idx
                    ? "w-8 bg-cyan-400 shadow-[0_0_8px_#06B6D4]"
                    : "w-2 bg-slate-700 hover:bg-slate-600"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Get Started Button */}
          <button
            id="onboarding-next-btn"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
          >
            <span>{currentStep === steps.length - 1 ? "Get Started" : "Next"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
