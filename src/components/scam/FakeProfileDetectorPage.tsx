import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  UserCheck,
  Link as LinkIcon,
  AtSign,
  Upload,
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
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  Youtube,
  MessageCircle,
  Video,
  Check,
  AlertOctagon,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CircularProgress } from "../common/CircularProgress";
import { ScanRecord } from "../../types";
import { downloadReport } from "../../utils/exportReport";
import { analyzeProfileWithAI } from "../../services/aiScanner";

export const FakeProfileDetectorPage: React.FC = () => {
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

  const [inputMode, setInputMode] = useState<"url" | "username" | "screenshot">("url");
  const [profileUrl, setProfileUrl] = useState("");
  const [username, setUsername] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [followersCount, setFollowersCount] = useState("");
  const [followingCount, setFollowingCount] = useState("");
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [screenshotPreview, setScreenshotPreview] = useState<{ name: string; url: string } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [activeResult, setActiveResult] = useState<ScanRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [historySearch, setHistorySearch] = useState("");
  const [historyPlatform, setHistoryPlatform] = useState("All");

  const [tipIndex, setTipIndex] = useState(0);

  // Quick Test Demo Profiles for immediate 1-click testing
  const demoProfiles = [
    {
      label: "Fake Bank Support",
      type: "fake",
      platform: "Instagram",
      handle: "@sbi_customercare_24x7_support",
      bio: "24x7 Official Helpline for SBI Bank. Urgent KYC updates, unblock accounts, instant refund support. Call or WhatsApp toll-free: wa.me/+919876543210",
      followers: "14",
      following: "4,850",
    },
    {
      label: "Celebrity Crypto Scam",
      type: "fake",
      platform: "X (Twitter)",
      handle: "@elonmusk_airdrop_official",
      bio: "Official Tesla & SpaceX 5,000 BTC / ETH Giveaway! Send 0.1 BTC to get 0.2 BTC back instantly. Claim now: bit.ly/tesla-airdrop-win",
      followers: "28",
      following: "3,200",
    },
    {
      label: "Romance Catfish Bot",
      type: "fake",
      platform: "Facebook",
      handle: "@dr_richard_army_surgeon",
      bio: "US Army Chief Medical Surgeon stationed on peacekeeping mission in Syria. Widower looking for an honest and sincere woman for true love. DM on WhatsApp.",
      followers: "5",
      following: "1,980",
    },
    {
      label: "Giveaway / Prize Scam",
      type: "fake",
      platform: "Instagram",
      handle: "@amazon_lucky_winner_claim2025",
      bio: "Congratulations! You won the iPhone 16 Pro Diwali Lucky Draw. Send screenshot and pay ₹499 processing gas fee to receive your parcel: t.me/claimprize",
      followers: "42",
      following: "4,100",
    },
    {
      label: "Suspicious Deal Bot",
      type: "suspicious",
      platform: "Telegram",
      handle: "@hot_deals_loot_bot9841",
      bio: "Daily loot deals & 90% discount cashback coupons. Click link to download cash app APK bit.ly/hotdeal-apk",
      followers: "120",
      following: "950",
    },
    {
      label: "Legitimate Creator",
      type: "genuine",
      platform: "YouTube",
      handle: "@mkbhd",
      bio: "Quality tech videos | YouTuber | Host of Waveform Podcast | Ultimate Frisbee player",
      followers: "18.5M",
      following: "420",
    },
    {
      label: "Official Brand",
      type: "genuine",
      platform: "Instagram",
      handle: "@google",
      bio: "Official account for Google. Organizing the world's information and making it universally accessible and useful.",
      followers: "15.2M",
      following: "85",
    },
  ];

  const handleSelectDemo = (demo: typeof demoProfiles[0]) => {
    setSelectedPlatform(demo.platform);
    setInputMode("username");
    setUsername(demo.handle);
    setProfileUrl(`https://${demo.platform.toLowerCase().replace(/[^a-z]/g, "")}.com/${demo.handle.replace("@", "")}`);
    setProfileBio(demo.bio);
    setFollowersCount(demo.followers);
    setFollowingCount(demo.following);
    setShowAdvancedStats(true);
    setErrorMessage(null);
    showToast("Sample Loaded", `Loaded sample account ${demo.handle} (${demo.label})`, "info");
  };

  const platforms = [
    { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600" },
    { name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-700" },
    { name: "X (Twitter)", icon: Twitter, color: "from-slate-700 to-slate-900" },
    { name: "LinkedIn", icon: Linkedin, color: "from-blue-700 to-cyan-700" },
    { name: "TikTok", icon: Video, color: "from-slate-900 to-pink-600" },
    { name: "YouTube", icon: Youtube, color: "from-red-600 to-red-700" },
    { name: "Telegram", icon: Send, color: "from-sky-500 to-blue-500" },
    { name: "WhatsApp", icon: MessageCircle, color: "from-emerald-500 to-green-600" },
    { name: "Snapchat", icon: MessageCircle, color: "from-yellow-400 to-amber-500" },
  ];

  const safetyTips = [
    {
      title: "Signs of Impersonation & Cloned Accounts",
      tip: "Fake accounts frequently add underscores, numbers, or words like 'official', 'support', or 'vip' to mimic celebrities, influencers, or corporate support handles.",
    },
    {
      title: "Romance & Catfishing Warning Signs",
      tip: "Be vigilant if a new online acquaintance professes deep affection quickly, avoids live video calls, or eventually claims a sudden financial or medical crisis requiring money.",
    },
    {
      title: "Investment & Crypto Giveaways",
      tip: "Legitimate executives or financial firms will never ask you to send cryptocurrency to an external wallet with the promise of returning double the amount.",
    },
    {
      title: "Follower Ratio Anomalies",
      tip: "Accounts following 5,000+ profiles with only 12 followers and zero organic post interactions are typically automated bot swarms or newly created burner profiles.",
    },
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % safetyTips.length);
    }, 6000);
    return () => clearInterval(tipInterval);
  }, [safetyTips.length]);

  const loadingMessages = [
    "Analyzing account...",
    "Checking profile authenticity...",
    "Scanning profile information...",
    "Comparing with fraud patterns...",
    "Evaluating account trust...",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("image")) {
        setErrorMessage("Please upload a valid image file (PNG, JPG, JPEG).");
        return;
      }
      setErrorMessage(null);
      const url = URL.createObjectURL(file);
      setScreenshotPreview({ name: file.name, url });
      showToast("Screenshot Attached", `Loaded profile screenshot ${file.name}`, "info");
    }
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);
    let target = "";
    if (inputMode === "url") {
      if (!profileUrl.trim()) {
        setErrorMessage("Please enter a valid social profile URL.");
        return;
      }
      target = profileUrl;
    } else if (inputMode === "username") {
      if (!username.trim()) {
        setErrorMessage("Please enter a username or handle (e.g. @username).");
        return;
      }
      target = username.startsWith("@") ? username : `@${username}`;
    } else {
      if (!screenshotPreview) {
        setErrorMessage("Please upload a profile screenshot to scan.");
        return;
      }
      target = `Screenshot: ${screenshotPreview.name}`;
    }

    // Compose rich detail metadata
    let detailsString = "";
    if (inputMode === "screenshot") {
      detailsString = "Uploaded profile capture with bio and follow ratios.";
    }
    if (profileBio.trim()) {
      detailsString += ` Bio: "${profileBio.trim()}".`;
    }
    if (followersCount.trim()) {
      detailsString += ` Followers: ${followersCount.trim()}.`;
    }
    if (followingCount.trim()) {
      detailsString += ` Following: ${followingCount.trim()}.`;
    }

    setIsAnalyzing(true);
    setLoadingStage(0);

    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const data = await analyzeProfileWithAI(
        target,
        selectedPlatform,
        detailsString
      );
      clearInterval(stageInterval);

      const savedRecord = addScan({
        type: "profile",
        platform: selectedPlatform,
        target,
        riskScore: 100 - data.authenticityScore,
        verdict: data.verdict,
        category: `${selectedPlatform} Account Verification`,
        confidence: data.confidence,
        indicators: data.riskIndicators,
        explanation: data.explanation,
        recommendations: data.recommendations,
      });

      setActiveResult(savedRecord);
      showToast(
        "Profile Analyzed",
        `Verdict: ${savedRecord.verdict} (${data.authenticityScore}% Authentic)`,
        data.verdict === "Genuine" ? "success" : data.verdict === "Suspicious" ? "warning" : "error"
      );
    } catch (err) {
      clearInterval(stageInterval);
      showToast("Analysis Error", "Failed to analyze profile. Please try again.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    if (!activeResult) return;
    const reportStr = `SYRA NOVA PROFILE AUTHENTICITY AUDIT\nTarget: ${activeResult.target}\nPlatform: ${activeResult.platform}\nVerdict: ${activeResult.verdict}\nAuthenticity Score: ${100 - activeResult.riskScore}%\nConfidence: ${activeResult.confidence}%\nIndicators: ${activeResult.indicators.join(", ")}\nExplanation: ${activeResult.explanation}\nRecommendations:\n- ${activeResult.recommendations.join("\n- ")}`;
    navigator.clipboard.writeText(reportStr);
    setCopied(true);
    showToast("Report Copied", "Profile audit copied to clipboard.", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    showToast("Report Generated", "Downloading SYRA NOVA Profile Intelligence Dossier...", "info");
    const element = document.createElement("a");
    const file = new Blob(
      [
        `==================================================
SYRA NOVA PROFILE AUTHENTICITY AUDIT REPORT
==================================================
Audit ID: ${activeResult?.id}
Timestamp: ${activeResult?.date}
Platform: ${activeResult?.platform}
Target Account: ${activeResult?.target}
Verdict: ${activeResult?.verdict}
Authenticity Score: ${100 - (activeResult?.riskScore ?? 0)}%
AI Confidence: ${activeResult?.confidence}%

RISK INDICATORS:
${activeResult?.indicators.map((i) => `• ${i}`).join("\n")}

AI EXPLANATION:
${activeResult?.explanation}

RECOMMENDATIONS:
${activeResult?.recommendations.map((r) => `✓ ${r}`).join("\n")}

Verified by SYRA NOVA Neural Social Guard v1.0
==================================================`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `SYRA-NOVA-Profile-Audit-${activeResult?.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const profileScans = scans.filter((s) => s.type === "profile");
  const filteredHistory = profileScans.filter((s) => {
    const matchesSearch = s.target.toLowerCase().includes(historySearch.toLowerCase());
    const matchesPlatform = historyPlatform === "All" || s.platform === historyPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div id="fake-profile-detector-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="profile-detector-back-btn"
            onClick={navigateBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              Fake Profile Detector
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Analyze suspicious social media accounts, impersonators, bot swarms, and catfishing profiles using AI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {profileScans.length > 0 && (
            <button
              id="profile-detector-download-all-btn"
              onClick={() => {
                downloadReport({
                  filename: `SYRA_Profile_Audits_${new Date().toISOString().slice(0, 10)}`,
                  title: "Aggregated Social Media Profile Forensic Dossier",
                  format: "txt",
                  data: {
                    totalAudits: profileScans.length,
                    audits: profileScans,
                  },
                });
                showToast("Reports Exported", `Downloaded ${profileScans.length} profile audit reports.`, "success");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-all"
              title="Download All Profile Audit Reports"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Export Audits</span>
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

      {/* Quick Test Demo Samples Banner */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Test Instant Scenarios (Click to auto-fill & verify):
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Live Forensic Testing</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {demoProfiles.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectDemo(demo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0 ${
                demo.type === "fake"
                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30"
                  : demo.type === "suspicious"
                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${demo.type === "fake" ? "bg-red-400" : demo.type === "suspicious" ? "bg-amber-400" : "bg-emerald-400"}`}></span>
              <span>{demo.label}</span>
              <span className="text-[10px] opacity-60">({demo.handle})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input & AI Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: Profile Input Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel shadow-xl space-y-5">
            {/* Platform Selector Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Platform</label>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedPlatform === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedPlatform(p.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                          : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/80"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Method Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Input Method</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setInputMode("url")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    inputMode === "url"
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Profile URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode("username")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    inputMode === "username"
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <AtSign className="w-3.5 h-3.5" />
                  <span>Username</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode("screenshot")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    inputMode === "screenshot"
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Screenshot</span>
                </button>
              </div>
            </div>

            {/* Option 1: Paste Profile URL */}
            {inputMode === "url" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Paste Profile URL</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    id="profile-url-input"
                    placeholder={`https://${selectedPlatform.toLowerCase().replace(/[^a-z]/g, "")}.com/...`}
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                  />
                  {profileUrl && (
                    <button
                      onClick={() => setProfileUrl("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-400">
                  <span>Supported links:</span>
                  <span className="text-cyan-300">Instagram, Facebook, X (Twitter), LinkedIn, TikTok, YouTube, Telegram</span>
                </div>
              </div>
            )}

            {/* Option 2: Enter Username */}
            {inputMode === "username" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Enter Username / Handle</label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="profile-username-input"
                    placeholder="@username (e.g. @sbi_support_official or @mkbhd)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
                  />
                </div>
              </div>
            )}

            {/* Option 3: Upload Screenshot */}
            {inputMode === "screenshot" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Upload Profile Screenshot</label>
                {screenshotPreview ? (
                  <div className="relative p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                        <img
                          src={screenshotPreview.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-xs">{screenshotPreview.name}</p>
                        <span className="text-[10px] text-cyan-300 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Ready for Optical AI Scan
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-semibold text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors">
                        Replace
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <button
                        onClick={() => setScreenshotPreview(null)}
                        className="p-1 text-slate-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    id="profile-screenshot-dropzone"
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/40 bg-slate-950/40 hover:bg-slate-900/60 cursor-pointer transition-all group text-center"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                    <p className="text-xs font-medium text-slate-300">
                      <span className="text-cyan-400 font-semibold">Click to upload screenshot</span> or drag & drop
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Supported: PNG, JPG, JPEG</p>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Optional Bio & Profile Metadata Section */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowAdvancedStats(!showAdvancedStats)}
                className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <span>Add Bio Description & Follower Counts (Optional)</span>
                <span className="text-cyan-400 font-mono text-[11px]">{showAdvancedStats ? "− Hide Details" : "+ Add Details"}</span>
              </button>

              {showAdvancedStats && (
                <div className="mt-3 space-y-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Profile Bio / Description</label>
                    <textarea
                      rows={2}
                      placeholder="Paste bio description, external contact numbers, links or suspicious promises..."
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 resize-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Followers Count</label>
                      <input
                        type="text"
                        placeholder="e.g. 14 or 250k"
                        value={followersCount}
                        onChange={(e) => setFollowersCount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Following Count</label>
                      <input
                        type="text"
                        placeholder="e.g. 4,500"
                        value={followingCount}
                        onChange={(e) => setFollowingCount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertOctagon className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Analyze Button */}
            <button
              id="analyze-profile-btn"
              type="button"
              disabled={isAnalyzing}
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
                  <UserCheck className="w-4 h-4" />
                  <span>Analyze Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Safety Tips Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-slate-900/90 via-slate-900/90 to-purple-950/30 border border-slate-800 glass-panel shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-purple-400 animate-pulse" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                  Profile Security Intelligence
                </h4>
              </div>
              <div className="flex items-center gap-1">
                {safetyTips.map((_, idx) => (
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

            <h5 className="text-xs font-bold text-cyan-300 mb-1">{safetyTips[tipIndex].title}</h5>
            <p className="text-xs text-slate-300 leading-relaxed">{safetyTips[tipIndex].tip}</p>
          </div>
        </div>

        {/* Right Column: AI Result (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          {activeResult ? (
            <div
              id="profile-analysis-result-card"
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl glass-panel animate-in zoom-in-95 duration-200 space-y-5"
            >
              {/* Verdict Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Account Verification Status
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5 font-heading truncate max-w-[200px]">
                    {activeResult.target}
                  </h3>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                    activeResult.verdict === "Fake Profile Detected"
                      ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                      : activeResult.verdict === "Suspicious"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                  }`}
                >
                  {activeResult.verdict === "Fake Profile Detected" && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
                  {activeResult.verdict === "Suspicious" && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {activeResult.verdict === "Genuine" && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{activeResult.verdict}</span>
                </div>
              </div>

              {/* Authenticity Score Meter */}
              <div className="flex flex-col items-center justify-center py-2">
                <CircularProgress
                  value={100 - activeResult.riskScore}
                  size={150}
                  strokeWidth={12}
                  colorScheme="authenticity"
                  label="Authenticity"
                />
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Analysis Confidence: {activeResult.confidence}%
                </p>
              </div>

              {/* Risk Indicators */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Detected Risk Indicators
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

              {/* AI Explanation */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-300 block mb-1">AI Findings:</span>
                <p className="text-slate-300 leading-relaxed">{activeResult.explanation}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Recommendations
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
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "SYRA NOVA Profile Audit",
                          text: `Profile Audit for ${activeResult.target}: ${activeResult.verdict}`,
                          url: window.location.href,
                        });
                      } else {
                        handleCopyReport();
                      }
                    }}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveResult(null);
                      setProfileUrl("");
                      setUsername("");
                      setScreenshotPreview(null);
                    }}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-400 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Another</span>
                  </button>
                  <button
                    onClick={() => {
                      if (activeResult) {
                        deleteScan(activeResult.id);
                        setActiveResult(null);
                      }
                    }}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Audit Record"
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
            /* Empty State: Shield with Social Media Icons */
            <div className="h-full min-h-[380px] p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500/15 to-purple-500/15 border border-cyan-500/30 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                <Shield className="w-10 h-10 text-cyan-400" />
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-purple-400">
                  <Instagram className="w-4 h-4" />
                </div>
              </div>
              <h4 className="text-base font-bold text-white font-heading">No profile analyzed yet.</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Paste a profile link, username, or upload a screenshot to begin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Previous Profile Analyses */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white font-heading">Previous Profile Analyses</h3>
            <p className="text-xs text-slate-400">Audit history across social platforms</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search username..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={historyPlatform}
              onChange={(e) => setHistoryPlatform(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
            >
              <option value="All">All Platforms</option>
              {platforms.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {profileScans.length > 0 && (
              <button
                id="profile-clear-history-btn"
                onClick={clearAllScans}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/20 border border-slate-800 hover:border-red-500/30 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                title="Clear all profile audit history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-500 text-xs">
              No profile analyses found. Try analyzing your first suspicious handle.
            </div>
          ) : (
            filteredHistory.map((scan) => (
              <div
                key={scan.id}
                onClick={() => setActiveResult(scan)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 glass-card-interactive cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
                      {scan.platform || "Instagram"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        scan.verdict === "Fake Profile Detected"
                          ? "bg-red-500/20 text-red-400"
                          : scan.verdict === "Suspicious"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {scan.verdict} ({100 - scan.riskScore}%)
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white font-mono truncate">{scan.target}</p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{scan.explanation}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{scan.date}</span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        downloadReport({
                          filename: `Scan_Profile_${scan.id}`,
                          title: `Profile Forensic Audit: ${scan.target}`,
                          format: "txt",
                          data: scan,
                        });
                        showToast("Report Exported", `Downloaded scan #${scan.id} report.`, "success");
                      }}
                      className="p-1 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Download Profile Audit Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteScan(scan.id)}
                      className="p-1 rounded-md bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Profile Audit Record"
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
