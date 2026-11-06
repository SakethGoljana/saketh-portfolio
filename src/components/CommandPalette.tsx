"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  ArrowRight,
  Palette,
  Sparkles,
  Layers,
  Briefcase,
  Sliders,
  Calendar,
  BookOpen,
  Copy,
  MessageCircle,
  X,
  Check,
  Smartphone,
  Download,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

interface PaletteCommand {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Theme" | "Action";
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  action: () => void;
  badge?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Navigation" | "Theme" | "Action">("All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K and open-palette event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen((prev) => !prev);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-palette", handleCustomOpen);
    };
  }, []);

  const setThemeMode = (mode: "dark" | "light") => {
    try {
      localStorage.setItem("portfolio-theme", mode);
      document.documentElement.setAttribute("data-theme", mode);
      document.documentElement.classList.toggle("dark", mode === "dark");
      document.documentElement.classList.toggle("light", mode === "light");
      window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: mode } }));
    } catch {}
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const copyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("hello@sakethgoljana.tech");
    }
    setCopiedNotice(true);
    setTimeout(() => {
      setCopiedNotice(false);
      setIsOpen(false);
    }, 1200);
  };

  const commands: PaletteCommand[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-hero",
        title: "Introduction & Hero",
        subtitle: "Product developer & design engineer overview",
        category: "Navigation",
        icon: Sparkles,
        action: () => scrollTo("top"),
      },
      {
        id: "nav-work",
        title: "Selected Work (The 2 Projects)",
        subtitle: "Dispatch Mobile App & Portfolio System",
        category: "Navigation",
        icon: Briefcase,
        action: () => scrollTo("work"),
      },
      {
        id: "nav-process",
        title: "Workflow Roadmap (Flowchart)",
        subtitle: "How ideas transform into production code",
        category: "Navigation",
        icon: Sparkles,
        action: () => scrollTo("process"),
      },
      {
        id: "nav-capabilities",
        title: "Capabilities & Tech Stack",
        subtitle: "Mobile (React Native), Web (Next.js), AI & Automation",
        category: "Navigation",
        icon: Layers,
        action: () => scrollTo("capabilities"),
      },
      {
        id: "nav-contact",
        title: "Contact & Reach Out",
        subtitle: "WhatsApp, direct phone call, or brief message",
        category: "Navigation",
        icon: Calendar,
        action: () => scrollTo("contact"),
      },

      // Theme
      {
        id: "theme-dark",
        title: "Switch to Dark Mode",
        subtitle: "Deep obsidian slate with high-contrast typography",
        category: "Theme",
        icon: Moon,
        badge: "Dark",
        action: () => {
          setThemeMode("dark");
          setIsOpen(false);
        },
      },
      {
        id: "theme-light",
        title: "Switch to Light Mode",
        subtitle: "Editorial paper white with deep graphite text",
        category: "Theme",
        icon: Sun,
        badge: "Light",
        action: () => {
          setThemeMode("light");
          setIsOpen(false);
        },
      },

      // Actions
      {
        id: "action-dispatch-apk",
        title: "Download Dispatch APK v1.0.0 (Android)",
        subtitle: "Standalone mobile app · React Native 0.88 & Expo SDK 58",
        category: "Action",
        icon: Smartphone,
        action: () => {
          window.open(
            "https://github.com/SakethGoljana/Dispatch/releases/latest/download/dispatch-v1.0.0.apk",
            "_blank",
            "noopener,noreferrer"
          );
          setIsOpen(false);
        },
      },
      {
        id: "action-dispatch-github",
        title: "View Dispatch GitHub Repository",
        subtitle: "https://github.com/SakethGoljana/Dispatch",
        category: "Action",
        icon: GithubIcon,
        action: () => {
          window.open("https://github.com/SakethGoljana/Dispatch", "_blank", "noopener,noreferrer");
          setIsOpen(false);
        },
      },
      {
        id: "action-github-profile",
        title: "Saketh's GitHub Profile",
        subtitle: "https://github.com/SakethGoljana",
        category: "Action",
        icon: GithubIcon,
        action: () => {
          window.open("https://github.com/SakethGoljana", "_blank", "noopener,noreferrer");
          setIsOpen(false);
        },
      },
      {
        id: "action-linkedin-profile",
        title: "Connect on LinkedIn",
        subtitle: "https://www.linkedin.com/in/saketh-goljana/",
        category: "Action",
        icon: LinkedinIcon,
        action: () => {
          window.open("https://www.linkedin.com/in/saketh-goljana/", "_blank", "noopener,noreferrer");
          setIsOpen(false);
        },
      },
      {
        id: "action-chat-ai",
        title: "Open Portfolio AI Assistant",
        subtitle: "Sub-10ms interactive assistant on iPhone mockup",
        category: "Action",
        icon: MessageCircle,
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent("open-ai-chat"));
        },
      },
      {
        id: "action-whatsapp",
        title: "Direct WhatsApp Message (+91 90594 78739)",
        subtitle: "Instant chat & rapid response with Saketh",
        category: "Action",
        icon: MessageCircle,
        action: () => {
          window.open("https://wa.me/919059478739", "_blank", "noopener,noreferrer");
          setIsOpen(false);
        },
      },
      {
        id: "action-email",
        title: "Copy Email: hello@sakethgoljana.tech",
        subtitle: "Direct custom inbox reachout",
        category: "Action",
        icon: Copy,
        action: copyEmail,
      },
      {
        id: "action-feedback",
        title: "Share Feedback, Ideas or Bug Reports",
        subtitle: "Quick micro-feedback directly to Saketh",
        category: "Action",
        icon: Sparkles,
        badge: "Press F",
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent("open-feedback"));
        },
      },
    ],
    [router]
  );

  const filteredCommands = useMemo(() => {
    let list = commands;
    if (activeCategory !== "All") {
      list = list.filter((c) => c.category === activeCategory);
    }
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q))
    );
  }, [commands, query, activeCategory]);

  // Reset selection when query or category changes
  const [prevFilter, setPrevFilter] = useState({ query, activeCategory });
  if (prevFilter.query !== query || prevFilter.activeCategory !== activeCategory) {
    setPrevFilter({ query, activeCategory });
    setSelectedIndex(0);
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="command-palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-24 px-4 bg-black/60 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            key="command-palette-content"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[0_20px_70px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[82vh] text-[var(--foreground)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
              <Search size={18} className="text-[var(--subtext)] shrink-0" />
              <input
                type="text"
                aria-label="Search commands"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a command, navigate, or switch theme..."
                className="w-full bg-transparent text-base sm:text-sm text-[var(--foreground)] placeholder-[var(--subtext)] focus:outline-none font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-[var(--subtext)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--border)] bg-[var(--muted)]/50 overflow-x-auto no-scrollbar">
              {(["All", "Navigation", "Theme", "Action"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-emerald-600 text-white font-semibold shadow-xs"
                      : "text-[var(--subtext)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Command List Results */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[50vh]">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-[var(--subtext)]">
                  No matching commands found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = selectedIndex === idx;
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      type="button"
                      onClick={() => cmd.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500/10 text-[var(--foreground)] border border-emerald-500/30"
                          : "text-[var(--foreground)] hover:bg-[var(--muted)] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                              : "bg-[var(--muted)] text-[var(--subtext)]"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-[13px] font-medium truncate flex items-center gap-2">
                            <span>{cmd.title}</span>
                            {cmd.badge && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-[var(--muted)] text-[var(--subtext)]">
                                {cmd.badge}
                              </span>
                            )}
                          </div>
                          {cmd.subtitle && (
                            <div className="text-[11px] text-[var(--subtext)] font-mono truncate">
                              {cmd.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight
                        size={14}
                        className={`shrink-0 transition-opacity ${
                          isSelected ? "opacity-100 text-[var(--accent)]" : "opacity-0"
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hint Bar */}
            <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--muted)]/40 flex items-center justify-between text-[11px] font-mono text-[var(--subtext)]">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              {copiedNotice && (
                <span className="text-[var(--accent)] font-semibold flex items-center gap-1">
                  <Check size={12} /> Email copied to clipboard!
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
