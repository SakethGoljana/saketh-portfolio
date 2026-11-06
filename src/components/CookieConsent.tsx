"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

const CONSENT_STORAGE_KEY = "portfolio_cookie_consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!consent) {
        // Delay slightly for smooth non-intrusive entrance
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    triggerHaptic("tap");
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, accepted ? "accepted" : "declined");
    } catch {
      // Ignore localStorage errors
    }

    // Update Google Consent Mode dynamically if gtag is loaded
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: accepted ? "granted" : "denied",
      });
    }

    setShowBanner(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.aside
          role="region"
          aria-label="Cookie consent banner"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed bottom-4 left-4 z-40 max-w-[340px] sm:max-w-[380px] w-[calc(100vw-32px)]"
        >
          <div className="relative p-3.5 sm:p-4 rounded-2xl bg-white/85 dark:bg-[#0B1017]/85 backdrop-blur-xl border border-black/10 dark:border-white/12 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.3)] text-[var(--foreground)]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck size={16} strokeWidth={2.4} />
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-xs font-bold tracking-tight">Privacy &amp; Analytics</h4>
                <p className="text-[11px] text-[var(--subtext)] leading-relaxed mt-0.5">
                  We use minimal cookies for traffic insights and performance. No ad tracking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleConsent(false)}
                className="text-[var(--subtext)] hover:text-[var(--foreground)] p-1 -mr-1 -mt-1 transition-colors cursor-pointer"
                title="Dismiss"
                aria-label="Dismiss cookie notice"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleConsent(true)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Accept Analytics
              </button>
              <button
                type="button"
                onClick={() => handleConsent(false)}
                className="py-1.5 px-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/15 text-[var(--foreground)] font-mono text-[11px] font-medium transition-all cursor-pointer text-center"
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
