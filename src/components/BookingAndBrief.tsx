"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Send,
  Sparkles,
  Phone,
  ArrowUpRight,
  Download,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sunrise,
  Star,
  Video,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { triggerHaptic } from "@/utils/haptics";

/* ──────────────────────────────────────────────────────────────────────── */
/*  DATA LAYER                                                            */
/* ──────────────────────────────────────────────────────────────────────── */

const TIME_PERIODS = [
  {
    period: "Morning",
    range: "10:00 AM – 12:30 PM",
    icon: Sunrise,
    slots: ["10:00 AM", "10:45 AM", "11:30 AM", "12:15 PM"],
  },
  {
    period: "Afternoon",
    range: "1:30 PM – 5:00 PM",
    icon: Sun,
    slots: ["02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM"],
  },
  {
    period: "Evening",
    range: "5:30 PM – 8:00 PM",
    icon: Moon,
    slots: ["05:30 PM", "06:15 PM", "07:00 PM", "07:45 PM"],
  },
];

const SERVICES = ["Mobile App", "Web Platform", "AI Automation", "Full Redesign"];
const BUDGET_OPTIONS = [
  "Discuss openly on call (Flexible)",
  "Lean MVP / Founder-friendly",
  "Milestone-based sprints",
  "Tailored scope",
];
const TIMELINES = ["ASAP (< 2 weeks)", "1 to 2 months", "Flexible"];

export default function BookingAndBrief() {
  const [activeTab, setActiveTab] = useState<"call" | "brief">("call");

  // Real Month Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    return new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "Asia/Kolkata" });
  });
  const [selectedSlot, setSelectedSlot] = useState<string>("11:30 AM");
  const [bookName, setBookName] = useState<string>("");
  const [bookContact, setBookContact] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [bookError, setBookError] = useState("");
  const [mobilePeriod, setMobilePeriod] = useState<"All" | "Morning" | "Afternoon" | "Evening">("All");

  // Brief State
  const [selectedService, setSelectedService] = useState<string>("Mobile App");
  const [selectedBudget, setSelectedBudget] = useState<string>(BUDGET_OPTIONS[0]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>(TIMELINES[0]);
  const [briefName, setBriefName] = useState<string>("");
  const [briefContact, setBriefContact] = useState<string>("");
  const [briefNotes, setBriefNotes] = useState<string>("");
  const [isSendingBrief, setIsSendingBrief] = useState(false);
  const [briefSuccess, setBriefSuccess] = useState(false);
  const [briefError, setBriefError] = useState("");
  const [botHoneypot, setBotHoneypot] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("sakethgoljana098@gmail.com");
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    triggerHaptic("tap");
  };

  const handleNextMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    triggerHaptic("tap");
  };

  // Calendar Day Generator
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Monday-based start index (0 = Mon, 6 = Sun)
    const startDay = (firstDay.getDay() + 6) % 7;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Leading days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Trailing days from next month
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  }, [currentMonthDate]);

  // Mobile Upcoming Days Strip (Next 14 Days)
  const mobileUpcomingDays = useMemo(() => {
    const list: { date: Date; dayName: string; dayNum: number; monthName: string; isToday: boolean; formatted: string }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push({
        date: d,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString("en-US", { month: "short" }),
        isToday: i === 0,
        formatted: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      });
    }
    return list;
  }, []);

  // Filtered mobile slots
  const mobileSlots = useMemo(() => {
    if (mobilePeriod === "All") {
      return TIME_PERIODS.flatMap((p) => p.slots.map((s) => ({ slot: s, period: p.period })));
    }
    const found = TIME_PERIODS.find((p) => p.period === mobilePeriod);
    return (found?.slots || []).map((s) => ({ slot: s, period: mobilePeriod }));
  }, [mobilePeriod]);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target < today;
  };

  // Calendar export helpers with precise UTC date-time calculations
  const getSlotUtcTimes = () => {
    const match = selectedSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let hours = 11;
    let minutes = 30;
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const isPm = match[3].toUpperCase() === "PM";
      if (isPm && hours < 12) hours += 12;
      if (!isPm && hours === 12) hours = 0;
    }
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    const istOffsetMinutes = 330; // IST is UTC+5:30
    const totalMinutesUtc = hours * 60 + minutes - istOffsetMinutes;
    const start = new Date(Date.UTC(year, month, day, 0, totalMinutesUtc, 0));
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const formatIso = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return { startIso: formatIso(start), endIso: formatIso(end) };
  };

  const getGoogleCalendarUrl = () => {
    if (!selectedDay || !selectedSlot) return "#";
    const { startIso, endIso } = getSlotUtcTimes();
    const title = encodeURIComponent(`Intro Call · Saketh × ${bookName || "Partner"}`);
    const details = encodeURIComponent(
      `30-minute introductory architecture & design discussion.\nDate & Time: ${selectedDay} at ${selectedSlot} IST (UTC+5:30)\nContact: ${bookContact}\nMeeting link will be shared via email/WhatsApp prior to the call.`
    );
    const location = encodeURIComponent("Google Meet");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}`;
  };

  const downloadIcs = () => {
    const { startIso, endIso } = getSlotUtcTimes();
    const nowIso = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = `Intro Call · Saketh × ${bookName || "Partner"}`;
    const description = `30-minute introductory architecture & design discussion.\nDate: ${selectedDay} at ${selectedSlot} IST.\nContact: ${bookContact}`;
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Saketh Portfolio//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:call-${Date.now()}@saketh.dev`,
      `DTSTAMP:${nowIso}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      "LOCATION:Google Meet",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    const blobUrl = window.URL.createObjectURL(blob);
    link.href = blobUrl;
    link.setAttribute("download", "saketh-intro-call.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleConfirmCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botHoneypot) return;
    if (!selectedDay || !selectedSlot) {
      setBookError("Please select both a day and a time slot.");
      return;
    }
    if (!bookName.trim()) {
      setBookError("Please enter your name.");
      return;
    }
    if (!bookContact.trim()) {
      setBookError("Please provide your email or WhatsApp number so I can confirm the slot.");
      return;
    }
    setBookError("");
    setIsBooking(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "call_booking",
          day: selectedDay,
          slot: selectedSlot,
          name: bookName.trim(),
          contact: bookContact.trim(),
          website_hp: botHoneypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to confirm slot. Please reach out via WhatsApp.");
      }

      setBookedSuccess(true);
      triggerHaptic("success");
    } catch (err) {
      setBookError(
        err instanceof Error ? err.message : "Unable to confirm slot. Please reach out via WhatsApp."
      );
      triggerHaptic("error");
    } finally {
      setIsBooking(false);
    }
  };

  const handleSendBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botHoneypot) return;
    if (!briefName.trim()) {
      setBriefError("Please enter your name.");
      return;
    }
    if (!briefContact.trim()) {
      setBriefError("Please provide your email or WhatsApp number.");
      return;
    }
    setBriefError("");
    setIsSendingBrief(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "project_brief",
          name: briefName.trim(),
          contact: briefContact.trim(),
          service: selectedService,
          budget: selectedBudget,
          timeline: selectedTimeline,
          notes: briefNotes.trim(),
          website_hp: botHoneypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send brief. Please message directly on WhatsApp.");
      }

      setBriefSuccess(true);
      triggerHaptic("success");
    } catch (err) {
      setBriefError(
        err instanceof Error ? err.message : "Failed to send brief. Please message directly on WhatsApp."
      );
      triggerHaptic("error");
    } finally {
      setIsSendingBrief(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-10 sm:py-16 md:py-20 px-5 sm:px-8 bg-[var(--background)] border-t border-[var(--border)] relative overflow-hidden transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 dark:border-emerald-400/20 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              <span>04 · GET IN TOUCH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              Let&apos;s build something extraordinary.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[var(--subtext)] max-w-md font-normal leading-relaxed">
            Whether you need a standalone mobile application, an ultra-fast web product, or intelligent automation—I&apos;m ready to collaborate.
          </p>
        </div>

        {/* Quick WhatsApp Action Strip */}
        <div className="mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#25D366] text-black flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <span>Instant WhatsApp Direct Line</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              </div>
              <div className="text-xs text-[var(--subtext)] font-mono mt-0.5">
                Chat directly with Saketh (+91 93902 46687) · Quick reply
              </div>
            </div>
          </div>
          <a
            href="https://wa.me/919390246687"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold font-mono text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xs cursor-pointer min-h-[38px] sm:min-h-[44px]"
          >
            <span>Message on WhatsApp</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Mode Toggle Tabs (Universal Glassmorphic Track) */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 sm:inline-flex p-1 rounded-xl sm:rounded-full bg-slate-100/90 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 w-full sm:w-auto shadow-xs relative">
          <button
            type="button"
            onClick={() => {
              setActiveTab("call");
              triggerHaptic("toggle");
            }}
            className={`relative flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer min-h-[38px] sm:min-h-[42px] select-none ${
              activeTab === "call"
                ? "text-white font-bold"
                : "text-[var(--subtext)] hover:text-[var(--foreground)]"
            }`}
          >
            {activeTab === "call" && (
              <motion.div
                layoutId="active-booking-tab-pill"
                className="absolute inset-0 rounded-lg sm:rounded-full bg-emerald-600 shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              <CalendarIcon size={14} />
              <span>Book a call</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("brief");
              triggerHaptic("toggle");
            }}
            className={`relative flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer min-h-[38px] sm:min-h-[42px] select-none ${
              activeTab === "brief"
                ? "text-white font-bold"
                : "text-[var(--subtext)] hover:text-[var(--foreground)]"
            }`}
          >
            {activeTab === "brief" && (
              <motion.div
                layoutId="active-booking-tab-pill"
                className="absolute inset-0 rounded-lg sm:rounded-full bg-emerald-600 shadow-sm"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              <Send size={14} />
              <span>Send brief</span>
            </span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* UNIFIED ADAPTIVE CHASSIS (Equal in Light & Dark Mode)             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {/* TAB 1: CALL BOOKING (INSPIRED BY REFERENCE DESIGN) */}
          {activeTab === "call" && (
            <motion.div
              key="booking-tab-call"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {bookedSuccess ? (
                <div className="py-12 px-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/90 dark:border-white/10 text-[var(--foreground)] flex flex-col items-center text-center shadow-lg dark:shadow-none animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--foreground)]">Slot Requested!</h4>
                  <p className="font-mono text-sm sm:text-base text-emerald-600 dark:text-emerald-400 mb-2 font-semibold">
                    {selectedDay} at {selectedSlot} IST
                  </p>
                  <p className="text-sm text-[var(--subtext)] max-w-md mb-6 leading-relaxed">
                    Thank you! I will verify the timeslot and send you a confirmation email with the Google Meet link to{" "}
                    <strong className="text-[var(--foreground)]">{bookContact}</strong>.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
                    <a
                      href={getGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-xs cursor-pointer min-h-[38px]"
                    >
                      <ExternalLink size={13} />
                      <span>Add to Google Calendar</span>
                    </a>
                    <button
                      type="button"
                      onClick={downloadIcs}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 hover:bg-slate-200 dark:hover:bg-white/20 text-[var(--foreground)] text-xs font-mono transition-all cursor-pointer min-h-[38px]"
                    >
                      <Download size={13} />
                      <span>Download .ics</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBookedSuccess(false);
                      setBookName("");
                      setBookContact("");
                    }}
                    className="px-5 py-2 rounded-full border border-slate-300 dark:border-white/20 hover:border-emerald-500 text-xs font-mono text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors cursor-pointer min-h-[36px]"
                  >
                    Pick another time
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleConfirmCall}
                  className="rounded-3xl p-5 sm:p-7 md:p-8 bg-white dark:bg-[#121622] text-[var(--foreground)] border border-slate-200/90 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-none relative overflow-hidden transition-colors duration-200"
                >
                  {/* Subtle Background Glows */}
                  <div className="absolute -top-32 left-1/4 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Header Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-200 dark:border-white/10 relative z-10">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                        <span>Select date and time</span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                          100% Free Intro
                        </span>
                      </h3>
                      <p className="text-xs text-[var(--subtext)] font-mono mt-0.5">
                        Choose your preferred time slot · You will receive an email confirmation once verified
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--subtext)] self-start sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Asia/Kolkata (IST · UTC+5:30)</span>
                    </div>
                  </div>

                  {/* ════════════════════════════════════════════════════════════════ */}
                  {/* DESKTOP & LAPTOP LAYOUT (>= lg): 3-COLUMN DASHBOARD (INTACT)     */}
                  {/* ════════════════════════════════════════════════════════════════ */}
                  <div className="hidden lg:block relative z-10">
                    {/* 3-Column Split Board matching reference */}
                    <div className="grid grid-cols-12 gap-6 pt-5">
                      
                      {/* ───── 1. Left Column: Meeting Info & Host ───── */}
                      <div className="col-span-3 space-y-3.5">
                        {/* Meeting Scope Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-1.5">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                            <Sparkles size={13} />
                            <span>Scope &amp; Architecture</span>
                          </div>
                          <div className="font-bold text-sm text-[var(--foreground)]">
                            30-Min Engineering Call
                          </div>
                          <p className="text-xs text-[var(--subtext)] leading-relaxed pt-1">
                            Direct discussion on scope, timeline &amp; budget. Direct engineer talk with zero pushy sales.
                          </p>
                        </div>

                        {/* Host Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                              SG
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-[var(--foreground)] truncate">Saketh Goljana</div>
                              <div className="text-[11px] text-[var(--subtext)] font-mono truncate">Freelance Developer</div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 dark:border-white/5 space-y-1.5 text-xs font-mono text-[var(--subtext)]">
                            <div className="flex items-center justify-between">
                              <span>Duration</span>
                              <span className="font-bold text-[var(--foreground)]">30 min</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Platform</span>
                              <span className="font-bold text-[var(--foreground)]">Google Meet</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Confirmation</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">Via Email</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ───── 2. Middle Column: Interactive Month Calendar ───── */}
                      <div className="col-span-4 p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between">
                        <div>
                          {/* Month Header with < > Controls */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold font-mono text-[var(--foreground)]">
                              {currentMonthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                                aria-label="Previous month"
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                                aria-label="Next month"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Weekday Labels */}
                          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-semibold text-[var(--subtext)] mb-2">
                            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((dayName) => (
                              <span key={dayName} className="py-1">
                                {dayName}
                              </span>
                            ))}
                          </div>

                          {/* Days Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {calendarDays.map((d, index) => {
                              const isSelected = isSameDay(d.date, selectedDate);
                              const isPast = isDatePast(d.date);
                              const isCurrentMonth = d.isCurrentMonth;

                              return (
                                <button
                                  key={`${d.date.toISOString()}-${index}`}
                                  type="button"
                                  disabled={isPast || !isCurrentMonth}
                                  onClick={() => {
                                    if (!isPast && isCurrentMonth) {
                                      setSelectedDate(d.date);
                                      setSelectedDay(
                                        d.date.toLocaleDateString("en-US", {
                                          weekday: "short",
                                          month: "short",
                                          day: "numeric",
                                        })
                                      );
                                      triggerHaptic("tap");
                                    }
                                  }}
                                  className={`h-9 w-full rounded-xl flex items-center justify-center font-mono text-xs font-semibold transition-all duration-150 ${
                                    isSelected
                                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/35 ring-2 ring-emerald-400 scale-105"
                                      : !isCurrentMonth
                                      ? "text-slate-400 dark:text-zinc-700 cursor-not-allowed opacity-30"
                                      : isPast
                                      ? "text-slate-400 dark:text-zinc-700 cursor-not-allowed opacity-30"
                                      : "text-[var(--foreground)] hover:bg-slate-200/80 dark:hover:bg-white/10 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer active:scale-95"
                                  }`}
                                >
                                  {d.day}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-white/5 text-[11px] font-mono text-[var(--subtext)] flex items-center justify-between">
                          <span>Selected date:</span>
                          <span className="font-bold text-[var(--foreground)]">
                            {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* ───── 3. Right Column: Structured Time Slots by Period ───── */}
                      <div className="col-span-5 p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                            <div className="font-bold text-sm text-[var(--foreground)]">
                              {selectedDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                              30-Min Duration
                            </span>
                          </div>

                          {/* Period Slots */}
                          <div className="space-y-3.5">
                            {TIME_PERIODS.map((period) => {
                              const PeriodIcon = period.icon;
                              return (
                                <div key={period.period} className="space-y-1.5">
                                  <div className="flex items-center justify-between text-xs font-mono text-[var(--subtext)]">
                                    <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                                      <PeriodIcon size={13} className="text-emerald-600 dark:text-emerald-400" />
                                      <span>{period.period}</span>
                                    </div>
                                    <span className="text-[10px] text-[var(--subtext)]">{period.range}</span>
                                  </div>

                                  <div className="grid grid-cols-4 gap-1.5">
                                    {period.slots.map((slot) => {
                                      const active = selectedSlot === slot;
                                      return (
                                        <button
                                          key={slot}
                                          type="button"
                                          onClick={() => {
                                            setSelectedSlot(slot);
                                            triggerHaptic("tap");
                                          }}
                                          className={`py-2 px-1 rounded-xl text-[11px] font-mono font-semibold transition-all duration-150 cursor-pointer text-center ${
                                            active
                                              ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400 scale-[1.02]"
                                              : "bg-white dark:bg-white/5 text-[var(--foreground)] border border-slate-200/90 dark:border-white/10 hover:border-emerald-400/60 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95"
                                          }`}
                                        >
                                          {active ? `★ ${slot}` : slot}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-white/5 text-[11px] font-mono text-[var(--subtext)] flex items-center justify-between">
                          <span>Selected slot:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedSlot}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Confirmation Bar */}
                    <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 flex flex-row items-center justify-between gap-4">
                      {/* Selected Summary Pill & Notice */}
                      <div className="flex items-center gap-3">
                        <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold inline-flex items-center gap-1.5 self-start">
                          <Star size={12} className="text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                          <span>
                            {selectedSlot}, {selectedDay}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--subtext)] font-mono">
                          Confirmation email sent upon verification
                        </span>
                      </div>

                      {/* Desktop Inputs & CTA */}
                      <div className="flex items-center gap-2.5">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={bookName}
                          onChange={(e) => setBookName(e.target.value)}
                          className="w-36 px-3.5 py-2.5 bg-slate-100/80 dark:bg-white/5 border border-slate-300 dark:border-white/15 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#1E1E26] rounded-xl text-xs text-[var(--foreground)] placeholder:text-[var(--subtext)] outline-none transition-all shadow-2xs"
                        />
                        <input
                          type="text"
                          placeholder="Email or WhatsApp"
                          value={bookContact}
                          onChange={(e) => setBookContact(e.target.value)}
                          className="w-44 px-3.5 py-2.5 bg-slate-100/80 dark:bg-white/5 border border-slate-300 dark:border-white/15 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#1E1E26] rounded-xl text-xs text-[var(--foreground)] placeholder:text-[var(--subtext)] outline-none transition-all shadow-2xs"
                        />
                        <button
                          type="submit"
                          disabled={isBooking}
                          className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs active:scale-95 transition-all shadow-md shadow-emerald-500/20 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
                        >
                          {isBooking ? "Confirming..." : "Save and Continue"}
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ════════════════════════════════════════════════════════════════ */}
                  {/* DEDICATED MOBILE SCREEN LAYOUT (< lg): THUMB-FIRST & FAST       */}
                  {/* ════════════════════════════════════════════════════════════════ */}
                  <div className="block lg:hidden pt-3 space-y-4 relative z-10">
                    {/* Compact Host & Scope Header Banner */}
                    <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                          SG
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[var(--foreground)] truncate">Saketh Goljana</div>
                          <div className="text-[11px] text-[var(--subtext)] font-mono truncate">Freelance Developer · 30m Free Call</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold shrink-0">
                        <Video size={11} />
                        <span>Google Meet</span>
                      </div>
                    </div>

                    {/* 1. Date Selection: Swipeable Horizontal Day Strip */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-0.5">
                        <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--foreground)]">
                          1 · Select Date
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {selectedDay}
                        </span>
                      </div>

                      {/* Horizontal Scroll Day Strip */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 -mx-1 px-1 no-scrollbar scroll-smooth snap-x">
                        {mobileUpcomingDays.map((d) => {
                          const isSelected = isSameDay(d.date, selectedDate);
                          return (
                            <button
                              key={d.date.toISOString()}
                              type="button"
                              onClick={() => {
                                setSelectedDate(d.date);
                                setSelectedDay(d.formatted);
                                triggerHaptic("tap");
                              }}
                              className={`shrink-0 snap-start flex flex-col items-center justify-center w-[60px] py-2 px-1.5 rounded-2xl border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/30 scale-[1.02]"
                                  : "bg-slate-100/90 dark:bg-white/5 border-slate-200/90 dark:border-white/10 text-[var(--foreground)] hover:border-emerald-400/60 active:scale-95"
                              }`}
                            >
                              <span
                                className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                                  isSelected
                                    ? "text-emerald-200"
                                    : d.isToday
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-[var(--subtext)]"
                                }`}
                              >
                                {d.isToday ? "Today" : d.dayName}
                              </span>
                              <span className="text-base font-bold font-mono my-0.5">
                                {d.dayNum}
                              </span>
                              <span className={`text-[10px] font-mono ${isSelected ? "text-emerald-200" : "text-[var(--subtext)]"}`}>
                                {d.monthName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Time Slots: Period Filter & 3-Col Touch Chips */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between px-0.5">
                        <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--foreground)]">
                          2 · Select Time Slot
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {selectedSlot} IST
                        </span>
                      </div>

                      {/* Mobile Period Filter Tabs */}
                      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[11px] font-mono">
                        {(["All", "Morning", "Afternoon", "Evening"] as const).map((period) => (
                          <button
                            key={period}
                            type="button"
                            onClick={() => {
                              setMobilePeriod(period);
                              triggerHaptic("toggle");
                            }}
                            className={`py-1.5 px-1 rounded-lg font-semibold transition-all cursor-pointer text-center text-[10px] sm:text-xs ${
                              mobilePeriod === period
                                ? "bg-emerald-600 text-white shadow-xs font-bold"
                                : "text-[var(--subtext)] hover:text-[var(--foreground)]"
                            }`}
                          >
                            {period}
                          </button>
                        ))}
                      </div>

                      {/* Time Chips (3 columns, 44px min height for touch targets) */}
                      <div className="grid grid-cols-3 gap-2">
                        {mobileSlots.map(({ slot }) => {
                          const active = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(slot);
                                triggerHaptic("tap");
                              }}
                              className={`h-11 rounded-xl text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                                active
                                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400 scale-[1.02]"
                                  : "bg-slate-100/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-[var(--foreground)] active:scale-95 hover:border-emerald-400"
                              }`}
                            >
                              {active ? `★ ${slot}` : slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Summary Callout & Form Fields */}
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-3">
                      {/* Selected Slot Callout with Confirmation Note */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                            <Star size={13} className="fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
                            <span>{selectedSlot} · {selectedDay}</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                            30-Min Call
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--subtext)] font-mono leading-relaxed">
                          You will receive a confirmation email once the slot is verified.
                        </p>
                      </div>

                      {/* Full-width Touch-Friendly Inputs */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[11px] font-mono text-[var(--subtext)] mb-1 font-semibold">
                            Your Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Alex Vance"
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                            className="w-full h-12 px-3.5 bg-slate-100/90 dark:bg-white/5 border border-slate-300 dark:border-white/15 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#1E1E26] rounded-xl text-base sm:text-sm text-[var(--foreground)] placeholder:text-[var(--subtext)] outline-none transition-all shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[var(--subtext)] mb-1 font-semibold">
                            Email or WhatsApp <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="alex@company.com or phone"
                            value={bookContact}
                            onChange={(e) => setBookContact(e.target.value)}
                            className="w-full h-12 px-3.5 bg-slate-100/90 dark:bg-white/5 border border-slate-300 dark:border-white/15 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#1E1E26] rounded-xl text-base sm:text-sm text-[var(--foreground)] placeholder:text-[var(--subtext)] outline-none transition-all shadow-2xs"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isBooking}
                          className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                        >
                          <span>{isBooking ? "Confirming..." : "Save and Continue"}</span>
                          <ArrowUpRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Shared Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={botHoneypot}
                      onChange={(e) => setBotHoneypot(e.target.value)}
                    />
                  </div>

                  {bookError && (
                    <div className="mt-3 text-xs text-rose-500 font-mono font-semibold">
                      {bookError}
                    </div>
                  )}
                </form>
              )}
            </motion.div>
          )}

          {/* TAB 2: SEND A PROJECT BRIEF (UNIFIED THEME & ARCHITECTURE) */}
          {activeTab === "brief" && (
            <motion.div
              key="booking-tab-brief"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {briefSuccess ? (
                <div className="py-12 px-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/90 dark:border-white/10 text-[var(--foreground)] flex flex-col items-center text-center shadow-lg dark:shadow-none animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--foreground)]">Brief Received!</h4>
                  <p className="text-base text-[var(--subtext)] max-w-md mb-6 leading-relaxed">
                    Thank you! I will review your requirements personally and reply to{" "}
                    <strong className="text-[var(--foreground)]">{briefContact}</strong> within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBriefSuccess(false);
                      setSelectedService("Mobile App");
                      setSelectedBudget(BUDGET_OPTIONS[0]);
                      setSelectedTimeline(TIMELINES[0]);
                      setBriefName("");
                      setBriefContact("");
                      setBriefNotes("");
                    }}
                    className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-white/20 hover:border-emerald-500 text-xs font-mono text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    Send another brief
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSendBrief}
                  className="rounded-3xl p-5 sm:p-7 md:p-8 bg-white dark:bg-[#121622] text-[var(--foreground)] border border-slate-200/90 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-none relative overflow-hidden transition-colors duration-200"
                >
                  {/* Subtle Background Glows */}
                  <div className="absolute -top-32 left-1/4 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-200 dark:border-white/10 relative z-10">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
                        <span>Project Scope &amp; Brief</span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                          Zero Agency Overhead
                        </span>
                      </h3>
                      <p className="text-xs text-[var(--subtext)] font-mono mt-0.5">
                        Tell me about your product, timeline &amp; goals · Direct reply within 24 hours
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--subtext)] self-start sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Direct Engineer Review</span>
                    </div>
                  </div>

                  {/* 2-Column Balanced Dashboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pt-5 relative z-10">
                    {/* Left 6 cols: Service, Budget & Timeline */}
                    <div className="lg:col-span-6 space-y-4">
                      {/* 1. Service Needed */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2">
                        <label className="block font-mono text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider">
                          1 · What are we building?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {SERVICES.map((s) => {
                            const active = selectedService === s;
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setSelectedService(s);
                                  triggerHaptic("tap");
                                }}
                                className={`py-2 px-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-center ${
                                  active
                                    ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/25 scale-[1.02]"
                                    : "bg-white dark:bg-white/5 text-[var(--foreground)] border border-slate-200/90 dark:border-white/10 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Budget Model */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2">
                        <label className="block font-mono text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider">
                          2 · Pricing Model
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {BUDGET_OPTIONS.map((b) => {
                            const active = selectedBudget === b;
                            return (
                              <button
                                key={b}
                                type="button"
                                onClick={() => {
                                  setSelectedBudget(b);
                                  triggerHaptic("tap");
                                }}
                                className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                                  active
                                    ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/25 scale-[1.01]"
                                    : "bg-white dark:bg-white/5 text-[var(--foreground)] border border-slate-200/90 dark:border-white/10 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                                }`}
                              >
                                {b}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Timeline */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2">
                        <label className="block font-mono text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider">
                          3 · Target Timeline
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {TIMELINES.map((t) => {
                            const active = selectedTimeline === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => {
                                  setSelectedTimeline(t);
                                  triggerHaptic("tap");
                                }}
                                className={`py-2 px-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-center ${
                                  active
                                    ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/25 scale-[1.02]"
                                    : "bg-white dark:bg-white/5 text-[var(--foreground)] border border-slate-200/90 dark:border-white/10 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                                }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right 6 cols: Project Notes */}
                    <div className="lg:col-span-6 flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                      <div className="space-y-2 flex-1 flex flex-col">
                        <label className="block font-mono text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider">
                          4 · Project Notes &amp; Key Features
                        </label>
                        <textarea
                          rows={6}
                          placeholder="Describe the problem, target users, reference links, key deliverables, or deadlines..."
                          value={briefNotes}
                          onChange={(e) => setBriefNotes(e.target.value)}
                          className="w-full flex-1 p-3.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--subtext)] outline-none transition-all resize-none shadow-2xs leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ───── Bottom Bar ───── */}
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--subtext)] font-mono">
                        Direct reply to your email or WhatsApp within 24 hours
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={briefName}
                        onChange={(e) => setBriefName(e.target.value)}
                        className="w-full sm:w-36 px-3.5 py-2.5 bg-slate-100/80 dark:bg-white/5 border border-slate-300 dark:border-white/15 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#1E1E26] rounded-xl text-xs text-[var(--foreground)] placeholder:text-[var(--subtext)] outline-none transition-all shadow-2xs"
                      />
                      <input
                        type="text"
                        placeholder="Email or WhatsApp"
                        value={briefContact}
                        onChange={(e) => setBriefContact(e.target.value)}
                        className="w-full sm:w-44 px-3.5 py-2.5 bg-slate-100/80 dark:bg-white/5 border border-slate-300 dark:border-white/15 focus:border-emerald-500 focus:bg-white dark:focus:bg-[#1E1E26] rounded-xl text-xs text-[var(--foreground)] placeholder:text-[var(--subtext)] outline-none transition-all shadow-2xs"
                      />

                      {/* Honeypot field */}
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="website_hp_brief"
                          tabIndex={-1}
                          autoComplete="off"
                          value={botHoneypot}
                          onChange={(e) => setBotHoneypot(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingBrief}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs active:scale-95 transition-all shadow-md shadow-emerald-500/20 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
                      >
                        {isSendingBrief ? "Sending..." : "Send Project Brief"}
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>

                  {briefError && (
                    <div className="mt-3 text-xs text-rose-500 font-mono font-semibold">
                      {briefError}
                    </div>
                  )}
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Direct Reachout Bar */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--subtext)]">
          <div className="flex items-center gap-2">
            <span>Direct Email:</span>
            <span className="font-bold text-[var(--foreground)]">sakethgoljana098@gmail.com</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1 rounded hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors cursor-pointer"
              title="Copy Email"
            >
              {copiedEmail ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Replies within 2 hours</span>
            </span>
            <span>·</span>
            <span>Based in Hyderabad (IST)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
