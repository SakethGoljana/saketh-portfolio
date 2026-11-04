"use client";

import { useEffect, useState } from "react";
import { Sparkles, Layers, Palette, Rocket } from "lucide-react";

const STAGES = [
  {
    name: "Concept",
    step: "01",
    subtitle: "Distill the core proposition",
    icon: Sparkles,
    caption: "// 01 · define the mental model, user psychology & core loop",
  },
  {
    name: "Architecture",
    step: "02",
    subtitle: "Lay out wireframes & systems",
    icon: Layers,
    caption: "// 02 · establish layout hierarchy, component tokens & data flow",
  },
  {
    name: "Polish",
    step: "03",
    subtitle: "Infuse typography & micro-motion",
    icon: Palette,
    caption: "// 03 · craft visual identity, spring physics & aesthetic delight",
  },
  {
    name: "Production",
    step: "04",
    subtitle: "Deploy fast, accessible code",
    icon: Rocket,
    caption: "// 04 · zero-compromise execution, sub-second loads & live launch",
  },
];

export default function ProcessShowcase() {
  const [stage, setStage] = useState(0);
  const [manual, setManual] = useState(false);

  // Auto-cycle through the 4 stages every 3s unless manually paused
  useEffect(() => {
    let reduceMotion = false;
    try {
      reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}

    if (reduceMotion || manual) return;

    const timer = setInterval(() => {
      setStage((prev) => (prev + 1) % STAGES.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [manual]);

  const selectStage = (index: number) => {
    setStage(index);
    setManual(true);
  };

  return (
    <section id="how" className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-[5%] bg-[#0B0B0F] relative overflow-hidden">
      {/* Ambient background glow */}
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[var(--accent)]/[0.025] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Narrative Act Tag */}
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent)] uppercase tracking-widest mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
          <span>ACT II · THE CRAFT &amp; PROCESS</span>
        </div>

        {/* Section Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#F4F4F0]">
          From raw vision<br />
          <span className="text-outline">to living software.</span>
        </h2>

        {/* Narrative Subtitle */}
        <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-[#A1A1AA]">
          When design and code are created by the same mind, nothing is lost in translation.
          Here is how an idea evolves from a spark into a production-grade product.
        </p>

        {/* Interactive Showcase Card */}
        <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-[#26262E] bg-[#0E0E14] overflow-hidden shadow-2xl">
          {/* 4 Interactive Stage Pills */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[#26262E] divide-y lg:divide-y-0 lg:divide-x divide-[#26262E] bg-[#121218]">
            {STAGES.map((s, i) => {
              const active = stage === i;
              const Icon = s.icon;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => selectStage(i)}
                  className={`p-3.5 sm:p-6 text-left transition-all duration-300 cursor-pointer relative ${
                    active ? "bg-[#181822]" : "hover:bg-[#15151F]"
                  }`}
                >
                  {/* Top indicator bar */}
                  {active && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)]" />
                  )}

                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="font-mono text-[10px] sm:text-xs text-[#71717A]">
                      {s.step} / PHASE
                    </span>
                    <Icon
                      size={16}
                      className={active ? "text-[var(--accent)]" : "text-[#71717A]"}
                    />
                  </div>

                  <div className={`text-base sm:text-xl font-bold ${active ? "text-[var(--accent)]" : "text-[#F4F4F0]"}`}>
                    {s.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#A1A1AA] mt-0.5 line-clamp-1">
                    {s.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Morphing Canvas Viewport */}
          <div className="p-3 sm:p-8 md:p-14 flex justify-center bg-[radial-gradient(#22222C_1.2px,transparent_1.3px)] bg-[size:24px_24px]">
            {/* The Morphing Browser Mockup Window */}
            <div
              className={`w-full max-w-3xl bg-[#0B0B0F] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl ${
                stage === 0
                  ? "border-2 border-dashed border-[#3A3A48]"
                  : stage === 1
                  ? "border border-[#3A3A48]"
                  : stage === 2
                  ? "border border-[#26262E]"
                  : "border border-[var(--accent)] shadow-[0_0_35px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
              }`}
            >
              {/* Browser Window Bar */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#26262E] bg-[#121218]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34343E] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34343E] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34343E] inline-block" />
                <span className="ml-2.5 flex-1 min-w-0 bg-[#181822] rounded-full px-3.5 py-1 font-mono text-xs text-[#A1A1AA] truncate">
                  {stage === 3 ? "yourproject.com · live build" : "· · ·"}
                </span>
                <span
                  className={`font-mono text-[11px] font-bold tracking-wider transition-opacity duration-300 ${
                    stage === 3 ? "text-[var(--accent)] opacity-100" : "opacity-0"
                  }`}
                >
                  ● LIVE
                </span>
              </div>

              {/* Window Body: Hero Content Morphing */}
              <div className="p-4 sm:p-10 flex flex-col md:flex-row gap-5 sm:gap-8 items-stretch">
                {/* Left Column: Headlines & CTA */}
                <div className="flex-1 flex flex-col justify-between gap-4 sm:gap-5">
                  <div className="relative min-h-[75px] sm:min-h-[96px] flex flex-col justify-center">
                    {/* Skeleton State (Stage 0 & 1) */}
                    <div
                      className={`flex flex-col gap-2.5 transition-opacity duration-400 ${
                        stage < 2 ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
                      }`}
                    >
                      <div
                        className={`h-4 sm:h-5 w-[92%] rounded-md transition-all duration-400 ${
                          stage === 0
                            ? "border-2 border-dashed border-[#3A3A48] bg-transparent"
                            : "bg-[#2A2A36]"
                        }`}
                      />
                      <div
                        className={`h-4 sm:h-5 w-[65%] rounded-md transition-all duration-400 ${
                          stage === 0
                            ? "border-2 border-dashed border-[#3A3A48] bg-transparent"
                            : "bg-[#2A2A36]"
                        }`}
                      />
                    </div>

                    {/* Rendered Text State (Stage 2 & 3) */}
                    <div
                      className={`text-xl sm:text-3xl font-bold leading-tight tracking-tight transition-opacity duration-500 ${
                        stage >= 2 ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
                      }`}
                    >
                      Your brand,<br />
                      <span className="text-[var(--accent)]">unmissable.</span>
                    </div>
                  </div>

                  {/* Subtext Morph */}
                  <div className="relative min-h-[35px] sm:min-h-[40px] flex items-center">
                    <div
                      className={`h-3.5 sm:h-4 w-full rounded-md transition-opacity duration-400 ${
                        stage < 2
                          ? "opacity-100 " + (stage === 0 ? "border-2 border-dashed border-[#3A3A48] bg-transparent" : "bg-[#2A2A36]")
                          : "opacity-0 pointer-events-none absolute inset-0"
                      }`}
                    />
                    <div
                      className={`text-xs sm:text-base text-[#A1A1AA] transition-opacity duration-500 ${
                        stage >= 2 ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
                      }`}
                    >
                      A site that turns curious visitors into raving clients.
                    </div>
                  </div>

                  {/* Button Morph */}
                  <div>
                    <div
                      className={`w-fit px-5 sm:px-7 py-2.5 sm:py-3.5 font-bold text-xs sm:text-sm transition-all duration-400 ${
                        stage === 0
                          ? "border-2 border-dashed border-[#3A3A48] text-transparent rounded-lg bg-transparent"
                          : stage === 1
                          ? "bg-[#2A2A36] text-transparent rounded-lg"
                          : stage === 2
                          ? "bg-[var(--accent)] text-[#0B0B0F] rounded-full"
                          : "bg-[var(--accent)] text-[#0B0B0F] rounded-full shadow-[0_0_24px_color-mix(in_srgb,var(--accent)_40%,transparent)]"
                      }`}
                    >
                      Get started
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Graphic Block */}
                <div
                  className={`flex-1 min-h-[140px] sm:min-h-[210px] rounded-xl sm:rounded-2xl transition-all duration-500 flex flex-col items-center justify-center p-4 sm:p-6 text-center ${
                    stage === 0
                      ? "border-2 border-dashed border-[#3A3A48] bg-transparent"
                      : stage === 1
                      ? "bg-[#2A2A36]"
                      : "bg-[#A78BFA] shadow-xl text-[#0B0B0F]"
                  }`}
                >
                  {stage >= 2 && (
                    <div className="space-y-1">
                      <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/15 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                        Dynamic Visual Asset
                      </div>
                      <div className="text-[11px] sm:text-xs font-medium opacity-80 pt-0.5 sm:pt-1">
                        High-DPI 3D Render &amp; Spring Physics
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Metrics/Features Mockup */}
              <div className="px-4 sm:px-10 pb-4 sm:pb-10 flex gap-2 sm:gap-4">
                {[1, 2, 3].map((card) => (
                  <div
                    key={card}
                    className={`flex-1 h-12 sm:h-16 rounded-lg sm:rounded-xl transition-all duration-400 flex items-center justify-center ${
                      stage === 0
                        ? "border-2 border-dashed border-[#3A3A48] bg-transparent"
                        : stage === 1
                        ? "bg-[#2A2A36]"
                        : "bg-[#15151C] border border-[#26262E]"
                    }`}
                  >
                    {stage >= 2 && (
                      <span className="font-mono text-[10px] sm:text-[11px] text-[#A1A1AA]">
                        Component 0{card}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Live Stage Description */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4.5 border-t border-[#26262E] font-mono text-xs sm:text-sm text-[var(--accent)] bg-[#0A0A0E] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <span>{STAGES[stage].caption}</span>
            <span className="text-[11px] sm:text-xs text-[#71717A]">tap phases above to scrub through the process</span>
          </div>
        </div>
      </div>
    </section>
  );
}
