"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Home,
  RefreshCw,
  Terminal,
  Bug,
} from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log exception safely to client console
    console.error("Runtime exception caught by Next.js error boundary:", error);
  }, [error]);

  const copyDiagnostic = async () => {
    const diagnostic = `Error: ${error.message}\nDigest: ${error.digest || "None"}\nTimestamp: ${new Date().toISOString()}\nURL: ${typeof window !== "undefined" ? window.location.href : "SSR"}`;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(diagnostic);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn("Clipboard access denied:", err);
    }
  };

  const triggerFeedbackWithBug = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-feedback", {
          detail: {
            category: "bug",
            prefill: `Encountered runtime error: ${error.message} (Digest: ${error.digest || "N/A"})`,
          },
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4 py-12 relative overflow-hidden selection:bg-[var(--foreground)] selection:text-[var(--background)] transition-colors duration-200">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Ambient Crimson Warning Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Status Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 text-xs font-mono mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-rose-700 dark:text-rose-400 font-bold">HTTP 500</span>
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <span className="text-[var(--foreground)] font-medium">
            RUNTIME BREAK ISOLATED
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)] mb-3">
          Execution interrupted safely.
        </h1>

        <p className="text-sm sm:text-base text-[var(--subtext)] max-w-md mx-auto leading-relaxed mb-6">
          An unexpected exception occurred during page execution. The runtime
          boundary safely contained the error to preserve session integrity.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-6">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs sm:text-sm font-semibold shadow-md hover:opacity-90 active:scale-98 transition-all cursor-pointer"
          >
            <RefreshCw size={15} />
            <span>Re-attempt Execution</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[var(--foreground)] text-xs sm:text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/10 active:scale-98 transition-all cursor-pointer"
          >
            <Home size={15} />
            <span>Clean Session (Home)</span>
          </Link>
        </div>

        {/* Collapsible Technical Diagnostics Drawer */}
        <div className="w-full rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden text-left mb-6 shadow-sm">
          <button
            type="button"
            onClick={() => setShowDetails((p) => !p)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-emerald-500" />
              <span className="font-semibold">Diagnostic Trace & Digest</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{showDetails ? "Hide" : "Inspect"}</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>

          {showDetails && (
            <div className="p-4 border-t border-[var(--border)] bg-black/40 font-mono text-xs space-y-3">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">
                  Exception Message
                </span>
                <p className="text-rose-400 break-words mt-0.5">
                  {error.message || "Unknown runtime anomaly"}
                </p>
              </div>

              {error.digest && (
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">
                    Next.js Error Digest
                  </span>
                  <code className="text-zinc-300 bg-white/5 px-1.5 py-0.5 rounded text-[11px]">
                    {error.digest}
                  </code>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={copyDiagnostic}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "Copied diagnostic!" : "Copy Diagnostics"}</span>
                </button>

                <button
                  type="button"
                  onClick={triggerFeedbackWithBug}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition-colors cursor-pointer"
                >
                  <Bug size={13} />
                  <span>Report Anomaly</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer System Status */}
      <footer className="relative z-10 mt-auto pt-6 text-[11px] font-mono text-[var(--subtext)] text-center">
        <span>Resilient Error Boundary · Zero data leak</span>
      </footer>
    </div>
  );
}
