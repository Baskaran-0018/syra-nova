import React, { useState } from "react";
import { Landmark, ArrowLeft, Bell, ShieldAlert, Globe, Server, Activity, Download, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { downloadReport } from "../../utils/exportReport";

export const GovernmentIntelligencePage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, showToast } = useApp();

  const [advisories, setAdvisories] = useState<Array<{
    id: string;
    title: string;
    date: string;
    severity: string;
  }>>([]);

  const handleDownloadIntel = () => {
    downloadReport({
      filename: `CERT_Government_Cyber_Threat_Advisory_${new Date().toISOString().slice(0, 10)}`,
      title: "CERT-In & Law Enforcement National Threat Intelligence Bulletin",
      format: "txt",
      data: {
        agency: "CERT-In National Cyber Intelligence Exchange",
        activeAdvisoriesCount: advisories.length,
        bulletins: advisories,
      },
    });
    showToast("Advisory Exported", "Downloaded CERT threat intelligence bulletin.", "success");
  };

  const handleDeleteAdvisory = (id: string) => {
    setAdvisories(advisories.filter((a) => a.id !== id));
    showToast("Advisory Dismissed", `Removed advisory ${id}`, "info");
  };

  const handleClearAll = () => {
    setAdvisories([]);
    showToast("Advisories Cleared", "Cleared national threat advisories stream.", "info");
  };

  return (
    <div id="government-intel-page" className="space-y-6 animate-in fade-in duration-200 pb-16">
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
              Gov & Law Enforcement Cyber Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              National cyber crime registry feeds, botnet takedown telemetry, and CERT advisory channels.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="gov-download-intel-btn"
            onClick={handleDownloadIntel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all"
            title="Download Government Intelligence Bulletin"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Export Bulletin</span>
          </button>

          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Landmark className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-heading">CERT-In Active Cyber Advisories</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold font-mono">
              SYNCED
            </span>
            {advisories.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {advisories.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No active unread advisories. Intelligence feed is up to date.
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {advisories.map((adv) => (
              <div key={adv.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{adv.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {adv.severity}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{adv.date}</span>
                  </div>
                  <p className="text-slate-200 font-medium">{adv.title}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      downloadReport({
                        filename: `CERT_Advisory_${adv.id}`,
                        title: `Government Cyber Advisory: ${adv.id}`,
                        format: "txt",
                        data: adv,
                      });
                      showToast("Advisory Downloaded", `Exported ${adv.id}`, "success");
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                    title="Download Advisory"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAdvisory(adv.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Dismiss Advisory"
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
