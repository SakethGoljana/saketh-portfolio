"use client";

import { useState } from "react";
import { ArrowDown, Code2, Copy, Check } from "lucide-react";

const PROJECT_TYPES = ["Website", "Mobile app", "Web app", "Brand System"];

const FEATURES = [
  "Online Booking",
  "Payments / Stripe",
  "User Accounts",
  "Admin Dashboard",
  "Fluid 3D / Animations",
  "Technical SEO",
  "Headless CMS",
  "WhatsApp / Live Chat",
];

export default function ScopeEstimator() {
  const [selectedType, setSelectedType] = useState("Website");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [pickedFeatures, setPickedFeatures] = useState<string[]>([
    "Online Booking",
    "Fluid 3D / Animations",
  ]);

  const toggleFeature = (feature: string) => {
    setPickedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const count = pickedFeatures.length;
  const scope =
    count === 0 ? "lightweight" : count <= 2 ? "focused mvp" : count <= 4 ? "full product" : "enterprise scale";
  const litBars = count === 0 ? 1 : count <= 2 ? 2 : count <= 4 ? 4 : 5;

  const timeline =
    count === 0 ? "1–2 weeks" : count <= 2 ? "2–4 weeks" : count <= 4 ? "4–6 weeks" : "6–8+ weeks";

  const investmentPhilosophy = "Discuss on free call (Accessible founder rates)";

  const [copiedConfig, setCopiedConfig] = useState(false);

  const copyConfigJson = () => {
    const configData = {
      product_type: selectedType,
      capabilities: pickedFeatures,
      architecture_scope: scope,
      estimated_velocity: timeline,
      budget_model: investmentPhilosophy,
      agency_overhead: "0% (Direct design engineer collaboration)",
    };
    navigator.clipboard.writeText(JSON.stringify(configData, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 1500);
  };

  // Bridge scope to booking form
  const handleBridgeScope = () => {
    if (typeof window !== "undefined") {
      const detail = {
        type: selectedType,
        features: pickedFeatures,
        scope,
        timeline,
        investment: investmentPhilosophy,
        currency,
      };
      window.dispatchEvent(new CustomEvent("scope-selected", { detail }));
      const target = document.getElementById("contact");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="build" className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-[5%] bg-[#0B0B0F] relative overflow-hidden">
      {/* Ambient background glow */}
      <div aria-hidden="true" className="absolute top-1/3 right-1/4 w-[520px] h-[300px] bg-[var(--accent)]/[0.025] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Narrative Act Tag */}
        <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent)] uppercase tracking-widest mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
          <span>ACT IV · THE COLLABORATION</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F4F4F0] leading-[1.08]">
          Have a vision in mind?<br />
          <span className="text-outline">Let&apos;s see what it takes.</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-[#A1A1AA]">
          Every great product starts by clarifying the scope. Pick what you&apos;re building, toggle the core capabilities, and see your architectural blueprint calibrate in real time.
        </p>

        {/* Split Configurator Layout */}
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 sm:gap-6 items-start">
          {/* Left Configuration Panel */}
          <div className="flex-[1.3_1_420px] min-w-[280px] sm:min-w-[340px] bg-[#121218] border border-[#26262E] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-9 flex flex-col gap-6 sm:gap-8 shadow-2xl">
            {/* Step 1: Type Selection */}
            <div>
              <div className="font-mono text-xs text-[#A1A1AA] tracking-wider uppercase mb-3.5">
                1 · WHAT KIND OF PRODUCT ARE YOU BUILDING?
              </div>
              <div className="flex flex-wrap gap-2.5">
                {PROJECT_TYPES.map((type) => {
                  const active = selectedType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      aria-pressed={active}
                      className={`font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer min-h-[44px] ${
                        active
                          ? "bg-[var(--accent)] text-[#0B0B0F] font-bold border border-[var(--accent)] shadow-[0_0_15px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
                          : "bg-transparent text-[#F4F4F0] border border-[#34343E] hover:border-[#4B4B58]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Capabilities Selection */}
            <div>
              <div className="font-mono text-xs text-[#A1A1AA] tracking-wider uppercase mb-3.5">
                2 · WHAT KEY CAPABILITIES DOES IT REQUIRE?
              </div>
              <div className="flex flex-wrap gap-2.5">
                {FEATURES.map((feat) => {
                  const active = pickedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      aria-pressed={active}
                      className={`font-medium text-sm px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
                        active
                          ? "bg-[var(--accent)] text-[#0B0B0F] font-bold border border-[var(--accent)]"
                          : "bg-transparent text-[#F4F4F0] border border-[#34343E] hover:border-[#4B4B58]"
                      }`}
                    >
                      <span className="font-mono">{active ? "✓" : "+"}</span>
                      <span>{feat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live Architecture JSON & Meter Card */}
          <div className="flex-[1_1_320px] min-w-[280px] sm:min-w-[320px] bg-[#121218] border border-[#26262E] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Window header with Currency Toggle & Copy */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#26262E] bg-[#15151E]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block opacity-80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block opacity-80" />
                <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-[#A1A1AA] ml-1">
                  <Code2 size={13} />
                  <span>architecture.config</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy JSON Button */}
                <button
                  type="button"
                  onClick={copyConfigJson}
                  title="Copy configuration JSON"
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1B1B26] border border-[#2E2E3E] text-[10px] font-mono text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors cursor-pointer"
                >
                  {copiedConfig ? (
                    <>
                      <Check size={11} className="text-[var(--accent)]" />
                      <span className="text-[var(--accent)]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Currency Switcher */}
                <div className="flex items-center bg-[#0E0E14] border border-[#2E2E3A] rounded-full p-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`px-2 sm:px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
                      currency === "USD"
                        ? "bg-[var(--accent)] text-[#0B0B0F] font-bold"
                        : "text-[#A1A1AA] hover:text-[#F4F4F0]"
                    }`}
                  >
                    USD $
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("INR")}
                    className={`px-2 sm:px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
                      currency === "INR"
                        ? "bg-[var(--accent)] text-[#0B0B0F] font-bold"
                        : "text-[#A1A1AA] hover:text-[#F4F4F0]"
                    }`}
                  >
                    INR ₹
                  </button>
                </div>
              </div>
            </div>

            {/* Live JSON Output Screen with Line Numbers */}
            <div className="font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed p-4 sm:p-6 bg-[#0E0E14] text-[#F4F4F0] min-h-[190px] sm:min-h-[220px] flex flex-col justify-center">
              <div className="flex items-start">
                <span className="w-6 shrink-0 select-none text-[#4A4A58] text-[10px] sm:text-xs text-right pr-2">1</span>
                <div>&#123;</div>
              </div>
              <div className="flex items-start">
                <span className="w-6 shrink-0 select-none text-[#4A4A58] text-[10px] sm:text-xs text-right pr-2">2</span>
                <div className="pl-2">
                  <span className="text-[#A78BFA]">&quot;product_type&quot;</span>:{" "}
                  <span className="text-[#F4B860]">&quot;{selectedType}&quot;</span>,
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-6 shrink-0 select-none text-[#4A4A58] text-[10px] sm:text-xs text-right pr-2">3</span>
                <div className="pl-2 break-words">
                  <span className="text-[#A78BFA]">&quot;capabilities&quot;</span>: [
                  <span className="text-[#F4B860]">
                    {pickedFeatures.length === 0
                      ? ""
                      : pickedFeatures.map((f) => `"${f}"`).join(", ")}
                  </span>
                  ],
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-6 shrink-0 select-none text-[#4A4A58] text-[10px] sm:text-xs text-right pr-2">4</span>
                <div className="pl-2">
                  <span className="text-[#A78BFA]">&quot;architecture_scope&quot;</span>:{" "}
                  <span className="text-[var(--accent)] font-bold">&quot;{scope}&quot;</span>,
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-6 shrink-0 select-none text-[#4A4A58] text-[10px] sm:text-xs text-right pr-2">5</span>
                <div className="pl-2">
                  <span className="text-[#A78BFA]">&quot;estimated_velocity&quot;</span>:{" "}
                  <span className="text-[#7CF4D4]">&quot;{timeline}&quot;</span>,
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-6 shrink-0 select-none text-[#4A4A58] text-[10px] sm:text-xs text-right pr-2">6</span>
                <div className="pl-2">
                  <span className="text-[#A78BFA]">&quot;pricing_model&quot;</span>:{" "}
                  <span className="text-[#FF7A59]">&quot;Discuss on free call (Accessible rates)&quot;</span>,
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-6 shrink-0 select-none text-[#4A4A58] text-[10px] sm:text-xs text-right pr-2">7</span>
                <div className="pl-2">
                  <span className="text-[#A78BFA]">&quot;agency_markup&quot;</span>:{" "}
                  <span className="text-[#7CF4D4]">&quot;0% (Direct engineer collaboration)&quot;</span>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-6 shrink-0 select-none text-[#4A4A58] text-[10px] sm:text-xs text-right pr-2">8</span>
                <div>&#125;</div>
              </div>
            </div>

            {/* Complexity Meter & Auto-Bridge CTA */}
            <div className="p-4 sm:p-6 border-t border-[#26262E] bg-[#121218] flex flex-col gap-4 sm:gap-5">
              {/* Complexity Meter */}
              <div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-[#A1A1AA] mb-1.5 sm:mb-2">
                  <span>Scope tier</span>
                  <span className="text-[var(--accent)] uppercase font-bold">{scope}</span>
                </div>
                <div className="flex gap-1.5 sm:gap-2" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`flex-1 h-1.5 sm:h-2 rounded-full transition-colors duration-300 ${
                        i < litBars ? "bg-[var(--accent)]" : "bg-[#2A2A36]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Estimated Velocity & Pricing Readout */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#0E0E14] border border-[#242430]">
                  <div className="text-[10px] sm:text-[11px] font-mono text-[#71717A] uppercase">Est. Delivery</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F4F4F0] mt-0.5">{timeline}</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#0E0E14] border border-[#242430]">
                  <div className="text-[10px] sm:text-[11px] font-mono text-[#71717A] uppercase">Budget Model</div>
                  <div className="text-xs sm:text-sm font-bold text-[var(--accent)] mt-0.5">Free Call to Align</div>
                  <div className="text-[10px] text-[#A1A1AA] font-mono mt-0.5">Accessible & Flexible</div>
                </div>
              </div>

              {/* Action Button: Bridges directly to Act V */}
              <button
                type="button"
                onClick={handleBridgeScope}
                className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--accent)] text-[#0B0B0F] font-bold text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_24px_color-mix(in_srgb,var(--accent)_40%,transparent)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Book free call to discuss budget & scope</span>
                <ArrowDown size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
