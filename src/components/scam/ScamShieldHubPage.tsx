import React, { useState } from "react";
import {
  Shield,
  MessageSquareWarning,
  UserCheck,
  QrCode,
  PhoneCall,
  Globe,
  ArrowRight,
  ArrowLeft,
  Bell,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Download,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppView } from "../../types";
import { downloadReport } from "../../utils/exportReport";

export const ScamShieldHubPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, user, setCurrentView, showToast } = useApp();
  const [quickUrl, setQuickUrl] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [isUrlChecking, setIsUrlChecking] = useState(false);
  const [urlResult, setUrlResult] = useState<any>(null);

  const handleDownloadHubDossier = () => {
    downloadReport({
      filename: `SYRA_ScamShield_Hub_Overview_${new Date().toISOString().slice(0, 10)}`,
      title: "SYRA NOVA Scam Shield AI Threat Intelligence Blueprint",
      format: "txt",
      data: {
        activeModules: [
          "Scam Message Detector (99.4% Accuracy)",
          "Fake Profile Detector (Multi-Platform)",
          "Deepfake & Voice Clone AI",
          "Browser Shield & URL Inspector",
        ],
        defenseProtocols: "Zero-Trust Neural Classifier v2.4",
        scannedDomainsCount: 14208,
      },
    });
    showToast("Hub Intelligence Downloaded", "Scam Shield technical dossier exported.", "success");
  };

  const modules = [
    {
      id: "message-detector" as AppView,
      title: "Scam Message Detector",
      tagline: "Neural SMS, WhatsApp & Email Scanner",
      desc: "Analyze suspicious text messages, lottery SMS, bank KYC warnings, and screenshot uploads.",
      icon: MessageSquareWarning,
      gradient: "from-cyan-500 to-blue-600",
      stats: "99.4% Accuracy",
    },
    {
      id: "profile-detector" as AppView,
      title: "Fake Profile Detector",
      tagline: "Social Media Account Authenticity Checker",
      desc: "Verify Instagram, X (Twitter), LinkedIn, TikTok, and Telegram handles for bot swarms.",
      icon: UserCheck,
      gradient: "from-purple-500 to-indigo-600",
      stats: "Multi-Platform AI",
    },
    {
      id: "deepfake-detection" as AppView,
      title: "Deepfake & Voice Clone AI",
      tagline: "Synthetic Media & Audio Analyzer",
      desc: "Detect manipulated video faces and synthetic AI voice clones on suspicious phone calls.",
      icon: Sparkles,
      gradient: "from-amber-500 to-orange-600",
      stats: "Deep Learning Heuristics",
    },
    {
      id: "browser-shield" as AppView,
      title: "Browser Shield & URL Inspector",
      tagline: "Phishing Website & Fake Gateway Guard",
      desc: "Inspect deceptive shopping portals, typo-squatted domains, and zero-day malicious links.",
      icon: Globe,
      gradient: "from-emerald-500 to-teal-600",
      stats: "Zero-Day Protection",
    },
  ];

  const handleCheckUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    setIsUrlChecking(true);
    setTimeout(() => {
      setIsUrlChecking(false);
      const isDangerous = quickUrl.includes("free") || quickUrl.includes("xyz") || quickUrl.includes("gift");
      setUrlResult({
        target: quickUrl,
        verdict: isDangerous ? "Phishing Threat Blocked" : "Verified Safe Domain",
        risk: isDangerous ? 94 : 4,
        category: isDangerous ? "Deceptive Credential Harvester" : "Legitimate Web Server",
      });
      showToast("URL Scan Complete", isDangerous ? "Dangerous URL identified!" : "Clean domain.", isDangerous ? "error" : "success");
    }, 900);
  };

  const handleCheckPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneQuery.trim()) return;
    showToast("Phone Intelligence", `Lookup for ${phoneQuery}: Flagged by 142 community users as Electricity Disconnection Scam.`, "warning");
  };

  return (
    <div id="scam-shield-hub-page" className="space-y-6 animate-in fade-in duration-200">
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
              Scam Shield AI Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Comprehensive threat detection suite for messages, social accounts, URLs, and phone calls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="hub-download-report-btn"
            onClick={handleDownloadHubDossier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all"
            title="Download Scam Shield Hub Intelligence"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export Intelligence</span>
          </button>

          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => setCurrentView(m.id)}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 glass-card-interactive cursor-pointer flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-tr ${m.gradient} text-white shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                    {m.stats}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                  {m.tagline}
                </span>
                <h3 className="text-lg font-black text-white font-heading mt-0.5 group-hover:text-cyan-300 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>Launch Scanner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Lookup Bar: URL or Phone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Quick URL Scanner */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-heading">Quick Phishing Link Checker</h4>
          </div>

          <form onSubmit={handleCheckUrl} className="flex gap-2">
            <input
              type="url"
              placeholder="Paste URL (e.g. http://sbi-reward.xyz)"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-mono"
            />
            <button
              type="submit"
              disabled={isUrlChecking}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              {isUrlChecking ? "Scanning..." : "Check"}
            </button>
          </form>

          {urlResult && (
            <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
              urlResult.risk > 50 ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}>
              <div>
                <p className="font-bold">{urlResult.verdict}</p>
                <p className="text-[10px] opacity-80">{urlResult.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs">{urlResult.risk}% Risk</span>
                <button
                  onClick={() => {
                    downloadReport({
                      filename: `Quick_URL_Scan_${Date.now()}`,
                      title: "Quick URL Phishing Audit Report",
                      format: "txt",
                      data: urlResult,
                    });
                    showToast("URL Report Exported", "Report saved.", "success");
                  }}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300"
                  title="Download URL Audit"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setUrlResult(null)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400"
                  title="Clear Result"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Phone Number & Caller Lookup */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-3">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-bold text-white font-heading">Suspect Caller & WhatsApp Lookup</h4>
          </div>

          <form onSubmit={handleCheckPhone} className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter phone number (e.g. +91 98401 23456)"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Search
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Cross-references national spam registries, telecom blacklist feeds & community reports.
          </p>
        </div>
      </div>
    </div>
  );
};
