"use client";

import { useState } from "react";
import Link from "next/link";

type CommandKey = "whoami" | "services" | "process" | "status" | "contact";

const COMMANDS: { key: CommandKey; label: string }[] = [
  { key: "whoami", label: "whoami" },
  { key: "services", label: "services" },
  { key: "process", label: "process" },
  { key: "status", label: "status" },
  { key: "contact", label: "contact" },
];

export default function Terminal() {
  const [activeCmd, setActiveCmd] = useState<CommandKey>("whoami");
  const [typedInput, setTypedInput] = useState("");

  const handleCommandSelect = (key: CommandKey) => {
    setActiveCmd(key);
    setTypedInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmed = typedInput.trim().toLowerCase();
      if (trimmed === "whoami") setActiveCmd("whoami");
      else if (trimmed === "services" || trimmed === "services --list") setActiveCmd("services");
      else if (trimmed === "process" || trimmed === "process --show") setActiveCmd("process");
      else if (trimmed === "status") setActiveCmd("status");
      else if (trimmed === "contact" || trimmed === "contact --open") setActiveCmd("contact");
      else if (trimmed === "clear") setActiveCmd("whoami");
      setTypedInput("");
    }
  };

  return (
    <section id="terminal" className="py-20 md:py-28 px-[5%] border-t border-[#1E1E26] bg-[#0B0B0F]">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <div className="font-mono text-xs text-[#D2FF3F] uppercase tracking-widest mb-3">
          03 / TERMINAL
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F4F4F0]">
          Ask my <span className="text-outline">terminal.</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#A1A1AA]">
          Skip the long bio. Pick a command or type below to get a straight answer.
        </p>

        {/* Terminal Container Card */}
        <div className="mt-12 rounded-2xl border border-[#26262E] bg-[#0E0E14] overflow-hidden shadow-2xl">
          {/* Clickable Quick Command Chips */}
          <div className="flex gap-2.5 p-4 sm:p-5 border-b border-[#26262E] overflow-x-auto no-scrollbar">
            {COMMANDS.map((cmd) => {
              const active = activeCmd === cmd.key;
              return (
                <button
                  key={cmd.key}
                  type="button"
                  onClick={() => handleCommandSelect(cmd.key)}
                  aria-pressed={active}
                  className={`font-mono text-sm px-5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer min-h-[44px] ${
                    active
                      ? "bg-[#D2FF3F] text-[#0B0B0F] font-bold border border-[#D2FF3F] shadow-[0_0_15px_rgba(210,255,63,0.3)]"
                      : "bg-transparent text-[#F4F4F0] border border-[#34343E] hover:border-[#4B4B58]"
                  }`}
                >
                  {cmd.label}
                </button>
              );
            })}
          </div>

          {/* Terminal CLI Window */}
          <div className="font-mono text-base leading-loose p-6 sm:p-10 bg-[#101016] min-h-[320px] flex flex-col justify-between">
            {/* Command Responses */}
            <div className="space-y-4">
              {activeCmd === "whoami" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-[#F4F4F0]">
                    <span className="text-[#D2FF3F]">$</span> whoami
                  </div>
                  <div className="text-[#A1A1AA] mt-1 space-y-1">
                    <div>name&nbsp;&nbsp;&nbsp;&nbsp;saketh</div>
                    <div>role&nbsp;&nbsp;&nbsp;&nbsp;full-stack product developer (apps · websites · web apps)</div>
                    <div>builds&nbsp;&nbsp;mobile apps (iOS &amp; Android) · SaaS web apps · modern websites</div>
                    <div>domains&nbsp;mobile development · full-stack web · UI/UX design · APIs &amp; databases</div>
                  </div>
                </div>
              )}

              {activeCmd === "services" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-[#F4F4F0]">
                    <span className="text-[#D2FF3F]">$</span> services --list
                  </div>
                  <div className="text-[#A1A1AA] mt-1 space-y-1">
                    <div>01&nbsp;&nbsp;mobile apps&nbsp;&nbsp;&nbsp;cross-platform iOS &amp; Android apps · native performance · app store ready</div>
                    <div>02&nbsp;&nbsp;web apps&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;full-stack SaaS · dashboards · API backends · database systems</div>
                    <div>03&nbsp;&nbsp;websites&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cinematic landing pages · high-converting business sites &amp; portfolios</div>
                    <div>04&nbsp;&nbsp;ui/ux design&nbsp;&nbsp;complete design systems · Figma prototypes · interaction design</div>
                  </div>
                </div>
              )}

              {activeCmd === "process" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-[#F4F4F0]">
                    <span className="text-[#D2FF3F]">$</span> process --show
                  </div>
                  <div className="text-[#A1A1AA] mt-1 space-y-1">
                    <div>brief → design wireframe → build code → launch live</div>
                    <div>you approve each milestone before the next one starts</div>
                    <div className="text-[#D2FF3F] font-bold">done. no guesswork.</div>
                  </div>
                </div>
              )}

              {activeCmd === "status" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-[#F4F4F0]">
                    <span className="text-[#D2FF3F]">$</span> status
                  </div>
                  <div className="mt-1 space-y-1">
                    <div className="text-[#D2FF3F]">● open for new projects</div>
                    <div className="text-[#A1A1AA]">timezone&nbsp;&nbsp;IST (UTC+5:30) · works with global teams</div>
                    <div className="text-[#A1A1AA]">reply via&nbsp;&nbsp;whatsapp · linkedin · booked video call</div>
                  </div>
                </div>
              )}

              {activeCmd === "contact" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-[#F4F4F0]">
                    <span className="text-[#D2FF3F]">$</span> contact --open
                  </div>
                  <div className="mt-1 space-y-1.5">
                    <div>
                      <Link href="#contact" className="text-[#D2FF3F] hover:underline">
                        → book a free call
                      </Link>
                    </div>
                    <div>
                      <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-[#F4F4F0]">
                        → whatsapp (direct message)
                      </a>
                    </div>
                    <div>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-[#F4F4F0]">
                        → linkedin (connect)
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive CLI Input Line */}
            <div className="pt-6 mt-6 border-t border-[#1C1C24] flex items-center gap-2 text-sm sm:text-base">
              <span className="text-[#D2FF3F]">$</span>
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command (e.g. whoami, services, contact, clear)..."
                className="bg-transparent border-none outline-none text-[#F4F4F0] placeholder:text-[#555562] flex-1 font-mono text-sm sm:text-base"
              />
              <span className="w-2.5 h-4 bg-[#F4F4F0] cursor-blink inline-block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
