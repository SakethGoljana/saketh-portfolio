"use client";

import Link from "next/link";
import { RefreshCw, Home, AlertOctagon } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0A0B10] text-[#EDEDED] font-sans flex flex-col items-center justify-center p-6 antialiased selection:bg-[#10B981] selection:text-black">
        <main className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-mono text-rose-400">
            <AlertOctagon size={14} />
            <span>GLOBAL ROOT ANOMALY</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">
            Root Layout Failure
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed">
            The application experienced a critical fault in the top-level layout.
            State isolation has protected system integrity.
          </p>

          <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-left text-zinc-300 overflow-x-auto">
            <span className="text-zinc-500 text-[10px] block mb-1">FATAL TRACE</span>
            <p className="text-rose-400">{error.message || "Unknown root layout exception"}</p>
            {error.digest && (
              <p className="text-zinc-500 text-[10px] mt-1">Digest: {error.digest}</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold transition-all cursor-pointer shadow-lg"
            >
              <RefreshCw size={14} />
              <span>Retry Root</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
            >
              <Home size={14} />
              <span>Hard Reload</span>
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
