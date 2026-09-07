import React from "react";

interface SyraNovaLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SyraNovaLogo: React.FC<SyraNovaLogoProps> = ({
  size = "md",
  showText = true,
  showSubtitle = false,
  className = "",
  onClick,
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-20 h-20",
  };

  const textSizes = {
    sm: "text-base tracking-wider",
    md: "text-lg tracking-wider",
    lg: "text-2xl tracking-wider",
    xl: "text-4xl tracking-widest",
  };

  return (
    <div
      id="syra-nova-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? "cursor-pointer group" : ""} ${className}`}
    >
      {/* High-tech Cyber Shield Logo */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center flex-shrink-0`}>
        {/* Glowing background ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/30 via-cyan-400/20 to-purple-600/30 blur-sm group-hover:blur-md transition-all duration-300" />
        
        {/* Shield Frame */}
        <svg
          viewBox="0 0 100 110"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Outer Outline */}
          <path
            d="M50 4L88 20V52C88 77 71.5 99.5 50 106C28.5 99.5 12 77 12 52V20L50 4Z"
            className="stroke-cyan-400 transition-colors"
            strokeWidth="4"
            strokeLinejoin="round"
            fill="url(#shieldGradient)"
          />
          {/* Inner Cyber Circuit Nodes */}
          <path
            d="M50 22L72 34V54C72 69 62.5 82 50 87C37.5 82 28 69 28 54V34L50 22Z"
            className="stroke-purple-400/80"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          {/* AI Core Central Crystal */}
          <polygon
            points="50,38 62,50 50,66 38,50"
            className="fill-cyan-400"
            style={{ filter: "drop-shadow(0 0 6px #06B6D4)" }}
          />
          <circle cx="50" cy="52" r="3" className="fill-white" />
          
          {/* Top light node */}
          <circle cx="50" cy="12" r="2.5" className="fill-cyan-300 animate-pulse" />
          
          <defs>
            <linearGradient id="shieldGradient" x1="50" y1="4" x2="50" y2="106" gradientUnits="userSpaceOnUse">
              <stop stopColor="#111827" stopOpacity="0.95" />
              <stop stopColor="#0B0F19" stopOpacity="0.98" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-['Outfit',sans-serif] font-extrabold uppercase text-white ${textSizes[size]}`}>
              SYRA
            </span>
            <span className={`font-['Outfit',sans-serif] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400 ${textSizes[size]}`}>
              NOVA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06B6D4] animate-pulse" />
          </div>
          {showSubtitle && (
            <span className="text-[10px] text-cyan-300/80 font-medium tracking-wider uppercase mt-1">
              AI Cyber Shield
            </span>
          )}
        </div>
      )}
    </div>
  );
};
