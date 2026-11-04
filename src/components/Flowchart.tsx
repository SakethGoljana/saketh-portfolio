"use client";

import { useState, useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { triggerHaptic } from "@/utils/haptics";

interface RoadmapStep {
  number: string;
  duration: string;
  title: string;
  tagline: string;
  narrative: string;
  deliverable: string;
}

const STEPS: RoadmapStep[] = [
  {
    number: "01",
    duration: "Week 01",
    title: "The Blueprint",
    tagline: "Clarity before code",
    narrative:
      "We discuss your product vision in plain English, map out every core user flow, and lock down a fixed scope and price. You get a locked roadmap before engineering starts—zero surprise invoices.",
    deliverable: "Fixed price & locked roadmap",
  },
  {
    number: "02",
    duration: "Week 02",
    title: "Interactive Prototype",
    tagline: "Feel it on your phone",
    narrative:
      "Before writing backend code, we design every screen and send an interactive build straight to your smartphone. You hold, tap, and test the real experience on your own device first.",
    deliverable: "Clickable test build on your phone",
  },
  {
    number: "03",
    duration: "Weeks 03–04",
    title: "Craft & Build",
    tagline: "Weekly working previews",
    narrative:
      "We turn approved screens into fast, responsive software with buttery smooth animations. Every Friday, we send you a working preview build so you can watch your product come to life.",
    deliverable: "Weekly test builds & progress",
  },
  {
    number: "04",
    duration: "Launch & Beyond",
    title: "Live Launch & Warranty",
    tagline: "Complete peace of mind",
    narrative:
      "We handle the entire App Store, Google Play, and web rollout for you. After launch, we stay on for 30 days of complimentary support and fine-tuning so you launch with confidence.",
    deliverable: "Live release + 30-day warranty",
  },
];

export default function Flowchart() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToStep = (index: number) => {
    setActiveStep(index);
    triggerHaptic("tap");
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const child = container.children[index] as HTMLElement;
      if (child) {
        container.scrollTo({
          left: child.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
      }
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeStep - 1);
    scrollToStep(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(STEPS.length - 1, activeStep + 1);
    scrollToStep(nextIdx);
  };

  return (
    <section
      id="process"
      className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-8 border-t border-[var(--border)] bg-[var(--background)] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* ========================================================================= */}
        {/* EDITORIAL HEADER & NAVIGATION CONTROLS                                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] animate-pulse" />
              <span className="font-mono text-xs font-semibold tracking-widest uppercase text-[var(--subtext)]">
                02 · The Process
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] leading-[1.1]">
              Four transparent milestones. <br className="hidden sm:inline" />
              Zero guesswork.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-4">
            <p className="text-sm sm:text-base text-[var(--subtext)] max-w-sm font-normal leading-relaxed">
              A predictable horizontal journey from initial concept to your live public launch.
            </p>

            {/* Mobile / Tablet Horizontal Navigation Arrows */}
            <div className="flex items-center gap-2 lg:hidden self-start sm:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeStep === 0}
                aria-label="Previous Milestone"
                className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--foreground)]/5 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-mono text-xs font-medium text-[var(--subtext)] px-2">
                0{activeStep + 1} / 0{STEPS.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={activeStep === STEPS.length - 1}
                aria-label="Next Milestone"
                className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--foreground)]/5 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTINUOUS HORIZONTAL CONNECTOR TRACK (DESKTOP)                           */}
        {/* ========================================================================= */}
        <div className="hidden lg:block relative mb-8">
          {/* Hairline baseline connecting all 4 steps */}
          <div className="h-[1px] w-full bg-[var(--border)] relative">
            {/* Active progress segment moving across the track */}
            <div
              className="absolute top-0 left-0 h-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-500 ease-out"
              style={{
                width: `${((activeStep + 1) / STEPS.length) * 100}%`,
              }}
            />
          </div>

          {/* Connected timeline indicator dots */}
          <div className="grid grid-cols-4 pt-3">
            {STEPS.map((step, idx) => (
              <button
                key={step.number}
                type="button"
                onClick={() => scrollToStep(idx)}
                className="group/dot flex items-center gap-2 text-left cursor-pointer transition-colors"
              >
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx <= activeStep
                      ? "bg-emerald-600 dark:bg-emerald-400 scale-110"
                      : "bg-[var(--border)] group-hover/dot:bg-[var(--subtext)]"
                  }`}
                />
                <span
                  className={`font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors ${
                    idx === activeStep
                      ? "text-[var(--foreground)]"
                      : "text-[var(--subtext)] group-hover/dot:text-[var(--foreground)]"
                  }`}
                >
                  {step.duration}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HORIZONTAL MILESTONE RUNWAY (SIDE-BY-SIDE ON DESKTOP · HORIZONTAL SNAP ON MOBILE) */}
        {/* ========================================================================= */}
        <div
          ref={scrollContainerRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            const scrollLeft = el.scrollLeft;
            const itemWidth = el.scrollWidth / STEPS.length;
            const newIndex = Math.round(scrollLeft / itemWidth);
            if (newIndex !== activeStep && newIndex >= 0 && newIndex < STEPS.length) {
              setActiveStep(newIndex);
            }
          }}
          className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none gap-4 sm:gap-6 lg:gap-0 lg:border-t lg:border-[var(--border)] -mx-5 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 pb-4 lg:pb-0"
        >
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;

            return (
              <div
                key={step.number}
                onClick={() => scrollToStep(idx)}
                onMouseEnter={() => {
                  setActiveStep(idx);
                  triggerHaptic("tap");
                }}
                className={`group relative snap-center shrink-0 w-[84vw] sm:w-[360px] lg:w-auto p-6 sm:p-7 lg:py-10 lg:px-6 flex flex-col justify-between transition-all duration-300 cursor-pointer
                  lg:border-r lg:border-[var(--border)] last:lg:border-r-0
                  rounded-2xl lg:rounded-none
                  border border-[var(--border)] lg:border-y-0 lg:border-l-0
                  bg-[var(--card)]/40 lg:bg-transparent
                  ${
                    isActive
                      ? "bg-[var(--card)] lg:bg-[var(--foreground)]/[0.02]"
                      : "hover:bg-[var(--foreground)]/[0.02]"
                  }
                `}
              >
                <div>
                  {/* Big Editorial Display Number + Duration Badge */}
                  <div className="flex items-baseline justify-between mb-6">
                    <span
                      className={`font-mono text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter transition-colors duration-300 select-none ${
                        isActive
                          ? "text-[var(--foreground)]"
                          : "text-[var(--foreground)]/15 group-hover:text-[var(--foreground)]/80"
                      }`}
                    >
                      {step.number}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[var(--subtext)] px-2.5 py-1 rounded-md bg-[var(--foreground)]/5 border border-[var(--border)]">
                      {step.duration}
                    </span>
                  </div>

                  {/* Kicker & Title */}
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--subtext)] mb-1.5">
                    {step.tagline}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] mb-3 group-hover:translate-x-0.5 transition-transform">
                    {step.title}
                  </h3>

                  {/* Plain-English Story Narrative */}
                  <p className="text-sm text-[var(--subtext)] leading-relaxed font-normal">
                    {step.narrative}
                  </p>
                </div>

                {/* Milestone Deliverable Badge at the Base */}
                <div className="pt-6 mt-6 border-t border-[var(--border)]">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="line-clamp-1">{step.deliverable}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Horizontal Snap Indicator Dots */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-4 pt-2">
          {STEPS.map((step, idx) => (
            <button
              key={step.number}
              type="button"
              onClick={() => scrollToStep(idx)}
              aria-label={`Go to step ${step.number}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeStep === idx
                  ? "w-7 bg-[var(--foreground)]"
                  : "w-2 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        {/* ========================================================================= */}
        {/* REASSURING BOTTOM ASSURANCE (EDITORIAL FOOTER WITHOUT HEAVY CARDS)         */}
        {/* ========================================================================= */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 max-w-xl">
            <div className="w-9 h-9 rounded-full bg-[var(--foreground)]/5 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Calendar size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--foreground)]">
                Have a project or custom timeline in mind?
              </div>
              <div className="text-xs text-[var(--subtext)] mt-0.5 font-normal">
                Let&apos;s talk through it on a free 30-minute intro call. Zero pushy sales talk.
              </div>
            </div>
          </div>

          <Link
            href="#contact"
            onClick={() => triggerHaptic("snap")}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[var(--foreground)] hover:opacity-90 text-[var(--background)] font-semibold font-mono text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 min-h-[42px]"
          >
            <span>Book a free intro call</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
