/**
 * Universal Haptic Engine for Web & Mobile
 * Combines physical device vibration (navigator.vibrate) with 
 * synthesized Apple Taptic-style Web Audio clicks.
 */

type HapticType = "tap" | "click" | "snap" | "success" | "toggle";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function triggerHaptic(type: HapticType = "tap") {
  if (typeof window === "undefined") return;

  // 1. Physical Device Vibration (Mobile Browsers)
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === "tap" || type === "click") {
        navigator.vibrate(10);
      } else if (type === "snap" || type === "toggle") {
        navigator.vibrate(15);
      } else if (type === "success") {
        navigator.vibrate([10, 30, 15]);
      }
    }
  } catch {}
}
