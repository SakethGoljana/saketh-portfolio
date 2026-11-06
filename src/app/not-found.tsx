"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  ArrowLeft,
  Compass,
  Home,
  Layers,
  MessageSquare,
  Search,
  Terminal,
} from "lucide-react";

function subscribe() {
  return () => {};
}

export default function NotFound() {
  const currentPath = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => ""
  );

  const triggerPalette = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-palette"));
    }
  };

  const triggerFeedback = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-feedback", {
          detail: {
            category: "bug",
            prefill: currentPath
              ? `I landed on a 404 broken route at: ${currentPath}`
              : "I encountered a 404 broken route.",
          },
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4 py-12 relative overflow-hidden selection:bg-[var(--foreground)] selection:text-[var(--background)] transition-colors duration-200">
      {/* Background Architectural Grid & Subtle Radial Ambient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Ambient Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Terminal Header Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[var(--subtext)] font-semibold">HTTP 404</span>
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            BLUEPRINT UNMAPPED
          </span>
        </div>

        {/* 404 Monospace Glyph */}
        <div className="relative mb-4 select-none">
          <h1 className="text-7xl sm:text-9xl font-mono font-extrabold tracking-tighter text-slate-200 dark:text-zinc-800/80">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)] drop-shadow-sm">
              Sector Off-Grid
            </span>
          </div>
        </div>

        {/* Explanatory Context */}
        <p className="text-sm sm:text-base text-[var(--subtext)] max-w-md mx-auto leading-relaxed mb-6 font-sans">
          The requested coordinate does not map to any active blueprint or
          deployed route in this system.
        </p>

        {/* Attempted Path Badge (if client available) */}
        {currentPath && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] font-mono text-xs text-[var(--subtext)] mb-8 max-w-full overflow-hidden truncate">
            <Terminal size={13} className="text-emerald-500 shrink-0" />
            <span className="text-zinc-400">path:</span>
            <span className="font-semibold text-[var(--foreground)] truncate">
              {currentPath}
            </span>
          </div>
        )}

        {/* Primary Action Button Grid */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-8">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs sm:text-sm font-semibold shadow-md hover:opacity-90 active:scale-98 transition-all cursor-pointer"
          >
            <Home size={15} />
            <span>Return to Portfolio</span>
          </Link>

          <button
            type="button"
            onClick={triggerPalette}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[var(--foreground)] text-xs sm:text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/10 active:scale-98 transition-all cursor-pointer"
          >
            <Search size={15} />
            <span>Search Command Menu</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-mono text-[var(--subtext)]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Quick Link Slices */}
        <div className="pt-6 border-t border-[var(--border)] w-full">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--subtext)] mb-3">
            Quick Navigation Blueprint
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <Link
              href="/#work"
              className="px-3 py-1 rounded-md bg-[var(--card)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--foreground)] transition-colors"
            >
              01 · Selected Work
            </Link>
            <Link
              href="/#capabilities"
              className="px-3 py-1 rounded-md bg-[var(--card)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--foreground)] transition-colors"
            >
              02 · Architecture & Stack
            </Link>
            <Link
              href="/#contact"
              className="px-3 py-1 rounded-md bg-[var(--card)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--foreground)] transition-colors"
            >
              03 · Direct Booking
            </Link>
            <button
              type="button"
              onClick={triggerFeedback}
              className="px-3 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer"
            >
              Report Broken Link
            </button>
          </div>
        </div>
      </main>

      {/* Footer System Status */}
      <footer className="relative z-10 mt-auto pt-8 text-[11px] font-mono text-[var(--subtext)] text-center">
        <span>Portfolio Core System v2.6 · All services operational</span>
      </footer>
    </div>
  );
}
