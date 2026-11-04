"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Search, 
  Sun, 
  Moon, 
  MessageCircle, 
  ArrowUpRight, 
  Home as HomeIcon, 
  Briefcase, 
  GitMerge, 
  Cpu, 
  Mail,
  MessageSquarePlus 
} from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

export default function Navbar() {
  const [istTime, setIstTime] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let rafId: number;
    const updateNavigation = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);

      // If user recently clicked a nav link, respect manual target rather than jittery mid-scroll updates
      if (isClickScrollingRef.current) return;

      const windowH = window.innerHeight;
      const scrollH = document.documentElement.scrollHeight;

      // Bottom of page: activate contact
      if (windowH + y >= scrollH - 80) {
        setActiveSection("contact");
        return;
      }

      // Exact viewport center trigger line for high-speed scrolling accuracy
      // This guarantees the active pill accurately reflects what is in the user's primary line of sight
      const viewportMidY = y + windowH * 0.45;
      const sections = ["contact", "capabilities", "process", "work"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const sectionTop = rect.top + y;
          const sectionBottom = sectionTop + rect.height;
          if (viewportMidY >= sectionTop && viewportMidY < sectionBottom) {
            setActiveSection(id);
            return;
          }
        }
      }

      if (y < 120) {
        setActiveSection("top");
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateNavigation);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateNavigation();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Close mobile drawer on Escape key or outside interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("portfolio-theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
        document.documentElement.classList.toggle("light", savedTheme === "light");
      } else {
        const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        const initial = prefersLight ? "light" : "dark";
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
        document.documentElement.classList.toggle("dark", initial === "dark");
        document.documentElement.classList.toggle("light", initial === "light");
      }
    } catch {
      // Fallback
    }

    const updateTime = () => {
      try {
        const timeString = new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        });
        setIstTime(timeString);
      } catch {
        setIstTime("11:30");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleThemeChange = (e: Event) => {
      const custom = e as CustomEvent<{ theme: "dark" | "light" }>;
      if (custom.detail?.theme) {
        setTheme(custom.detail.theme);
      }
    };

    window.addEventListener("theme-changed", handleThemeChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener("theme-changed", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    triggerHaptic("toggle");
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.classList.toggle("light", nextTheme === "light");
      window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: nextTheme } }));
    } catch {}
  };

  const triggerPalette = () => {
    triggerHaptic("snap");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-palette"));
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    triggerHaptic("tap");
    const id = href.replace("#", "");
    setActiveSection(id);

    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 700);

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const navOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  const navLinks = [
    { name: "Selected Work", href: "#work" },
    { name: "Workflow", href: "#process" },
    { name: "Capabilities", href: "#capabilities" },
    { name: "Contact", href: "#contact" },
  ];

  const mobileNavItems = [
    { id: "top", label: "Home", href: "#top", icon: HomeIcon },
    { id: "work", label: "Work", href: "#work", icon: Briefcase },
    { id: "process", label: "Workflow", href: "#process", icon: GitMerge },
    { id: "capabilities", label: "Stack", href: "#capabilities", icon: Cpu },
    { id: "contact", label: "Contact", href: "#contact", icon: Mail },
  ];

  return (
    <>
      {/* ======================================================== */}
      {/* 1. DESKTOP / TABLET HEADER (Hidden on mobile < md)       */}
      {/* ======================================================== */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 flex-col items-center pointer-events-none w-full transition-[padding] duration-500 ease-out px-4 pt-0">
        <nav
          aria-label="Desktop Navigation"
          className={`pointer-events-auto w-full transition-all duration-500 cubic-bezier(0.16,1,0.3,1) flex items-center justify-between ${
            isScrolled
              ? "max-w-5xl mt-3 sm:mt-4 rounded-full py-2 sm:py-2.5 px-6 bg-white/75 dark:bg-[#0B1120]/75 backdrop-blur-2xl border border-white/60 dark:border-white/12 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_4px_12px_rgba(79,70,229,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8),0_0_24px_rgba(99,102,241,0.12),inset_0_1px_1px_rgba(255,255,255,0.15)]"
              : "max-w-full mt-0 rounded-none py-4 px-8 bg-white/40 dark:bg-[#0B1120]/40 backdrop-blur-xl border-b border-slate-900/5 dark:border-white/8 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
          }`}
        >
          {/* Brand Logo */}
          <a
            href="#top"
            onClick={(e) => scrollToSection(e, "#top")}
            className="font-mono text-[16px] font-bold tracking-tight text-[var(--foreground)] hover:opacity-85 transition-opacity flex items-center gap-1 shrink-0 py-1"
          >
            <span>saketh</span>
            <span className="text-emerald-600 dark:text-emerald-400 cursor-blink font-bold">_</span>
          </a>

          {/* Desktop Navigation Links with Shared Framer Motion Sliding Pill */}
          <div
            className="flex items-center gap-1 text-[13px] font-medium text-[var(--subtext)] relative"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const linkId = link.href.replace("#", "");
              const isMatch = activeSection === linkId;
              const isHovered = hoveredLink === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 ${
                    isMatch
                      ? "text-emerald-600 dark:text-white font-semibold"
                      : isHovered
                      ? "text-[var(--foreground)]"
                      : "text-[var(--subtext)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {isMatch && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-emerald-50 dark:bg-white/10 border border-emerald-200/80 dark:border-white/15 -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  {isHovered && !isMatch && (
                    <motion.span
                      layoutId="navbar-hover-pill"
                      className="absolute inset-0 rounded-full bg-slate-100 dark:bg-white/5 -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* Right Desktop Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={triggerPalette}
              title="Open Command Palette (⌘K / Ctrl+K)"
              aria-label="Open Command Palette"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-400/50 dark:hover:border-emerald-400/50 text-[var(--subtext)] hover:text-[var(--foreground)] text-xs font-mono transition-all cursor-pointer shadow-2xs active:scale-95 group"
            >
              <Search size={12} className="text-[var(--subtext)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              <span className="text-[11px] font-medium tracking-tight">⌘K</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark and Light Mode"
              className="flex items-center justify-center px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 text-[var(--foreground)] text-xs font-medium transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
            >
              {theme === "dark" ? (
                <>
                  <Moon size={14} className="text-amber-300" />
                  <span className="font-mono text-[11px] text-[var(--subtext)] ml-1.5">Dark</span>
                </>
              ) : (
                <>
                  <Sun size={14} className="text-amber-600" />
                  <span className="font-mono text-[11px] text-[var(--subtext)] font-semibold ml-1.5">Light</span>
                </>
              )}
            </button>

            <div className="hidden lg:inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--subtext)] px-1">
              <span className="w-2 h-2 rounded-full pulse-dot inline-block bg-emerald-500" />
              <span>{istTime || "11:30"} IST</span>
            </div>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs tracking-tight transition-all duration-150 hover:shadow-md hover:shadow-emerald-500/20 active:scale-95 shadow-xs"
            >
              Start a project
            </a>
          </div>
        </nav>
      </header>

      {/* ======================================================== */}
      {/* 2. MINIMAL TOP BRAND & QUICK CONTROLS BAR (Mobile Only)   */}
      {/* ======================================================== */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] pointer-events-auto">
        <a
          href="#top"
          onClick={(e) => scrollToSection(e, "#top")}
          className="font-mono text-[15px] font-bold tracking-tight text-[var(--foreground)] flex items-center gap-1"
        >
          <span>saketh</span>
          <span className="text-emerald-600 dark:text-emerald-400 cursor-blink font-bold">_</span>
        </a>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-8 h-8 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-[var(--foreground)] active:scale-95"
          >
            {theme === "dark" ? <Moon size={13} className="text-amber-300" /> : <Sun size={13} className="text-amber-600" />}
          </button>
          <button
            type="button"
            onClick={triggerPalette}
            aria-label="Open Command Palette"
            className="w-8 h-8 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-[var(--subtext)] hover:text-[var(--foreground)] active:scale-95"
          >
            <Search size={13} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-feedback"));
              }
            }}
            aria-label="Leave Feedback"
            title="Leave Feedback"
            className="w-8 h-8 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 active:scale-95 cursor-pointer"
          >
            <MessageSquarePlus size={13} />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. DYNAMIC MORPHING ISLAND FLOATING DOCK (Mobile Only)   */}
      {/* Apple-grade Physics: Shared layoutId Sliding Pill          */}
      {/* ======================================================== */}
      <aside
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 pb-[env(safe-area-inset-bottom)]"
      >
        <div 
          className="pointer-events-auto p-1.5 rounded-full bg-[#E2E4E9]/90 dark:bg-[#1A1F2C]/90 backdrop-blur-2xl border border-white/70 dark:border-white/10 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.22),0_0_1px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.75)] dark:shadow-[0_20px_40px_-6px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center gap-1.5"
        >
          {mobileNavItems.map((item) => {
            const isMatch = activeSection === item.id || (item.id === "top" && (!activeSection || activeSection === "top"));
            const Icon = item.icon;

            return (
              <a
                key={item.id}
                href={item.href}
                aria-label={item.label}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`relative flex items-center justify-center rounded-full select-none cursor-pointer touch-manipulation h-10 transition-[padding,width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMatch ? "px-3.5" : "w-10"
                }`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* Physical Sliding Active Pill via Framer Motion Shared layoutId */}
                {isMatch ? (
                  <motion.div
                    layoutId="mobile-active-floating-dock-pill"
                    className="absolute inset-0 rounded-full bg-emerald-600 shadow-[0_4px_16px_rgba(16,185,129,0.42),inset_0_1px_1px_rgba(255,255,255,0.35)]"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 28,
                      mass: 0.8,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 rounded-full bg-white/95 dark:bg-[#282D3A]/90 shadow-[0_2px_6px_rgba(0,0,0,0.06)]" />
                )}

                {/* Content Layer */}
                <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                  <Icon
                    size={17}
                    strokeWidth={isMatch ? 2.4 : 2}
                    className={`transition-colors duration-200 ${
                      isMatch ? "text-white" : "text-slate-700 dark:text-slate-200"
                    }`}
                  />
                  {/* Smooth Label Reveal with Spring-Fed Width & Crossfade */}
                  <AnimatePresence mode="wait">
                    {isMatch && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{
                          width: { type: "spring", stiffness: 350, damping: 28 },
                          opacity: { duration: 0.18, ease: "easeOut" },
                        }}
                        className="text-xs font-semibold tracking-tight text-white whitespace-nowrap overflow-hidden inline-block"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </a>
            );
          })}
        </div>
      </aside>
    </>
  );
}
