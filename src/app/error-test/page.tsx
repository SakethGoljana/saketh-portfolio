"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Bug } from "lucide-react";

export default function ErrorTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error(
      "Simulated client exception: The error boundary successfully caught this runtime crash!"
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)] text-[var(--foreground)] text-center relative selection:bg-rose-500 selection:text-white">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto mb-2">
          <Bug size={24} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Error Boundary Test Rig
        </h1>

        <p className="text-xs sm:text-sm text-[var(--subtext)] leading-relaxed">
          This test environment allows you to inspect your custom{" "}
          <code className="text-rose-500 font-mono text-xs">error.tsx</code>{" "}
          runtime exception boundary in real time.
        </p>

        <button
          type="button"
          onClick={() => setShouldCrash(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
        >
          <AlertTriangle size={15} />
          <span>Trigger 500 Runtime Exception</span>
        </button>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
