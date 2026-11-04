/**
 * Device Haptic Engine for Web & Mobile
 * Uses navigator.vibrate for tactile physical feedback.
 */

type HapticType = "tap" | "click" | "snap" | "success" | "error" | "toggle";

export function triggerHaptic(type: HapticType = "tap") {
  if (typeof window === "undefined") return;

  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === "tap" || type === "click") {
        navigator.vibrate(10);
      } else if (type === "snap" || type === "toggle") {
        navigator.vibrate(15);
      } else if (type === "success") {
        navigator.vibrate([10, 30, 15]);
      } else if (type === "error") {
        navigator.vibrate([20, 40, 20]);
      }
    }
  } catch {}
}
