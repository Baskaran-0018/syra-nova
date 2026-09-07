import React, { useState } from "react";
import {
  Video,
  Mic,
  ArrowLeft,
  Bell,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Play,
  Volume2,
  Download,
  Trash2,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CircularProgress } from "../common/CircularProgress";
import { downloadReport } from "../../utils/exportReport";

export const DeepfakeDetectionPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, showToast } = useApp();
  const [tab, setTab] = useState<"video" | "voice">("video");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleDownloadDeepfakeDossier = () => {
    downloadReport({
      filename: `SYRA_Deepfake_Forensic_Report_${new Date().toISOString().slice(0, 10)}`,
      title: "Synthetic Media & Audio Deepfake Analysis Dossier",
      format: "txt",
      data: scanResult || {
        scannerMode: tab,
        detectionEngines: "GAN Noise Residual Analysis + Audio Phoneme Synchronizer v3.2",
        status: "Ready for ingestion",
      },
    });
    showToast("Report Exported", "Deepfake forensic analysis dossier downloaded.", "success");
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        mediaType: tab === "video" ? "Video Media" : "Audio Voicemail",
        filename: selectedFile || (tab === "video" ? "suspect_conference_call.mp4" : "whatsapp_voice_urgent_transfer.m4a"),
        date: new Date().toLocaleString(),
        verdict: "Manipulated Synthetic Media Detected",
        risk: 91,
        confidence: 94,
        artifacts: [
          "Blinking frequency anomaly (< 4 blinks/min)",
          "Facial boundary warping near jawline",
          "Audio-visual phoneme desynchronization",
          "Synthesized GAN noise texture in background",
        ],
        explanation: "Neural frame analysis reveals deepfake synthesis markers and unnatural lip motion synthesis.",
      });
      showToast("Deepfake Analysis Complete", "High-confidence synthetic media detected.", "error");
    }, 1500);
  };

  return (
    <div id="deepfake-detection-page" className="space-y-6 animate-in fade-in duration-200 pb-12">
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
              Deepfake & AI Voice Detection
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Inspect video footage, webcam feeds, and audio voicemails for synthetic manipulation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="deepfake-download-report-btn"
            onClick={handleDownloadDeepfakeDossier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all"
            title="Download Deepfake Forensic Report"
          >
            <Download className="w-4 h-4 text-amber-400" />
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            setTab("video");
            setScanResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === "video"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Deepfake Video Scanner</span>
        </button>

        <button
          onClick={() => {
            setTab("voice");
            setScanResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === "voice"
              ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20"
              : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>AI Voice Clone & Call Analyzer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Inspect Box (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-heading">
                {tab === "video" ? "Upload Video or Video Call Recording" : "Upload Audio Voicemail / Phone Call Clip"}
              </h3>
              {selectedFile && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove File</span>
                </button>
              )}
            </div>

            <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/40 bg-slate-950/50 cursor-pointer transition-all text-center group">
              <input
                type="file"
                className="hidden"
                accept={tab === "video" ? "video/*" : "audio/*"}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0].name);
                    showToast("File Loaded", `Selected ${e.target.files[0].name}`, "info");
                  }
                }}
              />
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
              <p className="text-xs font-medium text-slate-300">
                <span className="text-cyan-400 font-semibold">
                  {selectedFile ? selectedFile : "Click to upload media"}
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {tab === "video" ? "MP4, MOV, WEBM up to 100MB" : "MP3, WAV, M4A up to 50MB"}
              </p>
            </label>

            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting Neural Spectral Features...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze for Synthetic Manipulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Area (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {scanResult ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-red-500/40 glass-panel shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">AI Forensics Report</span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold text-[10px] border border-red-500/30">
                  {scanResult.confidence}% Confidence
                </span>
              </div>

              <div className="flex flex-col items-center">
                <CircularProgress
                  value={scanResult.risk}
                  size={130}
                  strokeWidth={10}
                  colorScheme="risk"
                  label="Synthetic Risk"
                />
              </div>

              <h4 className="text-sm font-bold text-white text-center font-heading">{scanResult.verdict}</h4>

              <div className="space-y-1.5 pt-2">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detected Artefacts:</p>
                {scanResult.artifacts.map((a: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-red-300 p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    downloadReport({
                      filename: `Deepfake_Audit_${Date.now()}`,
                      title: "Media Deepfake AI Forensic Audit",
                      format: "txt",
                      data: scanResult,
                    });
                    showToast("Report Exported", "Downloaded deepfake forensic report.", "success");
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>

                <button
                  onClick={() => {
                    setScanResult(null);
                    setSelectedFile(null);
                    showToast("Analysis Cleared", "Result reset.", "info");
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete/Clear Result"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
              <Video className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-sm font-bold text-white">Media Forensic Engine Ready</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Upload a video or audio sample to analyze facial landmarks, GAN textures, and voice synthesis signatures.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
