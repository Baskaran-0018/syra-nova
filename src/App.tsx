import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { BottomNav } from "./components/common/BottomNav";
import { FloatingAIAssistant } from "./components/common/FloatingAIAssistant";
import { GlobalSearchModal } from "./components/common/GlobalSearchModal";
import { NotificationDrawer } from "./components/common/NotificationDrawer";
import { ToastContainer } from "./components/common/ToastContainer";
import { ConfirmationModal } from "./components/common/ConfirmationModal";

// Screens
import { SplashScreen } from "./components/splash/SplashScreen";
import { OnboardingModal } from "./components/onboarding/OnboardingModal";
import { LoginPage } from "./components/auth/LoginPage";
import { AuthModal } from "./components/auth/AuthModal";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ScamShieldHubPage } from "./components/scam/ScamShieldHubPage";
import { ScamMessageDetectorPage } from "./components/scam/ScamMessageDetectorPage";
import { FakeProfileDetectorPage } from "./components/scam/FakeProfileDetectorPage";
import { DigitalIdentityGuardianPage } from "./components/identity/DigitalIdentityGuardianPage";
import { DeepfakeDetectionPage } from "./components/deepfake/DeepfakeDetectionPage";
import { BrowserShieldPage } from "./components/browser/BrowserShieldPage";
import { AIAssistantPage } from "./components/assistant/AIAssistantPage";
import { CommunityFeedPage } from "./components/community/CommunityFeedPage";
import { LearningHubPage } from "./components/learning/LearningHubPage";
import { EmergencySosPage } from "./components/emergency/EmergencySosPage";
import { EnterpriseCenterPage } from "./components/portals/EnterpriseCenterPage";
import { GovernmentIntelligencePage } from "./components/portals/GovernmentIntelligencePage";
import { SecurityReportsPage } from "./components/reports/SecurityReportsPage";
import { UserProfilePage } from "./components/profile/UserProfilePage";
import { SettingsPage } from "./components/settings/SettingsPage";
import { HistoryPage } from "./components/history/HistoryPage";
import { PasswordVaultPage } from "./components/vault/PasswordVaultPage";

const MainAppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isSplashActive,
    setIsSplashActive,
    isOnboardingActive,
    setIsOnboardingActive,
    isSidebarOpen,
    setIsSidebarOpen,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    showToast,
  } = useApp();

  // 1. Splash Screen
  if (isSplashActive) {
    return (
      <SplashScreen
        onComplete={() => {
          setIsSplashActive(false);
          setIsOnboardingActive(true);
        }}
      />
    );
  }

  // 2. Onboarding Modal Flow
  if (isOnboardingActive) {
    return (
      <OnboardingModal
        onComplete={() => {
          setIsOnboardingActive(false);
          setCurrentView("dashboard");
        }}
      />
    );
  }

  // 3. Login / Auth Page (if user logs out or selects login)
  if (currentView === "auth" || currentView === "login") {
    return <LoginPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardPage />;
      case "vault":
        return <PasswordVaultPage />;
      case "history":
        return <HistoryPage />;
      case "scam-shield":
        return <ScamShieldHubPage />;
      case "message-detector":
        return <ScamMessageDetectorPage />;
      case "profile-detector":
        return <FakeProfileDetectorPage />;
      case "identity-guardian":
        return <DigitalIdentityGuardianPage />;
      case "deepfake-detection":
        return <DeepfakeDetectionPage />;
      case "browser-shield":
        return <BrowserShieldPage />;
      case "assistant":
        return <AIAssistantPage />;
      case "community":
        return <CommunityFeedPage />;
      case "learning":
        return <LearningHubPage />;
      case "emergency-sos":
        return <EmergencySosPage />;
      case "enterprise":
        return <EnterpriseCenterPage />;
      case "government":
        return <GovernmentIntelligencePage />;
      case "reports":
        return <SecurityReportsPage />;
      case "profile":
        return <UserProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    showToast("Logged Out", "You have been securely signed out.", "info");
    setCurrentView("login");
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Main Container Layout */}
      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Content View Container */}
        <main
          id="main-app-content-area"
          className="flex-1 lg:pl-64 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12"
        >
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating AI Assistant Bubble */}
      <FloatingAIAssistant />

      {/* Global Modals */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <ToastContainer />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your SYRA NOVA cyber defense account? Active background neural shields will be placed on standby."
        confirmText="Log Out"
        cancelText="Stay Protected"
        isDangerous={true}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
