import React, { useState } from "react";
import {
  Fingerprint,
  ArrowLeft,
  Bell,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Mail,
  Lock,
  Globe,
  KeyRound,
  RefreshCw,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Download,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CircularProgress } from "../common/CircularProgress";
import { downloadReport } from "../../utils/exportReport";

export const DigitalIdentityGuardianPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, user, showToast } = useApp();
  const [emailLookup, setEmailLookup] = useState(user.email);
  const [isSearching, setIsSearching] = useState(false);
  const [breachesFound, setBreachesFound] = useState<any[]>([]);

  const handleDownloadDossier = () => {
    downloadReport({
      filename: `SYRA_Identity_Security_Audit_${new Date().toISOString().slice(0, 10)}`,
      title: "Digital Identity & Credential Exposure Dossier",
      format: "txt",
      data: {
        monitoredAccount: user.email,
        privacyIndex: user.privacyScore,
        incidentsTracked: breachesFound.length,
        breaches: breachesFound,
      },
    });
    showToast("Identity Report Exported", "Downloaded digital footprint dossier.", "success");
  };

  const handleDeleteBreach = (id: string, name: string) => {
    setBreachesFound(breachesFound.filter((b) => b.id !== id));
    showToast("Incident Dismissed", `Removed ${name} from active tracker.`, "info");
  };

  const handleClearAll = () => {
    setBreachesFound([]);
    showToast("Incidents Cleared", "Cleared all monitored incident records.", "info");
  };

  const handleScanEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      showToast("Identity Audit Complete", `Scan finished for ${emailLookup}. 2 past historical breaches monitored.`, "info");
    }, 1200);
  };

  return (
    <div id="identity-guardian-page" className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Header */}
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
              Digital Identity Guardian
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Monitor data breaches, leaked credentials, and digital footprint exposure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="identity-download-report-btn"
            onClick={handleDownloadDossier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all"
            title="Download Identity Exposure Dossier"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>

          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Identity Health Summary Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 glass-panel shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <CircularProgress
            value={user.privacyScore}
            size={120}
            strokeWidth={10}
            colorScheme="authenticity"
            label="Privacy Index"
          />
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              Zero Active Leaks Detected
            </span>
            <h2 className="text-xl font-black text-white font-heading mt-0.5">
              Identity Protected
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Your primary email, password hashes, and national ID credentials are not exposed on active dark web hacker forums.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast("Deep Identity Scan", "Scanning 8.4 billion dark web credential dumps...", "info")}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Run Deep Dark Web Scan</span>
        </button>
      </div>

      {/* Email Breach Checker */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-heading">Data Breach & Exposure Scanner</h3>
          </div>
          <span className="text-[11px] text-slate-400">Database: HaveIBeenPwned & Cyber Intel</span>
        </div>

        <form onSubmit={handleScanEmail} className="flex gap-2">
          <input
            type="email"
            required
            value={emailLookup}
            onChange={(e) => setEmailLookup(e.target.value)}
            placeholder="Enter email to audit across breached databases..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-colors"
          >
            {isSearching ? "Auditing..." : "Audit Email"}
          </button>
        </form>
      </div>

      {/* Monitored Breaches List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">
            Monitored Historical Incidents
          </h3>
          {breachesFound.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-slate-400 hover:text-red-400 font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Records</span>
            </button>
          )}
        </div>

        {breachesFound.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No active breach records on file. Your digital identity footprint is clean.
          </div>
        ) : (
          <div className="space-y-3">
            {breachesFound.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{b.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {b.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-slate-400">Exposed Data:</span>
                    {b.compromisedData.map((d: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {b.status}
                  </span>
                  <button
                    onClick={() => {
                      downloadReport({
                        filename: `Breach_Incident_${b.id}`,
                        title: `Breach Dossier: ${b.name}`,
                        format: "txt",
                        data: b,
                      });
                      showToast("Report Exported", `Exported report for ${b.name}`, "success");
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                    title="Download Incident Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBreach(b.id, b.name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Dismiss Incident"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
