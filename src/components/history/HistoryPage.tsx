import React, { useState, useMemo } from "react";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Download,
  Filter,
  Shield,
  MessageSquareWarning,
  UserCheck,
  Video,
  Globe,
  Fingerprint,
  Bot,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  FileText,
  FileCode,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { HistoryCategory, SearchHistoryItem, AppView } from "../../types";
import { downloadReport } from "../../utils/exportReport";

export const HistoryPage: React.FC = () => {
  const {
    searchHistory,
    deleteSearchHistoryItem,
    clearSearchHistory,
    setCurrentView,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<HistoryCategory>("all");
  const [selectedVerdictFilter, setSelectedVerdictFilter] = useState<string>("all");
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  // Filtered History list
  const filteredHistory = useMemo(() => {
    return searchHistory.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Verdict filter
      if (selectedVerdictFilter !== "all") {
        if (selectedVerdictFilter === "threats" && !["Scam Detected", "Fake Profile Detected", "Dangerous", "High Risk", "Breached"].includes(item.verdict || "")) {
          return false;
        }
        if (selectedVerdictFilter === "safe" && !["Safe", "Clean", "Genuine"].includes(item.verdict || "")) {
          return false;
        }
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inQuery = item.query.toLowerCase().includes(q);
        const inDetails = (item.details || "").toLowerCase().includes(q);
        const inVerdict = (item.verdict || "").toLowerCase().includes(q);
        const inCategory = item.category.toLowerCase().includes(q);
        return inQuery || inDetails || inVerdict || inCategory;
      }
      return true;
    });
  }, [searchHistory, selectedCategory, selectedVerdictFilter, searchQuery]);

  // Statistics
  const totalCount = searchHistory.length;
  const threatCount = searchHistory.filter((i) =>
    ["Scam Detected", "Fake Profile Detected", "Dangerous", "High Risk", "Breached"].includes(i.verdict || "")
  ).length;
  const safeCount = searchHistory.filter((i) =>
    ["Safe", "Clean", "Genuine"].includes(i.verdict || "")
  ).length;

  const getCategoryMeta = (cat: HistoryCategory) => {
    switch (cat) {
      case "scam_message":
        return { label: "Message Analysis", icon: MessageSquareWarning, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      case "profile":
        return { label: "Social Profile", icon: UserCheck, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "deepfake":
        return { label: "Synthetic Media", icon: Video, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
      case "url_domain":
        return { label: "Safe Browsing", icon: Globe, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "identity":
        return { label: "Identity & Leaks", icon: Fingerprint, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
      case "assistant":
        return { label: "AI Cyber Assistant", icon: Bot, color: "text-sky-400 bg-sky-500/10 border-sky-500/30" };
      case "emergency":
        return { label: "Emergency Case", icon: ShieldAlert, color: "text-red-400 bg-red-500/10 border-red-500/30" };
      default:
        return { label: "General Search", icon: Search, color: "text-slate-400 bg-slate-800/40 border-slate-700/50" };
    }
  };

  const getVerdictBadge = (verdict?: string, risk?: number) => {
    if (!verdict) return null;
    const isThreat = ["Scam Detected", "Fake Profile Detected", "Dangerous", "High Risk", "Breached"].includes(verdict);
    const isSafe = ["Safe", "Clean", "Genuine"].includes(verdict);

    if (isThreat) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          {verdict} {risk !== undefined && `(${risk}%)`}
        </span>
      );
    }
    if (isSafe) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {verdict}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
        <Sparkles className="w-3.5 h-3.5" />
        {verdict}
      </span>
    );
  };

  // Download all history
  const handleDownloadAll = (format: "txt" | "json" | "md") => {
    setDownloadDropdownOpen(false);
    downloadReport({
      filename: `SYRA_NOVA_Audit_History_${new Date().toISOString().slice(0, 10)}`,
      title: "Consolidated Search & Threat Audit History Log",
      format,
      data: searchHistory,
      metadata: {
        totalRecords: searchHistory.length,
        threatsIdentified: threatCount,
        safeRecords: safeCount,
        exportedBy: "Dr. Baskaran J.",
      },
    });
    showToast("Audit Log Exported", `Saved ${searchHistory.length} audit records in ${format.toUpperCase()} format.`, "success");
  };

  // Download single item report
  const handleDownloadSingleItem = (item: SearchHistoryItem) => {
    const singleReport = [
      `INDIVIDUAL SEARCH & FORENSIC RECORD`,
      `Record ID: ${item.id}`,
      `Timestamp: ${item.timestamp}`,
      `Category: ${item.category}`,
      `Query/Target: ${item.query}`,
      `Verdict: ${item.verdict || "N/A"}`,
      `Risk Score: ${item.riskScore !== undefined ? `${item.riskScore}/100` : "N/A"}`,
      `Details: ${item.details || "None"}`,
      "",
      ...(item.indicators && item.indicators.length > 0
        ? ["FORENSIC INDICATORS:", ...item.indicators.map((i) => ` - ${i}`), ""]
        : []),
      ...(item.recommendations && item.recommendations.length > 0
        ? ["RECOMMENDED MITIGATION:", ...item.recommendations.map((r) => ` • ${r}`), ""]
        : []),
    ].join("\n");

    downloadReport({
      filename: `SYRA_Audit_${item.category}_${item.id}`,
      title: `Forensic Audit Record: ${item.category.toUpperCase()}`,
      format: "txt",
      text: singleReport,
      metadata: {
        recordId: item.id,
        verdict: item.verdict || "Unclassified",
      },
    });
    showToast("Record Downloaded", `Audit record for "${item.query.slice(0, 24)}..." downloaded.`, "success");
  };

  const categories: { id: HistoryCategory; label: string; count: number }[] = [
    { id: "all", label: "All Records", count: totalCount },
    { id: "scam_message", label: "Messages", count: searchHistory.filter((i) => i.category === "scam_message").length },
    { id: "profile", label: "Profiles", count: searchHistory.filter((i) => i.category === "profile").length },
    { id: "deepfake", label: "Deepfakes", count: searchHistory.filter((i) => i.category === "deepfake").length },
    { id: "url_domain", label: "URLs & Web", count: searchHistory.filter((i) => i.category === "url_domain").length },
    { id: "identity", label: "Identity", count: searchHistory.filter((i) => i.category === "identity").length },
    { id: "assistant", label: "AI Assistant", count: searchHistory.filter((i) => i.category === "assistant").length },
  ];

  return (
    <div id="history-page-container" className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 lg:p-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold font-mono">
              <HistoryIcon className="w-3.5 h-3.5" />
              <span>FORENSIC AUDIT LEDGER</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
              Search & Threat Scan History
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Immutable activity records for all scanned messages, suspicious profiles, deepfake media tests, dark web breach searches, and safe browsing investigations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Download Dropdown */}
            <div className="relative">
              <button
                id="history-download-dropdown-btn"
                onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-sm font-semibold transition-colors shadow-lg active:scale-95"
                title="Download Entire History Audit Report"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export Audit Log</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {downloadDropdownOpen && (
                <div
                  id="history-download-dropdown-menu"
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <button
                    onClick={() => handleDownloadAll("txt")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-200 rounded-lg transition-colors text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Formatted Text (.txt)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadAll("json")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-200 rounded-lg transition-colors text-left"
                  >
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>JSON Raw Dossier (.json)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadAll("md")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-200 rounded-lg transition-colors text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>Markdown Report (.md)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Clear All History Button */}
            {searchHistory.length > 0 && (
              <button
                id="history-clear-all-btn"
                onClick={() => setIsClearModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-semibold transition-colors active:scale-95"
                title="Delete all history data"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Clear All History</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Scanned</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{totalCount} items</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block">Threats Found</span>
            <span className="text-xl font-bold text-red-400 mt-1 block">{threatCount} detected</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">Safe & Verified</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">{safeCount} clear</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">Status</span>
            <span className="text-xl font-bold text-cyan-400 mt-1 block">Active Guard</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Search input & Verdict Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="history-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by query text, username, URL, risk verdict, or keyword..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              id="history-verdict-filter"
              value={selectedVerdictFilter}
              onChange={(e) => setSelectedVerdictFilter(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Verdicts</option>
              <option value="threats">Threats & Scams Only</option>
              <option value="safe">Safe & Verified Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`history-filter-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-900/80 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  selectedCategory === cat.id ? "bg-slate-950/30 text-slate-950 font-extrabold" : "bg-slate-800 text-slate-400"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div id="history-empty-state" className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <HistoryIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">No Search or Scan Records Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "No history matching your current filter criteria. Try resetting your search."
                : "All previous history records have been cleared or no scans have been performed yet."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedVerdictFilter("all");
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setCurrentView("message-detector")}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
            >
              Scan a Message
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const meta = getCategoryMeta(item.category);
            const Icon = meta.icon;

            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className="group relative rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 p-4 lg:p-5 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left Column: Icon & Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${meta.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {meta.label}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-500 font-mono">{item.timestamp}</span>
                        {getVerdictBadge(item.verdict, item.riskScore)}
                      </div>

                      {/* Query Content */}
                      <p className="text-sm font-semibold text-slate-100 break-words line-clamp-2">
                        {item.query}
                      </p>

                      {/* Explanation / Details */}
                      {item.details && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.details}
                        </p>
                      )}

                      {/* Forensic Indicators */}
                      {item.indicators && item.indicators.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.indicators.slice(0, 3).map((ind, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
                            >
                              {ind}
                            </span>
                          ))}
                          {item.indicators.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800/80 text-slate-500">
                              +{item.indicators.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    {/* Re-run / Inspect in detector */}
                    {item.targetView && (
                      <button
                        onClick={() => setCurrentView(item.targetView as AppView)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                        title={`Open in ${item.targetView}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Inspect</span>
                      </button>
                    )}

                    {/* Download individual report */}
                    <button
                      onClick={() => handleDownloadSingleItem(item)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-700/50 hover:border-cyan-500/40 transition-colors"
                      title="Download Forensic Report"
                      aria-label="Download Record"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* Delete Item */}
                    <button
                      onClick={() => deleteSearchHistoryItem(item.id)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-500/40 transition-colors"
                      title="Delete this history entry"
                      aria-label="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Clearing All History */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">Clear All Search & Scan History?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will permanently delete all {searchHistory.length} search queries, forensics logs, and threat detection records. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearSearchHistory();
                  setIsClearModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/30"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
