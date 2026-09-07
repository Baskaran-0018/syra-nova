import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="app-toast-container"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          error: <AlertCircle className="w-5 h-5 text-red-400" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          info: <Info className="w-5 h-5 text-cyan-400" />,
        };

        const borderColors = {
          success: "border-emerald-500/30 shadow-emerald-500/10",
          error: "border-red-500/30 shadow-red-500/10",
          warning: "border-amber-500/30 shadow-amber-500/10",
          info: "border-cyan-500/30 shadow-cyan-500/10",
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-slate-900/95 border ${
              borderColors[t.type]
            } shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 glass-panel`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white font-heading">{t.title}</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
