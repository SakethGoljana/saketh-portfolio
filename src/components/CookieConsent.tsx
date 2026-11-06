"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, ChevronDown, Check } from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

const CONSENT_STORAGE_KEY = "portfolio_cookie_consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!consent) {
        // Delay slightly for smooth, non-intrusive entrance
        const timer = setTimeout(() => setShowBanner(true), 1800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    triggerHaptic(accepted ? "success" : "tap");
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, accepted ? "accepted" : "declined");
    } catch {
      // Ignore storage error
    }

    // Update Google Consent Mode dynamically if gtag is loaded
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: accepted ? "granted" : "denied",
      });
    }

    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.aside
          role="region"
          aria-label="Privacy & Telemetry Consent"
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed z-40 bottom-22 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-[400px] select-none"
        >
          {/* Main Glass HUD Container */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 bg-white/95 dark:bg-[#0C1017]/92 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_16px_40px_-6px_rgba(15,23,42,0.14),0_0_1px_rgba(15,23,42,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_22px_50px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.08)] text-slate-900 dark:text-[#F8FAFC]"
          >
            {/* Top Bar: Icon, Title & Pulse Status */}
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                {/* Micro Animated Pulse Badge */}
                <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 shrink-0 text-emerald-600 dark:text-emerald-400">
                  <Cookie size={14} strokeWidth={2.3} />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white truncate">
                    Telemetry &amp; Privacy
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-white/10">
                    0 ADS
                  </span>
                </div>
              </div>

              {/* Expand details toggle */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("toggle");
                  setExpanded((prev) => !prev);
                }}
                aria-expanded={expanded}
                aria-label="Toggle telemetry details"
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span>{expanded ? "Less" : "Why?"}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Core Message */}
            <p className="text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2 font-sans">
              Only anonymous performance &amp; traffic metrics. Zero cross-site tracking or profiling.
            </p>

            {/* Expandable Transparency Drawer */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 gap-2 text-[10.5px] font-mono">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                        <Check size={11} strokeWidth={3} />
                        <span>COLLECTED</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-tight">
                        Page views, country, screen size &amp; latency.
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-bold mb-1">
                        <ShieldCheck size={11} strokeWidth={2.4} />
                        <span>PROTECTED</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-tight">
                        IPs anonymized. No ad cookies, never sold.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar */}
            <div className="mt-3 flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleConsent(true)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-[#060A10] font-mono text-[11px] font-bold shadow-[0_2px_10px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={13} strokeWidth={2.8} />
                <span>Permit Telemetry</span>
              </button>

              <button
                type="button"
                onClick={() => handleConsent(false)}
                className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/8 dark:hover:bg-white/12 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-mono text-[11px] font-medium transition-all active:scale-[0.98] cursor-pointer"
              >
                Opt Out
              </button>
            </div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
