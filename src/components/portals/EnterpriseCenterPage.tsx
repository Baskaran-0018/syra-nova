import React, { useState } from "react";
import { Building2, ArrowLeft, Bell, ShieldCheck, Users, Activity, Lock, Award, Download, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { downloadReport } from "../../utils/exportReport";

export const EnterpriseCenterPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, showToast } = useApp();

  const [policyEvents, setPolicyEvents] = useState<Array<{
    id: string;
    rule: string;
    endpoint: string;
    timestamp: string;
    status: string;
  }>>([]);

  const handleDownloadEnterpriseDossier = () => {
    downloadReport({
      filename: `SYRA_Enterprise_Security_Dossier_${new Date().toISOString().slice(0, 10)}`,
      title: "Enterprise Cybersecurity & SOC 2 Telemetry Audit",
      format: "txt",
      data: {
        monitoredSeats: "0 Endpoints",
        phishingClickRate: "0.0%",
        compliance: "SOC 2 Type II Ready",
        events: policyEvents,
      },
    });
    showToast("Report Exported", "Downloaded enterprise security dossier.", "success");
  };

  const handleDeleteEvent = (id: string, rule: string) => {
    setPolicyEvents(policyEvents.filter((e) => e.id !== id));
    showToast("Event Dismissed", `Removed ${rule} from audit trail.`, "info");
  };

  const handleClearAll = () => {
    setPolicyEvents([]);
    showToast("Audit Trail Cleared", "Cleared active enterprise policy events.", "info");
  };

  return (
    <div id="enterprise-center-page" className="space-y-6 animate-in fade-in duration-200 pb-16">
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
              Enterprise Security Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Organizational threat telemetry, employee phishing simulation, and compliance monitoring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="enterprise-download-dossier-btn"
            onClick={handleDownloadEnterpriseDossier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all"
            title="Download Enterprise Security Dossier"
          >
            <Download className="w-4 h-4 text-cyan-400" />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Monitored Seats", val: "1,240 Endpoints", icon: Users, color: "text-cyan-400" },
          { label: "Phishing Simulation Click Rate", val: "1.4% (Industry 8%)", icon: Activity, color: "text-emerald-400" },
          { label: "SOC 2 Type II Compliance", val: "100% Passing", icon: Award, color: "text-purple-400" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-800 text-cyan-400">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <h4 className={`text-base font-bold ${item.color} mt-0.5 font-mono`}>{item.val}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise Policy Audit Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">
            Zero-Trust Policy Enforcement Logs
          </h3>
          {policyEvents.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-slate-400 hover:text-red-400 font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Logs</span>
            </button>
          )}
        </div>

        {policyEvents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No active policy violations. All enterprise endpoints are compliant.
          </div>
        ) : (
          <div className="space-y-3">
            {policyEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{evt.rule}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                      {evt.endpoint}
                    </span>
                    <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold">{evt.status}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      downloadReport({
                        filename: `Policy_Event_${evt.id}`,
                        title: `Enterprise Event: ${evt.rule}`,
                        format: "txt",
                        data: evt,
                      });
                      showToast("Event Exported", "Downloaded policy event detail.", "success");
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-colors"
                    title="Download Event Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(evt.id, evt.rule)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Dismiss Event"
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
