import React from "react";
import {
  X,
  Bell,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    alerts,
    markAlertAsRead,
    markAllAlertsAsRead,
    setCurrentView,
  } = useApp();

  if (!isNotificationOpen) return null;

  const getIcon = (type: string, severity: string) => {
    if (severity === "critical") return <ShieldAlert className="w-5 h-5 text-red-400" />;
    if (severity === "high") return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    if (type === "system") return <Info className="w-5 h-5 text-cyan-400" />;
    return <Bell className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div
      id="notification-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 flex justify-end"
      onClick={() => setIsNotificationOpen(false)}
    >
      <div
        id="notification-drawer-panel"
        className="w-full max-w-md h-full bg-slate-950/95 border-l border-slate-800 shadow-2xl flex flex-col glass-panel animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">Security Notifications</h3>
              <p className="text-xs text-slate-400">Live AI threat detection feed</p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/50 border-b border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">{alerts.length} Total Alerts</span>
          <button
            onClick={markAllAlertsAsRead}
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-white">All Clear! No Active Threats</p>
              <p className="text-xs text-slate-500 mt-1">SYRA NOVA real-time shields are actively defending your accounts.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  markAlertAsRead(alert.id);
                  if (alert.actionUrl) {
                    setCurrentView(alert.actionUrl);
                    setIsNotificationOpen(false);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  alert.read
                    ? "bg-slate-900/40 border-slate-800/80 opacity-75"
                    : "bg-slate-900/90 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.08)]"
                } hover:border-cyan-500/50 hover:opacity-100 group`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 flex-shrink-0 mt-0.5">
                    {getIcon(alert.type, alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {alert.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {alert.description}
                    </p>
                    {alert.actionUrl && (
                      <div className="mt-2.5 flex items-center text-[11px] font-semibold text-cyan-400 group-hover:text-cyan-300">
                        <span>Investigate Threat</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
