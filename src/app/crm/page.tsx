"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Mail,
  CheckCircle2,
  Lock,
  Trash2,
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Save,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  KeyRound,
  FileSpreadsheet,
} from "lucide-react";

type Stage = "New" | "Contacted" | "Proposal" | "Won";

interface LeadItem {
  id: string;
  name: string;
  contact: string;
  need: string;
  source: string;
  budget: string;
  stage: Stage;
  when: string;
  note: string;
  day?: string;
  slot?: string;

  // Financial & Deal terms
  currency: "USD" | "INR";
  dealValue: number;
  amountPaid: number;
  paymentStatus: "unpaid" | "deposit_paid" | "fully_paid";
  paymentRef: string;
  internalNotes: string;
  isRealLead: boolean;
}

const STAGE_COLORS: Record<Stage, { bg: string; text: string }> = {
  New: { bg: "#D2FF3F", text: "#0B0B0F" },
  Contacted: { bg: "#A78BFA", text: "#0B0B0F" },
  Proposal: { bg: "#F4B860", text: "#0B0B0F" },
  Won: { bg: "#7CF4D4", text: "#0B0B0F" },
};

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  } catch {
    return "Recent";
  }
}

const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * Saketh Portfolio - Secure Google Sheets Webhook Sync Script
 * 1. Open your Google Sheet -> Click Extensions > Apps Script
 * 2. Paste this code -> Click Deploy > New deployment > Web app
 * 3. Set Execute as: Me, Access: Anyone -> Copy Web app URL
 * 4. Paste URL into .env.local as GOOGLE_SHEET_WEBHOOK_URL
 */
var SCRIPT_SECRET = PropertiesService.getScriptProperties().getProperty("SCRIPT_SECRET");

function escapeFormula(val) {
  if (typeof val === "string") {
    var trimmed = val.trim();
    if (/^[=+\\-@\\t\\r]/.test(trimmed)) {
      return "'" + val;
    }
  }
  return val;
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);

    // Verify secret token to prevent unauthorized tampering
    if (SCRIPT_SECRET && payload.authSecret !== SCRIPT_SECRET) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", error: "Unauthorized access token" })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID", "Date & Time", "Type", "Status", "Name", "Contact", 
        "Service", "Schedule", "Budget / Model", "Deal Value ($)", 
        "Amount Paid ($)", "Pending Balance ($)", "Payment Status", 
        "Client Notes", "Internal Notes"
      ]);
      sheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#121218").setFontColor("#D2FF3F");
      sheet.setFrozenRows(1);
    }

    if (payload.action === "sync_all") {
      sheet.clearContents();
      sheet.appendRow([
        "ID", "Date & Time", "Type", "Status", "Name", "Contact", 
        "Service", "Schedule", "Budget / Model", "Deal Value ($)", 
        "Amount Paid ($)", "Pending Balance ($)", "Payment Status", 
        "Client Notes", "Internal Notes"
      ]);
      sheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#121218").setFontColor("#D2FF3F");
      sheet.setFrozenRows(1);
      
      payload.leads.forEach(function(l) {
        sheet.appendRow([
          escapeFormula(l.id), escapeFormula(l.createdAt), escapeFormula(l.type), escapeFormula(l.status), escapeFormula(l.name), escapeFormula(l.contact),
          escapeFormula(l.service), escapeFormula(l.schedule), escapeFormula(l.budgetOrPreference), l.dealValue,
          l.amountPaid, l.pendingBalance, escapeFormula(l.paymentStatus),
          escapeFormula(l.notes), escapeFormula(l.internalNotes)
        ]);
      });
      return ContentService.createTextOutput(JSON.stringify({ status: "success", count: payload.leads.length })).setMimeType(ContentService.MimeType.JSON);
    }

    // Single lead sync (updates existing or appends new)
    var l = payload.lead;
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === l.id) {
        rowIndex = i + 1;
        break;
      }
    }

    var rowValues = [
      escapeFormula(l.id), escapeFormula(l.createdAt), escapeFormula(l.type), escapeFormula(l.status), escapeFormula(l.name), escapeFormula(l.contact),
      escapeFormula(l.service), escapeFormula(l.schedule), escapeFormula(l.budgetOrPreference), l.dealValue,
      l.amountPaid, l.pendingBalance, escapeFormula(l.paymentStatus),
      escapeFormula(l.notes), escapeFormula(l.internalNotes)
    ];

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, 15).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", id: l.id })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function CrmStudio() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginMethod, setLoginMethod] = useState<"pin" | "password">("pin");
  const [pinInput, setPinInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Leads & Deal Management state
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Editable deal values for the selected lead
  const [editDealValue, setEditDealValue] = useState<number>(0);
  const [editAmountPaid, setEditAmountPaid] = useState<number>(0);
  const [editCurrency, setEditCurrency] = useState<"USD" | "INR">("USD");
  const [editPaymentStatus, setEditPaymentStatus] = useState<"unpaid" | "deposit_paid" | "fully_paid">("unpaid");
  const [editInternalNotes, setEditInternalNotes] = useState<string>("");
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Google Sheets integration state
  const [sheetsConfigured, setSheetsConfigured] = useState(false);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // 1. Check Authentication on Mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // 2. Check Sheets Status
  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/sheets")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSheetsConfigured(Boolean(data.configured));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // 3. Fetch Leads once authenticated
  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.leads)) {
        const formatted: LeadItem[] = json.leads.map((l: any) => {
          const isBooking = l.type === "call_booking";
          const stageMap: Record<string, Stage> = {
            new: "New",
            contacted: "Contacted",
            proposal: "Proposal",
            booked: "Contacted",
            completed: "Won",
          };
          return {
            id: l.id,
            name: l.name,
            contact: l.contact,
            need: isBooking ? "Booked Call" : l.service || "Website",
            source: isBooking ? "Book a call" : "Brief form",
            budget: l.budget || "Discuss on free call",
            stage: stageMap[l.status] || "New",
            when: formatTimeAgo(l.createdAt),
            note: isBooking
              ? `Call booked for ${l.day} at ${l.slot} IST. Client: ${l.name} (${l.contact}).`
              : l.notes || "No extra notes provided.",
            day: l.day,
            slot: l.slot,
            currency: l.currency || "USD",
            dealValue: Number(l.dealValue) || 0,
            amountPaid: Number(l.amountPaid) || 0,
            paymentStatus: l.paymentStatus || "unpaid",
            paymentRef: l.paymentRef || "",
            internalNotes: l.internalNotes || "",
            isRealLead: true,
          };
        });

        setLeads(formatted);
        if (formatted.length > 0 && !selectedLeadId) {
          setSelectedLeadId(formatted[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load leads from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    }
  }, [isAuthenticated]);

  // Sync edit form with selected lead
  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  useEffect(() => {
    if (selectedLead) {
      setEditDealValue(selectedLead.dealValue || 0);
      setEditAmountPaid(selectedLead.amountPaid || 0);
      setEditCurrency(selectedLead.currency || "USD");
      setEditPaymentStatus(selectedLead.paymentStatus || "unpaid");
      setEditInternalNotes(selectedLead.internalNotes || "");
    }
  }, [selectedLeadId]);

  // Handle Login via either PIN or Password
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    try {
      const payload = loginMethod === "pin" ? { pin: pinInput } : { password: passwordInput };

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPinInput("");
        setPasswordInput("");
      } else {
        setAuthError(data.error || "Access Denied");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Auto-submit PIN when 6 digits are reached
  const handlePinChange = (val: string) => {
    if (isAuthenticating) return;
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setPinInput(clean);
    if (clean.length === 6) {
      setTimeout(() => {
        setIsAuthenticating(true);
        fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: clean }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setIsAuthenticated(true);
              setPinInput("");
            } else {
              setAuthError(data.error || "Invalid 6-digit PIN. Try again.");
            }
          })
          .catch(() => setAuthError("Network error."))
          .finally(() => setIsAuthenticating(false));
      }, 100);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setLeads([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Update Lead Status
  const updateStage = async (newStage: Stage) => {
    if (!selectedLeadId) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLeadId ? { ...l, stage: newStage } : l))
    );

    try {
      const statusMap: Record<Stage, string> = {
        New: "new",
        Contacted: "contacted",
        Proposal: "proposal",
        Won: "completed",
      };
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedLeadId, status: statusMap[newStage] }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Save Deal & Financials
  const handleSaveDealDetails = async () => {
    if (!selectedLeadId) return;
    setIsSaving(true);

    try {
      const payload = {
        id: selectedLeadId,
        currency: editCurrency,
        dealValue: Number(editDealValue) || 0,
        amountPaid: Number(editAmountPaid) || 0,
        paymentStatus: editPaymentStatus,
        internalNotes: editInternalNotes,
      };

      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLeadId
              ? {
                  ...l,
                  currency: editCurrency,
                  dealValue: Number(editDealValue) || 0,
                  amountPaid: Number(editAmountPaid) || 0,
                  paymentStatus: editPaymentStatus,
                  internalNotes: editInternalNotes,
                }
              : l
          )
        );
        setSaveSuccessNotice(true);
        setTimeout(() => setSaveSuccessNotice(false), 2000);
      }
    } catch (err) {
      console.error("Failed to save deal terms:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        setDeleteConfirmId(null);
        if (selectedLeadId === id) {
          const remaining = leads.filter((l) => l.id !== id);
          setSelectedLeadId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  // Trigger Bulk Google Sheets Sync
  const handleBulkSyncSheets = async () => {
    setIsSyncingSheets(true);
    setSyncFeedback(null);
    try {
      const res = await fetch("/api/sheets", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback(`✓ Successfully synced ${data.syncedCount || leads.length} leads to Google Sheets!`);
        setSheetsConfigured(true);
      } else {
        setSyncFeedback(`⚠️ ${data.error || "Failed to sync. Check webhook URL in .env.local"}`);
      }
    } catch {
      setSyncFeedback("⚠️ Network error while connecting to Google Sheets.");
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Filtered Leads
  const visibleLeads = useMemo(() => {
    if (selectedFilter === "All") return leads;
    return leads.filter((l) => l.stage === selectedFilter);
  }, [leads, selectedFilter]);

  // Aggregate Metrics & Financials
  const totalPipelineValue = useMemo(() => {
    return leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  }, [leads]);

  const totalCollected = useMemo(() => {
    return leads.reduce((sum, l) => sum + (l.amountPaid || 0), 0);
  }, [leads]);

  const totalPending = useMemo(() => {
    return Math.max(0, totalPipelineValue - totalCollected);
  }, [totalPipelineValue, totalCollected]);

  // Clean WhatsApp URL
  const whatsappUrl = useMemo(() => {
    if (!selectedLead) return "https://wa.me/";
    const cleanNumber = selectedLead.contact.replace(/[^\d+]/g, "");
    const message = encodeURIComponent(
      `Hi ${selectedLead.name.split("·")[0].trim()}, thanks for reaching out through my portfolio regarding your ${selectedLead.need} project!`
    );
    return cleanNumber ? `https://wa.me/${cleanNumber}?text=${message}` : `https://wa.me/?text=${message}`;
  }, [selectedLead]);

  // ========================================================
  // RENDER: LOCKSCREEN (WHEN UNAUTHENTICATED)
  // ========================================================
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#07070A] text-[#F4F4F0] flex flex-col justify-between p-6 sm:p-12 font-mono selection:bg-[var(--accent)] selection:text-[#0B0B0F]">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xs text-[#A1A1AA] hover:text-[#F4F4F0] flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-[#FF5F56]">
            <span className="w-2 h-2 rounded-full bg-[#FF5F56] animate-pulse" />
            <span>CRM LOCKED</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto my-auto p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#101017] border border-[#22222E] shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#161622] border border-[#282838] flex items-center justify-center text-[var(--accent)]">
              <Lock size={18} />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#71717A] bg-[#14141E] px-2.5 py-1 rounded-full border border-[#22222E]">
              PRIVATE CLIENT CRM
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#F4F4F0] mb-1">
            Saketh CRM
          </h1>
          <p className="text-xs text-[#A1A1AA] mb-5 font-sans leading-relaxed">
            Restricted operations. Authenticate via Google Authenticator 6-digit PIN or Master Secret Key.
          </p>

          {/* Login Method Toggle */}
          <div className="flex bg-[#09090E] p-1 rounded-xl border border-[#22222E] mb-5">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("pin");
                setAuthError("");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === "pin"
                  ? "bg-[var(--accent)] text-[#0B0B0F] font-bold"
                  : "text-[#A1A1AA] hover:text-[#F4F4F0]"
              }`}
            >
              <Smartphone size={13} />
              <span>Authenticator PIN</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("password");
                setAuthError("");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === "password"
                  ? "bg-[var(--accent)] text-[#0B0B0F] font-bold"
                  : "text-[#A1A1AA] hover:text-[#F4F4F0]"
              }`}
            >
              <KeyRound size={13} />
              <span>Master Key</span>
            </button>
          </div>

          {/* PIN FORM */}
          {loginMethod === "pin" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-2">
                  Enter 6-Digit Google Authenticator Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#09090D] border border-[#262634] focus:border-[var(--accent)] outline-none text-center font-mono text-2xl font-bold tracking-[0.4em] text-[var(--accent)] placeholder:text-[#3A3A4A] placeholder:tracking-[0.3em] transition-colors"
                />
                <div className="text-[10px] text-[#71717A] mt-2 flex items-center justify-between">
                  <span>Google Authenticator app</span>
                  <span>Auto-unlocks on 6th digit</span>
                </div>
              </div>

              {authError && (
                <div className="text-xs text-[#FF5F56] flex items-center gap-1.5 font-sans">
                  <AlertCircle size={13} />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating || pinInput.length !== 6}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  pinInput.length === 6 && !isAuthenticating
                    ? "bg-[var(--accent)] text-[#0B0B0F] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_35%,transparent)] active:scale-95"
                    : "bg-[#1E1E2A] text-[#71717A] cursor-not-allowed opacity-60"
                }`}
              >
                {isAuthenticating ? "Verifying Token..." : "Unlock CRM with PIN"}
              </button>
            </form>
          ) : (
            /* PASSWORD FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-2">
                  Master Secret Key
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-4 py-3 rounded-xl bg-[#09090D] border border-[#262634] focus:border-[var(--accent)] outline-none text-sm text-[#F4F4F0] placeholder:text-[#555566] transition-colors"
                />
              </div>

              {authError && (
                <div className="text-xs text-[#FF5F56] flex items-center gap-1.5 font-sans">
                  <AlertCircle size={13} />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating || !passwordInput}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  passwordInput && !isAuthenticating
                    ? "bg-[var(--accent)] text-[#0B0B0F] hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_35%,transparent)] active:scale-95"
                    : "bg-[#1E1E2A] text-[#71717A] cursor-not-allowed opacity-60"
                }`}
              >
                {isAuthenticating ? "Verifying..." : "Unlock CRM"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-[11px] text-[#555566]">
          saketh_ · Client CRM Engine · RFC 6238 TOTP Protected
        </div>
      </div>
    );
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07070A] flex items-center justify-center font-mono text-xs text-[#A1A1AA]">
        <span className="animate-spin mr-2">⟳</span> Initializing CRM credentials...
      </div>
    );
  }

  // ========================================================
  // RENDER: SECURE CRM STUDIO
  // ========================================================
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F0] flex flex-col font-sans selection:bg-[var(--accent)] selection:text-[#0B0B0F]">
      {/* TOP EXECUTIVE BAR */}
      <header className="border-b border-[#1E1E26] bg-[#07070A] px-4 sm:px-[5%] py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="font-mono text-base font-medium tracking-tight text-[#F4F4F0] hover:opacity-90 flex items-center gap-1"
          >
            <span>saketh</span>
            <span className="text-[var(--accent)] font-bold">_crm</span>
          </Link>
          <span className="font-mono text-[10px] font-semibold text-[#0B0B0F] bg-[var(--accent)] px-2 py-0.5 rounded-full uppercase tracking-wider">
            AUTHENTICATED CRM
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Sheets Sync Button */}
          <button
            type="button"
            onClick={() => setShowSheetsModal(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#14141E] hover:bg-[#1C1C28] border border-[#26262E] text-xs font-mono text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={13} className={sheetsConfigured ? "text-[#7CF4D4]" : "text-[#A1A1AA]"} />
            <span className="hidden md:inline">Google Sheet</span>
            <span
              className={`w-2 h-2 rounded-full ${
                sheetsConfigured ? "bg-[#7CF4D4] shadow-[0_0_8px_#7CF4D4]" : "bg-[#71717A]"
              }`}
            />
          </button>

          {/* Refresh Leads */}
          <button
            type="button"
            onClick={loadLeads}
            title="Refresh Inquiries"
            className="p-2 rounded-lg bg-[#14141E] border border-[#26262E] text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E2A] hover:bg-[#2A2A3A] border border-[#2E2E3E] text-xs font-mono text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Lock &amp; Exit</span>
          </button>
        </div>
      </header>

      {/* EXECUTIVE FINANCIAL SUMMARY BAR */}
      <section className="border-b border-[#1A1A24] bg-[#0E0E14] px-4 sm:px-[5%] py-4 sm:py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#14141E] border border-[#242432]">
            <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-1">
              <span>Total Pipeline</span>
              <DollarSign size={15} className="text-[var(--accent)]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#F4F4F0]">
              ${totalPipelineValue.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#71717A] mt-1 font-mono">Agreed deal value</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#14141E] border border-[#242432]">
            <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-1">
              <span>Cash Collected</span>
              <CreditCard size={15} className="text-[#7CF4D4]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#7CF4D4]">
              ${totalCollected.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#71717A] mt-1 font-mono">Deposits &amp; full payments</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#14141E] border border-[#242432]">
            <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-1">
              <span>Pending Balance</span>
              <TrendingUp size={15} className="text-[#FF7A59]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#FF7A59]">
              ${totalPending.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#71717A] mt-1 font-mono">Outstanding payments</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#14141E] border border-[#242432]">
            <div className="flex items-center justify-between text-[#A1A1AA] text-xs font-mono mb-1">
              <span>Active Inquiries</span>
              <CheckCircle2 size={15} className="text-[var(--accent)]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#F4F4F0]">
              {leads.length}
            </div>
            <div className="text-[10px] text-[#71717A] mt-1 font-mono">Bookings &amp; briefs</div>
          </div>
        </div>
      </section>

      {/* MAIN CRM WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT COLUMN: LEADS PIPELINE */}
        <div className="w-full md:w-[420px] lg:w-[480px] border-r border-[#1E1E26] bg-[#0E0E14] flex flex-col overflow-y-auto">
          {/* Pipeline Stage Filter Pills */}
          <div className="p-3.5 sm:p-4 border-b border-[#1E1E26] bg-[#0A0A0E] flex items-center gap-1.5 overflow-x-auto">
            {["All", "New", "Contacted", "Proposal", "Won"].map((st) => {
              const active = selectedFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedFilter(st)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-[var(--accent)] text-[#0B0B0F] font-bold shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
                      : "bg-[#14141E] text-[#A1A1AA] hover:text-[#F4F4F0] border border-[#22222E]"
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Lead List Cards */}
          <div className="divide-y divide-[#181822] flex-1">
            {isLoading ? (
              <div className="p-8 text-center text-xs font-mono text-[#71717A]">
                <span className="animate-spin mr-2">⟳</span> Fetching pipeline...
              </div>
            ) : visibleLeads.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#71717A]">
                No inquiries in this stage.
              </div>
            ) : (
              visibleLeads.map((item) => {
                const isSelected = item.id === selectedLeadId;
                const stageColor = STAGE_COLORS[item.stage];
                const pending = Math.max(0, item.dealValue - item.amountPaid);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLeadId(item.id)}
                    className={`p-4 transition-colors cursor-pointer border-l-2 ${
                      isSelected
                        ? "bg-[#161622] border-l-[var(--accent)]"
                        : "hover:bg-[#12121A] border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-[#F4F4F0] flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.dealValue > 0 && (
                          <span className="text-[10px] font-mono text-[#7CF4D4] bg-[#7CF4D4]/10 px-1.5 py-0.2 rounded border border-[#7CF4D4]/30">
                            ${item.dealValue.toLocaleString()}
                          </span>
                        )}
                      </span>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: stageColor.bg, color: stageColor.text }}
                      >
                        {item.stage}
                      </span>
                    </div>

                    <div className="text-xs text-[#A1A1AA] font-mono truncate mb-2">
                      {item.contact}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#71717A] font-mono">
                      <span>{item.need}</span>
                      <span>{item.when}</span>
                    </div>

                    {/* Quick Payment Status Pill */}
                    {item.dealValue > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#20202E] flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#A1A1AA]">
                          Paid:{" "}
                          <strong className="text-[#7CF4D4]">
                            ${item.amountPaid.toLocaleString()}
                          </strong>
                        </span>
                        {pending > 0 ? (
                          <span className="text-[#FF7A59]">
                            Due: ${pending.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[#7CF4D4]">✓ Settled</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LEAD INSPECTION & FINANCIAL LEDGER */}
        <div className="flex-1 bg-[#09090D] overflow-y-auto p-4 sm:p-6 md:p-8">
          {selectedLead ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Header Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#12121A] border border-[#22222E]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#F4F4F0] mb-1">
                      {selectedLead.name}
                    </h2>
                    <div className="text-xs font-mono text-[#A1A1AA]">
                      {selectedLead.contact}
                    </div>
                  </div>

                  {/* Stage Selector */}
                  <div className="flex items-center gap-1 bg-[#0A0A0E] p-1 rounded-xl border border-[#242432]">
                    {(["New", "Contacted", "Proposal", "Won"] as Stage[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateStage(st)}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          selectedLead.stage === st
                            ? "bg-[var(--accent)] text-[#0B0B0F] font-bold"
                            : "text-[#71717A] hover:text-[#F4F4F0]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1E1E2A]">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1FAF38] hover:bg-[#25C743] text-[#0B0B0F] font-bold text-xs font-mono transition-all cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    <span>Reply on WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${selectedLead.contact}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E1E2A] hover:bg-[#2A2A3A] border border-[#2E2E3E] text-xs font-mono text-[#F4F4F0] transition-all cursor-pointer"
                  >
                    <Mail size={14} />
                    <span>Send Email</span>
                  </a>
                  {selectedLead.day && selectedLead.slot && (
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09090D] border border-[#22222E] text-xs font-mono text-[var(--accent)]">
                      <Calendar size={13} />
                      <span>
                        {selectedLead.day} at {selectedLead.slot} IST
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Brief / Requirements */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#12121A] border border-[#22222E] space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[#71717A]">
                  Inquiry Specifications
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#0A0A0E] border border-[#1E1E2A]">
                    <span className="text-[#71717A] block mb-1">Service Requested</span>
                    <span className="text-[#F4F4F0] font-bold">{selectedLead.need}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0A0A0E] border border-[#1E1E2A]">
                    <span className="text-[#71717A] block mb-1">Client Budget / Model</span>
                    <span className="text-[#F4F4F0] font-bold">{selectedLead.budget}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0A0A0E] border border-[#1E1E2A]">
                  <span className="text-[#71717A] text-xs font-mono block mb-1.5">
                    Client Notes &amp; Scope
                  </span>
                  <p className="text-xs text-[#D4D4D8] leading-relaxed whitespace-pre-wrap font-mono">
                    {selectedLead.note}
                  </p>
                </div>
              </div>

              {/* FINANCIAL & PAYMENT LEDGER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#12121A] border border-[#22222E] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                    <DollarSign size={14} />
                    <span>Deal Terms &amp; Payment Ledger</span>
                  </div>
                  {saveSuccessNotice && (
                    <span className="text-xs font-mono text-[#7CF4D4] animate-in fade-in">
                      ✓ Changes saved &amp; synced
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#A1A1AA] mb-1.5">
                      Total Agreed Deal Value ($)
                    </label>
                    <input
                      type="number"
                      value={editDealValue}
                      onChange={(e) => setEditDealValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-[#242432] focus:border-[var(--accent)] outline-none text-sm font-mono text-[#F4F4F0]"
                      placeholder="e.g. 3500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A1A1AA] mb-1.5">
                      Amount Paid / Received ($)
                    </label>
                    <input
                      type="number"
                      value={editAmountPaid}
                      onChange={(e) => setEditAmountPaid(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-[#242432] focus:border-[#7CF4D4] outline-none text-sm font-mono text-[#7CF4D4]"
                      placeholder="e.g. 1750"
                    />
                  </div>
                </div>

                {/* Balance Due Readout */}
                <div className="p-3 rounded-xl bg-[#0A0A0E] border border-[#20202E] flex items-center justify-between font-mono text-xs">
                  <span className="text-[#A1A1AA]">Pending Remaining Balance:</span>
                  <span
                    className={`font-bold ${
                      Math.max(0, editDealValue - editAmountPaid) > 0
                        ? "text-[#FF7A59]"
                        : "text-[#7CF4D4]"
                    }`}
                  >
                    ${Math.max(0, editDealValue - editAmountPaid).toLocaleString()}
                  </span>
                </div>

                {/* Payment Stage Buttons */}
                <div>
                  <label className="block text-xs font-mono text-[#A1A1AA] mb-2">
                    Payment Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "unpaid", label: "Unpaid (0%)" },
                      { key: "deposit_paid", label: "50% Deposit Received" },
                      { key: "fully_paid", label: "Paid in Full (100%)" },
                    ].map((opt) => {
                      const active = editPaymentStatus === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setEditPaymentStatus(opt.key as any)}
                          className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            active
                              ? "bg-[#7CF4D4] text-[#0B0B0F] font-bold border-[#7CF4D4]"
                              : "bg-[#0A0A0E] text-[#A1A1AA] border-[#22222E] hover:border-[#3A3A4A]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confidential Internal Notes */}
                <div>
                  <label className="block text-xs font-mono text-[#A1A1AA] mb-1.5">
                    Private Admin Notes &amp; Payment Reference
                  </label>
                  <textarea
                    rows={3}
                    value={editInternalNotes}
                    onChange={(e) => setEditInternalNotes(e.target.value)}
                    placeholder="Stripe invoice ID, payment links, contract terms, or client preferences..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-[#242432] focus:border-[var(--accent)] outline-none text-xs font-mono text-[#F4F4F0] placeholder:text-[#555566]"
                  />
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveDealDetails}
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl bg-[var(--accent)] text-[#0B0B0F] font-bold text-xs font-mono uppercase tracking-wider hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_color-mix(in_srgb,var(--accent)_25%,transparent)]"
                >
                  <Save size={14} />
                  <span>{isSaving ? "Saving Terms..." : "Save Deal Details"}</span>
                </button>
              </div>

              {/* Danger Zone: Delete Lead */}
              <div className="p-4 rounded-xl border border-[#2E1818] bg-[#140B0B] flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-[#FF5F56] font-bold">
                    Delete Lead
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] font-mono mt-0.5">
                    Permanently delete this spam or test submission.
                  </div>
                </div>

                {deleteConfirmId === selectedLead.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(selectedLead.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#FF5F56] text-[#0B0B0F] font-mono font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#222] text-[#A1A1AA] font-mono text-xs hover:text-[#FFF] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(selectedLead.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#221010] hover:bg-[#331515] text-[#FF5F56] border border-[#441B1B] text-xs font-mono transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-[#71717A]">
              Select a lead from the pipeline to inspect.
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: GOOGLE SHEETS SETUP & BULK SYNC */}
      {/* ======================================================== */}
      {showSheetsModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#101017] border border-[#262638] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[var(--accent)] font-mono text-xs uppercase tracking-wider font-bold">
                <FileSpreadsheet size={16} />
                <span>Google Sheets Fail-Proof Sync</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSheetsModal(false)}
                className="text-[#71717A] hover:text-[#F4F4F0] text-sm font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#F4F4F0] mb-2">
              Sync Inquiries to Google Sheets
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6 font-sans">
              Every incoming call booking, project brief, and payment update syncs automatically to your Google Sheet as a fail-proof backup. You can also trigger a full bulk sync at any time.
            </p>

            {/* Sync Trigger Card */}
            <div className="p-4 rounded-xl bg-[#09090E] border border-[#242434] mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono font-bold text-[#F4F4F0] flex items-center gap-2">
                  <span>Configuration Status:</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      sheetsConfigured
                        ? "bg-[#7CF4D4]/15 text-[#7CF4D4] border border-[#7CF4D4]/30"
                        : "bg-[#FF7A59]/15 text-[#FF7A59] border border-[#FF7A59]/30"
                    }`}
                  >
                    {sheetsConfigured ? "✓ Active (Webhook connected)" : "Not Connected Yet"}
                  </span>
                </div>
                <div className="text-[11px] text-[#71717A] font-mono mt-1">
                  {leads.length} leads in local database ready to sync.
                </div>
              </div>

              <button
                type="button"
                onClick={handleBulkSyncSheets}
                disabled={isSyncingSheets}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--accent)] text-[#0B0B0F] font-bold font-mono text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={13} className={isSyncingSheets ? "animate-spin" : ""} />
                <span>{isSyncingSheets ? "Syncing..." : "Sync All Leads Now"}</span>
              </button>
            </div>

            {syncFeedback && (
              <div className="mb-6 p-3 rounded-xl bg-[#141422] border border-[#2E2E42] text-xs font-mono text-[#7CF4D4]">
                {syncFeedback}
              </div>
            )}

            {/* 1-Minute Fail-Proof Setup Guide */}
            <div className="space-y-4 pt-4 border-t border-[#1E1E2A]">
              <div className="font-mono text-xs uppercase text-[#A1A1AA] font-bold flex items-center justify-between">
                <span>1-Minute Free Setup Guide (Zero Google Cloud Needed)</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline cursor-pointer"
                >
                  {copiedScript ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedScript ? "Copied Script!" : "Copy 15-Line Script"}</span>
                </button>
              </div>

              <ol className="text-xs text-[#A1A1AA] space-y-2.5 font-sans pl-4 list-decimal leading-relaxed">
                <li>
                  Create a new spreadsheet at{" "}
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] underline inline-flex items-center gap-0.5"
                  >
                    <span>sheets.new</span>
                    <ExternalLink size={11} />
                  </a>{" "}
                  named <strong className="text-[#F4F4F0]">Saketh Portfolio CRM</strong>.
                </li>
                <li>
                  Click <strong className="text-[#F4F4F0]">Extensions &gt; Apps Script</strong> in the top menu of your sheet.
                </li>
                <li>
                  Replace everything in the editor with the copied script and click <strong className="text-[#F4F4F0]">Save (Ctrl+S)</strong>.
                </li>
                <li>
                  Click <strong className="text-[#F4F4F0]">Deploy &gt; New deployment</strong>, choose <strong className="text-[#F4F4F0]">Web app</strong>, set <em>Execute as: Me</em> and <em>Who has access: Anyone</em>, then click Deploy.
                </li>
                <li>
                  Copy the provided Web app URL and paste it into your <code className="text-[#7CF4D4]">.env.local</code> as:
                  <div className="mt-1 p-2 rounded-lg bg-[#07070A] border border-[#22222E] font-mono text-[11px] text-[#7CF4D4] select-all">
                    GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycb.../exec
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
