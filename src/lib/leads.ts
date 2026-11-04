import fs from "fs";
import path from "path";

export interface Lead {
  id: string;
  type: "call_booking" | "project_brief";
  createdAt: string;
  status: "new" | "contacted" | "proposal" | "booked" | "completed";
  name: string;
  contact: string; // Email or WhatsApp
  day?: string;
  slot?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  notes?: string;

  // Real Freelance Deal & Payment Tracking
  currency?: "USD" | "INR";
  dealValue?: number; // Total agreed contract value
  amountPaid?: number; // Total amount received so far
  paymentStatus?: "unpaid" | "deposit_paid" | "fully_paid";
  paymentRef?: string; // Stripe / Bank reference
  internalNotes?: string; // Confidential notes for the admin
}

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

// In-memory fallback cache for serverless environments with read-only filesystems (e.g., Vercel)
let inMemoryLeads: Lead[] = [];
let hasLoadedFromFile = false;

// Ensure data folder and leads.json exist safely without crashing on read-only systems
function safeEnsureDataFile(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), "utf8");
    }
    return true;
  } catch (err: any) {
    // Read-only filesystem warning (normal in serverless lambda environments)
    return false;
  }
}

export function getLeads(): Lead[] {
  try {
    safeEnsureDataFile();
    if (fs.existsSync(LEADS_FILE)) {
      const raw = fs.readFileSync(LEADS_FILE, "utf8");
      const fileData: Lead[] = JSON.parse(raw);
      if (Array.isArray(fileData)) {
        inMemoryLeads = fileData;
        hasLoadedFromFile = true;
      }
    }
  } catch (err) {
    // Fall back to in-memory cache if filesystem is unavailable
  }

  return [...inMemoryLeads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveLead(leadData: Omit<Lead, "id" | "createdAt" | "status">): Lead {
  const leads = getLeads();

  // Enforce reasonable string bounds to prevent memory/disk exhaustion
  const sanitizedName = String(leadData.name || "").trim().slice(0, 100);
  const sanitizedContact = String(leadData.contact || "").trim().slice(0, 150);
  const sanitizedNotes = String(leadData.notes || "").trim().slice(0, 2000);

  const newLead: Lead = {
    ...leadData,
    name: sanitizedName,
    contact: sanitizedContact,
    notes: sanitizedNotes,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
    currency: "USD",
    dealValue: 0,
    amountPaid: 0,
    paymentStatus: "unpaid",
    paymentRef: "",
    internalNotes: "",
  };

  inMemoryLeads.unshift(newLead);

  try {
    safeEnsureDataFile();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(inMemoryLeads, null, 2), "utf8");
  } catch (err: any) {
    console.warn("Storage notice: Saved lead to in-memory storage (serverless read-only mode).");
  }

  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const index = inMemoryLeads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  // Sanitize internal notes if provided
  const sanitizedUpdates = { ...updates };
  if (typeof sanitizedUpdates.internalNotes === "string") {
    sanitizedUpdates.internalNotes = sanitizedUpdates.internalNotes.slice(0, 2000);
  }

  inMemoryLeads[index] = {
    ...inMemoryLeads[index],
    ...sanitizedUpdates,
  };

  try {
    safeEnsureDataFile();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(inMemoryLeads, null, 2), "utf8");
  } catch (err: any) {
    console.warn("Storage notice: Updated lead in in-memory storage.");
  }

  return inMemoryLeads[index];
}

export const updateLeadStatus = (id: string, status: Lead["status"]): Lead | null => {
  return updateLead(id, { status });
};

export function deleteLead(id: string): boolean {
  getLeads();
  const initialCount = inMemoryLeads.length;
  inMemoryLeads = inMemoryLeads.filter((l) => l.id !== id);

  if (inMemoryLeads.length === initialCount) return false;

  try {
    safeEnsureDataFile();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(inMemoryLeads, null, 2), "utf8");
  } catch (err: any) {
    console.warn("Storage notice: Deleted lead from in-memory storage.");
  }

  return true;
}
