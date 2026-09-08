import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  MessageSquareWarning,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  RefreshCw,
  Copy,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  FileDown,
  Check,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CircularProgress } from "../common/CircularProgress";
import { ScanRecord } from "../../types";
import { downloadReport } from "../../utils/exportReport";
import { analyzeMessageWithAI } from "../../services/aiScanner";

export const ScamMessageDetectorPage: React.FC = () => {
  const {
    navigateBack,
    setIsNotificationOpen,
    user,
    scans,
    addScan,
    deleteScan,
    clearAllScans,
    setCurrentView,
    showToast,
  } = useApp();

  const [messageText, setMessageText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [activeResult, setActiveResult] = useState<ScanRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"All" | "Scam Detected" | "Suspicious" | "Safe">("All");

  // Rotating tips index
  const [tipIndex, setTipIndex] = useState(0);

  const securityTips = [
    {
      title: "Urgent Payment & Electricity Scams",
      tip: "Scammers often threaten to disconnect electricity or block bank accounts within 2 hours. Official utilities never send disconnection threats with personal mobile numbers or APK download links.",
    },
    {
      title: "The Golden Rule of UPI / QR Codes",
      tip: "Entering your UPI PIN or scanning a QR code is ONLY required to send money, NEVER to receive money or cashback rewards. If someone asks for your PIN to send you money, it is 100% fraud.",
    },
    {
      title: "Look Out for Domain Spoofing",
      tip: "Fraudulent links often use deceptive extensions like .xyz, .top, or slight misspellings like 'sbi-online-kyc.com' instead of official domains like 'onlinesbi.sbi'.",
    },
    {
      title: "Part-Time Job & Telegram Task Scams",
      tip: "Messages promising ₹5,000/day for liking YouTube videos or rating hotels are advance-fee pyramid scams. Never pay 'security deposit' to unlock fake earnings.",
    },
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % securityTips.length);
    }, 6000);
    return () => clearInterval(tipInterval);
  }, [securityTips.length]);

  const loadingMessages = [
    "Analyzing message...",
    "Checking fraud indicators...",
    "Running AI security analysis...",
    "Comparing against known scam patterns...",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = (file.size / 1024).toFixed(1) + " KB";
      setUploadedFile({
        name: file.name,
        size: sizeStr,
        type: file.type || "Document",
      });
      if (!messageText) {
        setMessageText(`[Extracted text from ${file.name}]: Dear customer, your bank account #XXXX has been flagged. Please verify KYC immediately to prevent account closure.`);
      }
      showToast("File Attached", `Loaded ${file.name} for AI analysis.`, "info");
    }
  };

  const handleAnalyze = async () => {
    if (!messageText.trim() && !uploadedFile) {
      showToast("Input Required", "Please paste a message or upload a screenshot to analyze.", "warning");
      return;
    }

    setIsAnalyzing(true);
    setLoadingStage(0);

    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const data = await analyzeMessageWithAI(
        messageText,
        uploadedFile ? "file_screenshot" : "text"
      );
      clearInterval(stageInterval);

      const savedRecord = addScan({
        type: "message",
        target: messageText.slice(0, 180),
        riskScore: data.riskScore,
        verdict: data.verdict,
        category: data.category,
        confidence: data.confidence,
        indicators: data.threatIndicators,
        explanation: data.explanation,
        recommendations: data.recommendations,
      });

      setActiveResult(savedRecord);
      showToast(
        "Analysis Complete",
        `Result: ${savedRecord.verdict} (${savedRecord.riskScore}% Risk)`,
        savedRecord.verdict === "Safe" ? "success" : savedRecord.verdict === "Suspicious" ? "warning" : "error"
      );
    } catch (err) {
      clearInterval(stageInterval);
      showToast("Analysis Error", "Failed to analyze message. Please try again.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    if (!activeResult) return;
    const reportStr = `SYRA NOVA SCAM AUDIT REPORT\nDate: ${activeResult.date}\nVerdict: ${activeResult.verdict}\nRisk Score: ${activeResult.riskScore}%\nCategory: ${activeResult.category}\nIndicators: ${activeResult.indicators.join(", ")}\nExplanation: ${activeResult.explanation}\nRecommendations:\n- ${activeResult.recommendations.join("\n- ")}`;
    navigator.clipboard.writeText(reportStr);
    setCopied(true);
    showToast("Report Copied", "Audit report copied to clipboard.", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    showToast("Generating PDF", "Downloading complete SYRA NOVA Forensic Security Report...", "info");
    // Generate simple downloadable text file as report artifact
    const element = document.createElement("a");
    const file = new Blob(
      [
        `==================================================
SYRA NOVA AI CYBER SECURITY AUDIT REPORT
==================================================
Scan ID: ${activeResult?.id || "SCN-1001"}
Timestamp: ${activeResult?.date || new Date().toISOString()}
Target: ${activeResult?.target}
Verdict: ${activeResult?.verdict}
Risk Score: ${activeResult?.riskScore}%
Confidence: ${activeResult?.confidence}%

THREAT INDICATORS:
${activeResult?.indicators.map((i) => `• ${i}`).join("\n")}

AI EXPLANATION:
${activeResult?.explanation}

RECOMMENDED ACTIONS:
${activeResult?.recommendations.map((r) => `✓ ${r}`).join("\n")}

Verified by SYRA NOVA Neural Scam Detection Model v1.0
==================================================`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `SYRA-NOVA-Scam-Report-${activeResult?.id || "SCAN"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "SYRA NOVA Scam Analysis",
          text: `I scanned a suspicious message on SYRA NOVA. Verdict: ${activeResult?.verdict} (${activeResult?.riskScore}% Risk). Stay safe!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopyReport();
    }
  };

  const messageScans = scans.filter((s) => s.type === "message");
  const filteredScans = messageScans.filter((s) => {
    const matchesSearch =
      s.target.toLowerCase().includes(historySearch.toLowerCase()) ||
      s.category.toLowerCase().includes(historySearch.toLowerCase()) ||
      s.indicators.some((ind) => ind.toLowerCase().includes(historySearch.toLowerCase()));
    const matchesFilter = historyFilter === "All" || s.verdict === historyFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="scam-message-detector-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="scam-detector-back-btn"
            onClick={navigateBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              Scam Message Detector
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Analyze suspicious messages using AI and receive a detailed security assessment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {messageScans.length > 0 && (
            <button
              id="scam-detector-download-all-btn"
              onClick={() => {
                downloadReport({
                  filename: `SYRA_Message_Scan_Telemetry_${new Date().toISOString().slice(0, 10)}`,
                  title: "Aggregated Message Threat Forensic Dossier",
                  format: "txt",
                  data: {
                    totalScans: messageScans.length,
                    threats: messageScans,
                  },
                });
                showToast("Reports Exported", `Downloaded ${messageScans.length} message scan reports.`, "success");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all"
              title="Download All Message Scan Reports"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Export Scans</span>
            </button>
          )}

          <button
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <div
            onClick={() => setCurrentView("profile")}
            className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-500/30 cursor-pointer bg-slate-800"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>

      {/* Main Grid: Input & AI Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: Input Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-heading">Input Suspicious Content</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {messageText.length}/5000 chars
              </span>
            </div>

            {/* Large Text Area */}
            <div className="relative">
              <textarea
                id="scam-message-textarea"
                rows={6}
                maxLength={5000}
                placeholder="Paste the suspicious message here (SMS, WhatsApp text, email body, Telegram message, reward alert)..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-y leading-relaxed font-sans"
              />
              {messageText && (
                <button
                  onClick={() => setMessageText("")}
                  className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Sample Prompts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-medium">Try sample:</span>
              <button
                type="button"
                onClick={() =>
                  setMessageText(
                    "Hey, are you free for lunch tomorrow around 1:00 PM? Let me know if that works!"
                  )
                }
                className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors font-medium"
              >
                Safe Chat
              </button>
              <button
                type="button"
                onClick={() =>
                  setMessageText(
                    "Dear Customer, INR 450.00 debited from A/C XX8912 on 08-Sep-26 towards Metro Card. Avl Bal: INR 15,200.00 - HDFC Bank"
                  )
                }
                className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors font-medium"
              >
                Legitimate Bank Alert
              </button>
              <button
                type="button"
                onClick={() =>
                  setMessageText(
                    "Dear customer, your SBI NetBanking account will be BLOCKED today. Update your PAN card immediately by downloading the APK: http://sbi-kyc-secure.xyz to continue UPI service."
                  )
                }
                className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30 transition-colors font-medium"
              >
                Fake Bank KYC Scam
              </button>
              <button
                type="button"
                onClick={() =>
                  setMessageText(
                    "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM because previous month bill was not updated. Call electricity officer at 9876543210 immediately."
                  )
                }
                className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors font-medium"
              >
                Electricity Scam
              </button>
              <button
                type="button"
                onClick={() =>
                  setMessageText(
                    "CONGRATULATIONS! You have won ₹25,00,000 in KBC Lucky Draw. Enter your UPI PIN on http://bit.ly/claim-kbc to receive prize money."
                  )
                }
                className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 transition-colors font-medium"
              >
                UPI Lottery Fraud
              </button>
            </div>

            {/* Upload File Section */}
            <div className="pt-3 border-t border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Upload Document or Screenshot (TXT, PDF, DOCX, PNG, JPG)
              </label>

              {uploadedFile ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      {uploadedFile.type.includes("image") ? (
                        <ImageIcon className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-white">{uploadedFile.name}</p>
                      <p className="text-[10px] text-cyan-300/80 font-mono">{uploadedFile.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-semibold text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors">
                      Replace
                      <input
                        type="file"
                        accept=".txt,.pdf,.docx,image/png,image/jpeg"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  id="scam-message-file-dropzone"
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/40 bg-slate-950/40 hover:bg-slate-900/60 cursor-pointer transition-all group text-center"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                  <p className="text-xs font-medium text-slate-300">
                    <span className="text-cyan-400 font-semibold">Click to upload</span> or drag and drop screenshot
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, PDF, DOCX, TXT up to 10MB</p>
                  <input
                    type="file"
                    accept=".txt,.pdf,.docx,image/png,image/jpeg"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              id="analyze-message-btn"
              type="button"
              disabled={isAnalyzing || (!messageText.trim() && !uploadedFile)}
              onClick={handleAnalyze}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-cyan-500/25 transition-all transform active:scale-95 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{loadingMessages[loadingStage]}</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </div>

          {/* AI Insights Card (Rotating Security Tips) */}
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-slate-900/90 via-slate-900/90 to-cyan-950/30 border border-slate-800 glass-panel shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                  AI Cyber Security Insights
                </h4>
              </div>
              <div className="flex items-center gap-1">
                {securityTips.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTipIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      tipIndex === idx ? "w-4 bg-cyan-400" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h5 className="text-xs font-bold text-cyan-300 mb-1">
              {securityTips[tipIndex].title}
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              {securityTips[tipIndex].tip}
            </p>
          </div>
        </div>

        {/* Right Column: AI Analysis Result (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          {activeResult ? (
            <div
              id="scam-analysis-result-card"
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl glass-panel animate-in zoom-in-95 duration-200 space-y-5"
            >
              {/* Verdict Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    AI Security Assessment
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5 font-heading">
                    {activeResult.category}
                  </h3>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                    activeResult.verdict === "Scam Detected"
                      ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                      : activeResult.verdict === "Suspicious"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                  }`}
                >
                  {activeResult.verdict === "Scam Detected" && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
                  {activeResult.verdict === "Suspicious" && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {activeResult.verdict === "Safe" && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{activeResult.verdict}</span>
                </div>
              </div>

              {/* Circular Risk Score Meter */}
              <div className="flex flex-col items-center justify-center py-2">
                <CircularProgress
                  value={activeResult.riskScore}
                  size={150}
                  strokeWidth={12}
                  colorScheme="risk"
                  label="Risk Score"
                />
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Neural Confidence: {activeResult.confidence}%
                </p>
              </div>

              {/* Threat Indicators Chips */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Detected Threat Indicators
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeResult.indicators.map((ind, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-[11px] text-slate-200 font-medium"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>{ind}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Plain Language Explanation */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-300 block mb-1">AI Explanation:</span>
                <p className="text-slate-300 leading-relaxed">{activeResult.explanation}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Recommended Actions
                </h4>
                <div className="space-y-1.5">
                  {activeResult.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-300 p-2 rounded-xl bg-slate-850/60 border border-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied" : "Copy Report"}</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveResult(null);
                      setMessageText("");
                      setUploadedFile(null);
                    }}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-400 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Scan Another</span>
                  </button>
                  <button
                    onClick={() => {
                      if (activeResult) {
                        deleteScan(activeResult.id);
                        setActiveResult(null);
                      }
                    }}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Scan Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => setCurrentView("community")}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-medium text-red-400 transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State for AI Result */
            <div className="h-full min-h-[380px] p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white font-heading">AI Security Scanner Ready</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Paste any SMS, WhatsApp alert, or upload a screenshot. Our neural scam engine will generate a complete risk audit.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans History Section */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white font-heading">Recent Message Scans</h3>
            <p className="text-xs text-slate-400">Search and review previously analyzed messages</p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
            >
              <option value="All">All Verdicts</option>
              <option value="Scam Detected">Scam Detected</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Safe">Safe</option>
            </select>

            {messageScans.length > 0 && (
              <button
                id="scam-clear-msg-history-btn"
                onClick={clearAllScans}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/20 border border-slate-800 hover:border-red-500/30 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                title="Clear all message scan history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* History Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScans.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-500 text-xs">
              No message scan records found matching your filters.
            </div>
          ) : (
            filteredScans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => setActiveResult(scan)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 glass-card-interactive cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500">{scan.date}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        scan.verdict === "Scam Detected"
                          ? "bg-red-500/20 text-red-400"
                          : scan.verdict === "Suspicious"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {scan.verdict} ({scan.riskScore}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 italic">
                    "{scan.target}"
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-semibold">{scan.category}</span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        downloadReport({
                          filename: `Scan_Message_${scan.id}`,
                          title: `Message Forensic Report: ${scan.category}`,
                          format: "txt",
                          data: scan,
                        });
                        showToast("Report Exported", `Downloaded scan #${scan.id} report.`, "success");
                      }}
                      className="p-1 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Download Scan Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteScan(scan.id)}
                      className="p-1 rounded-md bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Scan Record"
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
    </div>
  );
};
