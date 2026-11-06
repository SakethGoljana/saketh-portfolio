"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  X,
  Download,
  MessageCircle,
  FileSpreadsheet,
  Globe,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
} from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { triggerHaptic } from "@/utils/haptics";

/* ──────────────────────────────────────────────────────────────────────── */
/*  DATA LAYER                                                            */
/* ──────────────────────────────────────────────────────────────────────── */

interface ProjectSnapshot {
  title: string;
  subtitle: string;
  description: string;
  type?:
    | "dispatch-roster"
    | "dispatch-lang"
    | "dispatch-queue"
    | "crm-dashboard"
    | "portfolio-chat"
    | "portfolio-theme";
  badge: string;
  metric: string;
  imageSrc?: string;
  aspect?: "mobile" | "desktop";
}

interface ProjectData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  categoryShort: string;
  tagline: string;
  description: string;
  accent: string;
  apkUrl?: string;
  githubUrl?: string;
  easUrl?: string;
  pills: string[];
  metrics: { label: string; value: string }[];
  snapshots: ProjectSnapshot[];
  deviceType: "mobile" | "web";
}

const PROJECTS: ProjectData[] = [
  {
    id: "dispatch",
    number: "01",
    title: "Dispatch",
    subtitle: "Bulk WhatsApp Automation Engine",
    category: "MOBILE APPLICATION · ANDROID & IOS",
    categoryShort: "APPS",
    tagline:
      "Turn raw Excel, CSV, and Google Sheets into personalized WhatsApp messages with 1-tap dispatch and zero ban risk.",
    description:
      "Small businesses, schools, and clinics waste hours manually copying fee, attendance, and dispatch notices to hundreds of contacts, or get their phone numbers permanently banned using third-party spam bots. Dispatch parses spreadsheets 100% locally in device RAM (zero-knowledge ephemeral state), compiles dynamic token templates in 8 Indian languages, and sends messages via official 1-tap WhatsApp deep links or Meta Cloud API v21.0.",
    accent: "#059669",
    githubUrl: "https://github.com/SakethGoljana/Dispatch",
    apkUrl:
      "https://github.com/SakethGoljana/Dispatch/releases/latest/download/dispatch-v1.0.0.apk",
    easUrl: "https://expo.dev/accounts/saketh3773/projects/dispatch",
    pills: [
      "React Native 0.88",
      "Expo SDK 58",
      "Meta Cloud API",
      "SheetJS Parsing",
      "OTA Updates",
      "Zero-Knowledge",
    ],
    metrics: [
      { label: "Data Architecture", value: "100% Ephemeral RAM" },
      { label: "Meta Cloud API", value: "Graph API v21.0" },
      { label: "Regional Presets", value: "8 Languages" },
    ],
    snapshots: [
      {
        title: "Home & Campaign Hub",
        subtitle: "1-Tap Excel to WhatsApp Campaign Launcher",
        description:
          "Clean, high-performance home dashboard to launch new campaigns, pick spreadsheets, auto-fill custom dues, and review recent activity with 100% on-device private data isolation.",
        type: "dispatch-roster",
        badge: "01 · Home",
        metric: "Zero Cloud Upload",
        imageSrc: "/snapshots/dispatch-01-home.png",
      },
      {
        title: "Dynamic Message Templates",
        subtitle: "Syntax-Aware Variable Composer ({{Name}}, {{Balance}}, {{Date}})",
        description:
          "Pre-configured categorized templates for fees & dues, appointment bookings, and delivery updates with instant copy or direct 1-tap campaign injection.",
        type: "dispatch-lang",
        badge: "02 · Templates",
        metric: "1-Click Variables",
        imageSrc: "/snapshots/dispatch-02-templates.png",
      },
      {
        title: "Campaign Activity Logs",
        subtitle: "Historical Records Kept Exclusively On Your Phone",
        description:
          "Detailed campaign history tracking delivery receipts, dispatched counts, timestamps, and message statuses with zero third-party telemetry.",
        type: "dispatch-queue",
        badge: "03 · Activity",
        metric: "100% Offline Vault",
        imageSrc: "/snapshots/dispatch-03-activity.png",
      },
      {
        title: "Channel Settings & Adapters",
        subtitle: "Dual Sending Engine: Personal Link Mode vs Meta Graph API",
        description:
          "Toggle between zero-setup personal WhatsApp links (free, ban-safe human review) and official Meta Cloud Platform API v21.0 with ephemeral memory protection.",
        type: "dispatch-queue",
        badge: "04 · Settings",
        metric: "Hybrid Architecture",
        imageSrc: "/snapshots/dispatch-04-settings.png",
      },
      {
        title: "Live Cloud Updates & Creator Info",
        subtitle: "Instant Over-The-Air Runtime Pushes Without APK Reinstall",
        description:
          "Integrated Expo EAS over-the-air update system delivering hotfixes and UI improvements directly to user devices, paired with developer profile credentials.",
        type: "dispatch-queue",
        badge: "05 · Cloud OTA",
        metric: "Instant Updates",
        imageSrc: "/snapshots/dispatch-05-ota.png",
      },
      {
        title: "Universal Document Importer",
        subtitle: "Excel (.xlsx, .xls), Live Google Sheets & Digital PDF Support",
        description:
          "Upload any local spreadsheet, paste live Google Sheets cloud links, or parse selectable PDF rosters. Data is processed locally in ephemeral memory.",
        type: "dispatch-roster",
        badge: "06 · Import",
        metric: "Multi-Format Sync",
        imageSrc: "/snapshots/dispatch-06-import.png",
      },
      {
        title: "Smart Column Auto-Mapper",
        subtitle: "17 Columns Auto-Detected with 1-Click Audience Filters",
        description:
          "Automatically detects names, phone numbers, balance dues, and vehicle routes. Filter contacts with 1-click (e.g. 'With Balance Only' 4 of 5 targeted).",
        type: "dispatch-roster",
        badge: "07 · Column Mapper",
        metric: "Auto Recognition",
        imageSrc: "/snapshots/dispatch-07-mapping.png",
      },
      {
        title: "Multi-Route Channel Selector",
        subtitle: "Personal WhatsApp vs Meta Cloud API vs Web Companion",
        description:
          "Summarizes target audience (e.g. 5 contacts, ₹32,300 total pending balance) and lets the user choose the ideal delivery route for the campaign.",
        type: "dispatch-queue",
        badge: "08 · Channels",
        metric: "Targeted Routing",
        imageSrc: "/snapshots/dispatch-08-channels.png",
      },
      {
        title: "Gesture-Driven 1-Tap Sender",
        subtitle: "Pre-Filled WhatsApp Messages with Turbo Mode & SMS Fallback",
        description:
          "Opens official WhatsApp with pre-filled personalized text. Interactive swipe deck allows tapping 'Mark Sent ✓' to physically roll to the next recipient.",
        type: "dispatch-queue",
        badge: "09 · 1-Tap Sender",
        metric: "100% Ban-Safe",
        imageSrc: "/snapshots/dispatch-09-sender.png",
      },
      {
        title: "Campaign Completion & Audit",
        subtitle: "Instant Receipts Summary with 1-Click Excel Audit Export",
        description:
          "Comprehensive dispatch metrics (Sent, Skipped, Total). Clears memory buffer immediately and offers instant one-click Excel audit export (.xlsx).",
        type: "dispatch-roster",
        badge: "10 · Complete",
        metric: "Audit Compliance",
        imageSrc: "/snapshots/dispatch-10-complete.png",
      },
    ],
    deviceType: "mobile",
  },
  {
    id: "portfolio",
    number: "02",
    title: "Full-Stack Portfolio",
    subtitle: "End-to-End Client Platform",
    category: "FULL-STACK PLATFORM · END-TO-END SAAS",
    categoryShort: "WEBSITES",
    tagline:
      "A complete client acquisition & delivery engine — from public portfolio and 24/7 AI copilot to direct booking and 2FA-secured lead operations.",
    description:
      "Engineered not just as a static showcase, but as an end-to-end client platform. Seamlessly connects public discovery, interactive project galleries, 24/7 AI assistant, direct calendar scheduling, and structured scope intake directly into an authenticated, 2FA-secured lead CRM to track inquiries from first visit to signed contract.",
    accent: "#6366F1",
    pills: [
      "End-to-End Architecture",
      "Public Portfolio & 24/7 AI",
      "Direct Booking Chassis",
      "2FA Lead Management",
    ],
    metrics: [
      { label: "Architecture", value: "Full End-to-End" },
      { label: "Conversion", value: "Visitor to Contract" },
      { label: "Performance", value: "<150ms First Paint" },
    ],
    snapshots: [
      {
        title: "Public Platform & Gemini AI Copilot",
        subtitle:
          "Sub-150ms First Paint with Dual Theme Design System",
        description:
          "High-performance public portfolio canvas with integrated 24/7 Gemini phone assistant, quick inquiry action buttons, and fluid spring choreographies.",
        type: "portfolio-chat",
        badge: "01 · Platform Hero",
        metric: "<150ms First Paint",
        imageSrc: "/snapshots/portfolio-desktop-hero.png",
        aspect: "desktop",
      },
      {
        title: "Interactive Selected Work & Modal Runway",
        subtitle:
          "Zero Synthetic Mockups · Real Production Screenshot Showcase",
        description:
          "Deep-dive project walkthrough allowing visitors to swipe through 10 real production screens, inspect technical details, and review architecture with zero marketing fluff.",
        type: "portfolio-theme",
        badge: "02 · Work Showcase",
        metric: "Zero Mockups",
        imageSrc: "/snapshots/portfolio-desktop-work.png",
        aspect: "desktop",
      },
      {
        title: "Core Capabilities & Production Standards",
        subtitle:
          "Modern Stack Architecture, SLAs & Technical Guarantees",
        description:
          "Showcases the complete production tech stack (Next.js 16, TypeScript, Tailwind, React Native Expo, Supabase, Cloudflare edge) with zero-bloat architectural patterns.",
        type: "portfolio-theme",
        badge: "03 · Architecture",
        metric: "Zero Bloat Standards",
        imageSrc: "/snapshots/portfolio-desktop-capabilities.png",
        aspect: "desktop",
      },
      {
        title: "Direct Consultation Booking Chassis",
        subtitle:
          "Interactive Calendar Engine with Rapid Time Slot Selection",
        description:
          "Frictionless scheduling chassis with instant timezone alignment. Clients select available consultation dates and 45-minute architectural review windows with zero email back-and-forth.",
        type: "crm-dashboard",
        badge: "04 · Booking Chassis",
        metric: "Instant Timezone Sync",
        imageSrc: "/snapshots/portfolio-desktop-booking.png",
        aspect: "desktop",
      },
      {
        title: "Structured Project Intake & Brief Form",
        subtitle:
          "Service Categorization, Budget Bands & Project Scope",
        description:
          "Pre-qualifies inbound inquiries with interactive category pills (Full-Stack Web App, Mobile React Native, Custom CRM, Fast MVP), estimated budget tiers, and target launch timeline.",
        type: "portfolio-theme",
        badge: "05 · Project Brief",
        metric: "Lead Pre-Qualification",
        imageSrc: "/snapshots/portfolio-desktop-brief.png",
        aspect: "desktop",
      },
      {
        title: "Touch-First Mobile Experience",
        subtitle:
          "Responsive Single-Thumb Layout with Floating AI Copilot",
        description:
          "Pixel-perfect mobile adaptation engineered for fluid single-thumb navigation, compact metric counters, and an instant expandable AI chat dialog with zero layout shift.",
        type: "portfolio-chat",
        badge: "06 · Mobile Web",
        metric: "Touch-First 60fps",
        imageSrc: "/snapshots/portfolio-mobile-hero.png",
        aspect: "mobile",
      },
      {
        title: "Mobile Booking Scheduler",
        subtitle:
          "Native-Feeling Calendar Grid & Rapid Slot Selection",
        description:
          "Optimized for mobile touch targets with responsive calendar dates, horizontal scrolling slot chips, and 1-tap confirmation.",
        type: "crm-dashboard",
        badge: "07 · Mobile Booking",
        metric: "1-Thumb Scheduling",
        imageSrc: "/snapshots/portfolio-mobile-booking.png",
        aspect: "mobile",
      },
      {
        title: "Mobile Scope Intake & Roadmap",
        subtitle:
          "4-Stage Delivery Blueprint: Discovery to Production Launch",
        description:
          "Transparent delivery milestones and mobile brief intake allowing clients to specify timeline, requirements, and budget on the go without pinch-zooming.",
        type: "portfolio-theme",
        badge: "08 · Mobile Roadmap",
        metric: "Clear Milestones",
        imageSrc: "/snapshots/portfolio-mobile-process.png",
        aspect: "mobile",
      },
      {
        title: "TOTP 2-Factor Authentication Gateway",
        subtitle:
          "RFC 6238 Time-Based Security Gate with Auto-Focus Input",
        description:
          "Zero-compromise security checkpoint protecting confidential client proposals and inquiries. Integrates Google Authenticator / 1Password 6-digit TOTP tokens with 30-second rolling validity.",
        type: "crm-dashboard",
        badge: "09 · 2FA Security",
        metric: "RFC 6238 TOTP 2FA",
        imageSrc: "/snapshots/portfolio-crm-auth.png",
        aspect: "desktop",
      },
      {
        title: "Authenticated CRM Pipeline Dashboard",
        subtitle:
          "Real-Time Revenue, Lead Stages & Active Deal Tracking",
        description:
          "Private management dashboard closing the end-to-end loop. Categorizes inbound prospects across Discovery, Scoping, Proposal, and Won stages with live KPIs ($28.4K pipeline, 12 active leads, 41% win rate).",
        type: "crm-dashboard",
        badge: "10 · Deal Operations",
        metric: "Closed-Loop Tracking",
        imageSrc: "/snapshots/portfolio-crm-dashboard.png",
        aspect: "desktop",
      },
    ],
    deviceType: "web",
  },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  DEVICE MOCKUP VISUALS                                                 */
/* ──────────────────────────────────────────────────────────────────────── */

/** Mobile device frame — three staggered phones for Dispatch with authentic screenshots */
function MobileDeviceMockup() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Phone 1 — back left (Column Auto-Mapping) */}
      <div className="absolute left-[5%] top-[10%] w-[38%] h-[82%] rounded-[20px] bg-[#12131C] border border-white/[0.14] shadow-2xl -rotate-6 overflow-hidden">
        <div className="w-full h-2.5 bg-black/80 flex items-center justify-center">
          <div className="w-6 h-1 rounded-full bg-white/20" />
        </div>
        <img
          src="/snapshots/dispatch-07-mapping.png"
          alt="Dispatch Column Mapper"
          className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-95 transition-opacity duration-300"
          loading="lazy"
        />
      </div>

      {/* Phone 2 — center front (Home Campaign Hub, largest & crispest) */}
      <div className="relative z-10 w-[46%] h-[90%] rounded-[24px] bg-[#0C0D14] border-2 border-white/[0.22] shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="w-full h-3 bg-black/90 flex items-center justify-center">
          <div className="w-8 h-1 rounded-full bg-white/30" />
        </div>
        <img
          src="/snapshots/dispatch-01-home.png"
          alt="Dispatch Home Hub"
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      {/* Phone 3 — back right (1-Tap Personal Sender Deck) */}
      <div className="absolute right-[5%] top-[6%] w-[36%] h-[80%] rounded-[20px] bg-[#12131C] border border-white/[0.14] shadow-2xl rotate-6 overflow-hidden">
        <div className="w-full h-2.5 bg-black/80 flex items-center justify-center">
          <div className="w-6 h-1 rounded-full bg-white/20" />
        </div>
        <img
          src="/snapshots/dispatch-09-sender.png"
          alt="Dispatch 1-Tap Sender"
          className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-95 transition-opacity duration-300"
          loading="lazy"
        />
      </div>
    </div>
  );
}

/** Web device frame — laptop + phone for Full-Stack Portfolio */
function WebDeviceMockup() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Laptop frame */}
      <div className="relative w-[78%] h-[78%] rounded-xl bg-[#1A1A2E]/90 border border-white/[0.14] shadow-2xl overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border-b border-white/[0.08]">
          <div className="w-2 h-2 rounded-full bg-rose-400/80" />
          <div className="w-2 h-2 rounded-full bg-amber-400/80" />
          <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
          <div className="flex-1 mx-2 h-2.5 rounded-full bg-white/[0.08]" />
        </div>
        {/* Real Desktop Platform Screenshot */}
        <div className="relative w-full h-full bg-[#0D0D14] overflow-hidden">
          <img
            src="/snapshots/portfolio-desktop-hero.png"
            alt="Full-Stack Portfolio Desktop Platform"
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
      </div>

      {/* Phone overlap — right side */}
      <div className="absolute right-[4%] bottom-[4%] w-[26%] h-[68%] rounded-xl bg-[#12131C] border border-white/[0.16] shadow-2xl rotate-3 overflow-hidden z-10">
        <div className="w-full h-1.5 bg-black/80 flex items-center justify-center">
          <div className="w-4 h-0.5 rounded-full bg-white/20" />
        </div>
        <img
          src="/snapshots/portfolio-mobile-hero.png"
          alt="Mobile Portfolio Platform"
          className="w-full h-full object-cover object-top opacity-95"
          loading="lazy"
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  SNAPSHOT SCREEN RENDERER (reused in lightbox modal)                   */
/* ──────────────────────────────────────────────────────────────────────── */

function SnapshotScreen({
  type,
  isCompact = false,
}: {
  type: ProjectSnapshot["type"];
  isCompact?: boolean;
}) {
  if (type === "dispatch-roster") {
    return (
      <div className="space-y-1.5 font-mono text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border)] text-[10px] sm:text-[11px] text-[var(--subtext)]">
          <div className="flex items-center gap-1.5 text-[var(--foreground)] font-bold truncate">
            <FileSpreadsheet
              size={13}
              className="text-emerald-600 dark:text-[#10B981] shrink-0"
            />
            <span className="truncate">CLASS-2A_FEES_OCT2026.xlsx</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-emerald-100/70 dark:bg-[#10B981]/15 text-emerald-700 dark:text-[#10B981] text-[9px] font-semibold shrink-0">
            100% Offline
          </span>
        </div>

        <div className="space-y-1 sm:space-y-1.5">
          {[
            {
              name: "Sohan Aditya",
              phone: "+91 93902 46687",
              balance: "₹12,500",
              bus: "MAGIC-1",
              status: "Overdue",
            },
            {
              name: "Pooja Sharma",
              phone: "+91 98480 12345",
              balance: "₹8,200",
              bus: "AP39 UW",
              status: "Due",
            },
            ...(!isCompact
              ? [
                  {
                    name: "Rahul Varma",
                    phone: "+91 91234 56789",
                    balance: "₹15,000",
                    bus: "SELF AUTO",
                    status: "Overdue",
                  },
                ]
              : []),
          ].map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[var(--background)] border border-[var(--border)]"
            >
              <div className="min-w-0 pr-2">
                <div className="font-bold text-[var(--foreground)] text-[10px] sm:text-[11px] truncate">
                  {row.name}
                </div>
                <div className="text-[8px] sm:text-[9px] text-[var(--subtext)] truncate">
                  {row.phone} · {row.bus}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-emerald-700 dark:text-[#10B981] text-[10px] sm:text-[11px]">
                  {row.balance}
                </div>
                <span className="text-[8px] px-1 py-0.2 rounded bg-rose-100/80 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-500/30">
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "dispatch-lang") {
    return (
      <div className="space-y-1.5 font-mono text-xs">
        <div className="flex items-center gap-1.5 pb-1.5 border-b border-[var(--border)] text-[10px] sm:text-[11px] font-bold text-[var(--foreground)]">
          <Globe
            size={13}
            className="text-emerald-600 dark:text-[#10B981] shrink-0"
          />
          <span className="truncate">
            8 Regional Presets (Telugu, Hindi, etc.)
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-[var(--subtext)]">
            <span className="text-emerald-600 dark:text-[#10B981] font-bold">
              తెలుగు (Telugu Notice):
            </span>
            <span className="text-[8px] text-[var(--subtext)]">Tokenized</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[var(--foreground)] leading-snug sm:leading-relaxed">
            &quot;గౌరవనీయులైన తల్లిదండ్రులకు, సోహన్ ఆదిత్య గారి స్కూల్ ఫీజు
            బకాయి ₹12,500 చెల్లించవలసిందిగా కోరుచున్నాము.&quot;
          </p>
        </div>

        {!isCompact && (
          <div className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between text-[9px] text-[var(--subtext)]">
              <span className="text-emerald-600 dark:text-[#10B981] font-bold">
                हिंदी (Hindi Notice):
              </span>
              <span className="text-[8px] text-[var(--subtext)]">
                Tokenized
              </span>
            </div>
            <p className="text-[11px] text-[var(--foreground)] leading-relaxed">
              &quot;आदरणीय अभिभावक, यह सोहन आदित्य के स्कूल शुल्क ₹12,500 के
              संबंध में है। कृपया समय पर भुगतान करें।&quot;
            </p>
          </div>
        )}
      </div>
    );
  }

  if (type === "dispatch-queue") {
    return (
      <div className="space-y-1.5 font-mono text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border)] text-[10px] sm:text-[11px] font-bold text-[var(--foreground)]">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#25D366]">
            <MessageCircle size={13} />
            <span>1-Tap WhatsApp Safe Queue</span>
          </div>
          <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded bg-emerald-100/70 dark:bg-[#25D366]/15 text-emerald-700 dark:text-[#25D366] font-semibold">
            Zero Ban Risk
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#DCF8C6]/30 dark:bg-[#075E54]/20 border border-[#25D366]/30 space-y-1">
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-bold text-[#075E54] dark:text-[#25D366]">
              Official WhatsApp App
            </span>
            <span className="text-[8px] text-[var(--subtext)]">
              Pre-filled Message
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[var(--foreground)] font-mono leading-relaxed">
            Opens native WhatsApp with phone number &amp; personalized message
            ready. One user tap confirms sending.
          </p>
        </div>
      </div>
    );
  }

  if (type === "crm-dashboard") {
    return (
      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border)] text-[10px] sm:text-[11px] font-bold text-[var(--foreground)]">
          <span>Client Pipeline Status</span>
          <span className="text-emerald-600 dark:text-[var(--accent)] font-semibold">
            3 Deals In Progress
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-[9px] sm:text-[10px]">
          <div className="p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[8px] text-[var(--subtext)]">NEW INQUIRY</div>
            <div className="font-bold text-[var(--foreground)] mt-0.5">
              Fintech App
            </div>
            <div className="text-emerald-600 font-bold mt-1">₹1,50,000</div>
          </div>
          <div className="p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[8px] text-[var(--subtext)]">DISCOVERY</div>
            <div className="font-bold text-[var(--foreground)] mt-0.5">
              School SaaS
            </div>
            <div className="text-emerald-600 font-bold mt-1">₹85,000</div>
          </div>
          <div className="p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-[8px] text-[var(--subtext)]">
              DELIVERED ✨
            </div>
            <div className="font-bold text-[var(--foreground)] mt-0.5">
              Dispatch
            </div>
            <div className="text-emerald-500 font-bold mt-1">Ready</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "portfolio-chat") {
    return (
      <div className="space-y-2 font-mono text-xs">
        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-[10px] text-[var(--foreground)]">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            Visitor:
          </span>{" "}
          &quot;How fast can you build a mobile app?&quot;
        </div>
        <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/40 text-[10px] text-[var(--foreground)]">
          <span className="font-bold text-teal-600 dark:text-teal-400">
            Assistant:
          </span>{" "}
          &quot;Typical projects ship in 2–4 weeks with weekly progress
          check-ins.&quot;
        </div>
      </div>
    );
  }

  if (type === "portfolio-theme") {
    return (
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div className="p-2 rounded-xl bg-[#09090B] border border-zinc-800 text-white space-y-1">
          <div className="font-bold text-emerald-400 text-[10px]">
            🌙 Obsidian Dark
          </div>
          <p className="text-[9px] text-zinc-400 leading-snug">
            Deep slate #09090B with subtle glow.
          </p>
        </div>
        <div className="p-2 rounded-xl bg-[#FFFFFF] border border-zinc-200 text-[#09090B] space-y-1">
          <div className="font-bold text-emerald-600 text-[10px]">
            ☀️ Pure White
          </div>
          <p className="text-[9px] text-zinc-500 leading-snug">
            Crisp paper white with emerald accents.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  PROJECT CARD — Reference Design                                       */
/* ──────────────────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  onViewScreens,
}: {
  project: ProjectData;
  onViewScreens: () => void;
}) {
  const screenCount = project.snapshots.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 28 } }}
      whileTap={{ scale: 0.985, transition: { duration: 0.1 } }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onViewScreens}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} screens`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewScreens();
        }
      }}
      className="group relative flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer
        bg-white dark:bg-[#111319]
        border border-black/[0.08] dark:border-white/[0.07]
        shadow-[0_2px_20px_rgba(0,0,0,0.03)] dark:shadow-none
        transition-all duration-300 ease-out
        hover:shadow-[0_14px_44px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_14px_44px_rgba(0,0,0,0.4)]
        hover:border-black/[0.16] dark:hover:border-white/[0.14]"
    >
      {/* ───── Visual Preview Area (Minimalist Studio Canvas) ───── */}
      <div className="relative aspect-[16/10] bg-[#0A0B10] dark:bg-[#07080C] overflow-hidden border-b border-black/[0.06] dark:border-white/[0.06]">
        {/* Architectural studio vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 120%, rgba(255, 255, 255, 0.04) 0%, transparent 65%)",
          }}
        />

        {/* Subtle hairline precision grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Device Mockups — gentle scale up on hover */}
        <div className="absolute inset-6 sm:inset-8 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          {project.deviceType === "mobile" ? (
            <MobileDeviceMockup />
          ) : (
            <WebDeviceMockup />
          )}
        </div>

        {/* Screen Count Badge — Minimalist & Refined */}
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 dark:bg-white/10 backdrop-blur-md border border-white/15 text-white dark:text-zinc-200 text-[10px] sm:text-[11px] font-mono font-medium tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{screenCount} SCREENS</span>
          </span>
        </div>

        {/* Swipe Cue on Mobile */}
        {project.deviceType === "mobile" && (
          <div className="sm:hidden absolute bottom-3 inset-x-0 flex justify-center z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300 shadow-xs">
              <span>Swipe to explore ⇄</span>
            </span>
          </div>
        )}

        {/* Large Project Number — top right, minimalist architectural typography */}
        <div className="absolute top-2 right-4 sm:top-3 sm:right-5">
          <span className="font-mono text-4xl sm:text-5xl font-black text-white/[0.05] group-hover:text-white/[0.12] select-none leading-none tracking-tighter transition-colors duration-400">
            {project.number}
          </span>
        </div>
      </div>

      {/* ───── Card Content Area ───── */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Category Label */}
        <div className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] text-[var(--subtext)] uppercase mb-2">
          PROJECT {project.number} · {project.categoryShort}
        </div>

        {/* Project Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 tracking-tight leading-tight mb-1.5 transition-colors duration-200">
          {project.title}
        </h3>

        {/* One-line Tagline */}
        <p className="text-sm text-[var(--subtext)] leading-relaxed line-clamp-2 mb-5 sm:mb-6">
          [{project.tagline}]
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Action Row */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <span
            className="font-mono text-xs sm:text-sm font-bold tracking-wide text-[var(--foreground)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5"
          >
            VIEW SCREENS
            <ChevronRight
              size={14}
              className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out"
            />
          </span>

          {/* Minimalist Executive Action Circle Button */}
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
              bg-[var(--foreground)] text-[var(--background)]
              transition-all duration-200 ease-out
              group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500
              group-active:scale-95 shadow-2xs"
            aria-label={`View ${project.title} screens`}
          >
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                                        */
/* ──────────────────────────────────────────────────────────────────────── */

export default function WorkShowcase() {
  const [activeModalProject, setActiveModalProject] =
    useState<ProjectData | null>(null);
  const [activeSnapshotIndex, setActiveSnapshotIndex] = useState(0);

  const runwayRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeModalProject) {
      modalContentRef.current?.focus();
    }
  }, [activeModalProject]);

  const scrollToSnapshot = (idx: number) => {
    setActiveSnapshotIndex(idx);
    triggerHaptic("tap");
    const el = itemRefs.current[idx];
    if (el && runwayRef.current) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const handleRunwayScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(containerCenter - elCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeSnapshotIndex) {
      setActiveSnapshotIndex(closestIndex);
    }
  };

  const openProject = (project: ProjectData, snapshotIdx = 0) => {
    setActiveModalProject(project);
    setActiveSnapshotIndex(snapshotIdx);
    triggerHaptic("snap");
    setTimeout(() => {
      const el = itemRefs.current[snapshotIdx];
      if (el && runwayRef.current) {
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }, 160);
  };

  const closeModal = () => {
    setActiveModalProject(null);
    triggerHaptic("toggle");
  };

  // Keyboard arrow keys navigation for Play Store runway
  useEffect(() => {
    if (!activeModalProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        scrollToSnapshot(
          (activeSnapshotIndex + 1) % activeModalProject.snapshots.length
        );
      } else if (e.key === "ArrowLeft") {
        scrollToSnapshot(
          (activeSnapshotIndex - 1 + activeModalProject.snapshots.length) %
            activeModalProject.snapshots.length
        );
      } else if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalProject, activeSnapshotIndex]);

  return (
    <section
      id="work"
      className="relative py-10 sm:py-16 md:py-20 px-5 sm:px-8 border-t border-[var(--border)] bg-[var(--background)] transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto">
        {/* ───── Section Header ───── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              <span>01 · SELECTED WORK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              Real software. Real users. Zero mockups.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--subtext)] max-w-sm font-mono leading-relaxed">
            Tap a card to flip through the real screens. Production-tested code
            designed to eliminate business friction.
          </p>
        </div>

        {/* ───── Project Cards Grid ───── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewScreens={() => openProject(project, 0)}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FULL-SCREEN SNAPSHOT LIGHTBOX MODAL                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            key="work-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-modal-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              ref={modalContentRef}
              tabIndex={-1}
              key="work-modal-content"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-[32px] sm:rounded-3xl bg-[var(--card)] border border-[var(--border)] p-4 sm:p-8 space-y-4 sm:space-y-5 text-[var(--foreground)] shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Close Button & Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${activeModalProject.accent} 15%, transparent)`,
                        color: activeModalProject.accent,
                      }}
                    >
                      {activeModalProject.category}
                    </span>
                    <span className="font-mono text-xs text-[var(--subtext)]">
                      Project {activeModalProject.number}
                    </span>
                  </div>
                  <h2 id="work-modal-title" className="text-xl sm:text-3xl font-bold text-[var(--foreground)]">
                    {activeModalProject.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--subtext)] mt-1 max-w-2xl leading-relaxed">
                    {activeModalProject.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {activeModalProject.snapshots[0]?.imageSrc ? (
                /* ═════════════════════════════════════════════════════════════ */
                /* HORIZONTAL SCREEN WALKTHROUGH RUNWAY                        */
                /* ═════════════════════════════════════════════════════════════ */
                <div className="space-y-4">
                  {/* Carousel Header & Screen Cue */}
                  <div className="flex items-center justify-between px-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-medium text-[var(--foreground)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>SCREEN WALKTHROUGH</span>
                      <span className="text-[11px] text-[var(--subtext)] font-normal hidden sm:inline">
                        · {activeModalProject.snapshots.length} Screens
                      </span>
                    </div>

                    {/* Progress Counter & Navigation Arrows */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-[var(--foreground)]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {activeSnapshotIndex + 1}
                        </span>
                        <span className="text-[var(--subtext)]"> / </span>
                        <span>{activeModalProject.snapshots.length}</span>
                      </span>
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          type="button"
                          onClick={() =>
                            scrollToSnapshot(
                              (activeSnapshotIndex -
                                1 +
                                activeModalProject.snapshots.length) %
                                activeModalProject.snapshots.length
                            )
                          }
                          className="w-8 h-8 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] flex items-center justify-center transition-colors cursor-pointer"
                          title="Previous Screen"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            scrollToSnapshot(
                              (activeSnapshotIndex + 1) %
                                activeModalProject.snapshots.length
                            )
                          }
                          className="w-8 h-8 rounded-full bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] flex items-center justify-center transition-colors cursor-pointer"
                          title="Next Screen"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Swiping Snap Runway */}
                  <div className="relative -mx-4 sm:-mx-8 py-2">
                    {/* Left & Right gradient edge fades (hidden on mobile for full view) */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[var(--card)] to-transparent z-10 hidden sm:block" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[var(--card)] to-transparent z-10 hidden sm:block" />

                    <div
                      ref={runwayRef}
                      onScroll={handleRunwayScroll}
                      className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 px-6 sm:px-12 py-3 no-scrollbar scroll-smooth items-center touch-pan-x"
                      style={{
                        WebkitOverflowScrolling: "touch",
                        scrollSnapType: "x mandatory",
                      }}
                    >
                      {activeModalProject.snapshots.map((snap, idx) => {
                        const isActive = activeSnapshotIndex === idx;
                        const isDesktop =
                          snap.aspect === "desktop" ||
                          (!snap.aspect && activeModalProject.deviceType === "web");

                        return (
                          <div
                            key={snap.badge}
                            ref={(el) => {
                              itemRefs.current[idx] = el;
                            }}
                            onClick={() => scrollToSnapshot(idx)}
                            className={`snap-center shrink-0 transition-all duration-300 cursor-pointer select-none touch-pan-x ${
                              isActive
                                ? "scale-100 opacity-100"
                                : "scale-[0.91] sm:scale-[0.93] opacity-60 hover:opacity-85"
                            }`}
                          >
                            {isDesktop ? (
                              /* Desktop / Laptop Browser Chassis Frame */
                              <div
                                className={`relative w-[84vw] max-w-[460px] sm:w-[500px] md:w-[560px] rounded-[18px] sm:rounded-[22px] p-2 sm:p-2.5 bg-[#0C0D14] border transition-all duration-300 shadow-xl ${
                                  isActive
                                    ? "border-emerald-500/80 dark:border-emerald-400 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
                                    : "border-slate-800 dark:border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                                }`}
                              >
                                {/* Minimal Browser Top Header */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 mb-1.5 bg-black/60 rounded-t-lg border-b border-white/[0.08]">
                                  <div className="w-2 h-2 rounded-full bg-rose-400/80" />
                                  <div className="w-2 h-2 rounded-full bg-amber-400/80" />
                                  <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                                  <div className="flex-1 mx-2 h-3 rounded-full bg-white/[0.06] flex items-center px-2">
                                    <span className="text-[9px] font-mono text-zinc-400 truncate">
                                      {snap.badge.includes("Operations") || snap.badge.includes("CRM") || snap.badge.includes("2FA")
                                        ? "crm.internal.app/pipeline"
                                        : snap.badge.includes("Booking")
                                          ? "portfolio.dev/#booking"
                                          : snap.badge.includes("Brief")
                                            ? "portfolio.dev/#contact"
                                            : snap.badge.includes("Work")
                                              ? "portfolio.dev/#work"
                                              : "portfolio.dev"}
                                    </span>
                                  </div>
                                </div>

                                {/* Screen Container with Desktop Aspect Ratio */}
                                <div className="relative rounded-[12px] sm:rounded-[16px] overflow-hidden bg-black aspect-[16/9.5]">
                                  {snap.imageSrc ? (
                                    <img
                                      src={snap.imageSrc}
                                      alt={snap.title}
                                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                                      loading="lazy"
                                      draggable={false}
                                    />
                                  ) : (
                                    <div className="w-full h-full p-4 flex flex-col justify-center bg-[var(--card)] text-xs">
                                      <span className="font-bold">{snap.title}</span>
                                      <span className="text-[10px] text-[var(--subtext)]">
                                        {snap.subtitle}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Bottom Screen Label */}
                                <div className="mt-2 flex items-center justify-between px-1">
                                  <span className="font-mono text-[10px] font-medium text-zinc-400 truncate max-w-[200px]">
                                    {snap.badge}
                                  </span>
                                  {isActive && (
                                    <span className="text-[9px] font-mono font-medium text-white bg-white/10 px-2 py-0.2 rounded-full border border-white/15">
                                      Viewing
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* Smartphone Chassis Frame (Architectural Precision) */
                              <div
                                className={`relative w-[68vw] max-w-[230px] sm:w-[250px] md:w-[270px] rounded-[30px] sm:rounded-[36px] p-2 sm:p-2.5 bg-[#0C0D14] border transition-all duration-300 shadow-xl ${
                                  isActive
                                    ? "border-emerald-500/80 dark:border-emerald-400 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
                                    : "border-slate-800 dark:border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                                }`}
                              >
                                {/* Dynamic Island Pill */}
                                <div className="absolute top-3.5 sm:top-4 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-2.5 sm:h-3 rounded-full bg-black z-20 flex items-center justify-end px-1.5">
                                  <div
                                    className={`w-1 h-1 rounded-full ${
                                      isActive
                                        ? "bg-emerald-400/90"
                                        : "bg-zinc-700"
                                    }`}
                                  />
                                </div>

                                {/* Screen Container with Smartphone Aspect Ratio */}
                                <div className="relative rounded-[22px] sm:rounded-[28px] overflow-hidden bg-black aspect-[9/19.5]">
                                  {snap.imageSrc ? (
                                    <img
                                      src={snap.imageSrc}
                                      alt={snap.title}
                                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                                      loading="lazy"
                                      draggable={false}
                                    />
                                  ) : (
                                    <div className="w-full h-full p-4 flex flex-col justify-center bg-[var(--card)] text-xs">
                                      <span className="font-bold">
                                        {snap.title}
                                      </span>
                                      <span className="text-[10px] text-[var(--subtext)]">
                                        {snap.subtitle}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Bottom Screen Label */}
                                <div className="mt-2 flex items-center justify-between px-1">
                                  <span className="font-mono text-[10px] font-medium text-zinc-400 truncate max-w-[130px]">
                                    {snap.badge}
                                  </span>
                                  {isActive && (
                                    <span className="text-[9px] font-mono font-medium text-white bg-white/10 px-2 py-0.2 rounded-full border border-white/15">
                                      Viewing
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Screen Context & Breakdown Card */}
                  <div className="rounded-2xl bg-[var(--background)] border border-[var(--border)] p-4 sm:p-6 shadow-inner space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSnapshotIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                Screen {activeSnapshotIndex + 1} of{" "}
                                {activeModalProject.snapshots.length}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                                {
                                  activeModalProject.snapshots[
                                    activeSnapshotIndex
                                  ].metric
                                }
                              </span>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                              {
                                activeModalProject.snapshots[
                                  activeSnapshotIndex
                                ].title
                              }
                            </h4>
                            <p className="font-mono text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">
                              {
                                activeModalProject.snapshots[
                                  activeSnapshotIndex
                                ].subtitle
                              }
                            </p>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[var(--subtext)] pt-3 leading-relaxed">
                          {
                            activeModalProject.snapshots[activeSnapshotIndex]
                              .description
                          }
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Thumbnail Strip for 1-Tap Quick Jump Across All 10 Screens */}
                    <div className="pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-[var(--subtext)] uppercase tracking-wider font-semibold">
                          Quick Jump (All{" "}
                          {activeModalProject.snapshots.length} Screens)
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {activeSnapshotIndex + 1} /{" "}
                          {activeModalProject.snapshots.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {activeModalProject.snapshots.map((snap, idx) => {
                          const isDesktop =
                            snap.aspect === "desktop" ||
                            (!snap.aspect && activeModalProject.deviceType === "web");
                          return (
                            <button
                              key={snap.badge}
                              type="button"
                              onClick={() => scrollToSnapshot(idx)}
                              className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                                isDesktop
                                  ? "w-16 h-11 sm:w-20 sm:h-13"
                                  : "w-11 h-18 sm:w-13 sm:h-22"
                              } ${
                                activeSnapshotIndex === idx
                                  ? "border-emerald-500 shadow-md scale-105 ring-2 ring-emerald-500/30"
                                  : "border-[var(--border)] opacity-60 hover:opacity-100 hover:border-slate-400"
                              }`}
                              title={snap.title}
                            >
                              {snap.imageSrc ? (
                                <img
                                  src={snap.imageSrc}
                                  alt={snap.badge}
                                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center text-[10px] font-mono font-bold">
                                  {idx + 1}
                                </div>
                              )}
                              <div className="absolute bottom-0 inset-x-0 bg-black/75 py-0.5 text-center text-[8px] font-mono text-white font-bold">
                                {idx + 1}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ═════════════════════════════════════════════════════════════ */
                /* WEB PLATFORM TABS & FRAME VIEW (FOR CRM / SAAS PLATFORMS)    */
                /* ═════════════════════════════════════════════════════════════ */
                <div className="space-y-4">
                  {/* Snapshot Selector Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {activeModalProject.snapshots.map((s, idx) => (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => setActiveSnapshotIndex(idx)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                          activeSnapshotIndex === idx
                            ? "bg-emerald-600 text-white font-bold shadow-xs"
                            : "bg-[var(--muted)] text-[var(--subtext)] hover:text-[var(--foreground)] border border-[var(--border)]"
                        }`}
                      >
                        {s.badge}
                      </button>
                    ))}
                  </div>

                  {/* Active Visual Snapshot Screen Viewer Frame */}
                  <div className="rounded-2xl bg-[var(--background)] border border-[var(--border)] p-4 sm:p-6 shadow-inner space-y-4 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSnapshotIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
                              {
                                activeModalProject.snapshots[
                                  activeSnapshotIndex
                                ].title
                              }
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                              {
                                activeModalProject.snapshots[
                                  activeSnapshotIndex
                                ].metric
                              }
                            </span>
                          </div>
                          <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {
                              activeModalProject.snapshots[
                                activeSnapshotIndex
                              ].subtitle
                            }
                          </p>
                          <p className="text-xs sm:text-sm text-[var(--subtext)] mt-2 leading-relaxed">
                            {
                              activeModalProject.snapshots[
                                activeSnapshotIndex
                              ].description
                            }
                          </p>
                        </div>

                        {/* Realistic Visual Mockup Screen / Screenshot */}
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 sm:p-4 shadow-md overflow-hidden flex items-center justify-center">
                          {activeModalProject.snapshots[activeSnapshotIndex].imageSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={activeModalProject.snapshots[activeSnapshotIndex].imageSrc}
                              alt={activeModalProject.snapshots[activeSnapshotIndex].title}
                              className="max-h-[380px] w-auto object-contain rounded-xl shadow-lg border border-[var(--border)]"
                              loading="lazy"
                            />
                          ) : (
                            <SnapshotScreen
                              type={
                                activeModalProject.snapshots[activeSnapshotIndex]
                                  .type
                              }
                              isCompact={false}
                            />
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Bottom Modal Navigation & Action Controls */}
              <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      scrollToSnapshot(
                        (activeSnapshotIndex - 1 + activeModalProject.snapshots.length) %
                          activeModalProject.snapshots.length
                      )
                    }
                    className="p-2 rounded-xl bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] transition-colors cursor-pointer"
                    title="Previous Snapshot"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      scrollToSnapshot((activeSnapshotIndex + 1) % activeModalProject.snapshots.length)
                    }
                    className="p-2 rounded-xl bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] transition-colors cursor-pointer"
                    title="Next Snapshot"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <span className="font-mono text-xs text-[var(--subtext)]">
                    Screen {activeSnapshotIndex + 1} of{" "}
                    {activeModalProject.snapshots.length}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {activeModalProject.githubUrl && (
                    <a
                      href={activeModalProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white font-bold font-mono text-xs transition-all shadow-sm"
                    >
                      <GithubIcon size={14} />
                      <span>View GitHub</span>
                    </a>
                  )}
                  {activeModalProject.apkUrl && (
                    <a
                      href={activeModalProject.apkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold font-mono text-xs hover:bg-emerald-700 transition-all shadow-sm"
                    >
                      <Download size={14} />
                      <span>Download APK v1.0.0</span>
                    </a>
                  )}
                  <a
                    href="#contact"
                    onClick={closeModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-xs transition-colors shadow-xs"
                  >
                    <span>Discuss this project</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
