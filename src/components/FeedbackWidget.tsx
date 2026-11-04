"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquarePlus,
  X,
  Send,
  CheckCircle2,
  Sparkles,
  Bug,
  Lightbulb,
  Briefcase,
  HelpCircle,
  Laptop,
} from "lucide-react";
import type { FeedbackCategory } from "@/lib/feedback";

interface CategoryOption {
  id: FeedbackCategory;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  placeholder: string;
  accent: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "craft",
    label: "Craft & UX",
    icon: Sparkles,
    placeholder: "What visual detail, typography, or interaction caught your eye?",
    accent: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    id: "bug",
    label: "Found a Bug",
    icon: Bug,
    placeholder: "What broke or looked misaligned? Any error message visible?",
    accent: "text-rose-500 border-rose-500/30 bg-rose-500/10",
  },
  {
    id: "idea",
    label: "Feature Idea",
    icon: Lightbulb,
    placeholder: "What feature, interactive widget, or tool would make this even better?",
    accent: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  },
  {
    id: "inquiry",
    label: "Opportunity",
    icon: Briefcase,
    placeholder: "Have a project, role, or collaboration in mind?",
    accent: "text-sky-500 border-sky-500/30 bg-sky-500/10",
  },
];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory>("craft");
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "issue">("positive");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [metaInfo, setMetaInfo] = useState<{ path: string; screen: string; theme: string }>({
    path: "/",
    screen: "",
    theme: "dark",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Capture client environment metadata
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateMeta = () => {
        const theme = document.documentElement.getAttribute("data-theme") || "dark";
        setMetaInfo({
          path: window.location.pathname,
          screen: `${window.innerWidth}×${window.innerHeight}`,
          theme,
        });
      };
      updateMeta();
      window.addEventListener("resize", updateMeta);
      return () => window.removeEventListener("resize", updateMeta);
    }
  }, []);

  // Keyboard shortcut listener: 'F' to toggle (unless focused on input/textarea)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (e.key.toLowerCase() === "f" && !e.metaKey && !e.ctrlKey && !e.altKey && !isInput) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.category) {
        setCategory(customEvent.detail.category);
        if (customEvent.detail.category === "bug") setSentiment("issue");
      }
      if (customEvent.detail?.prefill) {
        setMessage(customEvent.detail.prefill);
      }
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-feedback", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-feedback", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && !submitted) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg("Please enter your thoughts before sending.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          sentiment,
          message: message.trim(),
          contact: contact.trim() || undefined,
          metadata: {
            pathname: metaInfo.path,
            screen: metaInfo.screen,
            theme: metaInfo.theme,
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        // Reset form after exit animation completes
        setTimeout(() => {
          setSubmitted(false);
          setMessage("");
          setContact("");
          setCategory("craft");
          setSentiment("positive");
        }, 300);
      }, 2200);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategoryConfig = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  return (
    <>
      {/* ────────────────────────────────────────────────────────────────── */}
      {/* MINIMALIST FLOATING TRIGGER (Bottom-Left Desktop, Clean & Subtle)   */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        aria-label="Open Feedback Dialog (Press F)"
        title="Share Feedback or Report a Bug (Press F)"
        className="fixed bottom-6 left-6 z-40 hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100/90 dark:bg-[#12131C]/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 text-xs font-mono text-[var(--subtext)] hover:text-[var(--foreground)] hover:border-emerald-500/50 hover:shadow-md active:scale-95 transition-all cursor-pointer group shadow-sm select-none"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <MessageSquarePlus size={14} className="text-emerald-600 dark:text-emerald-400" />
        <span className="font-sans font-medium">Feedback</span>
        <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] font-mono text-[var(--subtext)] group-hover:text-[var(--foreground)] transition-colors">
          F
        </kbd>
      </motion.button>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* LIGHTBOX FEEDBACK MODAL (Framer Motion, Clean & Frictionless)      */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Card — Responsive Bottom Sheet on Mobile, Centered Modal on Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-title"
              className="relative w-full max-w-lg rounded-t-[28px] sm:rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-2xl p-4 sm:p-6 text-[var(--foreground)] max-h-[88vh] sm:max-h-[90vh] overflow-y-auto z-10 pb-[calc(1.2rem+env(safe-area-inset-bottom))] sm:pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Drawer Pull Indicator */}
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-2.5 sm:hidden" />

              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-[var(--border)]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>DIRECT FEEDBACK</span>
                  </div>
                  <h3 id="feedback-title" className="text-lg sm:text-2xl font-bold tracking-tight">
                    Thoughts, bugs, or ideas?
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[var(--subtext)] mt-0.5 leading-tight">
                    Direct feedback straight to Saketh to polish design, speed, and craft.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close dialog"
                  className="p-1.5 sm:p-2 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {submitted ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 flex flex-col items-center text-center space-y-2.5"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-1">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
                    Feedback Received!
                  </h4>
                  <p className="text-xs text-[var(--subtext)] max-w-xs leading-relaxed">
                    Thank you for taking the time to share your perspective. Every detail helps build better software.
                  </p>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
                    Closing dialog...
                  </span>
                </motion.div>
              ) : (
                /* Form State */
                <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                  {/* Category Chip Selector */}
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--subtext)] block mb-1.5 font-medium">
                      Select Topic
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategory(cat.id);
                              if (cat.id === "bug") setSentiment("issue");
                              else if (cat.id === "craft") setSentiment("positive");
                            }}
                            className={`flex items-center sm:flex-col justify-center gap-1.5 py-1.5 px-2 sm:p-2.5 rounded-lg sm:rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? `${cat.accent} shadow-xs font-semibold scale-[1.01]`
                                : "border-[var(--border)] bg-[var(--background)] text-[var(--subtext)] hover:text-[var(--foreground)]"
                            }`}
                          >
                            <Icon size={14} className="shrink-0" />
                            <span className="text-[11px] truncate max-w-full">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="feedback-message"
                        className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--subtext)] font-medium"
                      >
                        Your Note
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {message.length}/2500
                      </span>
                    </div>
                    <textarea
                      id="feedback-message"
                      ref={textareaRef}
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={activeCategoryConfig.placeholder}
                      maxLength={2500}
                      className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] placeholder:text-zinc-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Optional Contact Field */}
                  <div>
                    <label
                      htmlFor="feedback-contact"
                      className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[var(--subtext)] block mb-1 font-medium"
                    >
                      Email or Handle <span className="text-zinc-400 lowercase">(optional)</span>
                    </label>
                    <input
                      id="feedback-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="e.g. alex@example.com or @alex"
                      className="w-full px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] placeholder:text-zinc-400/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Auto-Captured Environmental Context Pill (UX Delight) */}
                  <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-[var(--muted)]/60 border border-[var(--border)] text-[9px] sm:text-[10px] font-mono text-[var(--subtext)]">
                    <Laptop size={11} className="text-emerald-500 shrink-0" />
                    <span className="truncate">
                      Context: {metaInfo.path} · {metaInfo.screen} · {metaInfo.theme}
                    </span>
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-rose-500 font-mono font-medium">{errorMsg}</p>
                  )}

                  {/* Actions */}
                  <div className="pt-1 sm:pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-mono text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !message.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-xs sm:text-sm font-semibold shadow-md hover:opacity-90 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <Send size={12} />
                      <span>{isSubmitting ? "Sending..." : "Submit Feedback"}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
