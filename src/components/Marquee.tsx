"use client";

const ITEMS = [
  "Mobile Applications",
  "Modern Websites",
  "UI/UX Design",
  "Product Strategy",
  "Fast Turnaround",
  "Transparent Pricing",
  "Direct Communication",
  "30-Day Launch Warranty",
];

export default function Marquee() {
  return (
    <div
      aria-label="Core services"
      className="py-4 sm:py-5 overflow-hidden select-none relative border-y border-[var(--border)] bg-[#F1F4F9] dark:bg-[var(--background)] transition-colors duration-200"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="overflow-hidden flex">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-8 sm:gap-12 pr-8 sm:pr-12 hover:[animation-play-state:paused]">
          {[...ITEMS, ...ITEMS, ...ITEMS].map((item, idx) => (
            <div key={`${item}-${idx}`} className="inline-flex items-center gap-8 sm:gap-12">
              <span className="font-mono text-xs sm:text-sm tracking-wide text-[var(--foreground)] font-semibold">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 dark:bg-zinc-600 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
