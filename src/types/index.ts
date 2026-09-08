export type AppView =
  | "splash"
  | "onboarding"
  | "auth"
  | "login"
  | "dashboard"
  | "vault"
  | "history"
  | "scam-shield"
  | "message-detector"
  | "profile-detector"
  | "identity-guardian"
  | "deepfake-detection"
  | "browser-shield"
  | "assistant"
  | "community"
  | "learning"
  | "emergency-sos"
  | "enterprise"
  | "government"
  | "settings"
  | "profile"
  | "reports";

export type ThreatLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: "User" | "Enterprise Admin" | "Government Officer" | "Cyber Expert" | "Guest";
  safetyScore: number;
  privacyScore: number;
  identityRisk: "Low" | "Moderate" | "High";
  twoFactorEnabled: boolean;
  biometricsEnabled: boolean;
  memberSince: string;
  plan: "Free" | "Pro Cyber Shield" | "Enterprise" | "National Defense";
}

export interface SecurityAlert {
  id: string;
  title: string;
  type: "scam" | "breach" | "phishing" | "deepfake" | "system" | "emergency";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  description: string;
  source?: string;
  read: boolean;
  actionUrl?: AppView;
}

export interface ScanRecord {
  id: string;
  date: string;
  type: "message" | "profile" | "website" | "qr" | "file" | "voice" | "video";
  target: string;
  riskScore: number; // 0 - 100
  verdict: "AI-Generated" | "Human-Written" | "Mixed / Uncertain" | "Safe" | "Suspicious" | "Scam Detected" | "Genuine" | "Fake Profile Detected" | "Dangerous";
  category: string;
  confidence: number;
  confidence_score?: number;
  perplexity_assessment?: "High" | "Medium" | "Low";
  burstiness_assessment?: "High" | "Medium" | "Low";
  reasoning?: {
    summary: string;
    perplexity_reason: string;
    burstiness_reason: string;
    key_indicators: string[];
  };
  indicators: string[];
  explanation: string;
  recommendations: string[];
  platform?: string;
}

export interface SettingsState {
  // Appearance & Language
  theme: "dark" | "light" | "system";
  language: "English" | "Tamil" | "Hindi" | "Telugu" | "Kannada" | "Malayalam";
  
  // Security
  twoFactorAuth: boolean;
  biometricLogin: boolean;
  
  // Notifications
  scamAlerts: boolean;
  aiSecurityAlerts: boolean;
  securityUpdates: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  
  // AI Protection
  autoScanMessages: boolean;
  autoScanLinks: boolean;
  fakeProfileDetection: boolean;
  deepfakeDetection: boolean;
  aiVoiceScamDetection: boolean;
  autoThreatAlerts: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  category: "Beginner" | "Intermediate" | "Advanced" | "Senior Safety" | "Banking & UPI";
  duration: string;
  xp: number;
  completed: boolean;
  progress: number;
  iconName: string;
}

export interface EmergencyCase {
  id: string;
  type: string;
  victimName: string;
  date: string;
  status: "Reported" | "Bank Contacted" | "Evidence Locked" | "Under Investigation" | "Resolved";
  financialLoss?: string;
  bankName?: string;
  transactionId?: string;
  cyberComplaintNo?: string;
  evidenceCount: number;
}

export type HistoryCategory =
  | "all"
  | "scam_message"
  | "profile"
  | "deepfake"
  | "url_domain"
  | "identity"
  | "assistant"
  | "emergency"
  | "global_search";

export interface SearchHistoryItem {
  id: string;
  timestamp: string;
  query: string;
  category: HistoryCategory;
  verdict?: "AI-Generated" | "Human-Written" | "Mixed / Uncertain" | "Safe" | "Suspicious" | "Scam Detected" | "Genuine" | "Fake Profile Detected" | "Dangerous" | "Clean" | "Breached" | "High Risk" | "Processed";
  riskScore?: number;
  details?: string;
  targetView?: AppView;
  indicators?: string[];
  recommendations?: string[];
  metadata?: Record<string, any>;
}

export type VaultCategory =
  | "all"
  | "social"
  | "banking"
  | "email"
  | "entertainment"
  | "work"
  | "document"
  | "custom";

export interface VaultItem {
  id: string;
  title: string;
  service: string; // e.g. "Instagram", "Google", "SBI Bank", "Facebook", "X / Twitter", "Netflix"
  usernameOrEmail: string;
  password?: string;
  websiteUrl?: string;
  category: "social" | "banking" | "email" | "entertainment" | "work" | "document" | "custom";
  notes?: string;
  screenshotUrl?: string; // base64 data URL or image path
  screenshotName?: string;
  screenshotSize?: string;
  tags?: string[];
  isFavorite?: boolean;
  securityStrength?: "Weak" | "Medium" | "Strong" | "Ultra";
  createdAt: string;
  updatedAt: string;
}


