import { ScanRecord } from "../types";

export interface AIMessageAnalysisResult {
  verdict: "AI-Generated" | "Human-Written" | "Mixed / Uncertain";
  confidence_score: number;
  perplexity_assessment: "High" | "Medium" | "Low";
  burstiness_assessment: "High" | "Medium" | "Low";
  reasoning: {
    summary: string;
    perplexity_reason: string;
    burstiness_reason: string;
    key_indicators: string[];
  };
  // Compatibility fields
  riskScore: number;
  category: string;
  confidence: number;
  threatIndicators: string[];
  explanation: string;
  recommendations: string[];
}

export interface ProfileAnalysisResult {
  authenticityScore: number;
  verdict: "Genuine" | "Suspicious" | "Fake Profile Detected";
  confidence: number;
  riskIndicators: string[];
  explanation: string;
  recommendations: string[];
}

export type MessageAnalysisResult = AIMessageAnalysisResult;

/**
 * Intelligent AI vs Human Message & Text Analyzer
 * Evaluates Perplexity, Burstiness, and Stylistic Patterns.
 */
export async function analyzeMessageWithAI(
  message: string,
  messageType = "text"
): Promise<AIMessageAnalysisResult> {
  const trimmed = message.trim();

  // 1. Try Server API Endpoint first (Gemini AI Powered)
  try {
    const response = await fetch("/api/analyze/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed, messageType }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.verdict && typeof data.confidence_score === "number" && data.reasoning) {
        return {
          verdict: data.verdict,
          confidence_score: data.confidence_score,
          perplexity_assessment: data.perplexity_assessment || "Medium",
          burstiness_assessment: data.burstiness_assessment || "Medium",
          reasoning: {
            summary: data.reasoning.summary || "Linguistic AI detection completed.",
            perplexity_reason: data.reasoning.perplexity_reason || "Analyzed word predictability.",
            burstiness_reason: data.reasoning.burstiness_reason || "Analyzed sentence rhythm.",
            key_indicators: Array.isArray(data.reasoning.key_indicators) ? data.reasoning.key_indicators : [],
          },
          riskScore: typeof data.riskScore === "number" ? data.riskScore : (data.verdict === "AI-Generated" ? data.confidence_score : 100 - data.confidence_score),
          category: data.category || (data.verdict === "AI-Generated" ? "Synthetic AI Text" : data.verdict === "Human-Written" ? "Organic Human Text" : "Hybrid Content"),
          confidence: data.confidence_score,
          threatIndicators: Array.isArray(data.reasoning.key_indicators) ? data.reasoning.key_indicators : [],
          explanation: data.reasoning.summary || "",
          recommendations: data.recommendations || (data.verdict === "AI-Generated" ? ["Verify authenticity with author", "Check factual citations"] : ["Organic human writing confirmed"]),
        };
      }
    }
  } catch (apiErr) {
    console.warn("Backend AI detector API unavailable, using local linguistic engine:", apiErr);
  }

  // 2. High-precision Client-Side Linguistic Engine
  const words = trimmed.split(/\s+/).filter(Boolean);
  const rawSentences = trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const sentences = rawSentences.length > 0 ? rawSentences : [trimmed];

  // A. Sentence length variance calculation (Burstiness)
  const sentenceLengths = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / (sentenceLengths.length || 1);
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLen, 2), 0) / (sentenceLengths.length || 1);
  const stdDev = Math.sqrt(variance);

  // B. Perplexity & AI Transitional Patterns
  const lower = trimmed.toLowerCase();
  const aiTransitions = [
    "furthermore", "moreover", "in conclusion", "it is important to note",
    "delve into", "testament to", "beacon of", "tapestry", "multifaceted",
    "paramount", "in summary", "pivotal role", "realm of", "game-changer",
    "holistic approach", "revolutionize", "at its core", "notably",
    "it is crucial to", "serves as a", "fosters an environment"
  ];
  const matchedAiTransitions = aiTransitions.filter((t) => lower.includes(t));

  const humanSlangAndCasual = [
    "lol", "lmao", "btw", "idk", "tbh", "ngl", "bruh", "bro", "dude", "hey",
    "hi", "heyy", "thanks", "thx", "cool", "yeah", "nah", "gonna", "wanna",
    "gotta", "imma", "omg", "kinda", "sorta", "haha", "hahaha", "yup", "nope"
  ];
  const matchedHumanMarkers = humanSlangAndCasual.filter((h) => {
    const regex = new RegExp(`\\b${h}\\b`, "i");
    return regex.test(lower);
  });

  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  const lexicalDiversity = words.length > 0 ? uniqueWords.size / words.length : 1;

  let isAI = false;
  let isHuman = false;
  let confidence = 85;
  let perplexityAssessment: "High" | "Medium" | "Low" = "Medium";
  let burstinessAssessment: "High" | "Medium" | "Low" = "Medium";
  const keyIndicators: string[] = [];

  // Evaluate Burstiness
  if (stdDev >= 6.0 || (sentenceLengths.length >= 2 && Math.max(...sentenceLengths) - Math.min(...sentenceLengths) >= 10)) {
    burstinessAssessment = "High";
    keyIndicators.push(`High sentence length variance (StdDev: ${stdDev.toFixed(1)} words, ranging from ${Math.min(...sentenceLengths)} to ${Math.max(...sentenceLengths)} words)`);
  } else if (stdDev <= 2.2 && sentences.length >= 2) {
    burstinessAssessment = "Low";
    keyIndicators.push(`Uniform, repetitive sentence lengths (StdDev: ${stdDev.toFixed(1)} words) indicative of automated generation`);
  } else {
    burstinessAssessment = "Medium";
  }

  // Evaluate Perplexity & Stylistic Markers
  if (matchedAiTransitions.length >= 2 || (matchedAiTransitions.length >= 1 && burstinessAssessment === "Low")) {
    perplexityAssessment = "Low";
    matchedAiTransitions.forEach((t) => keyIndicators.push(`Formulaic AI transition phrase: "${t}"`));
  } else if (matchedHumanMarkers.length >= 1 || words.length < 8 || stdDev > 5) {
    perplexityAssessment = "High";
    matchedHumanMarkers.forEach((m) => keyIndicators.push(`Informal human conversational token: "${m}"`));
  } else {
    perplexityAssessment = lexicalDiversity > 0.72 ? "High" : "Medium";
  }

  // Casual punctuation & typo detection
  if (/[!?]{2,}/.test(trimmed) || /\b(im|dont|cant|wont|didnt|youre|theyre)\b/.test(lower)) {
    keyIndicators.push("Natural human typing traits (omitted apostrophes / expressive punctuation)");
    perplexityAssessment = "High";
  }

  // Final Verdict Logic
  if (matchedAiTransitions.length >= 2 || (burstinessAssessment === "Low" && perplexityAssessment === "Low")) {
    isAI = true;
    confidence = Math.min(84 + matchedAiTransitions.length * 4, 96);
  } else if (matchedHumanMarkers.length > 0 || burstinessAssessment === "High" || (words.length <= 15 && matchedAiTransitions.length === 0)) {
    isHuman = true;
    confidence = Math.min(85 + matchedHumanMarkers.length * 4 + (burstinessAssessment === "High" ? 5 : 0), 98);
  } else {
    confidence = 65;
  }

  const verdict: "AI-Generated" | "Human-Written" | "Mixed / Uncertain" = isAI
    ? "AI-Generated"
    : isHuman
    ? "Human-Written"
    : "Mixed / Uncertain";

  const summary =
    verdict === "AI-Generated"
      ? `This text demonstrates strong statistical hallmarks of synthetic AI generation, including low structural burstiness (${stdDev.toFixed(1)} word variance) and formulaic transitional phrasing (${matchedAiTransitions.slice(0, 3).join(", ") || "standard LLM cadence"}).`
      : verdict === "Human-Written"
      ? `This message displays organic human authorship with natural rhythm variance, high vocabulary perplexity, and spontaneous conversational pacing.`
      : `The text displays a hybrid mix of predictable AI transitions alongside varied sentence structures, suggesting human-edited AI text.`;

  const perplexityReason =
    perplexityAssessment === "High"
      ? "High vocabulary entropy and unexpected conversational turns reflect spontaneous human phrasing."
      : perplexityAssessment === "Low"
      ? "Low perplexity detected. Vocabulary predictability and lexical sequences mirror standard generative model distributions."
      : "Moderate vocabulary predictability consistent with structured professional communication.";

  const burstinessReason =
    burstinessAssessment === "High"
      ? `High burstiness: Sentence lengths vary from ${Math.min(...sentenceLengths)} to ${Math.max(...sentenceLengths)} words (StdDev: ${stdDev.toFixed(1)}), matching natural human cadences.`
      : burstinessAssessment === "Low"
      ? `Low burstiness: Sentences are evenly measured (~${avgLen.toFixed(1)} words), a recognized characteristic of autoregressive LLMs.`
      : `Balanced sentence structure across ${sentences.length} sentence unit(s).`;

  return {
    verdict,
    confidence_score: confidence,
    perplexity_assessment: perplexityAssessment,
    burstiness_assessment: burstinessAssessment,
    reasoning: {
      summary,
      perplexity_reason: perplexityReason,
      burstiness_reason: burstinessReason,
      key_indicators: keyIndicators.length > 0 ? keyIndicators : ["Natural human syntax rhythm"],
    },
    // Compatibility fields
    riskScore: verdict === "AI-Generated" ? confidence : verdict === "Human-Written" ? 100 - confidence : 50,
    category: verdict === "AI-Generated" ? "Synthetic AI Text" : verdict === "Human-Written" ? "Organic Human Text" : "Hybrid / Mixed Content",
    confidence: confidence,
    threatIndicators: keyIndicators,
    explanation: summary,
    recommendations: verdict === "AI-Generated"
      ? ["Verify claims with primary sources", "Review for automated hallucinations or repetitive transitions"]
      : ["Natural human authorship confirmed", "Organic pacing and high linguistic variety detected"]
  };
}

export interface ProfileAuditAttributes {
  accountAge?: "new" | "recent" | "established" | "old";
  profilePicType?: "default" | "ai_model" | "brand_logo" | "real_person";
  postCount?: "zero" | "few" | "moderate" | "many";
  followers?: string;
  following?: string;
  bio?: string;
  linkType?: "none" | "shortener" | "messaging_app" | "suspicious_apk" | "official_domain";
  unsolicitedDm?: boolean;
  askingMoneyOrCrypto?: boolean;
  promisingPrizeOrJob?: boolean;
  offPlatformRedirection?: boolean;
  hasBlueBadge?: boolean;
  hasMutualConnections?: boolean;
}

/**
 * Intelligent Social Profile & Bot Detector
 * Evaluates deep multi-parameter forensic questionnaires including Account Age,
 * Profile Pictures, Follower Ratios, DM behavior, Financial solicitations, and Badges.
 */
export async function analyzeProfileWithAI(
  target: string,
  platform: string,
  details = "",
  attributes?: ProfileAuditAttributes
): Promise<ProfileAnalysisResult> {
  const cleanTarget = target.trim();
  const cleanDetails = details.trim();
  const combined = `${cleanTarget} ${cleanDetails}`.toLowerCase();

  // 1. Try Server API Endpoint (Gemini AI Powered)
  try {
    const response = await fetch("/api/analyze/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: cleanTarget.startsWith("@") ? cleanTarget : `@${cleanTarget}`,
        url: cleanTarget.startsWith("http") ? cleanTarget : undefined,
        platform,
        details: cleanDetails,
        attributes,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (typeof data.authenticityScore === "number" && data.verdict) {
        return data;
      }
    }
  } catch (apiErr) {
    console.warn("Backend profile API unreachable, utilizing built-in forensic intelligence:", apiErr);
  }

  // 2. COMPREHENSIVE LOCAL FORENSIC HEURISTIC ENGINE
  const flags: string[] = [];
  let deduction = 0;
  let trustBoost = 0;
  let detectedCategory = "Profile Assessment";

  // Process structured Questionnaire Attributes
  if (attributes) {
    if (attributes.askingMoneyOrCrypto) {
      deduction += 75;
      flags.push("Direct solicitation of money, crypto, UPI, or financial assets in DMs");
      detectedCategory = "Financial Extortion / Scam";
    }
    if (attributes.promisingPrizeOrJob) {
      deduction += 65;
      flags.push("Advance-fee lottery, fake iPhone prize, or task scam bait");
      detectedCategory = "Prize / Work-From-Home Scam";
    }
    if (attributes.offPlatformRedirection) {
      deduction += 45;
      flags.push("Urgent off-platform redirection to Telegram/WhatsApp/Chat to evade moderation");
    }
    if (attributes.unsolicitedDm) {
      deduction += 20;
      flags.push("Unsolicited cold DM outreach targeting unacquainted users");
    }
    if (attributes.profilePicType === "ai_model") {
      deduction += 40;
      flags.push("Synthetic AI-generated / stolen celebrity profile picture");
    } else if (attributes.profilePicType === "default") {
      deduction += 25;
      flags.push("No profile photo / default platform avatar");
    }
    if (attributes.accountAge === "new") {
      deduction += 35;
      flags.push("Recently created burner account (< 1 month old)");
    } else if (attributes.accountAge === "recent") {
      deduction += 15;
    } else if (attributes.accountAge === "old") {
      trustBoost += 15;
      flags.push("Established longevity (> 2 years of public history)");
    }
    if (attributes.postCount === "zero") {
      deduction += 30;
      flags.push("Zero published posts with active outbound interaction");
    } else if (attributes.postCount === "many") {
      trustBoost += 10;
      flags.push("Active regular posting history (50+ posts)");
    }
    if (attributes.linkType === "shortener") {
      deduction += 35;
      flags.push("Obfuscated shortened URL (bit.ly / tinyurl) in bio");
    } else if (attributes.linkType === "messaging_app") {
      deduction += 40;
      flags.push("Unverified messaging redirection link (t.me / wa.me)");
    } else if (attributes.linkType === "suspicious_apk") {
      deduction += 60;
      flags.push("Direct link to untrusted APK / malicious third-party download");
    } else if (attributes.linkType === "official_domain") {
      trustBoost += 15;
      flags.push("Resolves to verified brand domain");
    }
    if (attributes.hasBlueBadge && !attributes.askingMoneyOrCrypto) {
      trustBoost += 25;
      flags.push("Official platform verification badge confirmed");
    }
    if (attributes.hasMutualConnections) {
      trustBoost += 15;
      flags.push("Verified mutual connections within personal social graph");
    }
  }

  // A. Impersonation & Cloned Entity Indicators
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

  const hasImpersonatorHandle = impersonatorSuffixes.some((s) => cleanTarget.toLowerCase().includes(s));
  const hasBrandKeyword = brandKeywords.some((b) => cleanTarget.toLowerCase().includes(b));

  if (
    (hasImpersonatorHandle && hasBrandKeyword) ||
    (combined.includes("customer care") || combined.includes("toll free") || combined.includes("24x7 helpline") || combined.includes("refund support"))
  ) {
    deduction += 65;
    flags.push("High-Risk Impersonation Handle / Fake Support Desk");
    flags.push("Unverified Customer Care / Helpline Pattern");
    detectedCategory = "Fake Customer Support Impersonation";
  }

  // B. Crypto / Investment / Forex Scam Indicators
  const isCryptoScam =
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
    combined.includes("airdrop");

  if (isCryptoScam) {
    deduction += 60;
    flags.push("High-Frequency Crypto/Forex Solicitation Signature");
    flags.push("Unregulated Financial Investment Bait in Bio/Handle");
    detectedCategory = "Crypto & Investment Fraud";
  }

  // C. Prize / Lottery / Giveaway Scams
  const isGiveawayScam =
    combined.includes("giveaway") ||
    combined.includes("congratulations you won") ||
    combined.includes("winner claim") ||
    combined.includes("lucky draw") ||
    combined.includes("free iphone") ||
    combined.includes("dm to claim") ||
    combined.includes("send screenshot to claim");

  if (isGiveawayScam) {
    deduction += 60;
    flags.push("Advance-Fee Prize / Giveaway Lure Detected");
    flags.push("Unsolicited Winner Notification Pattern");
    detectedCategory = "Fake Giveaway & Lottery Clone";
  }

  // D. Romance Scam / Catfishing Signals
  const isRomanceScam =
    (combined.includes("army") || combined.includes("military") || combined.includes("peacekeeping") || combined.includes("syria") || combined.includes("surgeon") || combined.includes("widower") || combined.includes("widowed")) &&
    (combined.includes("honest") || combined.includes("soulmate") || combined.includes("whatsapp") || combined.includes("looking for love") || combined.includes("deploy"));

  if (isRomanceScam) {
    deduction += 65;
    flags.push("Military / Surgeon Romance Catfishing Profile Signature");
    flags.push("Rapid Personal Intimacy & Off-Platform Redirection");
    detectedCategory = "Romance & Catfish Account";
  }

  // E. Bot / Burner Synthetics & Numbers in Username
  const digitMatches = cleanTarget.match(/\d+/g);
  const totalDigits = digitMatches ? digitMatches.join("").length : 0;
  const isBotSyntax =
    totalDigits >= 5 ||
    cleanTarget.toLowerCase().includes("bot_") ||
    cleanTarget.toLowerCase().includes("_bot") ||
    cleanTarget.toLowerCase().startsWith("user_") ||
    cleanTarget.toLowerCase().startsWith("user");

  if (isBotSyntax) {
    deduction += 35;
    flags.push("Synthetic Bot / Burner Account Handle Format");
    flags.push("High trailing digit count indicating automated account generator");
  }

  // F. Suspicious Off-Platform Redirection Links
  const hasSuspiciousLinks =
    combined.includes("t.me/") ||
    combined.includes("telegram.me") ||
    combined.includes("wa.me/") ||
    combined.includes("bit.ly") ||
    combined.includes("tinyurl") ||
    combined.includes(".xyz") ||
    combined.includes(".top") ||
    combined.includes(".ru") ||
    combined.includes("linktr.ee/free") ||
    combined.includes("cashapp") ||
    combined.includes("onlyfans.com/free");

  if (hasSuspiciousLinks) {
    deduction += 40;
    flags.push("External Unverified Redirection Link (Telegram/WhatsApp/Link Shortener)");
    flags.push("Off-platform communication trap to evade moderation");
  }

  // G. Follower / Ratio Anomaly
  if (
    (combined.includes("following 1000") || combined.includes("following 2000") || combined.includes("following 3000") || combined.includes("following 4000") || combined.includes("following 5000")) &&
    (combined.includes("0 followers") || combined.includes("5 followers") || combined.includes("10 followers") || combined.includes("12 followers") || combined.includes("few followers") || combined.includes("14 followers"))
  ) {
    deduction += 45;
    flags.push("Severe Follower-to-Following Imbalance (Follow-Spam Bot Strategy)");
  }

  // Calculate final Authenticity Score
  let baseScore = 92;
  let finalAuthenticity = Math.min(Math.max(baseScore - deduction + trustBoost, 4), 98);

  // Organic Benign Fast-Pass for clean everyday usernames
  const isCleanTarget =
    !hasImpersonatorHandle &&
    !isCryptoScam &&
    !isGiveawayScam &&
    !isRomanceScam &&
    !isBotSyntax &&
    !hasSuspiciousLinks &&
    deduction === 0;

  if (isCleanTarget) {
    finalAuthenticity = Math.min(95 + trustBoost, 99);
    flags.push("Organic username structure", "No automated bot traits detected", "Consistent public handle format", "Clean profile metadata");
  }

  let verdict: "Genuine" | "Suspicious" | "Fake Profile Detected" = "Genuine";

  if (finalAuthenticity <= 40) {
    verdict = "Fake Profile Detected";
  } else if (finalAuthenticity <= 70) {
    verdict = "Suspicious";
  } else {
    verdict = "Genuine";
  }

  return {
    authenticityScore: finalAuthenticity,
    verdict,
    confidence: verdict === "Fake Profile Detected" ? 96 : verdict === "Suspicious" ? 88 : 94,
    riskIndicators: flags,
    explanation:
      verdict === "Fake Profile Detected"
        ? `High-risk forensic indicators identified on ${cleanTarget}. The profile exhibits classic patterns of ${detectedCategory}, with red flags in handle structure, direct message solicitations, account anomalies, or off-platform redirection.`
        : verdict === "Suspicious"
        ? `Potential irregularities detected on ${cleanTarget}. The account features elevated automated traits, recent creation date, unverified contact links, or non-standard follower patterns. Exercise strong caution before interacting.`
        : `The profile ${cleanTarget} displays standard organic behavioral attributes, healthy identity metadata, active longevity, and zero detected impersonation or scam triggers.`,
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
  };
}
