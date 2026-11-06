"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, type Variants } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  Sparkles,
  FileSpreadsheet,
  MessageCircle,
  Globe,
  Zap,
  CheckCircle2,
  Palette,
  KeyRound,
  Clock,
  Users,
  CreditCard,
  LifeBuoy,
  MousePointer,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

const WHY_CHOOSE_ME = [
  {
    icon: Users,
    title: "Direct Communication",
    description:
      "You speak directly with the builder who writes your code. No middle managers, no junior handoffs, and zero telephone games.",
  },
  {
    icon: Clock,
    title: "2–4 Week Turnaround",
    description:
      "Focused, high-speed sprints that get working software into your hands quickly, instead of dragging on for months of meetings.",
  },
  {
    icon: CreditCard,
    title: "Transparent Fixed Pricing",
    description:
      "Know exactly what you are paying upfront. Clear deliverables, zero surprise invoices, and no expensive monthly agency retainers.",
  },
  {
    icon: LifeBuoy,
    title: "30-Day Launch Warranty",
    description:
      "Every project includes 30 days of free support, fine-tuning, and bug fixes post-launch so you can go live with complete confidence.",
  },
];

interface CapabilityItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  badge: string;
  visual: "mobile" | "automation" | "ai" | "web" | "standards";
}

const CAPABILITIES: CapabilityItem[] = [
  {
    id: "mobile",
    tag: "MOBILE APPS",
    title: "Smooth Mobile Apps",
    description:
      "Custom mobile applications tailored for iPhone and Android. Built with React Native, they deliver 60 FPS performance, offline reliability, and intuitive gestures.",
    badge: "Zero Lag",
    visual: "mobile",
  },
  {
    id: "automation",
    tag: "WORKFLOW AUTOMATION",
    title: "Smart Automations",
    description:
      "Connect your spreadsheets, messaging apps, and customer forms to eliminate repetitive manual work, saving you hours every single day.",
    badge: "1-Click Actions",
    visual: "automation",
  },
  {
    id: "ai",
    tag: "AI COPILOTS & BOT",
    title: "24/7 Smart AI Support",
    description:
      "Intelligent helpers that answer client questions, qualify leads, and keep your business running smoothly around the clock without manual intervention.",
    badge: "Always Online",
    visual: "ai",
  },
  {
    id: "web",
    tag: "MODERN WEB PLATFORMS",
    title: "Lightning-Fast Websites",
    description:
      "Clean, striking web platforms that look stunning on any screen, load in under 1 second, and convert visitors into loyal paying customers.",
    badge: "Sub-Second Load",
    visual: "web",
  },
  {
    id: "standards",
    tag: "ENGINEERING STANDARDS",
    title: "What You Can Expect Every Time",
    description:
      "No corporate jargon, no surprise invoices, and no disappearing after launch. Just dependable, clean software with 100% full source code ownership.",
    badge: "100% Code Ownership",
    visual: "standards",
  },
];

const cardVariants: Variants = {
  initial: (dir: number) => ({
    scale: 0.94,
    opacity: 0.7,
    y: -8,
    x: dir > 0 ? 25 : -25,
  }),
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    x: 0,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 550,
      damping: 24,
      mass: 0.45,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -460 : 460,
    opacity: 0,
    rotate: dir > 0 ? -18 : 18,
    scale: 0.85,
    transition: { duration: 0.11, ease: "easeIn" },
  }),
};

function MobileCard({
  cap,
  direction,
  index,
  total,
  onNext,
  onPrev,
  renderVisual,
}: {
  cap: CapabilityItem;
  direction: number;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  renderVisual: (visual: CapabilityItem["visual"]) => React.ReactNode;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 160], [-14, 14]);
  const opacity = useTransform(x, [-260, -140, 0, 140, 260], [0.5, 0.95, 1, 0.95, 0.5]);

  return (
    <motion.div
      key={`mobile-active-${cap.id}`}
      custom={direction}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ x, rotate, opacity, touchAction: "pan-y" }}
      drag="x"
      dragSnapToOrigin={true}
      dragElastic={0.95}
      onDragEnd={(_, info) => {
        // Ultra-rapid rollout triggers: 16px displacement OR light 80px/s flick
        const swipeThreshold = 16;
        const velocityThreshold = 80;
        if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
          onNext();
        } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
          onPrev();
        }
      }}
      className="absolute inset-x-0 mx-auto w-[96%] rounded-3xl p-5 flex flex-col justify-between bg-[var(--card)] border border-[var(--border)] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.14)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.6)] ring-1 ring-[var(--foreground)]/15 cursor-grab active:cursor-grabbing select-none z-10"
    >
      {/* Visual Stage */}
      {renderVisual(cap.visual)}

      {/* Bottom Content */}
      <div className="pt-3 px-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] font-semibold text-[var(--subtext)]">
            0{index + 1} {"//"} {cap.tag}
          </span>
          <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--foreground)]/5 border border-[var(--border)] text-[var(--foreground)]">
            {cap.badge}
          </span>
        </div>
        <h3 className="text-base font-bold text-[var(--foreground)] tracking-tight">
          {cap.title}
        </h3>
        <p className="text-xs text-[var(--subtext)] leading-relaxed mt-1 font-normal line-clamp-2">
          {cap.description}
        </p>
      </div>

      {/* Swipe Instruction Cue on Front Card */}
      <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--subtext)]">
        <span className="flex items-center gap-1.5">
          <RotateCw size={10} className="text-[var(--foreground)]" />
          <span>Flick or swipe card</span>
        </span>
        <span className="font-bold text-[var(--foreground)]">
          0{index + 1} / 0{total}
        </span>
      </div>
    </motion.div>
  );
}

export default function Capabilities() {
  const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  const total = CAPABILITIES.length;

  const goToCard = useCallback(
    (index: number) => {
      setDirection(index >= activeMobileIndex ? 1 : -1);
      const normalized = (index + total) % total;
      setActiveMobileIndex(normalized);
      triggerHaptic("snap");
    },
    [activeMobileIndex, total]
  );

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveMobileIndex((prev) => (prev - 1 + total) % total);
    triggerHaptic("snap");
  }, [total]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveMobileIndex((prev) => (prev + 1) % total);
    triggerHaptic("snap");
  }, [total]);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Visual card stage render helper
  const renderVisual = (type: CapabilityItem["visual"]) => {
    switch (type) {
      case "mobile":
        return (
          <div className="h-[200px] sm:h-[225px] rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden bg-[var(--background)] border border-[var(--border)]">
            <div
              aria-hidden="true"
              className="absolute w-40 h-40 rounded-full bg-[var(--foreground)]/5 blur-2xl pointer-events-none"
            />
            <div className="relative z-10 w-full max-w-[240px] space-y-2 select-none">
              <div className="mx-auto w-[82%] px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-between text-[10px] font-mono shadow-xs opacity-85">
                <div className="flex items-center gap-1.5 text-[var(--subtext)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Speed &amp; Feel</span>
                </div>
                <span className="font-bold text-[var(--foreground)]">Silky Smooth</span>
              </div>

              <div className="mx-auto w-[92%] px-3.5 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-between text-[11px] font-mono shadow-xs opacity-95">
                <div className="flex items-center gap-1.5 text-[var(--foreground)] font-medium">
                  <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                  <span>No Internet Needed</span>
                </div>
                <span className="font-bold text-[var(--foreground)]">Works Offline</span>
              </div>

              <div className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <Smartphone size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[var(--foreground)] truncate">
                      Custom Mobile Apps
                    </div>
                    <div className="text-[9px] text-[var(--subtext)] font-mono truncate">
                      iPhone &amp; Android
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                  60 FPS
                </span>
              </div>
            </div>
          </div>
        );

      case "automation":
        return (
          <div className="h-[200px] sm:h-[225px] rounded-2xl p-4 flex items-center justify-center relative overflow-hidden bg-[var(--background)] border border-[var(--border)] select-none">
            <div
              aria-hidden="true"
              className="w-36 h-36 rounded-full border border-[var(--border)] absolute animate-ping opacity-25"
            />
            <div
              aria-hidden="true"
              className="w-44 h-44 rounded-full border border-[var(--border)] absolute"
            />
            <div
              aria-hidden="true"
              className="w-28 h-28 rounded-full border border-[var(--border)] absolute"
            />

            <div
              className="absolute top-4 left-5 w-8 h-8 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-xs text-[var(--foreground)]"
              title="Excel & Spreadsheets"
            >
              <FileSpreadsheet size={15} />
            </div>
            <div
              className="absolute top-4 right-5 w-8 h-8 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-xs text-emerald-600 dark:text-emerald-400"
              title="WhatsApp Alerts"
            >
              <MessageCircle size={15} />
            </div>
            <div
              className="absolute bottom-4 left-5 w-8 h-8 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-xs text-[var(--foreground)]"
              title="Smart AI Filters"
            >
              <Sparkles size={14} />
            </div>
            <div
              className="absolute bottom-4 right-5 w-8 h-8 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-xs text-amber-500"
              title="Instant Sync"
            >
              <Zap size={14} />
            </div>

            <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center shadow-md border-2 border-[var(--foreground)]/20">
              <div className="w-12 h-12 rounded-xl border border-[var(--background)]/30 flex items-center justify-center font-mono font-black text-xs tracking-wider">
                AUTO
              </div>
            </div>

            <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm font-mono text-[10px] font-bold text-[var(--foreground)]">
              <MousePointer size={11} className="text-[var(--foreground)] fill-current" />
              <span>1-Click Sync</span>
            </div>
          </div>
        );

      case "ai":
        return (
          <div className="h-[200px] sm:h-[225px] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden bg-[var(--background)] border border-[var(--border)] select-none">
            <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--foreground)] shadow-xs leading-relaxed max-w-[92%] relative z-10">
              &quot;Can you handle incoming client inquiries and schedule intro calls?&quot;
            </div>

            <div className="ml-auto p-3 rounded-2xl bg-[var(--foreground)] text-[var(--background)] text-xs font-medium shadow-xs max-w-[90%] relative z-10 leading-snug">
              &quot;Yes! Crisp, friendly answers 24/7 so you never lose high-value prospects.&quot;
            </div>

            <div className="p-2 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-between text-[9px] font-mono text-[var(--subtext)] relative z-10">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate">Always online · Zero wait times</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Instant
              </span>
            </div>
          </div>
        );

      case "web":
        return (
          <div className="h-[200px] sm:h-[225px] rounded-2xl p-4 flex items-center justify-center relative overflow-hidden bg-[var(--background)] border border-[var(--border)] select-none">
            <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[10px] font-mono font-bold text-[var(--foreground)] shadow-xs">
              Under 1s Load
            </div>
            <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[10px] font-mono font-bold text-[var(--foreground)] shadow-xs">
              Phone Ready
            </div>
            <div className="absolute bottom-3.5 left-3.5 px-2.5 py-1 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[10px] font-mono font-bold text-[var(--foreground)] shadow-xs">
              Clean SEO
            </div>
            <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[10px] font-mono font-bold text-[var(--foreground)] shadow-xs">
              100% Reliable
            </div>

            <div className="relative z-10 w-16 h-16 rounded-2xl bg-[var(--foreground)] text-[var(--background)] flex flex-col items-center justify-center shadow-md border-2 border-[var(--foreground)]/20">
              <Globe size={20} />
              <span className="text-[8px] font-mono uppercase font-bold tracking-wider mt-0.5">
                NEXT.JS
              </span>
            </div>
          </div>
        );

      case "standards":
        return (
          <div className="h-[200px] sm:h-[225px] rounded-2xl p-3 sm:p-4 flex flex-col justify-center relative overflow-hidden bg-[var(--background)] border border-[var(--border)] select-none">
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs flex items-center gap-2">
                <Zap size={14} className="text-amber-500 shrink-0" />
                <div className="text-[11px] font-bold text-[var(--foreground)] truncate">
                  Sub-Second Speed
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <div className="text-[11px] font-bold text-[var(--foreground)] truncate">
                  Rock-Solid Build
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs flex items-center gap-2">
                <Palette size={14} className="text-teal-500 shrink-0" />
                <div className="text-[11px] font-bold text-[var(--foreground)] truncate">
                  High-End Design
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs flex items-center gap-2">
                <KeyRound size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-[11px] font-bold text-[var(--foreground)] truncate">
                  Full Ownership
                </div>
              </div>
            </div>
            <div className="mt-3 text-center font-mono text-[10px] text-[var(--subtext)]">
              No Agency Overhead · Zero Lock-In · Clean Git Handover
            </div>
          </div>
        );
    }
  };

  // Stack card previews for mobile depth illusion
  const activeCap = CAPABILITIES[activeMobileIndex];
  const nextCap = CAPABILITIES[(activeMobileIndex + 1) % total];
  const secondNextCap = CAPABILITIES[(activeMobileIndex + 2) % total];

  return (
    <section
      id="capabilities"
      className="relative py-12 sm:py-16 md:py-24 px-5 sm:px-8 border-t border-[var(--border)] bg-[var(--background)] transition-colors duration-200 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* ========================================================================= */}
        {/* SECTION HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--foreground)]/5 border border-[var(--border)] text-xs font-mono font-semibold text-[var(--foreground)] mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] animate-pulse" />
              <span>03 · CORE CAPABILITIES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              Clean design. Reliable software. Zero headache.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-3.5">
            <p className="text-sm sm:text-base text-[var(--subtext)] max-w-md font-normal leading-relaxed">
              Whether you need a sleek mobile app, a high-converting website, or automations that save you hours every week, I build software that just works.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. LAPTOP / DESKTOP VIEW: INTACT 3-COLUMN BENTO GRID                      */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
          {CAPABILITIES.map((cap, idx) => {
            const isWide = idx === 4;
            return (
              <div
                key={`desktop-bento-${cap.id}`}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300
                  bg-[var(--card)]
                  border border-[var(--border)]
                  shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-none
                  hover:border-[var(--foreground)]/30 hover:-translate-y-1 hover:shadow-lg
                  ${isWide ? "lg:col-span-2" : ""}
                `}
              >
                {/* Visual Stage */}
                {renderVisual(cap.visual)}

                {/* Bottom Content */}
                <div className="pt-4 px-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-semibold text-[var(--subtext)]">
                      0{idx + 1} {"//"} {cap.tag}
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--foreground)]/5 border border-[var(--border)] text-[var(--foreground)]">
                      {cap.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-[var(--subtext)] leading-relaxed mt-1.5 font-normal">
                    {cap.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 2. MOBILE / TABLET VIEW: HARDWARE-ACCELERATED 60FPS SWIPE DECK            */}
        {/* ========================================================================= */}
        <div className="block lg:hidden mb-12">
          {/* Quick Pill Selector Tabs for 1-Tap Jumping on Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-4">
            {CAPABILITIES.map((cap, idx) => {
              const isSelected = activeMobileIndex === idx;
              return (
                <button
                  key={`mobile-pill-${cap.id}`}
                  type="button"
                  onClick={() => goToCard(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-[var(--foreground)] text-[var(--background)] shadow-xs font-bold scale-[1.02]"
                      : "bg-[var(--card)] text-[var(--subtext)] border border-[var(--border)]"
                  }`}
                >
                  <span className="opacity-70 text-[10px]">0{idx + 1}</span>
                  <span>{cap.title}</span>
                </button>
              );
            })}
          </div>

          {/* 3D Stack Stage with GPU-Accelerated Gestures & Spring Physics */}
          <div className="relative w-full max-w-sm mx-auto h-[430px] flex items-center justify-center select-none overflow-visible">
            {/* Background Deck Card 2 (Bottom depth layer) */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 mx-auto w-[86%] rounded-3xl p-5 bg-[var(--card)]/60 border border-[var(--border)] pointer-events-none transition-all duration-300"
              style={{
                transform: "translateY(-24px) scale(0.88)",
                opacity: 0.45,
                zIndex: 1,
              }}
            >
              <div className="h-[200px] rounded-2xl bg-[var(--background)] border border-[var(--border)] opacity-40" />
            </div>

            {/* Background Deck Card 1 (Middle depth layer) */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 mx-auto w-[92%] rounded-3xl p-5 bg-[var(--card)]/80 border border-[var(--border)] pointer-events-none transition-all duration-300"
              style={{
                transform: "translateY(-12px) scale(0.94)",
                opacity: 0.75,
                zIndex: 2,
              }}
            >
              <div className="h-[200px] rounded-2xl bg-[var(--background)] border border-[var(--border)] opacity-60" />
            </div>

            {/* Foreground Active Swipable Card (Driven by GPU Touch Compositor) */}
            <AnimatePresence mode="popLayout" custom={direction}>
              <MobileCard
                key={`mobile-active-${activeCap.id}`}
                cap={activeCap}
                direction={direction}
                index={activeMobileIndex}
                total={total}
                onNext={handleNext}
                onPrev={handlePrev}
                renderVisual={renderVisual}
              />
            </AnimatePresence>
          </div>

          {/* Bottom Mobile Deck Controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous capability card"
              className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center text-[var(--foreground)] active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {CAPABILITIES.map((_, dotIdx) => (
                <button
                  key={`deck-dot-${dotIdx}`}
                  type="button"
                  onClick={() => goToCard(dotIdx)}
                  aria-label={`Jump to card ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeMobileIndex === dotIdx
                      ? "w-6 bg-[var(--foreground)]"
                      : "w-2 bg-[var(--border)] hover:bg-[var(--subtext)]"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next capability card"
              className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center text-[var(--foreground)] active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* "WHY CLIENTS WORK DIRECTLY WITH ME" BANNER                                */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-[var(--card)] border border-[var(--border)] shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-none">
          {/* Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--foreground)] font-bold">
              <Users size={16} />
              <span>WHY CLIENTS WORK DIRECTLY WITH ME</span>
            </div>
            <span className="font-mono text-xs text-[var(--subtext)]">
              No Agency Bloat · Direct Access · 100% Focused Sprints
            </span>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_CHOOSE_ME.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-4 sm:p-5 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-2xs space-y-2 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[var(--foreground)]/5 text-[var(--foreground)]">
                      <IconComponent size={16} />
                    </div>
                    <div className="font-bold text-sm text-[var(--foreground)] leading-tight">
                      {item.title}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--subtext)] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
