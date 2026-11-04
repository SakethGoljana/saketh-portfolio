"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  RotateCcw,
  Wifi,
  Battery,
  PhoneCall,
  Clock,
  Layers,
  ArrowDown,
  ArrowUpRight,
  Smartphone,
  Download,
  X,
  Flame,
  Laugh,
} from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  time?: string;
  hasContactAction?: boolean;
  hasApkAction?: boolean;
}

const QUICK_SHORTCUTS = [
  { label: "Turnaround times", icon: Clock, text: "What is your turnaround time for building an app?" },
  { label: "Fixed pricing", icon: Layers, text: "How does Saketh's pricing work?" },
  { label: "Dispatch App", icon: Smartphone, text: "Tell me about his mobile app Dispatch." },
  { label: "Tell me a joke", icon: Laugh, text: "Write me a joke." },
];

export default function IPhoneAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Ask me anything about Saketh's work. Yes, I know his turnaround times, and no, he won't build your app for equity.",
      time: "9:41 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rotation, setRotation] = useState({ x: 2, y: -3 });
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopChatScrollRef = useRef<HTMLDivElement>(null);
  const mobileChatScrollRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Listen for mobile floating action bar trigger
  useEffect(() => {
    const handleOpenChat = () => setMobileModalOpen(true);
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  // Auto-scroll chat internally to latest message ONLY after user interaction
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const scrollToBottom = (el: HTMLDivElement | null) => {
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    };
    scrollToBottom(desktopChatScrollRef.current);
    scrollToBottom(mobileChatScrollRef.current);
  }, [messages, isLoading, mobileModalOpen]);

  // Smooth scroll down to #contact section
  const scrollToContact = (closeMobile = false) => {
    if (closeMobile) {
      setMobileModalOpen(false);
    }
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Subtle 3D mouse parallax on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({
      x: -(y / (rect.height / 2)) * 5,
      y: (x / (rect.width / 2)) * 7,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 1.5, y: -2.5 });
  };

  const playHapticSound = (type: "send" | "receive") => {
    triggerHaptic(type === "send" ? "snap" : "success");
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;
    triggerHaptic("snap");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      time: "Now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const reply =
        data?.reply ||
        "I'm Snark. Ping Saketh on WhatsApp at +91 93902 46687 to chat about projects!";

      const hasContact =
        data?.hasContactAction ||
        reply.toLowerCase().includes("whatsapp") ||
        reply.toLowerCase().includes("call") ||
        reply.toLowerCase().includes("contact") ||
        text.toLowerCase().includes("hire") ||
        text.toLowerCase().includes("call");

      const hasApk =
        data?.hasApkAction ||
        reply.toLowerCase().includes("dispatch") ||
        reply.toLowerCase().includes("apk") ||
        text.toLowerCase().includes("dispatch") ||
        text.toLowerCase().includes("apk");

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: reply,
          time: "Now",
          hasContactAction: hasContact,
          hasApkAction: hasApk,
        },
      ]);
      playHapticSound("receive");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: "My circuits took a quick break. Ping Saketh directly on WhatsApp at +91 93902 46687!",
          time: "Now",
          hasContactAction: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "Ask me anything about Saketh's work. Yes, I know his turnaround times, and no, he won't build your app for equity.",
        time: "9:41 AM",
      },
    ]);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW: AUTHENTIC APPLE TITANIUM IPHONE FLAGSHIP                 */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden lg:flex flex-col items-center justify-center relative w-[285px] xl:w-[298px] select-none mx-auto"
        style={{ perspective: "1000px" }}
        aria-label="Interactive Snark Bot"
      >
        {/* Soft spatial contact shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-4 bottom-2 h-16 rounded-[40px] bg-black/15 dark:bg-black/60 blur-[30px] pointer-events-none"
        />

        {/* Sculpted Titanium Hardware Chassis (Light Mode: Natural Titanium · Dark Mode: Black Titanium) */}
        <div
          className="relative w-[280px] xl:w-[295px] h-[510px] xl:h-[530px] rounded-[44px]
            bg-gradient-to-b from-[#E5E7EB] via-[#D1D5DB] to-[#9CA3AF]
            dark:from-[#383842] dark:via-[#22222A] dark:to-[#0E0E12]
            p-[2.5px]
            shadow-[0_24px_50px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.08)]
            dark:shadow-[0_28px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)]
            transition-transform duration-200 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Hardware Buttons: Left Side */}
          <div className="absolute -left-[3.5px] top-20 w-[3px] h-4 rounded-l-sm bg-[#9CA3AF] dark:bg-[#3E3E4C]" />
          <div className="absolute -left-[3.5px] top-28 w-[3px] h-8 rounded-l-sm bg-[#9CA3AF] dark:bg-[#3E3E4C]" />
          <div className="absolute -left-[3.5px] top-38 w-[3px] h-8 rounded-l-sm bg-[#9CA3AF] dark:bg-[#3E3E4C]" />

          {/* Hardware Buttons: Right Side (Power Button) */}
          <div className="absolute -right-[3.5px] top-28 w-[3px] h-11 rounded-r-sm bg-[#9CA3AF] dark:bg-[#3E3E4C]" />

          {/* Inner Display Panel (Light Mode: iOS Grouped Canvas · Dark Mode: Pure OLED) */}
          <div className="relative w-full h-full rounded-[41px] bg-[#F4F4F6] dark:bg-[#000000] overflow-hidden flex flex-col justify-between border border-black/10 dark:border-white/10 transition-colors duration-200">
            {/* Subtle Specular Glare Reflection */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15 dark:opacity-20 z-40"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, transparent 45%)",
              }}
            />

            {/* iOS Top Bar: Time, Dynamic Island, Status Glyphs */}
            <div className="relative z-30 pt-3 px-5 flex items-center justify-between text-[11px] font-semibold text-[#1C1C1E] dark:text-white/90">
              <span className="font-mono tracking-tight pl-1 font-bold">9:41</span>

              {/* Dynamic Island */}
              <button
                type="button"
                onClick={() => {
                  setIslandExpanded((prev) => !prev);
                  triggerHaptic("tap");
                }}
                className={`transition-all duration-300 rounded-full bg-black border border-black/10 dark:border-white/20 px-2.5 py-1 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-white ${
                  islandExpanded ? "w-[155px]" : "w-[80px]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                {islandExpanded ? (
                  <span className="text-[10px] font-mono text-amber-300 truncate font-semibold">
                    Snark · Brutally Honest
                  </span>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#181820] border border-white/20 shrink-0" />
                )}
              </button>

              <div className="flex items-center gap-1.5 pr-1">
                <span className="text-[9px] font-mono opacity-70 font-bold">5G</span>
                <Wifi size={11} className="opacity-80" />
                <Battery size={13} className="opacity-90 fill-current" />
              </div>
            </div>

            {/* Chat Header: Snark Header */}
            <div className="relative z-20 px-3.5 pt-2 pb-2 border-b border-black/6 dark:border-white/8 flex items-center justify-between bg-white/75 dark:bg-black/50 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  <Flame size={13} strokeWidth={2.6} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[var(--foreground)]">Snark</span>
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                      Gemini Flash
                    </span>
                  </div>
                  <span className="text-[9px] text-[var(--subtext)] block -mt-0.5 font-normal">
                    Slightly sarcastic · Brutally honest
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleReset();
                  triggerHaptic("toggle");
                }}
                title="Restart chat"
                className="p-1 rounded-full text-[var(--subtext)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Chat Scroll Viewport */}
            <div
              ref={desktopChatScrollRef}
              className="relative z-10 flex-1 px-3.5 py-2.5 overflow-y-auto space-y-2.5 no-scrollbar"
            >
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAssistant ? "items-start" : "items-end"} animate-in fade-in duration-200`}
                  >
                    <div
                      className={`max-w-[88%] px-3.5 py-2 rounded-2xl text-[12px] leading-relaxed whitespace-pre-line ${
                        isAssistant
                          ? "bg-white dark:bg-[#1C1C1E] text-[var(--foreground)] border border-black/8 dark:border-white/10 rounded-tl-sm shadow-xs"
                          : "bg-emerald-600 text-white font-medium rounded-tr-sm shadow-xs"
                      }`}
                    >
                      <div>{m.text}</div>

                      {/* Interactive Dispatch APK Download Button */}
                      {isAssistant && m.hasApkAction && (
                        <div className="mt-2.5 pt-2 border-t border-black/8 dark:border-white/10 flex flex-col gap-1.5 animate-in fade-in duration-200">
                          <a
                            href="https://expo.dev/artifacts/eas/ZMYV1bXPcouSwRPR97MMm_IZiFi6MjiJtYJzUBLmnk8.apk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-[10px] shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <Download size={12} strokeWidth={2.6} />
                            <span>Download Dispatch APK</span>
                          </a>
                        </div>
                      )}

                      {/* Interactive Contact CTA Button & WhatsApp Link */}
                      {isAssistant && m.hasContactAction && (
                        <div className="mt-2.5 pt-2 border-t border-black/8 dark:border-white/10 flex flex-col gap-1.5 animate-in fade-in duration-200">
                          <button
                            type="button"
                            onClick={() => scrollToContact(false)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--foreground)] hover:opacity-90 text-[var(--background)] font-bold font-mono text-[10px] shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                          >
                            <span>Jump to Contact Form</span>
                            <ArrowDown size={11} strokeWidth={2.6} />
                          </button>
                          <a
                            href="https://wa.me/919390246687"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-semibold transition-all"
                          >
                            <span>WhatsApp Direct (+91 93902 46687)</span>
                            <ArrowUpRight size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl rounded-tl-sm bg-white dark:bg-[#1C1C1E] border border-black/8 dark:border-white/10 w-fit text-[var(--subtext)] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.3s]" />
                </div>
              )}
            </div>

            {/* Quick Tap Shortcuts */}
            <div className="relative z-20 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-black/6 dark:border-white/8 bg-white/50 dark:bg-black/40">
              {QUICK_SHORTCUTS.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <button
                    key={shortcut.label}
                    type="button"
                    onClick={() => {
                      triggerHaptic("tap");
                      sendMessage(shortcut.text);
                    }}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#1C1C1E] hover:bg-zinc-100 dark:hover:bg-[#25252A] border border-black/10 dark:border-white/15 text-[11px] font-medium text-[var(--foreground)] whitespace-nowrap shrink-0 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Icon size={11} className="text-amber-500 shrink-0" strokeWidth={2} />
                    <span>{shortcut.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Chat Input Bar */}
            <div className="relative z-20 px-3 pt-1 pb-1.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-1.5 p-1 pl-3 rounded-full bg-white dark:bg-[#14141E] border border-black/12 dark:border-white/15 focus-within:border-[var(--foreground)] transition-colors shadow-2xs"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything... or ask for a joke"
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-[11px] text-[var(--foreground)] placeholder-[var(--subtext)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send Message"
                  className="w-6 h-6 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-25 disabled:scale-100 cursor-pointer shadow-2xs shrink-0"
                >
                  <Send size={10} strokeWidth={2.4} />
                </button>
              </form>
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="relative z-30 pb-1.5 flex justify-center">
              <div className="w-24 h-1 bg-black/25 dark:bg-white/35 rounded-full" />
            </div>
          </div>
        </div>

        {/* Desktop Footnote */}
        <div className="mt-2 text-center text-[11px] font-mono text-[var(--subtext)] flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Snark · Gemini Flash Active</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW: ELEGANT FLOATING CHAT DIALOG                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileModalOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobileModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative w-full max-w-[360px] h-[82vh] max-h-[560px] rounded-[32px] bg-[var(--card)] border border-[var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    <Flame size={13} strokeWidth={2.6} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[var(--foreground)]">Snark</span>
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                        Gemini Flash
                      </span>
                    </div>
                    <span className="text-[9px] text-[var(--subtext)]">
                      Slightly sarcastic · Brutally honest
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset"
                    className="w-8 h-8 rounded-full text-[var(--subtext)] hover:text-[var(--foreground)] flex items-center justify-center transition-colors touch-manipulation cursor-pointer"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileModalOpen(false)}
                    title="Close"
                    className="w-8 h-8 rounded-full text-[var(--subtext)] hover:text-[var(--foreground)] bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 flex items-center justify-center transition-colors ml-1 touch-manipulation cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

            {/* Messages Viewport */}
            <div
              ref={mobileChatScrollRef}
              className="flex-1 px-4 py-3 overflow-y-auto space-y-2.5 no-scrollbar bg-[var(--background)]/50"
            >
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAssistant ? "items-start" : "items-end"} animate-in fade-in duration-200`}
                  >
                    <div
                      className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed whitespace-pre-line ${
                        isAssistant
                          ? "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-tl-sm shadow-xs"
                          : "bg-emerald-600 text-white font-medium rounded-tr-sm shadow-xs"
                      }`}
                    >
                      <div>{m.text}</div>

                      {/* Interactive Dispatch APK Download Button */}
                      {isAssistant && m.hasApkAction && (
                        <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex flex-col gap-1.5">
                          <a
                            href="https://expo.dev/artifacts/eas/ZMYV1bXPcouSwRPR97MMm_IZiFi6MjiJtYJzUBLmnk8.apk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-[11px] shadow-xs cursor-pointer"
                          >
                            <Download size={13} strokeWidth={2.6} />
                            <span>Download Dispatch APK</span>
                          </a>
                        </div>
                      )}

                      {/* Interactive Contact Jump Button */}
                      {isAssistant && m.hasContactAction && (
                        <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => scrollToContact(true)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--foreground)] hover:opacity-90 text-[var(--background)] font-bold font-mono text-[11px] shadow-xs cursor-pointer"
                          >
                            <span>Jump to Contact Form</span>
                            <ArrowDown size={13} strokeWidth={2.6} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl rounded-tl-sm bg-[var(--card)] border border-[var(--border)] w-fit text-[var(--subtext)] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.3s]" />
                </div>
              )}
            </div>

            {/* Quick Shortcuts */}
            <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-[var(--border)] bg-[var(--card)]">
              {QUICK_SHORTCUTS.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <button
                    key={shortcut.label}
                    type="button"
                    onClick={() => {
                      triggerHaptic("tap");
                      sendMessage(shortcut.text);
                    }}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--border)] text-xs font-medium text-[var(--foreground)] whitespace-nowrap shrink-0 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Icon size={12} className="text-amber-500 shrink-0" strokeWidth={2} />
                    <span>{shortcut.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Chat Input Form */}
            <div className="p-3 border-t border-[var(--border)] bg-[var(--card)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2 p-1.5 pl-3.5 rounded-full bg-[var(--background)] border border-[var(--border)] focus-within:border-[var(--foreground)]"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything... or ask for a joke"
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-xs text-[var(--foreground)] placeholder-[var(--subtext)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send Message"
                  className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-25 cursor-pointer shadow-xs shrink-0"
                >
                  <Send size={12} strokeWidth={2.4} />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
