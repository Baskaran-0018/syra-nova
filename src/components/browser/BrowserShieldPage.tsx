import React, { useState } from "react";
import { Globe, ShieldCheck, ShieldAlert, ArrowLeft, Bell, CheckCircle2, Lock, ExternalLink, Zap, Download, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { downloadReport } from "../../utils/exportReport";

export const BrowserShieldPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, showToast } = useApp();

  const [blockedDomains, setBlockedDomains] = useState<Array<{
    id: string;
    domain: string;
    reason: string;
    blockedAt: string;
    severity: string;
  }>>([]);

  const handleDownloadReport = () => {
    downloadReport({
      filename: `SYRA_BrowserShield_Report_${new Date().toISOString().slice(0, 10)}`,
      title: "SYRA NOVA Browser Shield Active Threat Telemetry",
      format: "txt",
      data: {
        totalThreatsIntercepted: blockedDomains.length,
        activeFilterListCount: blockedDomains.length,
        interceptedSites: blockedDomains,
        status: "Active Web Gateway Filter Enabled",
      },
    });
    showToast("Report Exported", "Downloaded browser shield intelligence report.", "success");
  };

  const handleDeleteSite = (id: string, domain: string) => {
    setBlockedDomains(blockedDomains.filter((d) => d.id !== id));
    showToast("Entry Removed", `Removed ${domain} from blocked telemetry.`, "info");
  };

  const handleClearAll = () => {
    setBlockedDomains([]);
    showToast("Telemetry Cleared", "Cleared blocked sites list.", "info");
  };

  return (
    <div id="browser-shield-page" className="space-y-6 animate-in fade-in duration-200 pb-12">
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
              Browser Shield Protection
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Live web threat blocker, phishing interceptor, and secure checkout gate.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="browser-shield-download-report-btn"
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all"
            title="Download Browser Shield Dossier"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Phishing Links Blocked", value: "248 Sites", icon: ShieldAlert, color: "text-emerald-400" },
          { label: "Secure Payments Guarded", value: "$4,290 Protected", icon: Lock, color: "text-cyan-400" },
          { label: "Zero-Day Signatures", value: "Real-time Live", icon: Zap, color: "text-purple-400" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-800 text-cyan-400">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <h4 className={`text-lg font-black ${s.color} font-mono mt-0.5`}>{s.value}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extension Install Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 glass-panel flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            Official Browser Addon
          </span>
          <h3 className="text-lg font-bold text-white font-heading">
            SYRA NOVA Chrome, Safari & Edge Extension
          </h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Inspect every website before you enter your credit card or passwords. Detect typo-squatted domains instantly.
          </p>
        </div>

        <button
          onClick={() => showToast("Extension Downloaded", "Installed SYRA NOVA Web Shield Companion.", "success")}
          className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Globe className="w-4 h-4" />
          <span>Add to Browser (Free)</span>
        </button>
      </div>

      {/* Recently Blocked Web Threat Domains */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">
            Recently Blocked Deceptive Portals
          </h3>
          {blockedDomains.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-slate-400 hover:text-red-400 font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Telemetry</span>
            </button>
          )}
        </div>

        {blockedDomains.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No active threat domains recorded. Clean web browsing session.
          </div>
        ) : (
          <div className="space-y-3">
            {blockedDomains.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-red-400">{item.domain}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                      {item.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.blockedAt}</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.reason}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      downloadReport({
                        filename: `Blocked_Site_${item.id}`,
                        title: `Web Threat Audit: ${item.domain}`,
                        format: "txt",
                        data: item,
                      });
                      showToast("Report Exported", `Exported audit for ${item.domain}`, "success");
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                    title="Download Site Threat Audit"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSite(item.id, item.domain)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Record"
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
