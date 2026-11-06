"use client";

import Link from "next/link";
import { ArrowUp, MessageCircle, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer
      id="footer"
      className="relative z-20 w-full border-t border-[var(--border)] bg-[#F1F4F9] dark:bg-[var(--background)] pt-10 sm:pt-14 pb-20 md:pb-12 px-5 sm:px-8 mt-auto transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8">
        {/* Brand & Studio Status */}
        <div className="flex flex-col gap-3.5 max-w-md">
          <Link
            href="#top"
            className="font-mono text-2xl font-bold tracking-tight text-[var(--foreground)] hover:opacity-90 inline-flex items-center gap-1 group"
          >
            <span>saketh</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold cursor-blink">_</span>
          </Link>
          <p className="text-sm text-[var(--subtext)] leading-relaxed">
            Full-stack product developer &amp; design engineer. Building high-performance mobile apps, modern web platforms, and intelligent automation systems.
          </p>
          <div className="inline-flex items-center gap-2.5 text-xs font-mono text-[var(--subtext)] pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot inline-block" />
            <span className="font-medium text-[var(--foreground)]">Available for select projects &amp; full-time contracts</span>
          </div>
        </div>

        {/* Quick Links & Socials */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
          {/* Internal Navigation Shortcuts */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-[var(--subtext)]">
            <Link href="#work" className="hover:text-[var(--foreground)] transition-colors py-1">
              Selected Work
            </Link>
            <span>·</span>
            <Link href="#process" className="hover:text-[var(--foreground)] transition-colors py-1">
              Workflow
            </Link>
            <span>·</span>
            <Link href="#capabilities" className="hover:text-[var(--foreground)] transition-colors py-1">
              Capabilities
            </Link>
            <span>·</span>
            <Link href="#contact" className="hover:text-[var(--foreground)] transition-colors py-1">
              Contact
            </Link>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-feedback"));
                }
              }}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 cursor-pointer font-medium"
            >
              Feedback
            </button>
          </nav>

          {/* Social Icons Dock - Uniform Glassmorphism */}
          <div className="flex items-center gap-2.5 text-[var(--subtext)]">
            {/* GitHub */}
            <a
              href="https://github.com/SakethGoljana"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 text-[var(--foreground)] hover:text-emerald-500 transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95 shadow-2xs"
              aria-label="GitHub Profile"
              title="Saketh on GitHub"
            >
              <GithubIcon size={18} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/saketh-goljana/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 text-[var(--foreground)] hover:text-[#0A66C2] transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95 shadow-2xs"
              aria-label="LinkedIn Profile"
              title="Connect on LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919059478739"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 text-[var(--foreground)] hover:text-[#25D366] transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95 shadow-2xs"
              aria-label="WhatsApp"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={18} />
            </a>

            {/* Email */}
            <a
              href="mailto:hello@sakethgoljana.tech"
              className="w-11 h-11 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 text-[var(--foreground)] hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95 shadow-2xs"
              aria-label="Email"
              title="Send an Email"
            >
              <Mail size={18} />
            </a>

            {/* Back to top glide button */}
            <Link
              href="#top"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--foreground)] px-4 py-2.5 rounded-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 transition-all ml-1 min-h-[44px] touch-manipulation shadow-2xs"
              title="Glide back to top"
            >
              <span>Top</span>
              <ArrowUp size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--subtext)] gap-3">
        <span>© {currentYear} Saketh Goljana. All rights reserved.</span>
        <div className="flex items-center gap-3">
          <span>Crafted with Next.js 16, React 19 &amp; Tailwind CSS</span>
          <span>·</span>
          <span className="text-[var(--accent)] font-semibold">Zero Fake Filler</span>
        </div>
      </div>
    </footer>
  );
}
