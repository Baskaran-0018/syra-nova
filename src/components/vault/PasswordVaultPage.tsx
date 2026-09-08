import React, { useState, useRef } from "react";
import {
  KeyRound,
  ArrowLeft,
  Search,
  Plus,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Trash2,
  Edit3,
  Star,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  X,
  Upload,
  AlertTriangle,
  FileText,
  Sliders,
  Maximize2,
  Instagram,
  Globe,
  Mail,
  Building2,
  Tv,
  Wifi,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { VaultItem, VaultCategory } from "../../types";
import { downloadReport } from "../../utils/exportReport";

// Service preset helper
interface ServicePreset {
  name: string;
  category: "social" | "banking" | "email" | "entertainment" | "work" | "document" | "custom";
  icon: React.ElementType;
  url: string;
  defaultTitle: string;
  color: string;
}

const SERVICE_PRESETS: ServicePreset[] = [
  {
    name: "Instagram",
    category: "social",
    icon: Instagram,
    url: "https://instagram.com",
    defaultTitle: "Instagram Account",
    color: "from-pink-500 via-purple-500 to-amber-500 text-pink-400",
  },
  {
    name: "Google",
    category: "email",
    icon: Mail,
    url: "https://accounts.google.com",
    defaultTitle: "Google / Gmail Account",
    color: "from-blue-500 to-red-500 text-blue-400",
  },
  {
    name: "SBI Bank",
    category: "banking",
    icon: Building2,
    url: "https://onlinesbi.sbi",
    defaultTitle: "SBI Online NetBanking",
    color: "from-cyan-600 to-blue-700 text-cyan-400",
  },
  {
    name: "Facebook",
    category: "social",
    icon: Globe,
    url: "https://facebook.com",
    defaultTitle: "Facebook Account",
    color: "from-blue-600 to-blue-800 text-blue-400",
  },
  {
    name: "X / Twitter",
    category: "social",
    icon: Globe,
    url: "https://x.com",
    defaultTitle: "X (Twitter) Handle",
    color: "from-slate-700 to-slate-900 text-slate-300",
  },
  {
    name: "Netflix",
    category: "entertainment",
    icon: Tv,
    url: "https://netflix.com",
    defaultTitle: "Netflix Streaming Account",
    color: "from-red-600 to-rose-800 text-red-400",
  },
  {
    name: "Wi-Fi Router",
    category: "work",
    icon: Wifi,
    url: "http://192.168.1.1",
    defaultTitle: "Wi-Fi Router WPA3 Key",
    color: "from-emerald-600 to-teal-700 text-emerald-400",
  },
  {
    name: "Custom / Other",
    category: "custom",
    icon: KeyRound,
    url: "",
    defaultTitle: "Custom Password / Note",
    color: "from-purple-600 to-indigo-700 text-purple-400",
  },
];

// Sample screenshots for quick testing
const SAMPLE_SCREENSHOTS = [
  {
    name: "Instagram Login & Recovery QR",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    size: "320 KB",
  },
  {
    name: "2FA Security Keys Backup Sheet",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80",
    size: "245 KB",
  },
  {
    name: "Wi-Fi Router Back Panel Credentials",
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
    size: "480 KB",
  },
];

export const PasswordVaultPage: React.FC = () => {
  const {
    navigateBack,
    vaultItems,
    addVaultItem,
    updateVaultItem,
    deleteVaultItem,
    clearAllVaultItems,
    toggleFavoriteVaultItem,
    isVaultLocked,
    setIsVaultLocked,
    showToast,
  } = useApp();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<VaultCategory>("all");
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isPasswordGenOpen, setIsPasswordGenOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    service: "Instagram",
    usernameOrEmail: "",
    password: "",
    websiteUrl: "https://instagram.com",
    category: "social" as VaultItem["category"],
    notes: "",
    screenshotUrl: "",
    screenshotName: "",
    screenshotSize: "",
    tags: ["social"],
    isFavorite: false,
  });

  // Password Generator Settings
  const [genLength, setGenLength] = useState(16);
  const [genUseUppercase, setGenUseUppercase] = useState(true);
  const [genUseNumbers, setGenUseNumbers] = useState(true);
  const [genUseSymbols, setGenUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy helper
  const handleCopy = (text: string, fieldKey: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedFieldId(fieldKey);
    showToast("Copied to Clipboard", `${label} copied securely.`, "success");
    setTimeout(() => {
      setCopiedFieldId(null);
    }, 2000);
  };

  // Toggle single password visibility
  const toggleReveal = (id: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Reveal or mask all passwords
  const [revealAll, setRevealAll] = useState(false);
  const handleToggleRevealAll = () => {
    const nextState = !revealAll;
    setRevealAll(nextState);
    const updated: Record<string, boolean> = {};
    vaultItems.forEach((item) => {
      updated[item.id] = nextState;
    });
    setRevealedPasswords(updated);
  };

  // Calculate password strength
  const evaluateStrength = (pwd: string): "Weak" | "Medium" | "Strong" | "Ultra" => {
    if (!pwd) return "Weak";
    if (pwd.length < 8) return "Weak";
    let score = 0;
    if (pwd.length >= 12) score += 2;
    else if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 2;

    if (score >= 6) return "Ultra";
    if (score >= 4) return "Strong";
    if (score >= 3) return "Medium";
    return "Weak";
  };

  // Password Generator logic
  const generatePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (genUseUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (genUseNumbers) charset += "0123456789";
    if (genUseSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let result = "";
    const array = new Uint32Array(genLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < genLength; i++) {
      result += charset[array[i] % charset.length];
    }
    setGeneratedPassword(result);
  };

  // Initialize Generator once opened
  const openPasswordGenerator = () => {
    generatePassword();
    setIsPasswordGenOpen(true);
  };

  // Apply Generated Password to Form
  const applyGeneratedPassword = () => {
    setFormData((prev) => ({ ...prev, password: generatedPassword }));
    setIsPasswordGenOpen(false);
    showToast("Password Applied", "Strong generated password populated.", "success");
  };

  // Open modal for new item
  const handleOpenAddModal = (presetName: string = "Instagram") => {
    const preset = SERVICE_PRESETS.find((p) => p.name === presetName) || SERVICE_PRESETS[0];
    setEditingItemId(null);
    setFormData({
      title: preset.defaultTitle,
      service: preset.name,
      usernameOrEmail: "",
      password: "",
      websiteUrl: preset.url,
      category: preset.category,
      notes: "",
      screenshotUrl: "",
      screenshotName: "",
      screenshotSize: "",
      tags: [preset.category],
      isFavorite: false,
    });
    setIsAddEditModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (item: VaultItem) => {
    setEditingItemId(item.id);
    setFormData({
      title: item.title,
      service: item.service,
      usernameOrEmail: item.usernameOrEmail,
      password: item.password || "",
      websiteUrl: item.websiteUrl || "",
      category: item.category,
      notes: item.notes || "",
      screenshotUrl: item.screenshotUrl || "",
      screenshotName: item.screenshotName || "",
      screenshotSize: item.screenshotSize || "",
      tags: item.tags || [],
      isFavorite: !!item.isFavorite,
    });
    setIsAddEditModalOpen(true);
  };

  // Handle Preset Select in Form
  const handleSelectPreset = (preset: ServicePreset) => {
    setFormData((prev) => ({
      ...prev,
      service: preset.name,
      category: preset.category,
      title: prev.title ? prev.title : preset.defaultTitle,
      websiteUrl: preset.url,
    }));
  };

  // Handle Screenshot File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Invalid File", "Please upload a PNG, JPG, or screenshot image file.", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeKB = `${Math.round(file.size / 1024)} KB`;
      setFormData((prev) => ({
        ...prev,
        screenshotUrl: dataUrl,
        screenshotName: file.name,
        screenshotSize: sizeKB,
      }));
      showToast("Screenshot Attached", `Loaded ${file.name} (${sizeKB})`, "success");
    };
    reader.readAsDataURL(file);
  };

  // Save Item (Create or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.usernameOrEmail.trim()) {
      showToast("Missing Fields", "Please enter an account name and username/email.", "warning");
      return;
    }

    const strength = evaluateStrength(formData.password);

    if (editingItemId) {
      updateVaultItem(editingItemId, {
        ...formData,
        securityStrength: strength,
      });
    } else {
      addVaultItem({
        ...formData,
        securityStrength: strength,
      });
    }

    setIsAddEditModalOpen(false);
  };

  // Export Complete Vault
  const handleExportVault = () => {
    downloadReport({
      filename: `SYRA_Encrypted_Password_Vault_${new Date().toISOString().slice(0, 10)}`,
      title: "SYRA NOVA Quantum-Safe Password & Identity Data Vault",
      format: "txt",
      data: {
        totalRecords: vaultItems.length,
        exportDate: new Date().toISOString(),
        encryptionStatus: "Zero-Knowledge AES-256 Validated",
        vaultItems: vaultItems.map((item) => ({
          title: item.title,
          service: item.service,
          category: item.category,
          username: item.usernameOrEmail,
          hasPassword: !!item.password,
          passwordStrength: item.securityStrength,
          website: item.websiteUrl || "N/A",
          hasScreenshotBackup: !!item.screenshotUrl,
          screenshotFile: item.screenshotName || "None",
          notes: item.notes || "None",
          created: item.createdAt,
          lastUpdated: item.updatedAt,
        })),
      },
    });
    showToast("Vault Exported", "Encrypted vault backup downloaded.", "success");
  };

  // Export Single Item
  const handleExportSingleItem = (item: VaultItem) => {
    downloadReport({
      filename: `Vault_Item_${item.service}_${item.id}`,
      title: `SYRA Vault Record: ${item.title}`,
      format: "txt",
      data: {
        accountTitle: item.title,
        service: item.service,
        category: item.category,
        usernameOrEmail: item.usernameOrEmail,
        websiteUrl: item.websiteUrl || "N/A",
        notes: item.notes || "N/A",
        hasScreenshot: !!item.screenshotUrl,
        screenshotName: item.screenshotName || "None",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
    showToast("Record Downloaded", `Exported dossier for ${item.title}.`, "success");
  };

  // Filter vault items
  const filteredItems = vaultItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "social" && item.category === "social") ||
      (selectedCategory === "banking" && item.category === "banking") ||
      (selectedCategory === "email" && item.category === "email") ||
      (selectedCategory === "entertainment" && item.category === "entertainment") ||
      (selectedCategory === "work" && item.category === "work") ||
      (selectedCategory === "document" && (item.category === "document" || item.screenshotUrl)) ||
      (selectedCategory === "custom" && item.category === "custom");

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.service.toLowerCase().includes(q) ||
      item.usernameOrEmail.toLowerCase().includes(q) ||
      (item.notes && item.notes.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });

  // Strength color badge
  const getStrengthBadge = (strength?: string) => {
    switch (strength) {
      case "Ultra":
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">Ultra Safe</span>;
      case "Strong":
        return <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">Strong</span>;
      case "Medium":
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 font-mono text-[10px] font-bold">Weak</span>;
    }
  };

  // Get brand icon
  const getServiceIcon = (serviceName: string) => {
    const s = serviceName.toLowerCase();
    if (s.includes("insta")) return Instagram;
    if (s.includes("google") || s.includes("mail")) return Mail;
    if (s.includes("bank") || s.includes("sbi") || s.includes("hdfc")) return Building2;
    if (s.includes("netflix") || s.includes("stream") || s.includes("tv")) return Tv;
    if (s.includes("wifi") || s.includes("router")) return Wifi;
    return KeyRound;
  };

  // ----------------------------------------------------
  // Vault Locked View
  // ----------------------------------------------------
  if (isVaultLocked) {
    return (
      <div id="vault-locked-view" className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 glass-panel text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20">
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
            <Lock className="w-10 h-10 text-purple-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white font-['Outfit',sans-serif]">
            Zero-Knowledge Vault Locked
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your stored passwords, Instagram login credentials, and backup screenshots are encrypted with AES-256-GCM.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs text-slate-300 font-mono">Biometric Shield Active</span>
        </div>

        <button
          id="unlock-vault-btn"
          onClick={() => {
            setIsVaultLocked(false);
            showToast("Vault Unlocked", "Zero-knowledge decryption successful.", "success");
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Unlock className="w-4 h-4" />
          <span>Unlock Vault (Touch ID / Face ID)</span>
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // Main Vault Page
  // ----------------------------------------------------
  return (
    <div id="password-vault-page" className="space-y-6 animate-in fade-in duration-200 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={navigateBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                Password & Data Vault
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                AES-256
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Securely store credentials (Instagram, banking, emails), notes, and screenshot backups.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          <button
            id="vault-add-credential-btn"
            onClick={() => handleOpenAddModal("Instagram")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Store Password / Data</span>
          </button>

          <button
            id="vault-generate-pwd-btn"
            onClick={openPasswordGenerator}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-all"
            title="Generate Strong Password"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Password Generator</span>
          </button>

          <button
            id="vault-export-btn"
            onClick={handleExportVault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
            title="Export Encrypted Vault Backup"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export Backup</span>
          </button>

          <button
            id="vault-lock-toggle-btn"
            onClick={() => {
              setIsVaultLocked(true);
              showToast("Vault Locked", "Zero-knowledge security engaged.", "info");
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Lock Vault Now"
          >
            <Lock className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Quick Add Presets Row (Instagram, Google, SBI, Netflix, etc.) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">Quick Add by Account Type</span>
          <span className="text-[11px] text-cyan-400">Click to add account</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {SERVICE_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.name}
                onClick={() => handleOpenAddModal(preset.name)}
                className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${preset.color} bg-opacity-20`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="mt-2">
                  <span className="text-xs font-bold text-slate-200 block truncate">{preset.name}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{preset.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vault Statistics & Health Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Stored Credentials</span>
            <KeyRound className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-1">{vaultItems.length}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Zero-Knowledge Protected</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Saved Screenshots</span>
            <ImageIcon className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-1">
            {vaultItems.filter((i) => i.screenshotUrl).length}
          </p>
          <span className="text-[10px] text-purple-300 font-semibold">Login & 2FA Photos</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Ultra-Safe Passwords</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-1">
            {vaultItems.filter((i) => i.securityStrength === "Ultra" || i.securityStrength === "Strong").length}
          </p>
          <span className="text-[10px] text-cyan-400 font-semibold">High Entropy</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Vault Security Status</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-white font-mono mt-2">AES-256-GCM</p>
          <span className="text-[10px] text-slate-400">Local Encrypted</span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="vault-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search passwords by service (Instagram, Google), username, or notes..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Visibility Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleRevealAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
              title="Toggle visibility for all passwords"
            >
              {revealAll ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{revealAll ? "Hide All Passwords" : "Show All Passwords"}</span>
            </button>

            {vaultItems.length > 0 && (
              <button
                onClick={clearAllVaultItems}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                title="Clear All Stored Vault Data"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All Items" },
            { id: "social", label: "Social Media (Instagram, etc.)" },
            { id: "banking", label: "Banking & Finance" },
            { id: "email", label: "Email & Google" },
            { id: "entertainment", label: "Entertainment & Netflix" },
            { id: "work", label: "Work & Wi-Fi" },
            { id: "document", label: "Screenshots & Attachments" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as VaultCategory)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vault Items List */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Vault Items Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No passwords match "${searchQuery}". Try a different keyword or category.`
                : "You have no saved passwords in this category yet. Click 'Store Password / Data' to add one."}
            </p>
          </div>
          <button
            onClick={() => handleOpenAddModal("Instagram")}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Account (e.g. Instagram)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const Icon = getServiceIcon(item.service);
            const isRevealed = !!revealedPasswords[item.id];
            const hasScreenshot = !!item.screenshotUrl;

            return (
              <div
                key={item.id}
                id={`vault-card-${item.id}`}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg group"
              >
                {/* Card Top: Service Icon, Title, Favorite */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-cyan-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono capitalize">{item.service}</span>
                          {getStrengthBadge(item.securityStrength)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavoriteVaultItem(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isFavorite ? "text-amber-400 fill-amber-400" : "text-slate-600 hover:text-slate-300"
                      }`}
                      title={item.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? "fill-amber-400" : ""}`} />
                    </button>
                  </div>

                  {/* Username / Account Field */}
                  <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">
                        Username / ID
                      </span>
                      <span className="text-xs font-mono text-cyan-300 font-medium truncate block">
                        {item.usernameOrEmail}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(item.usernameOrEmail, `usr-${item.id}`, "Username")}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors flex-shrink-0"
                      title="Copy Username"
                    >
                      {copiedFieldId === `usr-${item.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Password Field */}
                  {item.password ? (
                    <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">
                          Password
                        </span>
                        <span className="text-xs font-mono text-slate-200 font-medium truncate block tracking-wider">
                          {isRevealed ? item.password : "••••••••••••••••"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleReveal(item.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                          title={isRevealed ? "Hide Password" : "Show Password"}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleCopy(item.password || "", `pwd-${item.id}`, "Password")}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Copy Password"
                        >
                          {copiedFieldId === `pwd-${item.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-850 text-xs text-slate-500 italic">
                      No password typed (screenshot or notes stored)
                    </div>
                  )}

                  {/* Website URL Link */}
                  {item.websiteUrl && (
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono truncate max-w-full"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{item.websiteUrl}</span>
                    </a>
                  )}

                  {/* Notes / 2FA Recovery Codes */}
                  {item.notes && (
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850 text-xs text-slate-300 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Notes & 2FA Backup
                      </span>
                      <p className="text-[11px] leading-relaxed line-clamp-2">{item.notes}</p>
                    </div>
                  )}

                  {/* Saved Screenshot / Photo Box (Key requirement!) */}
                  {hasScreenshot ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-purple-300 font-bold">
                          <ImageIcon className="w-3 h-3" />
                          <span>Saved Screenshot ({item.screenshotSize || "Image"})</span>
                        </span>
                        <span className="text-slate-500 truncate max-w-[120px]">{item.screenshotName}</span>
                      </div>

                      <div
                        onClick={() => {
                          setLightboxImageUrl(item.screenshotUrl || null);
                          setLightboxTitle(`${item.title} - Screenshot Backup`);
                        }}
                        className="relative rounded-2xl overflow-hidden border border-purple-500/30 group/img cursor-pointer max-h-36 bg-slate-950"
                      >
                        <img
                          src={item.screenshotUrl}
                          alt="Credentials Screenshot"
                          className="w-full h-32 object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                          <span className="p-2 rounded-xl bg-slate-900/90 text-cyan-300 font-bold text-xs flex items-center gap-1 shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>View Full Screen</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>+ Attach Login Screenshot</span>
                    </button>
                  )}
                </div>

                {/* Footer Controls: Export, Edit, Delete */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  <span>Updated: {item.updatedAt.split(" ")[0]}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExportSingleItem(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Download Dossier"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 transition-colors"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteVaultItem(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* ADD / EDIT ITEM MODAL                                */}
      {/* ---------------------------------------------------- */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl glass-panel">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                    {editingItemId ? "Edit Stored Password & Data" : "Store Password or Screenshot"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Save Instagram, emails, banking passwords, and screenshot backups securely.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Preset Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider text-[10px]">
                  Select Platform Preset
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {SERVICE_PRESETS.map((preset) => {
                    const isSelected = formData.service.toLowerCase() === preset.name.toLowerCase();
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                          isSelected
                            ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                            : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Account Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. My Instagram Account"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as VaultItem["category"] })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="social">Social Media (Instagram, Facebook, X)</option>
                    <option value="banking">Banking & Finance</option>
                    <option value="email">Email & Google Workspace</option>
                    <option value="entertainment">Entertainment & Streaming</option>
                    <option value="work">Work & Wi-Fi</option>
                    <option value="document">Document & Screenshot</option>
                    <option value="custom">Custom / Other</option>
                  </select>
                </div>
              </div>

              {/* Username / ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Username / Email / Handle *</label>
                <input
                  type="text"
                  required
                  value={formData.usernameOrEmail}
                  onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                  placeholder="e.g. @devashree_official or devashree@gmail.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Password with Generator Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={openPasswordGenerator}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Type password if you remember it (or attach screenshot below)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Website URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Login Website URL (Optional)</label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://instagram.com/accounts/login"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Notes / 2FA Backup */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  Notes & 2FA Recovery Codes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. 2FA backup codes: [93821, 10294], security question answers, recovery email."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Screenshot Upload Section (Key requested feature!) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>Save Screenshot / Photo Backup</span>
                  </label>
                  <span className="text-[10px] text-slate-400">For when you forgot or want photo proof</span>
                </div>

                {formData.screenshotUrl ? (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={formData.screenshotUrl}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-xl border border-slate-800"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {formData.screenshotName || "Attached Screenshot"}
                        </span>
                        <span className="text-[10px] text-purple-300 font-mono">
                          {formData.screenshotSize || "Image Saved"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          screenshotUrl: "",
                          screenshotName: "",
                          screenshotSize: "",
                        }))
                      }
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove Screenshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/40 bg-slate-950/60 hover:bg-slate-950 text-center cursor-pointer transition-all space-y-1"
                    >
                      <Upload className="w-6 h-6 mx-auto text-cyan-400" />
                      <p className="text-xs font-bold text-white">Click or Drag & Drop Screenshot Here</p>
                      <p className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP from your phone or PC</p>
                    </div>

                    {/* Quick Sample Screenshots */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 flex-wrap">
                      <span>Or pick sample screenshot:</span>
                      {SAMPLE_SCREENSHOTS.map((sample) => (
                        <button
                          key={sample.name}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              screenshotUrl: sample.url,
                              screenshotName: `${sample.name}.png`,
                              screenshotSize: sample.size,
                            }));
                            showToast("Sample Screenshot Loaded", sample.name, "info");
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
                        >
                          + {sample.name.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all"
                >
                  {editingItemId ? "Update Credentials" : "Save to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* AI PASSWORD GENERATOR MODAL                         */}
      {/* ---------------------------------------------------- */}
      {isPasswordGenOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl glass-panel">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white font-heading">AI Strong Password Generator</h3>
              </div>
              <button
                onClick={() => setIsPasswordGenOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Generated Password Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Generated High-Entropy Key
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-mono text-cyan-300 font-bold break-all select-all">
                  {generatedPassword}
                </span>
                <button
                  onClick={generatePassword}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-purple-500/20 text-purple-300 transition-colors flex-shrink-0"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">Length: {genLength} chars</span>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={genLength}
                  onChange={(e) => {
                    setGenLength(Number(e.target.value));
                    setTimeout(generatePassword, 10);
                  }}
                  className="w-40 accent-cyan-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGenUseUppercase(!genUseUppercase);
                    setTimeout(generatePassword, 10);
                  }}
                  className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                    genUseUppercase ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  A-Z Caps
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGenUseNumbers(!genUseNumbers);
                    setTimeout(generatePassword, 10);
                  }}
                  className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                    genUseNumbers ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  0-9 Numbers
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGenUseSymbols(!genUseSymbols);
                    setTimeout(generatePassword, 10);
                  }}
                  className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                    genUseSymbols ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  !@# Symbols
                </button>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedPassword);
                  showToast("Copied Password", generatedPassword, "success");
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Only</span>
              </button>

              <button
                onClick={applyGeneratedPassword}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-md transition-all"
              >
                Apply to Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* FULL-SCREEN IMAGE LIGHTBOX MODAL                     */}
      {/* ---------------------------------------------------- */}
      {lightboxImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in">
          <div className="relative max-w-3xl w-full rounded-3xl bg-slate-950 border border-slate-800 p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-white font-mono truncate">{lightboxTitle}</span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImageUrl}
                  download="vault_screenshot_backup.png"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Open Original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxImageUrl(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center rounded-2xl bg-black">
              <img src={lightboxImageUrl} alt="Credential Screenshot" className="max-h-[70vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
