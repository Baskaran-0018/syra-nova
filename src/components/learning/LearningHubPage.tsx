import React, { useState } from "react";
import {
  GraduationCap,
  ArrowLeft,
  Bell,
  Award,
  Zap,
  CheckCircle2,
  HelpCircle,
  Play,
  Flame,
  Download,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { downloadReport } from "../../utils/exportReport";

export const LearningHubPage: React.FC = () => {
  const { navigateBack, setIsNotificationOpen, showToast } = useApp();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [modules, setModules] = useState([
    {
      id: "mod-1",
      title: "Recognizing Digital Arrest & Police Impersonation Scams",
      level: "Intermediate",
      duration: "5 min read",
      xp: "+120 XP",
      completed: false,
    },
    {
      id: "mod-2",
      title: "The Anatomy of Fake Electricity Disconnection APKs",
      level: "Beginner",
      duration: "3 min read",
      xp: "+80 XP",
      completed: false,
    },
    {
      id: "mod-3",
      title: "How Deepfake Audio Clones Bypass Traditional KYC",
      level: "Advanced",
      duration: "8 min read",
      xp: "+200 XP",
      completed: false,
    },
  ]);

  const completedCount = modules.filter((m) => m.completed).length;
  const currentXP = completedCount * 100 + (isAnswered && selectedOption === 2 ? 50 : 0);

  const handleDownloadSyllabus = () => {
    downloadReport({
      filename: `SYRA_Cyber_Security_Awareness_Syllabus_${new Date().toISOString().slice(0, 10)}`,
      title: "SYRA NOVA Cyber Defense Curriculum & Case Studies",
      format: "txt",
      data: {
        streak: completedCount > 0 ? "1 Day" : "0 Days",
        totalXPEarned: currentXP,
        modulesCompleted: completedCount,
        curriculum: modules,
      },
    });
    showToast("Curriculum Exported", "Downloaded cyber learning syllabus.", "success");
  };

  const handleResetProgress = () => {
    setModules(modules.map((m) => ({ ...m, completed: false })));
    setIsAnswered(false);
    setSelectedOption(null);
    showToast("Progress Reset", "Learning progress has been reset.", "info");
  };

  const handleDeleteModule = (id: string, title: string) => {
    setModules(modules.filter((m) => m.id !== id));
    showToast("Lesson Removed", `Removed ${title} from view.`, "info");
  };

  const quiz = {
    question: "A caller claims to be a police officer on Skype stating your Aadhaar is linked to money laundering. What should you do?",
    options: [
      "Immediately transfer funds to the 'verification safe account' they provide.",
      "Share your NetBanking credentials to clear your name.",
      "Hang up immediately, report to Cyber Helpline 1930, and visit your local police station.",
      "Keep the camera on for 24 hours under 'Digital Arrest'.",
    ],
    correctIndex: 2,
    explanation: "Indian law and law enforcement agencies NEVER conduct arrests over Skype video calls or ask for funds to clear investigations. 'Digital Arrest' is 100% fraud.",
  };

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === quiz.correctIndex) {
      showToast("Correct Answer!", "+50 Cyber XP awarded!", "success");
    } else {
      showToast("Incorrect", "Review the security explanation below.", "warning");
    }
  };

  return (
    <div id="learning-hub-page" className="space-y-6 animate-in fade-in duration-200 pb-16">
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
              Cyber Security Learning Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Interactive scam simulations, daily safety quizzes, and cyber awareness badges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="learning-download-syllabus-btn"
            onClick={handleDownloadSyllabus}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all"
            title="Download Cyber Curriculum"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export Syllabus</span>
          </button>

          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
            title="Reset Learning Progress"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{completedCount > 0 ? "1 Day Streak" : "0 Day Streak"} • {currentXP} XP</span>
          </div>
        </div>
      </div>

      {/* Daily Interactive Quiz */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-heading">Daily Threat Simulation Challenge</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
            +50 XP
          </span>
        </div>

        <p className="text-sm font-bold text-white leading-relaxed">
          {quiz.question}
        </p>

        <div className="space-y-2">
          {quiz.options.map((opt, i) => {
            let btnClass = "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white";
            if (isAnswered) {
              if (i === quiz.correctIndex) {
                btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
              } else if (selectedOption === i) {
                btnClass = "bg-red-500/20 border-red-500 text-red-300";
              }
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleAnswer(i)}
                className={`w-full p-3.5 rounded-2xl border text-xs text-left transition-all flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {isAnswered && i === quiz.correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs animate-in fade-in">
            <span className="font-bold text-cyan-300 block mb-1">Expert Cyber Insight:</span>
            <p className="text-slate-300 leading-relaxed">{quiz.explanation}</p>
          </div>
        )}
      </div>

      {/* Awareness Modules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">
            Awareness Modules & Case Studies
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {modules.filter((m) => m.completed).length} / {modules.length} Completed
          </span>
        </div>

        {modules.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No modules remaining. You can click Reset above to restore curriculum.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((m) => (
              <div key={m.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{m.level}</span>
                    <span className="text-amber-400 font-bold">{m.xp}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-heading">{m.title}</h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-500">{m.duration}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setModules(modules.map((item) => item.id === m.id ? { ...item, completed: !item.completed } : item));
                        showToast(m.completed ? "Marked Incomplete" : "Lesson Completed", m.title, "success");
                      }}
                      className={`font-bold ${m.completed ? "text-emerald-400" : "text-cyan-400 hover:text-cyan-300"}`}
                    >
                      {m.completed ? "✓ Completed" : "Start Lesson →"}
                    </button>
                    <button
                      onClick={() => handleDeleteModule(m.id, m.title)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove Lesson"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
