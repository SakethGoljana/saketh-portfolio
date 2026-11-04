"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import IPhoneAIChat from "./IPhoneAIChat";
import { triggerHaptic } from "@/utils/haptics";

const WORDS = ["brands", "websites", "apps", "interfaces"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate headline words every 2.4s
  useEffect(() => {
    let reduceMotion = false;
    try {
      reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}

    if (reduceMotion) return;

    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  // Cursor-following spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty("--mx", `${x}px`);
    containerRef.current.style.setProperty("--my", `${y}px`);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    containerRef.current.style.setProperty("--mx", `${x}px`);
    containerRef.current.style.setProperty("--my", `${y}px`);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    triggerHaptic("tap");
    const id = targetId.replace("#", "");
    if (!id || id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const targetEl = document.getElementById(id);
    if (targetEl) {
      const navOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - navOffset),
        behavior: "smooth",
      });
      try {
        window.history.pushState(null, "", `#${id}`);
      } catch {}
    }
  };

  return (
    <section
      id="top"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 lg:pb-12 px-5 sm:px-8 overflow-hidden bg-[var(--background)] transition-colors duration-200"
      style={{ "--mx": "50%", "--my": "40%" } as React.CSSProperties}
    >
      {/* Ambient dynamic accent background glow (Dark mode only to keep light mode crisp & clean) */}
      <div
        aria-hidden="true"
        className="hidden dark:block absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-colors duration-700"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(13, 148, 136, 0.08) 50%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="hidden dark:block absolute top-1/3 right-[12%] -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-[150px] pointer-events-none opacity-15 transition-colors duration-700"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(13, 148, 136, 0.06) 50%, transparent 70%)",
        }}
      />

      {/* HERO CONTENT CONTAINER - Balanced vertical baseline between typography and iPhone */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-10 xl:gap-14">
        {/* Left Column: Typography & CTAs (Spans full height with bottom micro-bar anchored) */}
        <div className="max-w-2xl xl:max-w-3xl flex-1 w-full min-w-0 flex flex-col justify-between">
          <div>
            {/* Creative Minimalist Live Telemetry Tag */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono mb-3 sm:mb-4 select-none">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] tracking-wider uppercase whitespace-nowrap shadow-2xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span>AVAILABLE NOW</span>
              </div>
              <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">/</span>
              <span className="text-[11px] text-[var(--subtext)] font-mono uppercase tracking-wider whitespace-nowrap">
                FREELANCE CONTRACTS
              </span>
            </div>

            {/* Proposition Tag */}
            <div className="font-mono text-xs sm:text-sm text-[var(--foreground)]/85 mb-3 sm:mb-4 leading-relaxed font-semibold tracking-wide">
              &gt; freelance developer building mobile apps &amp; web platforms<span className="cursor-blink text-emerald-600 dark:text-emerald-400 font-bold">_</span>
            </div>

            {/* Kinetic Hero Display Headline (Stan.vision Masked Reveal) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.035em] leading-[1.12] sm:leading-[1.08] [text-wrap:balance]">
              {/* Mask Line 1 */}
              <span className="block overflow-hidden pb-0.5">
                <span className="block animate-mask-reveal text-[var(--foreground)]">
                  I make
                </span>
              </span>
              
              {/* Mask Line 2: Fluid Word Rotation Window */}
              <span className="block overflow-hidden py-1">
                <span className="inline-flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <span className="relative h-[1.18em] overflow-hidden drop-shadow-none dark:drop-shadow-[0_0_35px_rgba(16,185,129,0.35)]">
                    <span
                      className="block transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)]"
                      style={{ transform: `translateY(-${wordIndex * 1.18}em)` }}
                    >
                      {WORDS.map((w) => (
                        <span
                          key={w}
                          className="block h-[1.18em] leading-[1.18] bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent font-extrabold"
                        >
                          {w}
                        </span>
                      ))}
                    </span>
                  </span>

                  {/* Apple Style Category Pill Indicator */}
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--foreground)]/5 border border-[var(--border)] text-xs font-mono font-medium text-[var(--subtext)] -translate-y-0.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] animate-pulse" />
                    <span key={wordIndex} className="animate-in fade-in duration-300 inline-block">
                      {wordIndex === 0 ? "identity & craft" : wordIndex === 1 ? "next.js web" : wordIndex === 2 ? "mobile apps" : "ui/ux systems"}
                    </span>
                  </span>
                </span>
              </span>

              {/* Mask Line 3: Solid display word */}
              <span className="block overflow-hidden pt-0.5">
                <span className="block animate-mask-reveal text-[var(--foreground)] tracking-tight leading-[1.05]">
                  unmissable.
                </span>
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="mt-3.5 sm:mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-[var(--subtext)] font-normal break-words">
              Most digital products lose their soul in the handoff between design and code.
              I unite both worlds—designing with engineering precision and building with aesthetic obsessiveness.
            </p>

            {/* Action Buttons - Clean, Full-Width Mobile Ergonomics & Glassmorphic Uniformity */}
            <div className="mt-5 sm:mt-7 flex flex-col gap-3 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "#contact")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm tracking-tight transition-all duration-200 active:scale-[0.97] shadow-[0_8px_20px_-4px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] min-h-[46px] touch-manipulation cursor-pointer text-center"
                >
                  <span>Start a project</span>
                  <ArrowDown size={14} />
                </a>
                <a
                  href="#work"
                  onClick={(e) => scrollToSection(e, "#work")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-[var(--foreground)] text-sm font-semibold transition-all duration-200 active:scale-[0.97] shadow-2xs min-h-[46px] touch-manipulation cursor-pointer text-center"
                >
                  <span>Selected Work</span>
                  <ArrowUpRight size={14} className="text-emerald-600 dark:text-emerald-400" />
                </a>
              </div>

              {/* Mobile Direct Trigger for AI Copilot */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-ai-chat"));
                  }
                }}
                className="lg:hidden w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold transition-all active:scale-[0.97] min-h-[40px] cursor-pointer"
              >
                <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>Ask Saketh AI Copilot</span>
              </button>
            </div>
          </div>

          {/* Product Domains Micro-Bar (Evenly balanced at the bottom baseline) */}
          <div className="mt-6 sm:mt-8 pt-2 flex items-center gap-2 sm:gap-2.5 text-xs font-mono text-[var(--subtext)] overflow-x-auto no-scrollbar max-w-full w-full py-1">
            <span className="text-[var(--subtext)] font-semibold shrink-0">DOMAINS:</span>
            {[
              { label: "Mobile Apps", sub: "React Native" },
              { label: "Modern Web", sub: "Next.js & React" },
              { label: "AI & Automation", sub: "APIs & Workflows" },
              { label: "End-to-End", sub: "Design to Launch" },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#18181B] border border-zinc-200/80 dark:border-white/[0.08] text-[var(--foreground)] whitespace-nowrap shrink-0 hover:border-emerald-500/40 transition-colors shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-600 dark:bg-emerald-400" />
                <strong className="font-semibold">{item.label}</strong>
                <span className="text-[var(--subtext)] text-[11px]">{item.sub}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Realistic iPhone Hero Showcase (Anchored flush to bottom baseline) */}
        <div className="relative contents lg:flex flex-col items-center justify-end shrink-0 pr-0 xl:pr-4">
          <div className="relative">
            {/* Central Realistic iPhone AI Chat */}
            <IPhoneAIChat />
          </div>
        </div>
      </div>
    </section>
  );
}
