"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const progress = useMotionValue(0);
  const count = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const barWidth = useTransform(progress, (v) => `${v}%`);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const controls = animate(progress, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setTimeout(() => setDone(true), 200),
    });
    return () => controls.stop();
  }, [progress]);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col justify-between bg-ink p-6 md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex justify-between font-mono text-xs uppercase tracking-[0.2em] text-mute">
            <span>GenRise Tech</span>
            <span>Free · Open · Real</span>
          </div>
          <motion.img
            src="/logo-white.png"
            alt=""
            className="logo-theme mx-auto w-40 md:w-56"
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="flex items-end justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Loading experience</span>
            <motion.span className="font-serif text-7xl leading-none md:text-9xl">{count}</motion.span>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-volt"
            style={{ width: barWidth }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
