"use client";

import { useState } from "react";
import {
  FileCode2,
  FolderGit2,
  BookOpen,
  Video,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Layers,
  Copy,
  Check,
} from "lucide-react";

export default function DeliverablesStandard() {
  const [activeTab, setActiveTab] = useState<"readme" | "architecture" | "cms">("readme");
  const [copiedCode, setCopiedCode] = useState(false);

  const copySnippet = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1400);
    }
  };

  return (
    <section id="deliverables" className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-[5%] bg-[#0A0A0E] relative overflow-hidden">
      {/* Soft ambient lighting */}
      <div aria-hidden="true" className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-[var(--accent)]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Narrative Tag */}
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent)] uppercase tracking-widest mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
          <span>ACT II.5 · DELIVERABLES &amp; DOCUMENTATION</span>
        </div>

        {/* Section Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F4F4F0] leading-[1.08]">
          No black boxes.<br />
          <span className="text-outline">Full ownership. Zero lock-in.</span>
        </h2>

        {/* Honest Grounded Subtitle */}
        <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-[#A1A1AA]">
          When our engagement finishes, you don&apos;t just receive a live link—you receive a clean, production-grade codebase with full documentation so your team can maintain and extend it effortlessly.
        </p>

        {/* 4 Deliverable Pillars Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Pillar 1 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121218] border border-[#242432] flex flex-col justify-between shadow-xl hover:border-[#38384A] transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#161622] border border-[#262634] text-[var(--accent)] flex items-center justify-center mb-4">
                <Layers size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#F4F4F0]">
                Design System &amp; Figma Source
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                Complete Figma master files with auto-layout components, color tokens, responsive breakpoints, and SVG asset library.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1C1C26] font-mono text-[11px] text-[#71717A]">
              ✓ Full Figma workspace transfer
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121218] border border-[#242432] flex flex-col justify-between shadow-xl hover:border-[#38384A] transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#161622] border border-[#26262E] text-[#7CF4D4] flex items-center justify-center mb-4">
                <FolderGit2 size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#F4F4F0]">
                Production-Grade Codebase
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                Clean, scalable architecture built with modern best practices (Web &amp; Mobile), modular component patterns, and zero proprietary lock-in.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1C1C26] font-mono text-[11px] text-[#71717A]">
              ✓ Git repo transferred to your org
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121218] border border-[#242432] flex flex-col justify-between shadow-xl hover:border-[#38384A] transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#161622] border border-[#26262E] text-[#A78BFA] flex items-center justify-center mb-4">
                <BookOpen size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#F4F4F0]">
                Runbook &amp; Documentation
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                A crystal-clear README with 1-step local setup, environment variables guide, and CMS instructions for non-technical team edits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1C1C26] font-mono text-[11px] text-[#71717A]">
              ✓ Zero-guesswork runbooks
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121218] border border-[#242432] flex flex-col justify-between shadow-xl hover:border-[#38384A] transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#161622] border border-[#26262E] text-[#FF7A59] flex items-center justify-center mb-4">
                <Video size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#F4F4F0]">
                Live Launch &amp; Video Walkthrough
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                Production deployment on Edge CDN (Vercel/Cloudflare) with custom domain, SSL, plus a recorded 20-min walkthrough video.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1C1C26] font-mono text-[11px] text-[#71717A]">
              ✓ 14-day warranty included
            </div>
          </div>
        </div>

        {/* Interactive Documentation Window Mockup */}
        <div className="mt-10 sm:mt-14 rounded-2xl sm:rounded-3xl border border-[#26262E] bg-[#111117] overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 border-b border-[#20202E] bg-[#14141E] gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              <span className="font-mono text-xs text-[#A1A1AA] ml-2">handoff-package/</span>
            </div>

            {/* Document Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { key: "readme", label: "README.md", sub: "Setup Runbook" },
                { key: "architecture", label: "ARCHITECTURE.md", sub: "Data Flow" },
                { key: "cms", label: "CMS-GUIDE.md", sub: "Team Edits" },
              ].map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 ${
                      active
                        ? "bg-[#1E1E2C] text-[#F4F4F0] border border-[#3A3A4C]"
                        : "text-[#71717A] hover:text-[#A1A1AA]"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code & Content Window */}
          <div className="p-4 sm:p-7 bg-[#0B0B0F] font-mono text-xs sm:text-sm leading-relaxed text-[#D4D4D8] overflow-x-auto">
            {activeTab === "readme" && (
              <div className="space-y-4">
                <div className="text-[var(--accent)] font-bold"># Project Overview &amp; Local Setup Runbook</div>
                <p className="text-[#A1A1AA]">
                  This repository contains the complete production application. Zero hidden build steps or proprietary CLI tools.
                </p>
                <div className="bg-[#12121A] p-3.5 sm:p-4 rounded-xl border border-[#222230] space-y-1">
                  <div className="text-[#71717A]">// 1. Clone your private repository</div>
                  <div className="text-[#F4F4F0]">git clone https://github.com/your-company/project.git</div>
                  <div className="text-[#71717A] pt-2">// 2. Install dependencies</div>
                  <div className="text-[#F4F4F0]">npm install</div>
                  <div className="text-[#71717A] pt-2">// 3. Start local development server</div>
                  <div className="text-[var(--accent)]">npm run dev  <span className="text-[#71717A]">// &gt; ready on http://localhost:3000</span></div>
                </div>
                <div className="text-xs text-[#71717A] flex items-center gap-2 pt-1">
                  <CheckCircle2 size={13} className="text-[var(--accent)]" />
                  <span>Tested across Node.js v18, v20, and v22 with strict TypeScript verification.</span>
                </div>
              </div>
            )}

            {activeTab === "architecture" && (
              <div className="space-y-4">
                <div className="text-[#7CF4D4] font-bold"># Architecture Blueprint &amp; Data Flow</div>
                <p className="text-[#A1A1AA]">
                  Modular component structure organized by concerns. No monolithic 1000-line files.
                </p>
                <div className="bg-[#12121A] p-3.5 sm:p-4 rounded-xl border border-[#222230] text-xs space-y-1">
                  <div><span className="text-[#7CF4D4]">src/app/</span>             → Next.js 16 App Router (prerendered edge pages)</div>
                  <div><span className="text-[#A78BFA]">src/components/</span>      → Reusable UI primitives &amp; interactive modules</div>
                  <div><span className="text-[#F4B860]">src/lib/</span>             → Validation, database adapters &amp; utilities</div>
                  <div><span className="text-[#FF7A59]">public/</span>              → Optimized WebP media assets &amp; typography</div>
                </div>
              </div>
            )}

            {activeTab === "cms" && (
              <div className="space-y-4">
                <div className="text-[#A78BFA] font-bold"># Non-Technical Content Editing Guide</div>
                <p className="text-[#A1A1AA]">
                  How non-developers on your marketing or operations team update headlines, pricing, and case studies:
                </p>
                <div className="bg-[#12121A] p-3.5 sm:p-4 rounded-xl border border-[#222230] space-y-2 text-xs">
                  <div>1. <strong>Updating Copy &amp; Images</strong>: Open the dedicated CMS dashboard or content JSON file.</div>
                  <div>2. <strong>One-Click Publish</strong>: Edits trigger an automated preview build before going live.</div>
                  <div>3. <strong>Zero Code Knowledge Required</strong>: Your marketing team is completely autonomous.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
