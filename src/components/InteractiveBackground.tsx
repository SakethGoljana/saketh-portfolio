"use client";

import { useEffect, useState } from "react";

export default function InteractiveBackground() {
  const [accentRgb, setAccentRgb] = useState<string>("16, 185, 129");

  const hexToRgb = (color: string): string => {
    if (!color) return "16, 185, 129";
    const clean = color.trim().toLowerCase();
    if (clean.startsWith("#")) {
      let hex = clean.substring(1);
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      if (hex.length === 6) {
        const num = parseInt(hex, 16);
        return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
      }
    }
    return "16, 185, 129";
  };

  useEffect(() => {
    const handleThemeOrAccent = () => {
      if (typeof window !== "undefined") {
        const computed = getComputedStyle(document.documentElement).getPropertyValue("--accent");
        if (computed) setAccentRgb(hexToRgb(computed));
      }
    };

    const animFrame = requestAnimationFrame(handleThemeOrAccent);

    window.addEventListener("theme-changed", handleThemeOrAccent);
    window.addEventListener("accent-changed", handleThemeOrAccent);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("theme-changed", handleThemeOrAccent);
      window.removeEventListener("accent-changed", handleThemeOrAccent);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--background)] transition-colors duration-200"
    >
      {/* Soft Atmospheric Depth Blobs */}
      <div
        className="absolute -top-[20%] -right-[10%] w-[750px] h-[750px] rounded-full blur-[170px] opacity-[0.06] dark:opacity-20 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${accentRgb}, 0.28) 0%, transparent 65%)`,
        }}
      />
      <div
        className="absolute top-[38%] -left-[12%] w-[620px] h-[620px] rounded-full blur-[160px] opacity-[0.06] dark:opacity-15 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 65%)`,
        }}
      />
      <div
        className="absolute -bottom-[20%] right-[15%] w-[680px] h-[680px] rounded-full blur-[180px] opacity-[0.05] dark:opacity-15 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${accentRgb}, 0.2) 0%, transparent 70%)`,
        }}
      />

      {/* Subtle Micro-Dot Matrix Canvas */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.16] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--dot-color) 1.2px, transparent 1.2px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
