import React from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  MessageSquareWarning,
  UserCheck,
  Fingerprint,
  Video,
  Globe,
  Bot,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight,
  Bell,
  RefreshCw,
  Search,
  Download,
  Trash2,
  History as HistoryIcon,
  KeyRound,
  Image as ImageIcon,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CircularProgress } from "../common/CircularProgress";
import { AppView } from "../../types";
import { downloadReport } from "../../utils/exportReport";

export const DashboardPage: React.FC = () => {
  const {
    user,
    scans,
    deleteScan,
    clearAllScans,
    alerts,
    deleteAlert,
    clearAllAlerts,
    setCurrentView,
    setIsNotificationOpen,
    setIsSearchOpen,
    showToast,
  } = useApp();

  const handleDownloadDashboardReport = () => {
    downloadReport({
      filename: `SYRA_Executive_Cyber_Summary_${new Date().toISOString().slice(0, 10)}`,
      title: "Executive Cybersecurity Health & Activity Dossier",
      format: "txt",
      data: {
        user: user.name,
        safetyScore: `${user.safetyScore}%`,
        privacyScore: `${user.privacyScore}%`,
        identityRisk: user.identityRisk,
        activeScansCount: scans.length,
        unreadAlertsCount: alerts.length,
        recentScans: scans.slice(0, 5),
      },
      metadata: {
        securityLevel: "Quantum Zero-Trust Active",
        incidentReadiness: "100%",
      },
    });
    showToast("Report Exported", "Executive cybersecurity health summary downloaded.", "success");
  };

  const handleDownloadSingleScan = (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation();
    const scan = scans.find((s) => s.id === scanId);
    if (!scan) return;

    downloadReport({
      filename: `Scan_Report_${scan.id}`,
      title: `Threat Forensic Analysis: ${scan.category}`,
      format: "txt",
      data: scan,
    });
    showToast("Scan Report Downloaded", `Report for scan #${scan.id} downloaded.`, "success");
  };

  const handleDeleteSingleScan = (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation();
    deleteScan(scanId);
  };

  const quickTools: Array<{ id: AppView; title: string; desc: string; icon: React.ElementType; color: string; border: string; glow: string }> = [
    {
      id: "vault",
      title: "Password & Data Vault",
      desc: "Store Instagram, banking & work credentials, notes & saved login screenshots",
      icon: KeyRound,
      color: "from-purple-500 via-pink-500 to-indigo-600",
      border: "border-purple-500/40",
      glow: "shadow-purple-500/20",
    },
    {
      id: "message-detector",
      title: "Scam Message Detector",
      desc: "Analyze SMS, WhatsApp texts, emails & screenshot uploads with AI",
      icon: MessageSquareWarning,
      color: "from-cyan-500 to-blue-600",
      border: "border-cyan-500/40",
      glow: "shadow-cyan-500/20",
    },
    {
      id: "profile-detector",
      title: "Fake Profile Detector",
      desc: "Inspect Instagram, X, LinkedIn, Telegram accounts for bot activity",
      icon: UserCheck,
      color: "from-purple-500 to-indigo-600",
      border: "border-purple-500/40",
      glow: "shadow-purple-500/20",
    },
    {
      id: "identity-guardian",
      title: "Digital Identity Guardian",
      desc: "Breach alerts, leaked password exposure & digital footprint health",
      icon: Fingerprint,
      color: "from-emerald-500 to-cyan-600",
      border: "border-emerald-500/40",
      glow: "shadow-emerald-500/20",
    },
    {
      id: "deepfake-detection",
      title: "Deepfake & AI Voice Clone",
      desc: "Detect manipulated synthetic video, AI voices & spoofed calls",
      icon: Video,
      color: "from-amber-500 to-orange-600",
      border: "border-amber-500/40",
      glow: "shadow-amber-500/20",
    },
  ];

  return (
    <div id="dashboard-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner with Security Score */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 glass-panel shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Quantum Defense Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              SYRA NOVA is actively protecting your digital accounts. 0 critical vulnerabilities found in your identity footprint today.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <button
                id="dash-open-vault-btn"
                onClick={() => setCurrentView("vault")}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                <span>Password Vault</span>
              </button>
              <button
                id="dash-scan-msg-btn"
                onClick={() => setCurrentView("message-detector")}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <MessageSquareWarning className="w-4 h-4" />
                <span>Scan Message</span>
              </button>
              <button
                id="dash-verify-profile-btn"
                onClick={() => setCurrentView("profile-detector")}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span>Verify Profile</span>
              </button>
              <button
                id="dash-download-summary-btn"
                onClick={handleDownloadDashboardReport}
                className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95"
                title="Download Executive Cyber Security Report"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Big Security Score Ring */}
          <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <CircularProgress
              value={user.safetyScore}
              size={130}
              strokeWidth={10}
              colorScheme="authenticity"
              label="Safety Index"
            />
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Shield: Operational</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Privacy Score: <span className="text-white font-mono">{user.privacyScore}%</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Identity Risk: <span className="text-cyan-300 font-mono">{user.identityRisk}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Tier: <span className="text-purple-300 font-semibold">{user.plan}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Protection Tools Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            AI Cyber Defense Arsenal
          </h3>
          <span className="text-xs text-slate-400">Instant AI Scanners</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                id={`quick-tool-${tool.id}`}
                onClick={() => setCurrentView(tool.id)}
                className={`p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:${tool.border} glass-card-interactive cursor-pointer flex flex-col justify-between group shadow-lg`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white mb-4 shadow-lg ${tool.glow} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-heading">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Threat Feed & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent AI Scans (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Recent Threat Analyses
            </h3>
            <div className="flex items-center gap-2">
              {scans.length > 0 && (
                <button
                  id="dash-clear-scans-btn"
                  onClick={clearAllScans}
                  className="text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                  title="Clear all recent scans"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <button
                id="dash-view-history-btn"
                onClick={() => setCurrentView("history")}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                <span>Audit History</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 glass-panel space-y-2.5">
            {scans.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No recent scans. Run a message or profile check to generate threat telemetry.
              </div>
            ) : (
              scans.slice(0, 4).map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => {
                    if (scan.type === "message") setCurrentView("message-detector");
                    else setCurrentView("profile-detector");
                  }}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/30 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        scan.verdict.includes("Scam") || scan.verdict.includes("Fake")
                          ? "bg-red-500/15 text-red-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}
                    >
                      {scan.type === "message" ? (
                        <MessageSquareWarning className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{scan.category}</p>
                      <p className="text-[11px] text-slate-400 truncate italic">"{scan.target}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          scan.verdict.includes("Scam") || scan.verdict.includes("Fake")
                            ? "bg-red-500/20 text-red-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {scan.verdict}
                      </span>
                      <p className="text-[9px] text-slate-500 mt-0.5">{scan.date}</p>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDownloadSingleScan(e, scan.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                        title="Download Scan Report"
                        aria-label="Download Scan"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSingleScan(e, scan.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Scan"
                        aria-label="Delete Scan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Security Feed & Emergency Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Live Threat Alerts
            </h3>
            <div className="flex items-center gap-2">
              {alerts.length > 0 && (
                <button
                  id="dash-clear-alerts-btn"
                  onClick={clearAllAlerts}
                  className="text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                  title="Clear all alerts"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <span className="text-[11px] text-cyan-400 font-mono">LIVE FEED</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 glass-panel space-y-3">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No active threat alerts. All protection shields normal.
              </div>
            ) : (
              alerts.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      onClick={() => {
                        if (a.actionUrl) setCurrentView(a.actionUrl);
                      }}
                      className="text-xs font-bold text-white hover:text-cyan-300 cursor-pointer flex-1"
                    >
                      {a.title}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] text-slate-500">{a.timestamp}</span>
                      <button
                        onClick={() => deleteAlert(a.id)}
                        className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                        title="Dismiss Alert"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{a.description}</p>
                </div>
              ))
            )}

            <button
              onClick={() => setCurrentView("emergency-sos")}
              className="w-full py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Fraud Helpline 1930</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
