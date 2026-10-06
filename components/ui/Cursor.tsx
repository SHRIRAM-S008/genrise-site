"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      setHover(!!el);
      setLabel(el?.dataset.cursor ?? null);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  const size = label ? 88 : hover ? 56 : 32;

  return (
    <div className="cursor-ui pointer-events-none fixed inset-0 z-[70] hidden md:block" aria-hidden>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt"
        style={{ x, y }}
      />
      <motion.div
        className={`absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-colors duration-300 ${
          hover ? "border-volt" : "border-paper/35"
        }`}
        style={{ x: rx, y: ry }}
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-volt"
          animate={{ scale: label ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        />
        <span className="relative font-mono text-[10px] uppercase tracking-widest text-ink">{label}</span>
      </motion.div>
    </div>
  );
}
