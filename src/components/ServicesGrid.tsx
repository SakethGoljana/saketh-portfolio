import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    number: "01",
    title: "Design",
    description:
      "UI/UX for web and mobile, brand identity, social visuals and design systems that stay consistent as you grow.",
  },
  {
    number: "02",
    title: "Websites",
    description:
      "Fast, responsive business sites, landing pages and portfolios. Designed and coded by the same person, so nothing is lost in handoff.",
  },
  {
    number: "03",
    title: "Apps",
    description:
      "Mobile and web apps, MVPs, dashboards and internal tools: planned, designed and built end to end.",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="pt-20 md:pt-32 pb-0 bg-[#0B0B0F]">
      {/* Section Header */}
      <div className="px-[5%] max-w-6xl mx-auto mb-12 sm:mb-16">
        <div className="font-mono text-xs text-[#D2FF3F] uppercase tracking-widest mb-3">
          02 / SERVICES
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F4F4F0]">
          What I can <span className="text-outline">make for you.</span>
        </h2>
      </div>

      {/* Services List Rows */}
      <div className="flex flex-col">
        {SERVICES.map((svc, index) => (
          <Link
            key={svc.number}
            href="#contact"
            className={`group flex flex-wrap gap-4 sm:gap-10 md:gap-12 items-center justify-between px-[5%] py-10 sm:py-14 md:py-16 border-t border-[#26262E] hover:bg-[#121218] transition-colors duration-300 cursor-pointer ${
              index === SERVICES.length - 1 ? "border-b border-[#26262E]" : ""
            }`}
          >
            {/* Number */}
            <span className="font-mono text-base text-[#71717A] group-hover:text-[#D2FF3F] transition-colors duration-300 w-10 flex-shrink-0">
              {svc.number}
            </span>

            {/* Huge Display Service Title */}
            <span className="text-[clamp(44px,7.5vw,110px)] font-bold tracking-[-0.045em] leading-none text-[#F4F4F0] group-hover:text-[#D2FF3F] transition-colors duration-300 flex-1 min-w-[260px]">
              {svc.title}
            </span>

            {/* Description */}
            <span className="max-w-md text-base sm:text-lg text-[#A1A1AA] leading-relaxed flex-1 min-w-[260px] group-hover:text-[#F4F4F0] transition-colors duration-300">
              {svc.description}
            </span>

            {/* Animated Hover Arrow */}
            <div className="hidden lg:flex items-center justify-center w-14 h-14 rounded-full border border-[#26262E] group-hover:border-[#D2FF3F] group-hover:bg-[#D2FF3F] text-[#A1A1AA] group-hover:text-[#0B0B0F] transition-all duration-300 transform group-hover:translate-x-2">
              <ArrowRight size={24} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
