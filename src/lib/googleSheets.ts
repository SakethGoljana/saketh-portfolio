import type { Lead } from "./leads";

export interface SheetSyncResult {
  success: boolean;
  configured: boolean;
  syncedCount?: number;
  message: string;
}

export function getGoogleSheetWebhookUrl(): string | null {
  return process.env.GOOGLE_SHEET_WEBHOOK_URL || null;
}

export function getGoogleSheetSecret(): string {
  return process.env.GOOGLE_SHEETS_SECRET || process.env.ADMIN_SECRET || "saketh_portfolio_sync_2026";
}

export function isGoogleSheetConfigured(): boolean {
  const url = getGoogleSheetWebhookUrl();
  return Boolean(url && url.startsWith("http"));
}

/**
 * Neutralize Spreadsheet / Formula Injection (CWE-1236).
 * Prepend single quote if string begins with formula triggers: =, +, -, @, \t, \r
 */
export function sanitizeSpreadsheetCell(val: any): any {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (/^[=+\-@\t\r]/.test(trimmed)) {
      return `'${val}`;
    }
    return val;
  }
  return val;
}

/**
 * Format a lead object into clean columns for spreadsheet rows with formula injection neutralization
 */
function formatLeadForSheet(lead: Lead) {
  const dealVal = Number(lead.dealValue) || 0;
  const paid = Number(lead.amountPaid) || 0;
  const pending = Math.max(0, dealVal - paid);

  return {
    id: sanitizeSpreadsheetCell(lead.id),
    createdAt: sanitizeSpreadsheetCell(lead.createdAt),
    type: sanitizeSpreadsheetCell(lead.type === "call_booking" ? "Call Booking" : "Project Brief"),
    status: sanitizeSpreadsheetCell(lead.status),
    name: sanitizeSpreadsheetCell(lead.name),
    contact: sanitizeSpreadsheetCell(lead.contact),
    service: sanitizeSpreadsheetCell(lead.service || "Call Booking"),
    schedule: sanitizeSpreadsheetCell(lead.day && lead.slot ? `${lead.day} at ${lead.slot}` : "-"),
    budgetOrPreference: sanitizeSpreadsheetCell(lead.budget || "Discuss on free call"),
    dealValue: dealVal,
    amountPaid: paid,
    pendingBalance: pending,
    paymentStatus: sanitizeSpreadsheetCell(lead.paymentStatus || "unpaid"),
    notes: sanitizeSpreadsheetCell(lead.notes || "-"),
    internalNotes: sanitizeSpreadsheetCell(lead.internalNotes || ""),
  };
}

/**
 * Push a single new lead to Google Sheets asynchronously.
 * Never throws — guarantees client booking is never interrupted.
 */
export async function syncLeadToGoogleSheet(lead: Lead): Promise<SheetSyncResult> {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    return {
      success: false,
      configured: false,
      message: "Google Sheets Webhook URL not configured in .env.local",
    };
  }

  try {
    const payload = {
      action: "new_lead",
      authSecret: getGoogleSheetSecret(),
      lead: formatLeadForSheet(lead),
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000), // 6s timeout protection
    });

    if (res.ok) {
      return {
        success: true,
        configured: true,
        syncedCount: 1,
        message: "Successfully synced lead to Google Sheets",
      };
    } else {
      return {
        success: false,
        configured: true,
        message: `Google Sheets webhook returned HTTP ${res.status}`,
      };
    }
  } catch (err: any) {
    console.warn("Failed to sync lead to Google Sheets (non-blocking):", err?.message || err);
    return {
      success: false,
      configured: true,
      message: err?.name === "TimeoutError" ? "Webhook timed out" : "Network error during sync",
    };
  }
}

/**
 * Bulk sync all leads to Google Sheets (called from CRM)
 */
export async function syncAllLeadsToGoogleSheet(leads: Lead[]): Promise<SheetSyncResult> {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    return {
      success: false,
      configured: false,
      message: "Google Sheets Webhook URL not configured in .env.local",
    };
  }

  try {
    const payload = {
      action: "sync_all",
      authSecret: getGoogleSheetSecret(),
      leads: leads.map(formatLeadForSheet),
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10s timeout for bulk sync
    });

    if (res.ok) {
      return {
        success: true,
        configured: true,
        syncedCount: leads.length,
        message: `Successfully synced ${leads.length} leads to Google Sheets`,
      };
    } else {
      return {
        success: false,
        configured: true,
        message: `Google Sheets webhook returned HTTP ${res.status}`,
      };
    }
  } catch (err: any) {
    console.error("Bulk sync to Google Sheets error:", err);
    return {
      success: false,
      configured: true,
      message: err?.name === "TimeoutError" ? "Bulk sync timed out" : "Network error during bulk sync",
    };
  }
}
