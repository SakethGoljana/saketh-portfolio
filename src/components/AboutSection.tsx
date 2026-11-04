"use client";

import { useEffect, useState } from "react";

export default function AboutSection() {
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    try {
      const timeString = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
      setIstTime(timeString);
    } catch {
      setIstTime("10:55");
    }
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 px-[5%] border-t border-[#1E1E26] bg-[#0B0B0F]">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <div className="font-mono text-xs text-[#D2FF3F] uppercase tracking-widest mb-3">
          06 / ABOUT
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F4F4F0]">
          Small studio.<br />
          <span className="text-outline">Big attention.</span>
        </h2>

        {/* 2-Card Layout */}
        <div className="mt-12 flex flex-wrap gap-5">
          {/* Card 1: STATUS.BOARD */}
          <div className="flex-1 min-w-[280px] sm:min-w-[340px] bg-[#121218] border border-[#26262E] rounded-3xl overflow-hidden shadow-xl">
            <div className="font-mono text-xs text-[#A1A1AA] tracking-wider px-6 py-4 border-b border-[#26262E] bg-[#15151E]">
              STATUS.BOARD
            </div>
            <div className="font-mono text-sm sm:text-base px-6 py-3 divide-y divide-[#1E1E28]">
              <div className="flex items-center justify-between py-4">
                <span className="text-[#A1A1AA]">status</span>
                <span className="text-[#D2FF3F] font-bold">● open for projects</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[#A1A1AA]">local time</span>
                <span className="text-[#F4F4F0]">{istTime || "10:55"} IST</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[#A1A1AA]">reply via</span>
                <span className="text-[#F4F4F0]">WhatsApp · LinkedIn</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[#A1A1AA]">intro call</span>
                <span className="text-[#F4F4F0]">30 min · free</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-[#A1A1AA]">next free slot</span>
                <span className="text-[#D2FF3F]">Available this week</span>
              </div>
            </div>
          </div>

          {/* Card 2: README.MD */}
          <div className="flex-[1.2_1_340px] min-w-[280px] sm:min-w-[340px] bg-[#121218] border border-[#26262E] rounded-3xl overflow-hidden shadow-xl flex flex-col">
            <div className="font-mono text-xs text-[#A1A1AA] tracking-wider px-6 py-4 border-b border-[#26262E] bg-[#15151E]">
              README.MD
            </div>
            <div className="font-mono text-sm sm:text-base leading-loose p-6 sm:p-7 bg-[#0E0E14] flex-1 text-[#F4F4F0] space-y-2">
              <div className="text-[#D2FF3F] font-bold text-lg mb-3"># how I work</div>
              <div className="text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors">- one point of contact, no middlemen or account managers</div>
              <div className="text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors">- clear scope & deliverables agreed before any code starts</div>
              <div className="text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors">- regular asynchronous video demos and progress updates</div>
              <div className="text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors">- you approve each milestone before moving to the next</div>
              <div className="text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors">- 100% intellectual property ownership: you own all code and design files</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
