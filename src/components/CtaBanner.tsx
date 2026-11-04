import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-16 md:py-24 px-[5%] bg-[#0B0B0F] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Neon High-Impact Action Card */}
        <div className="relative overflow-hidden bg-[#D2FF3F] text-[#0B0B0F] rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 md:p-20 shadow-2xl">
          {/* Decorative geometric background rings */}
          <div
            aria-hidden="true"
            className="absolute -right-28 -bottom-36 w-[420px] h-[420px] rounded-full border-2 border-[#0B0B0F]/20 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -right-8 -bottom-16 w-[240px] h-[240px] rounded-full border-2 border-[#0B0B0F]/20 pointer-events-none"
          />

          <div className="relative z-10 flex flex-col gap-6 sm:gap-8 max-w-4xl">
            <h2 className="text-[clamp(40px,7.5vw,115px)] font-bold tracking-[-0.045em] leading-[0.95]">
              Let&apos;s make something unforgettable.
            </h2>
            <p className="text-[clamp(17px,2vw,22px)] leading-relaxed max-w-lg text-[#0B0B0F]/85 font-medium">
              Pick whatever is easiest: a booked call, a quick brief, or a direct message.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
              <Link
                href="#contact"
                className="px-8 py-4 rounded-full bg-[#0B0B0F] text-[#F4F4F0] font-bold text-[17px] tracking-tight transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
              >
                Book a call
              </Link>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full border-2 border-[#0B0B0F] text-[#0B0B0F] font-bold text-[17px] tracking-tight transition-all duration-200 hover:bg-[#0B0B0F] hover:text-[#D2FF3F]"
              >
                WhatsApp
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full border-2 border-[#0B0B0F] text-[#0B0B0F] font-bold text-[17px] tracking-tight transition-all duration-200 hover:bg-[#0B0B0F] hover:text-[#D2FF3F]"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Large Watermark Name */}
        <div className="pt-16 sm:pt-24 select-none pointer-events-none overflow-hidden">
          <div className="text-outline text-[clamp(64px,20vw,320px)] font-bold tracking-[-0.05em] leading-[0.85] uppercase opacity-70 whitespace-nowrap">
            SAKETH
          </div>
        </div>
      </div>
    </section>
  );
}
