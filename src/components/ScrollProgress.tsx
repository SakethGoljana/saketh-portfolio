"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] pointer-events-none bg-transparent"
    >
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        style={{ scaleX }}
      />
    </div>
  );
}
