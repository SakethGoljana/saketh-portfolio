"use client";

import { Menu, Sparkles, MessageCircle } from "lucide-react";

export default function MobileActionBar() {
  const triggerPalette = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-palette"));
    }
  };

  const triggerChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-ai-chat"));
    }
  };

  return (
    <aside
      aria-label="Mobile quick actions"
      className="hidden fixed bottom-5 right-4 z-40 items-center gap-2 pb-[env(safe-area-inset-bottom)] pointer-events-auto"
    >
      {/* 1-Tap WhatsApp Direct Link */}
      <a
        href="https://wa.me/919390246687"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat directly on WhatsApp"
        title="WhatsApp (+91 93902 46687)"
        className="w-11 h-11 rounded-full bg-[#25D366] text-black flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer touch-manipulation hover:scale-105"
      >
        <MessageCircle size={19} strokeWidth={2.4} />
      </a>

      {/* Menu / Command Palette Trigger */}
      <button
        type="button"
        onClick={triggerPalette}
        aria-label="Open Navigation Menu"
        title="Menu & Search"
        className="w-11 h-11 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-[var(--foreground)] flex items-center justify-center shadow-lg hover:border-[var(--accent)] active:scale-95 transition-all cursor-pointer touch-manipulation"
      >
        <Menu size={18} strokeWidth={2.2} />
      </button>

      {/* Chatbot Icon Button (Opens Saketh's Portfolio AI Assistant) */}
      <button
        type="button"
        onClick={triggerChat}
        aria-label="Open Saketh AI Assistant"
        title="Chat with Saketh AI"
        className="relative w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer touch-manipulation"
      >
        <span className="animate-ping absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-80" />
        <span className="absolute -top-0.5 -right-0.5 inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[var(--card)]" />
        <Sparkles size={19} strokeWidth={2.4} />
      </button>
    </aside>
  );
}
