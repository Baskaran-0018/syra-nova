import React, { useState } from "react";
import {
  ShieldAlert,
  PhoneCall,
  Lock,
  ArrowLeft,
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  ExternalLink,
  Shield,
  HelpCircle,
  Clock,
  Send,
  Download,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { downloadReport } from "../../utils/exportReport";

export const EmergencySosPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, showToast } = useApp();
  const [incidentType, setIncidentType] = useState("UPI / Bank Account Fraud");
  const [complaintText, setComplaintText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const emergencySteps = [
    {
      step: "01",
      title: "Call National Cyber Helpline 1930 Immediately",
      desc: "Within 2-4 hours of fraud (the 'Golden Hour'), calling 1930 enables banks to freeze suspect recipient wallets before cash is withdrawn at ATMs.",
    },
    {
      step: "02",
      title: "Block / Freeze Digital Banking Cards & UPI",
      desc: "Log in through your bank's official app or net banking and toggle 'International Transactions OFF' and 'Temporary Freeze Card / UPI ID'.",
    },
    {
      step: "03",
      title: "File an Official Complaint on cybercrime.gov.in",
      desc: "Record the Transaction Reference Number (UTR / RRN), suspect mobile numbers, phishing screenshots, and SMS alerts for FIR logging.",
    },
    {
      step: "04",
      title: "Secure Linked Social Media & Email Accounts",
      desc: "Force logout of all sessions, change master passwords, and verify that recovery email/phone has not been silently modified.",
    },
  ];

  const handleDownloadEmergencyKit = () => {
    downloadReport({
      filename: `SYRA_Emergency_Incident_Response_Kit_${new Date().toISOString().slice(0, 10)}`,
      title: "SYRA NOVA Emergency Cyber Incident Response Action Kit",
      format: "txt",
      data: {
        hotline: "National Cyber Helpline: 1930",
        officialPortal: "https://cybercrime.gov.in",
        incidentProtocols: emergencySteps,
        currentDraftIncident: {
          category: incidentType,
          details: complaintText || "No user details entered yet",
          timestamp: new Date().toLocaleString(),
        },
      },
    });
    showToast("Emergency Kit Downloaded", "Exported response protocols and incident draft.", "success");
  };

  const generateComplaintTemplate = () => {
    const draft = `INCIDENT DRAFT FOR NATIONAL CYBER CRIME PORTAL (cybercrime.gov.in)
Incident Category: ${incidentType}
Victim Name: [Your Name]
Transaction Reference / UTR Number: [Enter Reference / UTR]
Suspect Phone Number / UPI ID: [Enter Suspect ID]
Date & Time of Incident: ${new Date().toLocaleString()}

Description of Incident:
${complaintText || "[Detail how the fraud happened, OTP requests, or fake caller credentials]"}

Attached Evidence:
- Bank statement showing debit transaction
- Screenshots of WhatsApp / SMS conversation
- Call logs with suspect number`;

    navigator.clipboard.writeText(draft);
    setIsCopied(true);
    showToast("Template Copied", "Ready to paste into national cybercrime portal.", "success");
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div id="emergency-sos-page" className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={navigateBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-red-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
              Emergency SOS & Fraud Incident Protocol
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Immediate action checklist for banking fraud, account takeover, or cyber extortion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="emergency-download-kit-btn"
            onClick={handleDownloadEmergencyKit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold text-xs transition-all"
            title="Download Emergency Action Kit"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Export Emergency Kit</span>
          </button>

          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Hotlines Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] glass-panel">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider">
              Golden Hour Response Window
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              National Cyber Crime Helpline: 1930
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Dial immediately to freeze money transfers across inter-bank gateways before unauthorized withdrawals occur.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="tel:1930"
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>Call 1930 Now</span>
            </a>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Step Recovery Protocol */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-heading">
          Immediate Action Protocol
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencySteps.map((s) => (
            <div
              key={s.step}
              className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-sm font-black flex items-center justify-center flex-shrink-0">
                {s.step}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-heading">{s.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Report Generator Tool */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-heading">
              Quick Cyber Incident Complaint Generator
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Formal FIR / Bank Draft</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Type</label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
            >
              <option>UPI / Bank Account Fraud</option>
              <option>SIM Swap / OTP Theft</option>
              <option>Social Media Extortion / Blackmail</option>
              <option>Fake Part-Time Job / Telegram Scam</option>
              <option>Identity Theft / Loan Impersonation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Description of Event</label>
            <input
              type="text"
              placeholder="e.g. Scammer asked for electricity bill OTP and ₹45,000 was debited via UPI"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={generateComplaintTemplate}
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
          <span>{isCopied ? "Formal Complaint Draft Copied to Clipboard" : "Generate & Copy Formal Police / Portal Complaint"}</span>
        </button>
      </div>
    </div>
  );
};
