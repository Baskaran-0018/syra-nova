import React from "react";

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: "auto" | "risk" | "safety" | "authenticity" | "cyan" | "purple";
  showValueText?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  colorScheme = "auto",
  showValueText = true,
  className = "",
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  // Determine stroke color
  let strokeColor = "#06B6D4"; // default cyan
  let statusText = "";

  if (colorScheme === "risk") {
    // 0-25: Safe (green), 26-60: Suspicious (yellow/orange), 61-100: High Risk (red)
    if (clampedValue < 25) {
      strokeColor = "#22C55E";
      statusText = "Safe";
    } else if (clampedValue < 60) {
      strokeColor = "#F59E0B";
      statusText = "Suspicious";
    } else if (clampedValue < 80) {
      strokeColor = "#F97316";
      statusText = "High Risk";
    } else {
      strokeColor = "#EF4444";
      statusText = "Dangerous";
    }
  } else if (colorScheme === "authenticity" || colorScheme === "safety") {
    // 70-100: Green (Likely Genuine), 40-69: Yellow (Suspicious), 0-39: Red (High Risk)
    if (clampedValue >= 75) {
      strokeColor = "#22C55E";
      statusText = "Likely Genuine";
    } else if (clampedValue >= 45) {
      strokeColor = "#F59E0B";
      statusText = "Suspicious";
    } else {
      strokeColor = "#EF4444";
      statusText = "High Risk";
    }
  } else if (colorScheme === "purple") {
    strokeColor = "#A855F7";
  }

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800/80"
          />
          {/* Animated progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 0.85s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease",
              filter: `drop-shadow(0 0 6px ${strokeColor}66)`,
            }}
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {label && <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</span>}
          {showValueText && (
            <span className="font-['Outfit',sans-serif] text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {clampedValue}%
            </span>
          )}
          {(sublabel || statusText) && (
            <span
              className="text-[11px] font-bold mt-0.5 tracking-wide px-2 py-0.5 rounded-full"
              style={{ color: strokeColor, backgroundColor: `${strokeColor}1A` }}
            >
              {sublabel || statusText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
