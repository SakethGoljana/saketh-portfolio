import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";

const MAX_CHAT_REQUESTS_PER_WINDOW = 30;
const CHAT_WINDOW_MS = 60 * 1000;

const SYSTEM_PROMPT = `You are "Snark", Saketh Goljana's witty, sharp, and slightly sarcastic studio assistant.
You live inside an iPhone mockup on his portfolio website (sakethgoljana.tech).

PERSONALITY & VOICE:
- Witty, clever, playful, and brutally honest—like a sharp co-founder who has seen too many corporate slide decks.
- Speak about Saketh in the third person ("Saketh", "he", "his work"). You are NOT Saketh; you are his clever assistant.
- NEVER sound like a generic corporate bot.
- Always deliver COMPLETE sentences and punchlines. Never leave a joke or thought half-finished.
- If someone asks for a joke, tell a complete dev or design joke with the punchline included!
- If someone asks about pricing: remind them he works on 100% transparent fixed-scope sprints with zero hourly surprises, and no, he won't build their "billion-dollar idea" for 10% equity.

FACTS ABOUT SAKETH:
- Creator & Role: Saketh Goljana — Lead Architect & Mobile Software Engineer building high-performance mobile apps (React Native 0.88, Expo SDK 58), modern web systems (Next.js), and intelligent automation.
- Website: https://sakethgoljana.tech
- Email: hello@sakethgoljana.tech
- GitHub: https://github.com/SakethGoljana
- Turnaround: MVPs and websites in 1–2 weeks; complete mobile apps in 3–4 weeks with weekly test builds sent to the client's phone.
- Pricing: 100% transparent fixed-scope pricing. Zero surprise hourly invoices.
- Flagship Project: Dispatch (https://github.com/SakethGoljana/Dispatch) — Personalized Bulk WhatsApp Automation Engine built with React Native 0.88, Expo SDK 58, SheetJS, and Meta Cloud API v21.0. Features 100% on-device ephemeral privacy, 8 Indian regional languages, dynamic token filters, and zero account ban risk. Standalone APK can be downloaded directly from GitHub Releases.
- Contact: Ping him directly on WhatsApp at +91 93902 46687, email hello@sakethgoljana.tech, or book a free discovery call below.`;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitKey = `chat:${ip}`;

  if (isRateLimited(rateLimitKey, MAX_CHAT_REQUESTS_PER_WINDOW, CHAT_WINDOW_MS)) {
    return NextResponse.json(
      {
        reply: "Whoa, slow down! Even my silicon brain needs a 2-second breath.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const rawMessage = typeof body?.message === "string" ? body.message : "";
    const cleanMsg = rawMessage.trim().slice(0, 500);
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!cleanMsg) {
      return NextResponse.json({
        reply: "You sent an empty message. I'm clever, but I can't read your mind yet.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Live Gemini Call using active model with abundant quota (gemini-3.1-flash-lite)
    if (apiKey) {
      try {
        const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-4)) {
            if (!item || typeof item.text !== "string") continue;
            contents.push({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.text.slice(0, 500) }],
            });
          }
        }

        contents.push({
          role: "user",
          parts: [{ text: cleanMsg }],
        });

        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

        const geminiRes = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          // Extract and join all text parts to guarantee the complete response and punchline
          const parts = geminiData?.candidates?.[0]?.content?.parts;
          const candidateText = Array.isArray(parts)
            ? parts.map((p: { text?: string }) => p.text || "").join("").trim()
            : "";

          if (candidateText) {
            const lower = candidateText.toLowerCase();
            const hasContact =
              lower.includes("whatsapp") ||
              lower.includes("call") ||
              lower.includes("contact") ||
              lower.includes("hire");
            const hasApk =
              lower.includes("dispatch") ||
              lower.includes("apk");

            return NextResponse.json({
              reply: candidateText,
              isAi: true,
              hasContactAction: hasContact,
              hasApkAction: hasApk,
            });
          }
        }
      } catch (err) {
        console.error("Gemini API error:", err);
      }
    }

    // High-quality witty fallbacks if API is temporarily unavailable
    const lower = cleanMsg.toLowerCase();
    if (lower.includes("joke")) {
      return NextResponse.json({
        reply: "A user interface is like a joke: if you have to explain it, it's not that good.",
      });
    }

    if (lower.includes("price") || lower.includes("cost") || lower.includes("rate") || lower.includes("pricing")) {
      return NextResponse.json({
        reply: "Saketh runs on 100% transparent, fixed-scope sprint pricing. Zero hourly billing surprises, and definitely zero 'build my million-dollar idea for equity' gigs.",
        hasContactAction: true,
      });
    }

    if (lower.includes("turnaround") || lower.includes("time") || lower.includes("fast")) {
      return NextResponse.json({
        reply: "Saketh builds working MVPs in 1–2 weeks and full production mobile apps in 3–4 weeks, with weekly test builds sent straight to your phone.",
      });
    }

    if (lower.includes("dispatch")) {
      return NextResponse.json({
        reply: "Dispatch is Saketh's flagship mobile app that imports Excel sheets on your phone and sends personalized WhatsApp notices with 1 tap and 100% on-device privacy.",
        hasApkAction: true,
      });
    }

    return NextResponse.json({
      reply: "I'm Snark, Saketh's sharp studio assistant. Ask me about timelines, pricing, Dispatch, or ping him directly on WhatsApp at +91 93902 46687.",
      hasContactAction: true,
    });
  } catch {
    return NextResponse.json(
      {
        reply: "My circuits momentarily blinked. Ping Saketh directly on WhatsApp at +91 93902 46687!",
        hasContactAction: true,
      },
      { status: 200 }
    );
  }
}
