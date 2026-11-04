import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import WorkShowcase from "@/components/WorkShowcase";
import Flowchart from "@/components/Flowchart";
import Capabilities from "@/components/Capabilities";
import BookingAndBrief from "@/components/BookingAndBrief";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import FilmGrain from "@/components/FilmGrain";
import CommandPalette from "@/components/CommandPalette";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] relative selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)] transition-colors duration-200">
      {/* Dynamic Top Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Creative Interactive Ambient Background */}
      <InteractiveBackground />

      {/* Subtle Analog Film Grain Texture (Dark Mode only) */}
      <FilmGrain />

      {/* Global Spotlight Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette />

      {/* Global Navigation with Sun/Moon Dual Theme Toggle */}
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* 01. HERO (VISUAL HOOK & IPHONE AI ASSISTANT) */}
        <Hero />

        {/* 02. HIGH-ENERGY CRAFT MARQUEE (BIG & BOLD) */}
        <Marquee />

        {/* 03. SELECTED WORK (THE 2 STANDOUT REAL PROJECTS + SNAPSHOTS) */}
        <WorkShowcase />

        {/* 04. HOW I BUILD (ANIMATED VISUAL FLOWCHART) */}
        <Flowchart />

        {/* 05. CAPABILITIES & ARSENAL */}
        <Capabilities />

        {/* 06. CONTACT & HIRE (DIRECT WHATSAPP + INTRO CALL + BRIEF) */}
        <BookingAndBrief />
      </main>

      {/* Epilogue Footer */}
      <Footer />

      {/* Floating Back to Top Dial (Desktop & Tablet) */}
      <ScrollToTop />

      {/* Mobile Sticky Action Bar */}
      <MobileActionBar />
    </div>
  );
}
