"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/utils/haptics";

const CONSENT_STORAGE_KEY = "portfolio_cookie_consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!consent) {
        const timer = setTimeout(() => setShowBanner(true), 1500);
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
      // Ignore
    }

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
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="fixed z-40 bottom-22 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto select-none"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3.5 p-3 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-full bg-white/95 dark:bg-[#121620]/92 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.7)] text-slate-800 dark:text-slate-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-sm select-none shrink-0" aria-hidden="true">🍪</span>
              <span className="text-slate-600 dark:text-slate-300 text-xs font-normal">
                We use cookies for basic anonymous analytics.
              </span>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={() => handleConsent(true)}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl sm:rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-[#090D14] text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer text-center"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleConsent(false)}
                className="px-3 py-1.5 rounded-xl sm:rounded-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
