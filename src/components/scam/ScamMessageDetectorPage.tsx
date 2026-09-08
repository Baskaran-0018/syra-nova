import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  Bot,
  User,
  Sparkles,
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
  ShieldCheck,
  Search,
  Filter,
  Lightbulb,
  Check,
  Trash2,
  Activity,
  Layers,
  Zap,
  Code2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CircularProgress } from "../common/CircularProgress";
import { ScanRecord } from "../../types";
import { downloadReport } from "../../utils/exportReport";
import { analyzeMessageWithAI, AIMessageAnalysisResult } from "../../services/aiScanner";

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
  const [rawAiResponse, setRawAiResponse] = useState<AIMessageAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"All" | "AI-Generated" | "Human-Written" | "Mixed / Uncertain">("All");

  // Rotating educational tips on AI vs Human linguistics
  const [tipIndex, setTipIndex] = useState(0);

  const linguisticTips = [
    {
      title: "Understanding Perplexity (Vocabulary Predictability)",
      tip: "Perplexity measures how surprised a language model is by the next word. High perplexity reflects rich, unpredictable human word choices; low perplexity indicates formulaic LLM token sequences.",
    },
    {
      title: "Understanding Burstiness (Sentence Rhythm Variance)",
      tip: "Burstiness evaluates variation in sentence length and structure. Humans naturally mix short punchy fragments with complex thoughts. AI models produce evenly measured, uniform sentences.",
    },
    {
      title: "Common AI Transition Clichés",
      tip: "LLMs frequently overuse phrases like 'delve into', 'it is important to note', 'serves as a testament to', 'moreover', and 'fosters a collaborative environment'.",
    },
    {
      title: "Human Linguistic Signatures",
      tip: "Spontaneous conversational human writing contains typos, slang ('tbh', 'lol', 'ngl'), irregular punctuation, sentence fragments, and emotional nuance that generative models avoid.",
    },
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % linguisticTips.length);
    }, 6000);
    return () => clearInterval(tipInterval);
  }, [linguisticTips.length]);

  const loadingMessages = [
    "Evaluating vocabulary perplexity & entropy...",
    "Calculating sentence burstiness & variance...",
    "Scanning for stereotypical AI transition phrases...",
    "Synthesizing linguistic forensic assessment...",
  ];

  // Live word & sentence statistics
  const wordCount = messageText.trim() ? messageText.trim().split(/\s+/).length : 0;
  const charCount = messageText.length;
  const sentenceCount = messageText.trim() ? messageText.trim().split(/[.!?]+/).filter(Boolean).length : 0;

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
        setMessageText(`In today's rapidly evolving technological landscape, it is crucial to recognize the transformative power of automated intelligence. Furthermore, our platform stands as a testament to modern engineering, fostering an environment of seamless innovation.`);
      }
      showToast("File Attached", `Loaded ${file.name} for AI analysis.`, "info");
    }
  };

  const handleAnalyze = async () => {
    if (!messageText.trim() && !uploadedFile) {
      showToast("Input Required", "Please paste text or attach a document to analyze.", "warning");
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
      setRawAiResponse(data);

      const savedRecord = addScan({
        type: "message",
        target: messageText.slice(0, 180),
        riskScore: data.riskScore,
        verdict: data.verdict as any,
        category: data.category,
        confidence: data.confidence_score,
        confidence_score: data.confidence_score,
        perplexity_assessment: data.perplexity_assessment,
        burstiness_assessment: data.burstiness_assessment,
        reasoning: data.reasoning,
        indicators: data.reasoning.key_indicators,
        explanation: data.reasoning.summary,
        recommendations: data.recommendations,
      });

      setActiveResult(savedRecord);
      showToast(
        "Analysis Complete",
        `Verdict: ${savedRecord.verdict} (${data.confidence_score}% Confidence)`,
        savedRecord.verdict === "Human-Written" ? "success" : savedRecord.verdict === "AI-Generated" ? "info" : "warning"
      );
    } catch (err) {
      clearInterval(stageInterval);
      showToast("Analysis Error", "Failed to complete AI text analysis. Please try again.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyFormattedJson = () => {
    if (!activeResult && !rawAiResponse) return;
    const jsonOutput = {
      verdict: activeResult?.verdict || rawAiResponse?.verdict,
      confidence_score: activeResult?.confidence_score || activeResult?.confidence || rawAiResponse?.confidence_score || 85,
      perplexity_assessment: activeResult?.perplexity_assessment || rawAiResponse?.perplexity_assessment || "Medium",
      burstiness_assessment: activeResult?.burstiness_assessment || rawAiResponse?.burstiness_assessment || "Medium",
      reasoning: {
        summary: activeResult?.reasoning?.summary || activeResult?.explanation || rawAiResponse?.reasoning.summary,
        perplexity_reason: activeResult?.reasoning?.perplexity_reason || rawAiResponse?.reasoning.perplexity_reason,
        burstiness_reason: activeResult?.reasoning?.burstiness_reason || rawAiResponse?.reasoning.burstiness_reason,
        key_indicators: activeResult?.reasoning?.key_indicators || activeResult?.indicators || rawAiResponse?.reasoning.key_indicators,
      },
    };
    navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
    setCopiedJson(true);
    showToast("JSON Copied", "Formatted AI detection JSON copied to clipboard.", "success");
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleCopyReport = () => {
    if (!activeResult) return;
    const reportStr = `SYRA NOVA AI-DETECTION ANALYZER REPORT
==================================================
Target Text: "${activeResult.target}"
Verdict: ${activeResult.verdict}
Confidence Score: ${activeResult.confidence_score || activeResult.confidence}%
Perplexity Assessment: ${activeResult.perplexity_assessment || "Medium"}
Burstiness Assessment: ${activeResult.burstiness_assessment || "Medium"}

REASONING SUMMARY:
${activeResult.reasoning?.summary || activeResult.explanation}

PERPLEXITY ANALYSIS:
${activeResult.reasoning?.perplexity_reason || "Analyzed vocabulary distribution."}

BURSTINESS ANALYSIS:
${activeResult.reasoning?.burstiness_reason || "Analyzed structural rhythm variance."}

KEY IDENTIFIED INDICATORS:
${(activeResult.reasoning?.key_indicators || activeResult.indicators || []).map((i) => `• ${i}`).join("\n")}
==================================================`;
    navigator.clipboard.writeText(reportStr);
    setCopied(true);
    showToast("Report Copied", "AI analysis report copied to clipboard.", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = () => {
    if (!activeResult) return;
    const content = `==================================================
SYRA NOVA AI-DETECTION ANALYZER REPORT
==================================================
Scan ID: ${activeResult.id}
Date: ${activeResult.date}
Analyzed Text: "${activeResult.target}"

VERDICT: ${activeResult.verdict}
CONFIDENCE SCORE: ${activeResult.confidence_score || activeResult.confidence}%
PERPLEXITY ASSESSMENT: ${activeResult.perplexity_assessment || "Medium"}
BURSTINESS ASSESSMENT: ${activeResult.burstiness_assessment || "Medium"}

SUMMARY:
${activeResult.reasoning?.summary || activeResult.explanation}

PERPLEXITY ANALYSIS:
${activeResult.reasoning?.perplexity_reason || "Standard lexical distribution."}

BURSTINESS ANALYSIS:
${activeResult.reasoning?.burstiness_reason || "Standard structural pacing."}

KEY LINGUISTIC INDICATORS:
${(activeResult.reasoning?.key_indicators || activeResult.indicators || []).map((i) => `• ${i}`).join("\n")}

RECOMMENDATIONS / PROTOCOL:
${(activeResult.recommendations || []).map((r) => `✓ ${r}`).join("\n")}

Verified by SYRA NOVA Linguistic Forensics Engine v2.0
==================================================`;
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `SYRA-NOVA-AI-Detection-${activeResult.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast("Report Downloaded", "Text analysis dossier downloaded.", "success");
  };

  const handleShare = () => {
    if (navigator.share && activeResult) {
      navigator
        .share({
          title: "SYRA NOVA AI Detection Analysis",
          text: `Text Analysis Verdict: ${activeResult.verdict} (${activeResult.confidence_score || activeResult.confidence}% Confidence) on SYRA NOVA.`,
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                AI vs Human Text Analyzer
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Perplexity & Burstiness Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Evaluate messages and text to determine if they were written by a human or generated by an AI model.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {messageScans.length > 0 && (
            <button
              id="scam-detector-download-all-btn"
              onClick={() => {
                downloadReport({
                  filename: `SYRA_AI_Detection_Telemetry_${new Date().toISOString().slice(0, 10)}`,
                  title: "Aggregated AI Text Detection Forensic Dossier",
                  format: "txt",
                  data: {
                    totalScans: messageScans.length,
                    threats: messageScans,
                  },
                });
                showToast("Reports Exported", `Downloaded ${messageScans.length} text scan reports.`, "success");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all"
              title="Download All Scan Reports"
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
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-heading">Input Text for AI Evaluation</h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{sentenceCount} sentences</span>
                <span>•</span>
                <span>{charCount}/5000 chars</span>
              </div>
            </div>

            {/* Large Text Area */}
            <div className="relative">
              <textarea
                id="scam-message-textarea"
                rows={6}
                maxLength={5000}
                placeholder="Paste the message, email, essay, or chat snippet here to evaluate whether it was written by a human or generated by an AI model..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-y leading-relaxed font-sans"
              />
              {messageText && (
                <button
                  onClick={() => setMessageText("")}
                  className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Clear text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Sample Prompts */}
            <div>
              <span className="text-[10px] text-slate-400 font-medium block mb-1.5">
                Test with 1-click sample prompts:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    setMessageText(
                      "In today's fast-paced digital era, it is imperative to delve into the transformative implications of cutting-edge paradigms. Furthermore, our comprehensive framework serves as a testament to innovation, fostering a collaborative ecosystem designed to unlock unprecedented potential across diverse domains."
                    )
                  }
                  className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 transition-colors font-medium flex items-center gap-1"
                >
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span>AI Model Essay</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessageText(
                      "Moreover, our state-of-the-art cybersecurity platform harnesses the power of neural intelligence to deliver a holistic defense strategy. Notably, this innovative solution plays a pivotal role in revolutionizing digital asset protection."
                    )
                  }
                  className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors font-medium flex items-center gap-1"
                >
                  <Bot className="w-3 h-3 text-indigo-400" />
                  <span>AI Marketing Pitch</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessageText(
                      "hey bro, u free tonight? thinking of grabbing tacos around 8 or maybe just chilling at my place lol let me know"
                    )
                  }
                  className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors font-medium flex items-center gap-1"
                >
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>Casual Human Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessageText(
                      "Deployed the hotfix to prod about 10 mins ago. Found a memory leak in the websocket event listener buffer. Still watching Datadog logs closely, let's keep an eye on p99 latency during the lunch rush."
                    )
                  }
                  className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors font-medium flex items-center gap-1"
                >
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>Human Tech Note</span>
                </button>
              </div>
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
                    <span className="text-cyan-400 font-semibold">Click to upload</span> or drag and drop text document
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
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wide shadow-xl shadow-cyan-500/20 transition-all transform active:scale-95 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>{loadingMessages[loadingStage]}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Analyze Text Authenticity</span>
                </>
              )}
            </button>
          </div>

          {/* AI Insights Card (Rotating Linguistic Tips) */}
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-slate-900/90 via-slate-900/90 to-purple-950/30 border border-slate-800 glass-panel shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                  Linguistic Forensics Insights
                </h4>
              </div>
              <div className="flex items-center gap-1">
                {linguisticTips.map((_, idx) => (
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
              {linguisticTips[tipIndex].title}
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              {linguisticTips[tipIndex].tip}
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
                    AI vs Human Verdict
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5 font-heading">
                    {activeResult.verdict}
                  </h3>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                    activeResult.verdict === "AI-Generated"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                      : activeResult.verdict === "Human-Written"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(34,197,94,0.35)]"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                  }`}
                >
                  {activeResult.verdict === "AI-Generated" && <Bot className="w-4 h-4 text-purple-400" />}
                  {activeResult.verdict === "Human-Written" && <User className="w-4 h-4 text-emerald-400" />}
                  {activeResult.verdict === "Mixed / Uncertain" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  <span>{activeResult.verdict}</span>
                </div>
              </div>

              {/* Confidence Score Meter */}
              <div className="flex flex-col items-center justify-center py-2 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <CircularProgress
                  value={activeResult.confidence_score || activeResult.confidence || 85}
                  size={140}
                  strokeWidth={11}
                  colorScheme={activeResult.verdict === "AI-Generated" ? "risk" : activeResult.verdict === "Human-Written" ? "safety" : "identity"}
                  label="Confidence"
                />
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Linguistic Model Confidence: {activeResult.confidence_score || activeResult.confidence}%
                </p>
              </div>

              {/* Perplexity & Burstiness Dual Gauges */}
              <div className="grid grid-cols-2 gap-3">
                {/* Perplexity Card */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px] font-bold text-white">Perplexity</span>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        activeResult.perplexity_assessment === "High"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : activeResult.perplexity_assessment === "Low"
                          ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {activeResult.perplexity_assessment || "Medium"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {activeResult.reasoning?.perplexity_reason || "Vocabulary predictability distribution assessment."}
                  </p>
                </div>

                {/* Burstiness Card */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[11px] font-bold text-white">Burstiness</span>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        activeResult.burstiness_assessment === "High"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : activeResult.burstiness_assessment === "Low"
                          ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {activeResult.burstiness_assessment || "Medium"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {activeResult.reasoning?.burstiness_reason || "Sentence length variation and structural rhythm."}
                  </p>
                </div>
              </div>

              {/* Reasoning Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-cyan-300 block text-[11px] uppercase tracking-wider">
                  Reasoning Summary:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeResult.reasoning?.summary || activeResult.explanation}
                </p>
              </div>

              {/* Key Indicators / Stylistic Traits */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Identified Stylistic Traits</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(activeResult.reasoning?.key_indicators || activeResult.indicators || []).map((ind, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-[11px] text-slate-200 font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <span>{ind}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyFormattedJson}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
                    title="Copy exact JSON format"
                  >
                    {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Code2 className="w-4 h-4 text-cyan-400" />}
                    <span>{copiedJson ? "JSON Copied" : "Copy JSON"}</span>
                  </button>

                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                    title="Copy full text summary"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
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
                    <span>New Scan</span>
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
                </div>
              </div>
            </div>
          ) : (
            /* Empty State for AI Result */
            <div className="h-full min-h-[420px] p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-indigo-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Sparkles className="w-8 h-8 text-cyan-300" />
              </div>
              <h4 className="text-base font-bold text-white font-heading">AI Linguistic Forensics Ready</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Paste any text or test sample. The AI engine will compute <span className="text-cyan-300 font-semibold">Perplexity</span>, <span className="text-purple-300 font-semibold">Burstiness</span>, and evaluate <span className="text-emerald-300 font-semibold">AI vs Human authenticity</span>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans History Section */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white font-heading">Recent Text Authenticity Scans</h3>
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
              <option value="AI-Generated">AI-Generated</option>
              <option value="Human-Written">Human-Written</option>
              <option value="Mixed / Uncertain">Mixed / Uncertain</option>
            </select>

            {messageScans.length > 0 && (
              <button
                id="scam-clear-msg-history-btn"
                onClick={clearAllScans}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/20 border border-slate-800 hover:border-red-500/30 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                title="Clear all scan history"
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
              No text scan records found matching your filters.
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
                        scan.verdict === "AI-Generated"
                          ? "bg-purple-500/20 text-purple-300"
                          : scan.verdict === "Human-Written"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {scan.verdict} ({scan.confidence_score || scan.confidence}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 italic">
                    "{scan.target}"
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-semibold">{scan.category || "Text Assessment"}</span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        downloadReport({
                          filename: `Scan_AI_${scan.id}`,
                          title: `AI Forensic Report: ${scan.verdict}`,
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
