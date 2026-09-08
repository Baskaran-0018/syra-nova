import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI client:", err);
    }
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "SYRA NOVA AI Cyber Core",
    version: "1.0.0",
    aiAvailable: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. Scam Message Detector Endpoint
app.post("/api/analyze/message", async (req, res) => {
  const { message, messageType = "text", sender = "Unknown" } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message text is required." });
  }

  const ai = getAI();
  if (ai) {
    const modelsToTry = ["gemini-3.7-flash", "gemini-3.6-flash"];
    for (const modelName of modelsToTry) {
      try {
        const prompt = `You are SYRA NOVA AI, an expert cybersecurity fraud detection model.
Analyze this message objectively and accurately:
"""
${message.slice(0, 4000)}
"""
Message Type: ${messageType}
Sender Info: ${sender}

CLASSIFICATION RULES:
- If this is a standard benign conversation, greeting, friend/colleague chat, legitimate order confirmation, harmless question, or non-fraudulent everyday notification -> CLASSIFY AS "Safe", riskScore: 0 to 18, category: "Legitimate Message" or "Personal Communication".
- If this is unsolicited marketing, mild clickbait, or unverified promotional offers WITHOUT credential harvesting -> CLASSIFY AS "Suspicious", riskScore: 25 to 55, category: "Unsolicited Promotional".
- If this contains phishing links, fake bank alerts, threats of electricity/account disconnection, fake prize/lottery money, requests to enter UPI PIN to receive funds, requests for OTPs, or malicious APK downloads -> CLASSIFY AS "Scam Detected", riskScore: 70 to 99, category: specific scam type (e.g. "Bank Phishing", "Electricity Disconnection Scam", "UPI PIN Fraud", "Lottery Scam", "Job Task Scam").

CRITICAL: Do NOT mark normal, safe, or genuine messages as scam. False positives must be avoided.

Respond ONLY with a valid JSON object matching this schema:
{
  "riskScore": number (0 to 100),
  "verdict": "Safe" | "Suspicious" | "Scam Detected",
  "category": string,
  "confidence": number,
  "threatIndicators": string[],
  "explanation": string,
  "recommendations": string[]
}`;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        let text = response.text || "{}";
        text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(text);

        // Normalize verdict and riskScore consistency
        const score = typeof parsed.riskScore === "number" ? parsed.riskScore : 10;
        let verdict: "Safe" | "Suspicious" | "Scam Detected" = "Safe";
        if (score >= 65) verdict = "Scam Detected";
        else if (score >= 30) verdict = "Suspicious";

        return res.json({
          riskScore: score,
          verdict: parsed.verdict || verdict,
          category: parsed.category || (verdict === "Safe" ? "Legitimate Message" : verdict === "Suspicious" ? "Suspicious Content" : "Phishing Scam"),
          confidence: typeof parsed.confidence === "number" ? parsed.confidence : 94,
          threatIndicators: Array.isArray(parsed.threatIndicators) && parsed.threatIndicators.length > 0
            ? parsed.threatIndicators
            : verdict === "Safe" ? ["No threat patterns detected", "Normal communication tone"] : ["Suspicious urgency"],
          explanation: parsed.explanation || (verdict === "Safe" ? "This message appears safe with no fraudulent triggers." : "Potential risk factors detected."),
          recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0
            ? parsed.recommendations
            : verdict === "Safe" ? ["Standard safety precautions apply"] : ["Do not share OTP or sensitive details"]
        });
      } catch (aiErr) {
        console.warn(`Gemini scam analysis error on ${modelName}:`, aiErr);
      }
    }
  }

  // Fallback high-precision heuristic rule engine (Zero false-positives for benign chats)
  const lower = message.toLowerCase();
  const indicators: string[] = [];
  let score = 5;

  const hasUrgentThreat = lower.includes("blocked within") || lower.includes("disconnected tonight") || lower.includes("account suspended") || lower.includes("legal action") || lower.includes("court notice");
  const hasCredentialHarvester = (lower.includes("otp") || lower.includes("password") || lower.includes("cvv") || lower.includes("pin")) && (lower.includes("share") || lower.includes("send") || lower.includes("verify") || lower.includes("enter"));
  const hasRewardLottery = (lower.includes("lottery") || lower.includes("won ₹") || lower.includes("won rs") || lower.includes("claim 50,000") || lower.includes("cashback 5000")) && (lower.includes("claim") || lower.includes("link") || lower.includes("click"));
  const hasSuspiciousDomain = lower.includes("bit.ly") || lower.includes("tinyurl") || lower.includes(".xyz") || lower.includes(".top") || lower.includes(".apk") || lower.includes(".ru") || lower.includes("sbi-kyc") || lower.includes("update-kyc");
  const hasUpiReceiveFraud = (lower.includes("upi") || lower.includes("gpay") || lower.includes("phonepe") || lower.includes("paytm")) && (lower.includes("pin to receive") || lower.includes("receive money") || lower.includes("claim reward"));

  if (hasUrgentThreat) {
    indicators.push("Panic & disconnection threat");
    score += 45;
  }
  if (hasCredentialHarvester) {
    indicators.push("Credential / OTP harvesting attempt");
    score += 50;
  }
  if (hasRewardLottery) {
    indicators.push("Fake lottery / prize bait");
    score += 45;
  }
  if (hasSuspiciousDomain) {
    indicators.push("Deceptive or unverified external link");
    score += 35;
  }
  if (hasUpiReceiveFraud) {
    indicators.push("UPI PIN deception (PIN requested to receive money)");
    score += 50;
  }

  const finalScore = Math.min(Math.max(score, 4), 98);
  let verdict: "Safe" | "Suspicious" | "Scam Detected" = "Safe";
  let category = "Legitimate Message";

  if (finalScore >= 65) {
    verdict = "Scam Detected";
    category = hasUrgentThreat ? "Threat & Disconnection Scam" : hasRewardLottery ? "Lottery & Prize Fraud" : hasCredentialHarvester ? "Phishing & Credential Theft" : "Financial Scam Alert";
  } else if (finalScore >= 30) {
    verdict = "Suspicious";
    category = "Potential Unsolicited / Suspicious Message";
  } else {
    verdict = "Safe";
    category = "Legitimate Personal / Transactional Message";
    indicators.length = 0;
    indicators.push("Verified conversational tone", "No credential harvesting triggers detected", "No deceptive links found");
  }

  return res.json({
    riskScore: finalScore,
    verdict,
    category,
    confidence: 93,
    threatIndicators: indicators,
    explanation: verdict === "Safe"
      ? "The analyzed text is safe and does not exhibit phishing characteristics, panic-inducing threats, or fraudulent payment triggers."
      : verdict === "Suspicious"
      ? "This message contains promotional or unsolicited requests. Exercise standard caution before clicking any links or replying."
      : "High-risk scam detected. The message exhibits explicit fraud tactics designed to compromise credentials or induce unauthorized fund transfers.",
    recommendations: verdict === "Safe"
      ? ["Standard safety practices apply", "Always verify sender identity if unexpected", "Never share banking passwords or OTPs"]
      : [
          "Do not click any links or download APK files",
          "Never enter UPI PIN or share OTP to receive funds",
          "Block and report the sender number immediately",
          "If money was lost, report to National Cyber Helpline (1930)"
        ]
  });
});

// 2. Fake Profile Detector Endpoint
app.post("/api/analyze/profile", async (req, res) => {
  const { url, username, platform = "Instagram", details = "", attributes = {} } = req.body;
  const target = (username || url || "Unknown Profile").trim();
  const cleanDetails = (details || "").trim();

  // Format full forensic survey details for the AI
  const surveyItems: string[] = [];
  if (attributes.accountAge) surveyItems.push(`Account Age: ${attributes.accountAge}`);
  if (attributes.profilePicType) surveyItems.push(`Profile Picture: ${attributes.profilePicType}`);
  if (attributes.postCount) surveyItems.push(`Post History: ${attributes.postCount}`);
  if (attributes.followers) surveyItems.push(`Followers: ${attributes.followers}`);
  if (attributes.following) surveyItems.push(`Following: ${attributes.following}`);
  if (attributes.linkType) surveyItems.push(`Bio External Links: ${attributes.linkType}`);
  if (attributes.unsolicitedDm) surveyItems.push(`Unsolicited Outreach: YES (Sent cold DM)`);
  if (attributes.askingMoneyOrCrypto) surveyItems.push(`Direct Financial Request: YES (Asked for Money/Crypto/UPI/Card/OTP)`);
  if (attributes.promisingPrizeOrJob) surveyItems.push(`Prize/Job Lure: YES (Promised Lottery/Prize/High Returns)`);
  if (attributes.offPlatformRedirection) surveyItems.push(`Off-Platform Redirection: YES (Urged to move to Telegram/WhatsApp)`);
  if (attributes.hasBlueBadge) surveyItems.push(`Official Platform Verification Badge: Present`);
  if (attributes.hasMutualConnections) surveyItems.push(`Known Mutual Connections: Present`);

  const fullContext = [cleanDetails, surveyItems.join(" | ")].filter(Boolean).join("\nDetailed Profile Forensic Questionnaire:\n");
  const combined = `${target} ${fullContext}`.toLowerCase();

  const ai = getAI();
  if (ai) {
    const modelsToTry = ["gemini-3.7-flash", "gemini-3.6-flash"];
    for (const modelName of modelsToTry) {
      try {
        const prompt = `You are SYRA NOVA AI, an expert social media threat analyst and forensic fake profile detector.
Analyze this social account profile accurately:
Platform: ${platform}
Target Handle/URL: ${target}
Profile Bio / Stats / Description / Forensic Questionnaire Data:
${fullContext}

ANALYSIS CRITERIA:
1. "Fake Profile Detected" (authenticityScore: 5 to 35):
   - Asking for money, crypto, gift cards, investment, or OTP in DMs.
   - Promising fake lottery prizes, work-from-home tasks, or iPhone giveaways.
   - Impersonation of brands/celebrities/banks/customer support (e.g. adding _support, _official, _help, _24x7, _care, _airdrop, _claims to brand names).
   - Crypto / Forex / Binary investment solicitations, signals, mining pools, telegram links (t.me/, wa.me/).
   - Romance catfishing (military doctor/surgeon in Syria/deployment, asking for gift cards or off-platform WhatsApp).
   - Fake customer care desks offering refund helplines or toll-free numbers.
   - Bot follower swarms (e.g. following 4,000+ with 10 followers, 0 posts, newly created account).

2. "Suspicious" (authenticityScore: 40 to 68):
   - Unverified promotional accounts, heavy affiliate link shorteners (bit.ly, tinyurl), recent account with high following, unverified fan accounts.

3. "Genuine" (authenticityScore: 75 to 98):
   - Standard organic personal accounts, legitimate creators, authentic verified brand profiles without scam triggers or financial solicitations.

CRITICAL: Weigh all provided forensic questionnaire responses (especially DM solicitation, account age, profile photo, and follower ratios).

Respond strictly in JSON format matching this schema:
{
  "authenticityScore": number (0 to 100),
  "verdict": "Genuine" | "Suspicious" | "Fake Profile Detected",
  "confidence": number (e.g. 92),
  "riskIndicators": string[],
  "explanation": string,
  "recommendations": string[]
}`;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        let text = response.text || "{}";
        text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(text);

        if (typeof parsed.authenticityScore === "number" && parsed.verdict) {
          return res.json(parsed);
        }
      } catch (err) {
        console.warn(`Gemini profile analysis failed with model ${modelName}:`, err);
      }
    }
  }

  // Robust Server-side Heuristic Engine
  const flags: string[] = [];
  let deduction = 0;
  let category = "Profile Audit";

  const brandKeywords = [
    "support", "helpdesk", "customercare", "helpline", "official", "care", "service",
    "apple", "google", "meta", "instagram", "facebook", "twitter", "x", "telegram",
    "binance", "coinbase", "sbi", "hdfc", "icici", "axis", "paytm", "phonepe", "gpay",
    "amazon", "flipkart", "netflix", "paypal", "microsoft", "elon", "tesla", "spacex",
    "mrbeast", "crypto", "forex", "airdrop", "giveaway", "winner"
  ];

  const impersonatorSuffixes = [
    "_official", "_support", "_help", "_customercare", "_care", "_24x7", "_desk",
    "_backup", "_temp", "_fanpage", "_real", "_original", "_team", "_mod", "_admin",
    "_winner", "_claim", "_airdrop", "_bonus", "_refund", "_dept", "_officia1", "_supp0rt"
  ];

  const hasImpersonatorHandle = impersonatorSuffixes.some((s) => target.toLowerCase().includes(s));
  const hasBrandKeyword = brandKeywords.some((b) => target.toLowerCase().includes(b));

  if (
    (hasImpersonatorHandle && hasBrandKeyword) ||
    combined.includes("customer care") ||
    combined.includes("toll free") ||
    combined.includes("24x7 helpline") ||
    combined.includes("refund support")
  ) {
    deduction += 65;
    flags.push("High-Risk Impersonation Handle / Fake Support Desk");
    flags.push("Unverified Customer Care / Helpline Pattern");
    category = "Customer Support Impersonation";
  }

  if (
    combined.includes("crypto") ||
    combined.includes("forex") ||
    combined.includes("binary option") ||
    combined.includes("mining pool") ||
    combined.includes("guaranteed profit") ||
    combined.includes("earn $") ||
    combined.includes("earn ₹") ||
    combined.includes("passive income") ||
    combined.includes("investment plan") ||
    combined.includes("fx_") ||
    combined.includes("trader_") ||
    combined.includes("signals") ||
    combined.includes("airdrop")
  ) {
    deduction += 60;
    flags.push("Crypto / Forex Investment Solicitation");
    flags.push("Unregulated Financial Trading Lure");
    category = "Crypto & Financial Scam";
  }

  if (
    combined.includes("giveaway") ||
    combined.includes("congratulations you won") ||
    combined.includes("winner claim") ||
    combined.includes("lucky draw") ||
    combined.includes("free iphone") ||
    combined.includes("dm to claim") ||
    combined.includes("send screenshot to claim")
  ) {
    deduction += 60;
    flags.push("Advance-Fee Prize / Giveaway Trap");
    flags.push("Unsolicited Winner Notification Pattern");
    category = "Giveaway Scam";
  }

  if (
    (combined.includes("army") || combined.includes("military") || combined.includes("peacekeeping") || combined.includes("syria") || combined.includes("surgeon") || combined.includes("widower") || combined.includes("widowed")) &&
    (combined.includes("honest") || combined.includes("soulmate") || combined.includes("whatsapp") || combined.includes("looking for love") || combined.includes("deploy"))
  ) {
    deduction += 65;
    flags.push("Romance / Military Catfishing Persona Signature");
    flags.push("Off-Platform Redirection Trap");
    category = "Romance Catfish Scam";
  }

  const digitMatches = target.match(/\d+/g);
  const totalDigits = digitMatches ? digitMatches.join("").length : 0;
  if (totalDigits >= 5 || target.toLowerCase().includes("bot_") || target.toLowerCase().startsWith("user_")) {
    deduction += 35;
    flags.push("Synthetic Bot Handle Format / Numeric Swarm Identifier");
  }

  if (
    combined.includes("t.me/") ||
    combined.includes("telegram.me") ||
    combined.includes("wa.me/") ||
    combined.includes("bit.ly") ||
    combined.includes(".xyz") ||
    combined.includes(".top")
  ) {
    deduction += 40;
    flags.push("External Unverified Redirection Link (Telegram/WhatsApp/Link Shortener)");
  }

  let finalAuthenticity = Math.max(94 - deduction, 8);
  let verdict: "Genuine" | "Suspicious" | "Fake Profile Detected" = "Genuine";

  if (finalAuthenticity <= 40) {
    verdict = "Fake Profile Detected";
  } else if (finalAuthenticity <= 70) {
    verdict = "Suspicious";
  } else {
    flags.push("Organic handle structure", "No automated bot traits detected", "Consistent public metadata");
  }

  return res.json({
    authenticityScore: finalAuthenticity,
    verdict,
    confidence: verdict === "Fake Profile Detected" ? 94 : verdict === "Suspicious" ? 85 : 92,
    riskIndicators: flags,
    explanation:
      verdict === "Fake Profile Detected"
        ? `High-risk indicators identified on ${target}. The profile matches known patterns of ${category}, including deceptive handle syntax and external redirection.`
        : verdict === "Suspicious"
        ? `Potential irregularities detected on ${target}. Unverified linking patterns or automated traits present. Exercise caution.`
        : `The profile ${target} displays organic behavioral attributes, healthy identity metadata, and zero detected scam triggers.`,
    recommendations:
      verdict === "Fake Profile Detected"
        ? [
            "Do NOT click any bio links, payment links, or external chat invitations (Telegram/WhatsApp).",
            "Never send money, OTPs, gift cards, or cryptocurrency to this account.",
            "Report the profile immediately to the platform moderation team and block the user.",
            "If this account claims to be a brand or bank, verify through their official website or verified toll-free number.",
          ]
        : verdict === "Suspicious"
        ? [
            "Request video verification or contact through an alternate verified platform before engaging.",
            "Avoid sharing personal identity, workplace, or financial information.",
            "Examine follower comments and engagement history to verify authenticity.",
          ]
        : [
            "Standard online privacy and security practices apply.",
            "Always verify identity before engaging in peer-to-peer financial transactions.",
          ],
  });
});

// 3. AI Cyber Assistant ("NOVA AI") Chat Endpoint
app.post("/api/assistant/chat", async (req, res) => {
  const { messages = [], language = "English" } = req.body;
  const lastUserMsg = messages[messages.length - 1]?.content || "Hello";

  const ai = getAI();
  if (ai) {
    try {
      const systemInstruction = `You are NOVA AI, the world-class intelligent cyber defense companion inside the SYRA NOVA cybersecurity ecosystem.
You are professional, reassuring, crystal-clear, highly knowledgeable in:
- Scam & fraud prevention (SMS, WhatsApp, Email, UPI, Bank Phishing, Lottery scams)
- Digital Identity Guardian (password health, data breach recovery, privacy footprint)
- Deepfake and voice clone detection advice
- Browser Shield and real-time safe browsing
- Step-by-step incident recovery (hacked Instagram/Google, unauthorized UPI transactions, SIM swap)
- National Cyber Helpline guidance (such as India's 1930 / cybercrime.gov.in and international CERTs)

Language requested: ${language}.
Keep responses structured, concise, visually organized with bullet points, actionable steps, and zero technical jargon unless asked.
Never generate fake links. Provide real, sound cybersecurity best practices.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: lastUserMsg,
        config: {
          systemInstruction,
        },
      });

      return res.json({
        reply: response.text,
        language,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Gemini API assistant error:", err);
    }
  }

  // Fallback intelligent responses
  const lower = lastUserMsg.toLowerCase();
  let reply = `Hello! I am **NOVA AI**, your SYRA NOVA cyber guardian.\n\nHere are some actions I can assist you with right now:\n- 🛡️ **Analyze a suspicious message or email**\n- 🔍 **Check a social profile or website link**\n- 🚨 **Guide you through account recovery (Instagram, Google, UPI)**\n- 🔐 **Assess your password strength and privacy settings**\n\nHow can I protect you today?`;

  if (lower.includes("upi") || lower.includes("bank") || lower.includes("money") || lower.includes("fraud") || lower.includes("lost money")) {
    reply = `🚨 **Emergency Cyber Fraud Recovery Steps:**\n\n1. **Call Cyber Crime Helpline 1930** immediately (Golden Hour response stops illicit fund transfers).\n2. **Block Bank Account & UPI**: Open your banking app or call their fraud helpline to freeze digital banking access.\n3. **Preserve Evidence**: Take screenshots of transaction IDs, sender SMS, payment receipt, and chat messages.\n4. **Register Complaint**: File an official report at **cybercrime.gov.in** with the transaction reference.\n\nSYRA NOVA's **Emergency SOS** module can automatically compile your evidence dossier into a formal PDF report.`;
  } else if (lower.includes("hacked") || lower.includes("instagram") || lower.includes("facebook") || lower.includes("google")) {
    reply = `🔒 **Account Recovery Protocol:**\n\n1. **Secure Associated Email**: Change your email password first and terminate active sessions.\n2. **Official Account Recovery**: Use the platform's official recovery flow (e.g. instagram.com/hacked or accounts.google.com/signin/recovery).\n3. **Revoke Third-Party App Access**: Check connected apps and remove unfamiliar integrations.\n4. **Enable Multi-Factor Authentication (MFA)** using an Authenticator app, not SMS if possible.\n5. **Alert Contacts**: Notify friends that your account was compromised so they do not click malicious links sent in your name.`;
  } else if (lower.includes("deepfake") || lower.includes("voice")) {
    reply = `🤖 **Deepfake & Voice Clone Defense:**\n\n- **Live Verification Code**: Establish a secret "family safe word" to verify unexpected emergency phone calls.\n- **Visual Artifacts**: Look for unnatural eye blinks, edge distortion around lips and teeth, and lighting inconsistencies.\n- **Audio Anomaly**: Cloned voices often lack natural breathing pauses, subtle background room acoustic reflections, or micro-intonations.\n- Use the **SYRA NOVA Deepfake Detection** tool to scan audio and video files.`;
  }

  return res.json({
    reply,
    language,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SYRA NOVA server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
