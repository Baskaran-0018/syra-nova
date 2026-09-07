import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppView, UserProfile, SettingsState, ScanRecord, SecurityAlert, SearchHistoryItem, VaultItem } from "../types";

interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  previousView: AppView | null;
  navigateBack: () => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  updateSettings?: (newSettings: Partial<SettingsState>) => void;
  scans: ScanRecord[];
  addScan: (scan: Omit<ScanRecord, "id" | "date">) => ScanRecord;
  deleteScan: (id: string) => void;
  clearAllScans: () => void;
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (item: Omit<SearchHistoryItem, "id" | "timestamp">) => SearchHistoryItem;
  deleteSearchHistoryItem: (id: string) => void;
  clearSearchHistory: () => void;
  vaultItems: VaultItem[];
  addVaultItem: (item: Omit<VaultItem, "id" | "createdAt" | "updatedAt">) => VaultItem;
  updateVaultItem: (id: string, updates: Partial<VaultItem>) => void;
  deleteVaultItem: (id: string) => void;
  clearAllVaultItems: () => void;
  toggleFavoriteVaultItem: (id: string) => void;
  isVaultLocked: boolean;
  setIsVaultLocked: (locked: boolean) => void;
  alerts: SecurityAlert[];
  unreadAlertsCount: number;
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  deleteAlert: (id: string) => void;
  clearAllAlerts: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isSplashActive: boolean;
  setIsSplashActive: (active: boolean) => void;
  isOnboardingActive: boolean;
  setIsOnboardingActive: (active: boolean) => void;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isFloatingAIAssistantOpen: boolean;
  setIsFloatingAIAssistantOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: "success" | "info" | "warning" | "error") => void;
  removeToast: (id: string) => void;
  performLogout: () => void;
}

const defaultSettings: SettingsState = {
  theme: "dark",
  language: "English",
  twoFactorAuth: true,
  biometricLogin: true,
  scamAlerts: true,
  aiSecurityAlerts: true,
  securityUpdates: true,
  pushNotifications: true,
  emailNotifications: false,
  autoScanMessages: true,
  autoScanLinks: true,
  fakeProfileDetection: true,
  deepfakeDetection: true,
  aiVoiceScamDetection: true,
  autoThreatAlerts: true,
};

const initialUser: UserProfile = {
  id: "USR-0001",
  name: "Baskaran J.",
  email: "baskaran.j0018@gmail.com",
  phone: "+91 98401 23456",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  role: "User",
  safetyScore: 100,
  privacyScore: 100,
  identityRisk: "Low",
  twoFactorEnabled: true,
  biometricsEnabled: true,
  memberSince: "August 2026",
  plan: "Pro Cyber Shield",
};

const initialAlerts: SecurityAlert[] = [];

const initialScans: ScanRecord[] = [];

const initialSearchHistory: SearchHistoryItem[] = [];

const initialVaultItems: VaultItem[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setView] = useState<AppView>("splash");
  const [viewHistory, setViewHistory] = useState<AppView[]>(["dashboard"]);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [scans, setScans] = useState<ScanRecord[]>(initialScans);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(initialSearchHistory);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    try {
      // Clear legacy sample vault data if present
      if (localStorage.getItem("syra_password_vault")) {
        localStorage.removeItem("syra_password_vault");
      }
      const saved = localStorage.getItem("syra_password_vault_v2");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load vault items from storage", e);
    }
    return [];
  });
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(initialAlerts);

  // Persist vault items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("syra_password_vault_v2", JSON.stringify(vaultItems));
    } catch (e) {
      console.error("Failed to persist vault items", e);
    }
  }, [vaultItems]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isFloatingAIAssistantOpen, setIsFloatingAIAssistantOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [settings.theme]);

  const setCurrentView = (view: AppView) => {
    if (view !== currentView) {
      setViewHistory((prev) => [...prev, currentView]);
      setView(view);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navigateBack = () => {
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory((prevArr) => prevArr.slice(0, -1));
      setView(prev);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setView("dashboard");
    }
  };

  const previousView = viewHistory.length > 0 ? viewHistory[viewHistory.length - 1] : null;

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    showToast("Setting Updated", `${String(key)} has been updated successfully.`, "info");
  };

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const addScan = (scanData: Omit<ScanRecord, "id" | "date">): ScanRecord => {
    const newScan: ScanRecord = {
      ...scanData,
      id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setScans((prev) => [newScan, ...prev]);
    
    // Also record in search / activity history
    addSearchHistory({
      query: newScan.target,
      category: newScan.type === "message" ? "scam_message" : newScan.type === "profile" ? "profile" : newScan.type === "website" ? "url_domain" : "scam_message",
      verdict: newScan.verdict,
      riskScore: newScan.riskScore,
      details: newScan.explanation || newScan.category,
      targetView: newScan.type === "message" ? "message-detector" : newScan.type === "profile" ? "profile-detector" : "browser-shield",
      indicators: newScan.indicators,
      recommendations: newScan.recommendations,
    });

    return newScan;
  };

  const deleteScan = (id: string) => {
    setScans((prev) => prev.filter((s) => s.id !== id));
    showToast("Scan Deleted", `Scan record #${id} has been permanently deleted.`, "info");
  };

  const clearAllScans = () => {
    setScans([]);
    showToast("Scans Cleared", "All recent scan records have been cleared.", "warning");
  };

  const addSearchHistory = (item: Omit<SearchHistoryItem, "id" | "timestamp">): SearchHistoryItem => {
    const newItem: SearchHistoryItem = {
      ...item,
      id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: "Just now",
    };
    setSearchHistory((prev) => [newItem, ...prev]);
    return newItem;
  };

  const deleteSearchHistoryItem = (id: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.id !== id));
    showToast("History Item Removed", "Searched record removed from audit history.", "info");
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast("History Cleared", "All search and inspection history has been cleared.", "warning");
  };

  const addVaultItem = (itemData: Omit<VaultItem, "id" | "createdAt" | "updatedAt">): VaultItem => {
    const newItem: VaultItem = {
      ...itemData,
      id: `vlt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setVaultItems((prev) => [newItem, ...prev]);
    showToast("Credential Stored", `Saved "${newItem.title}" to secure vault.`, "success");
    return newItem;
  };

  const updateVaultItem = (id: string, updates: Partial<VaultItem>) => {
    setVaultItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              updatedAt: new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : item
      )
    );
    showToast("Vault Updated", "Password & account data updated.", "success");
  };

  const deleteVaultItem = (id: string) => {
    const target = vaultItems.find((v) => v.id === id);
    setVaultItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Item Removed", `Deleted "${target?.title || "credential"}" from vault.`, "info");
  };

  const clearAllVaultItems = () => {
    setVaultItems([]);
    showToast("Vault Cleared", "All vault records and screenshots have been removed.", "warning");
  };

  const toggleFavoriteVaultItem = (id: string) => {
    setVaultItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    showToast("Notifications Read", "All threat alerts marked as read.", "success");
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast("Alert Dismissed", "Security notification removed.", "info");
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    showToast("Alerts Cleared", "All security alerts have been cleared.", "info");
  };

  const showToast = (title: string, message: string, type: "success" | "info" | "warning" | "error" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const performLogout = () => {
    setIsLogoutModalOpen(false);
    setUser({
      ...initialUser,
      role: "Guest",
      name: "Guest User",
      email: "guest@syranova.ai",
    });
    showToast("Logged Out", "You have been logged out of your SYRA NOVA session.", "info");
    setCurrentView("login");
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        previousView,
        navigateBack,
        user,
        setUser,
        settings,
        updateSetting,
        updateSettings,
        scans,
        addScan,
        deleteScan,
        clearAllScans,
        searchHistory,
        addSearchHistory,
        deleteSearchHistoryItem,
        clearSearchHistory,
        vaultItems,
        addVaultItem,
        updateVaultItem,
        deleteVaultItem,
        clearAllVaultItems,
        toggleFavoriteVaultItem,
        isVaultLocked,
        setIsVaultLocked,
        alerts,
        unreadAlertsCount,
        markAlertAsRead,
        markAllAlertsAsRead,
        deleteAlert,
        clearAllAlerts,
        isSidebarOpen,
        setIsSidebarOpen,
        isSplashActive,
        setIsSplashActive,
        isOnboardingActive,
        setIsOnboardingActive,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isFloatingAIAssistantOpen,
        setIsFloatingAIAssistantOpen,
        toasts,
        showToast,
        removeToast,
        performLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
