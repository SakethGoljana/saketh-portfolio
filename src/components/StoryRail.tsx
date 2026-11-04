"use client";

import { useEffect, useState } from "react";

const ACTS = [
  { id: "top", label: "Act I · The Hook" },
  { id: "how", label: "Act II · The Craft" },
  { id: "deliverables", label: "Act II.5 · Deliverables" },
  { id: "work", label: "Act III · The Proof" },
  { id: "build", label: "Act IV · The Scope" },
  { id: "contact", label: "Act V · Next Chapter" },
];

export default function StoryRail() {
  const [activeAct, setActiveAct] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveAct(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    ACTS.forEach((act) => {
      const el = document.getElementById(act.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToAct = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside
      aria-label="Story chapters"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-4 py-4 px-2 rounded-full bg-[#121218]/60 backdrop-blur-md border border-[#26262E]/70 shadow-2xl"
    >
      {ACTS.map((act) => {
        const isActive = activeAct === act.id;
        return (
          <button
            key={act.id}
            type="button"
            onClick={() => scrollToAct(act.id)}
            className="group relative flex items-center justify-center p-1.5 cursor-pointer"
            aria-label={act.label}
          >
            {/* Dot */}
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-[var(--accent)] scale-125 shadow-[0_0_12px_var(--accent)]"
                  : "bg-[#34343E] hover:bg-[#A1A1AA] hover:scale-110"
              }`}
            />

            {/* Hover Tooltip Label */}
            <span className="pointer-events-none absolute right-8 whitespace-nowrap px-3 py-1 rounded-full bg-[#181822] text-[#F4F4F0] border border-[#26262E] font-mono text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 shadow-lg">
              {act.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
