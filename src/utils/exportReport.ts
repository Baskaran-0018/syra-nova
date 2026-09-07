// Utility to trigger client-side file downloads with timestamped audit formatting

export interface DownloadOptions {
  filename: string;
  title: string;
  data?: any;
  text?: string;
  format?: "txt" | "json" | "md" | "csv";
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export function downloadReport({
  filename,
  title,
  data,
  text,
  format = "txt",
  metadata = {},
}: DownloadOptions): void {
  const timestamp = new Date().toISOString();
  const readableDate = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  let fileContent = "";
  let mimeType = "text/plain;charset=utf-8";
  let extension = format;

  if (format === "json") {
    mimeType = "application/json;charset=utf-8";
    const payload = {
      system: "SYRA NOVA - Autonomous Quantum AI Cyber Defense System",
      reportTitle: title,
      generatedAt: timestamp,
      humanTimestamp: readableDate,
      metadata: {
        engine: "Gemini 3.7 Flash Neural Security Matrix",
        encryption: "AES-256 / Zero-Knowledge Protocol",
        ...metadata,
      },
      content: data || text,
    };
    fileContent = JSON.stringify(payload, null, 2);
  } else if (format === "md" || format === "txt") {
    mimeType = "text/plain;charset=utf-8";
    const divider = "=".repeat(78);
    const subDivider = "-".repeat(78);

    fileContent = [
      divider,
      `  SYRA NOVA AUTONOMOUS CYBER DEFENSE REPORT`,
      `  Title: ${title}`,
      `  Date: ${readableDate}`,
      `  Security Classification: CONFIDENTIAL / AUDIT READY`,
      `  AI Engine: Gemini 3.7 Flash Security Core (v2.4)`,
      divider,
      "",
      ...(Object.keys(metadata).length > 0
        ? [
            "METADATA & PARAMETERS:",
            ...Object.entries(metadata).map(([k, v]) => ` • ${k}: ${v}`),
            subDivider,
            "",
          ]
        : []),
      "REPORT SUMMARY & FORENSIC FINDINGS:",
      text ? text : (typeof data === "string" ? data : JSON.stringify(data, null, 2)),
      "",
      divider,
      "  END OF REPORT - Certified by SYRA NOVA Zero-Trust Protocol",
      "  National Cyber Emergency Helpline: 1930 | https://cybercrime.gov.in",
      divider,
    ].join("\n");
  } else if (format === "csv") {
    mimeType = "text/csv;charset=utf-8";
    fileContent = text || "";
  }

  // Create blob and trigger download
  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.includes(".") ? filename : `${filename}.${extension}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// Generate Emergency Cyber Complaint Dossier Format (Indian National Cyber Crime Portal / 1930 format)
export function generateComplaintDossier(caseData: {
  victimName: string;
  email: string;
  phone: string;
  incidentType: string;
  financialLoss?: string;
  bankName?: string;
  transactionId?: string;
  suspectInfo?: string;
  narrative: string;
  indicators: string[];
}): string {
  return [
    `FORMAL CYBERCRIME INCIDENT COMPLAINT DOSSIER`,
    `Generated via SYRA NOVA Autonomous Incident Response`,
    `Reference Standard: National Cyber Crime Reporting Portal (1930)`,
    ``,
    `1. COMPLAINANT PARTICULARS:`,
    `   - Name: ${caseData.victimName}`,
    `   - Registered Email: ${caseData.email}`,
    `   - Phone Number: ${caseData.phone}`,
    `   - Filing Timestamp: ${new Date().toLocaleString()}`,
    ``,
    `2. INCIDENT OVERVIEW:`,
    `   - Category: ${caseData.incidentType}`,
    `   - Estimated Financial Impact: ${caseData.financialLoss || "Nil / Data Only"}`,
    `   - Target Bank / Platform: ${caseData.bankName || "N/A"}`,
    `   - Transaction/Reference ID: ${caseData.transactionId || "N/A"}`,
    ``,
    `3. SUSPECT INFORMATION & DIGITAL IDENTIFIERS:`,
    `   - Known Identifiers: ${caseData.suspectInfo || "Phishing URLs / Stolen Accounts"}`,
    `   - Extracted Forensic Indicators:`,
    ...caseData.indicators.map((ind) => `     * ${ind}`),
    ``,
    `4. CHRONOLOGICAL NARRATIVE:`,
    `   ${caseData.narrative}`,
    ``,
    `5. RECOMMENDED IMMEDIATE MITIGATION:`,
    `   1. Dial National Cyber Helpline: 1930 immediately within the golden hour.`,
    `   2. Freeze associated UPI IDs, NetBanking, and credit/debit cards.`,
    `   3. Submit this dossier at https://cybercrime.gov.in along with bank statement proofs.`,
    `   4. Enable hardware-bound 2-Factor Authentication on all recovery channels.`,
  ].join("\n");
}
