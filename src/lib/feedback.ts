import fs from "fs";
import path from "path";

export type FeedbackCategory = "craft" | "bug" | "idea" | "inquiry" | "other";

export interface FeedbackItem {
  id: string;
  createdAt: string;
  category: FeedbackCategory;
  sentiment?: "positive" | "neutral" | "issue";
  message: string;
  contact?: string;
  metadata?: {
    pathname?: string;
    screen?: string;
    theme?: string;
    userAgent?: string;
  };
}

const DATA_DIR = path.join(process.cwd(), "data");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");

let inMemoryFeedback: FeedbackItem[] = [];

function safeEnsureDataFile(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FEEDBACK_FILE)) {
      fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2), "utf8");
    }
    return true;
  } catch {
    return false;
  }
}

export function getFeedbacks(): FeedbackItem[] {
  if (safeEnsureDataFile()) {
    try {
      const data = fs.readFileSync(FEEDBACK_FILE, "utf8");
      inMemoryFeedback = JSON.parse(data);
      return inMemoryFeedback;
    } catch {
      return inMemoryFeedback;
    }
  }
  return inMemoryFeedback;
}

export function saveFeedback(
  item: Omit<FeedbackItem, "id" | "createdAt">
): FeedbackItem {
  const current = getFeedbacks();
  const newItem: FeedbackItem = {
    ...item,
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  current.unshift(newItem);
  inMemoryFeedback = current;

  try {
    if (safeEnsureDataFile()) {
      fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(current, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("Failed to write feedback to disk, retained in memory:", err);
  }

  return newItem;
}
