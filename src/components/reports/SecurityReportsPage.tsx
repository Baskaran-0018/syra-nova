import React from "react";
import { FileCheck, ArrowLeft, Bell, Download, ShieldCheck, Share2, Filter } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const SecurityReportsPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, scans, showToast } = useApp();

  const handleDownloadAll = () => {
    showToast("Audit Report Exported", "Comprehensive SYRA NOVA Security Dossier downloaded.", "success");
  };

  return (
    <div id="security-reports-page" className="space-y-6 animate-in fade-in duration-200 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={navigateBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              Security Audit Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Certified forensic reports and historical scan telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadAll}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Export Full Audit PDF</span>
        </button>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden glass-panel divide-y divide-slate-800">
        {scans.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No security audit reports yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run real-time scans on suspicious messages, profiles, or domains to generate certified audit records.
            </p>
          </div>
        ) : (
          scans.map((s) => (
            <div key={s.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-heading">{s.category}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {s.date}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 italic">"{s.target}"</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    s.verdict.includes("Scam") || s.verdict.includes("Fake")
                      ? "bg-red-500/20 text-red-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {s.verdict} ({s.riskScore}% Risk)
                </span>
                <button
                  onClick={() => showToast("Exporting File", `Exported certificate for ${s.id}`, "info")}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Download Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
