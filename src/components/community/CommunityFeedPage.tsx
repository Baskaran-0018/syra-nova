import React, { useState } from "react";
import {
  Users,
  ArrowLeft,
  Bell,
  AlertTriangle,
  ThumbsUp,
  Share2,
  Send,
  Plus,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const CommunityFeedPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, showToast, user } = useApp();
  const [reportModal, setReportModal] = useState(false);
  const [reportText, setReportText] = useState("");

  const [threatPosts, setThreatPosts] = useState<Array<{
    id: string;
    author: string;
    verified: boolean;
    time: string;
    title: string;
    desc: string;
    indicators: string[];
    upvotes: number;
  }>>([]);

  const handleBroadcastReport = () => {
    if (!reportText.trim()) return;
    const newPost = {
      id: `th-${Date.now()}`,
      author: user.name || "Community Member",
      verified: true,
      time: "Just now",
      title: reportText.length > 50 ? `${reportText.slice(0, 50)}...` : reportText,
      desc: reportText,
      indicators: ["Community Reported", "Active Verification"],
      upvotes: 1,
    };
    setThreatPosts([newPost, ...threatPosts]);
    showToast("Report Submitted", "Thank you! Our AI intelligence node is verifying signatures.", "success");
    setReportModal(false);
    setReportText("");
  };

  return (
    <div id="community-feed-page" className="space-y-6 animate-in fade-in duration-200 pb-12">
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
              Community Threat Intelligence Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Crowdsourced early warning radar for real-time scams and fraud patterns.
            </p>
          </div>
        </div>

        <button
          onClick={() => setReportModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Scam</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {threatPosts.length === 0 ? (
          <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No community alerts yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first to warn fellow users about newly observed scams, phishing numbers, or fake links.
            </p>
            <button
              onClick={() => setReportModal(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
            >
              Submit Threat Intel
            </button>
          </div>
        ) : (
          threatPosts.map((p) => (
            <div key={p.id} className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{p.author}</span>
                  {p.verified && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                  <span className="text-[10px] text-slate-500">• {p.time}</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold border border-red-500/30">
                  Active Threat
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-heading">{p.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.indicators.map((ind, i) => (
                  <span key={i} className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-950 text-slate-300 border border-slate-800">
                    {ind}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <button
                  onClick={() => showToast("Upvoted", "Thank you for corroborating this threat intel!", "success")}
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{p.upvotes} Confirmations</span>
                </button>

                <button
                  onClick={() => showToast("Intel Shared", "Link copied to share with community.", "info")}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Alert</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl glass-panel space-y-4">
            <h3 className="text-base font-bold text-white font-heading">Report Scam to Threat Network</h3>
            <textarea
              rows={4}
              placeholder="Describe the suspicious message, scammer phone number, or malicious link..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-cyan-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcastReport}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Broadcast Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
