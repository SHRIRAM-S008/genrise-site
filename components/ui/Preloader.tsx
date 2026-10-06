"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useState } from "react";

const DURATION = 2; // counter 000 → 100
const WORDS = ["Designing", "Building", "Launching", "Growing"];
const C = 160; // svg centre
const RING = 118;
const ORBIT = 150;

const SHAPES = [
  { color: "var(--brand-lime)", d: "M0 -9 A9 9 0 1 1 0 9 A9 9 0 1 1 0 -9 Z" }, // circle
  { color: "var(--brand-sky)", d: "M-8 -8 H8 V8 H-8 Z" }, // square
  { color: "var(--brand-violet)", d: "M0 -10 L9 7 H-9 Z" }, // triangle
  { color: "var(--brand-pink)", d: "M-3 -10 H3 V-3 H10 V3 H3 V10 H-3 V3 H-10 V-3 H-3 Z" }, // plus
  { color: "var(--brand-amber)", d: "M0 -11 C1 -3 3 -1 11 0 C3 1 1 3 0 11 C-1 3 -3 1 -11 0 C-3 -1 -1 -3 0 -11 Z" }, // sparkle
];

/** One brand shape orbiting the logo; spirals into the centre over the last quarter of the load. */
function Orbiter({ i, time, progress }: { i: number; time: MotionValue<number>; progress: MotionValue<number> }) {
  const transform = useTransform([time, progress], ([t, p]: number[]) => {
    const pull = Math.min(1, Math.max(0, (p - 72) / 28)); // 0 → 1 between 72% and 100%
    const r = ORBIT * (1 - pull * pull) + 8 * Math.sin(t * 2 + i);
    const a = (i / SHAPES.length) * Math.PI * 2 + t * (0.9 + pull * 3);
    const x = C + Math.cos(a) * r;
    const y = C + Math.sin(a) * r * 0.82;
    const s = 1 - pull * 0.7;
    return `translate(${x}px, ${y}px) rotate(${t * 90 + i * 40}deg) scale(${s})`;
  });
  return (
    <motion.path
      d={SHAPES[i].d}
      fill={SHAPES[i].color}
      style={{ transform, filter: `drop-shadow(0 0 10px ${SHAPES[i].color})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
    />
  );
}

const BURST = Array.from({ length: 18 }, (_, i) => ({
  angle: (i / 18) * Math.PI * 2,
  dist: 150 + (i % 3) * 40,
  color: SHAPES[i % SHAPES.length].color,
  size: 4 + (i % 3) * 2,
}));

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState(false);
  const [word, setWord] = useState(0);
  const progress = useMotionValue(0);
  const time = useMotionValue(0);
  const count = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const barWidth = useTransform(progress, (v) => `${v}%`);
  const ring = useTransform(progress, (v) => v / 100);

  useAnimationFrame((t) => time.set(t / 1000));
  useMotionValueEvent(progress, "change", (v) => setWord(Math.min(WORDS.length - 1, Math.floor(v / 25))));

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const controls = animate(progress, 100, {
      duration: DURATION,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        setBurst(true);
        setTimeout(() => setDone(true), 380);
      },
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
          className="fixed inset-0 z-[80] flex flex-col justify-between overflow-hidden bg-ink p-6 md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_60%)]" />

          <div className="relative flex justify-between font-mono text-xs uppercase tracking-[0.2em] text-mute">
            <span>GenRise Tech</span>
            <span>Build · Grow · Scale</span>
          </div>

          {/* Logo stage */}
          <div className="relative mx-auto flex flex-col items-center">
            <div className="relative h-[280px] w-[280px] md:h-[340px] md:w-[340px]">
              <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                <defs>
                  <linearGradient id="pl-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="var(--brand-lime)" />
                    <stop offset="0.35" stopColor="var(--brand-sky)" />
                    <stop offset="0.7" stopColor="var(--brand-violet)" />
                    <stop offset="1" stopColor="var(--brand-pink)" />
                  </linearGradient>
                </defs>
                <circle cx={C} cy={C} r={RING} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="2" className="text-paper" />
                <circle cx={C} cy={C} r={RING + 14} fill="none" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="2 10" className="text-paper" />
                <motion.circle
                  cx={C}
                  cy={C}
                  r={RING}
                  fill="none"
                  stroke="url(#pl-ring)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{ pathLength: ring, rotate: -90, transformOrigin: "160px 160px" }}
                />
                {SHAPES.map((_, i) => (
                  <Orbiter key={i} i={i} time={time} progress={progress} />
                ))}
                {burst &&
                  BURST.map((b, i) => (
                    <motion.circle
                      key={i}
                      cx={C}
                      cy={C}
                      r={b.size}
                      fill={b.color}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: Math.cos(b.angle) * b.dist, y: Math.sin(b.angle) * b.dist, opacity: 0, scale: 0.3 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ))}
              </svg>
              {/* Theme inversion lives on the wrapper so the img's blur animation can't override it */}
              <div className="logo-theme absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 md:w-36">
                <motion.img
                  src="/logo-white.png"
                  alt=""
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
                  animate={burst ? { opacity: 1, scale: [1, 1.18, 1], filter: "blur(0px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: burst ? 0.45 : 1.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Status word */}
            <div className="relative mt-2 h-6 overflow-hidden font-mono text-xs uppercase tracking-[0.3em] text-paper/70">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={WORDS[word]}
                  className="block text-center"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {WORDS[word]}
                  <span className="text-volt">…</span>
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative flex items-end justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Loading experience</span>
            <motion.span className="font-serif text-7xl leading-none md:text-9xl">{count}</motion.span>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-[linear-gradient(90deg,var(--brand-lime),var(--brand-sky),var(--brand-violet),var(--brand-pink))]"
            style={{ width: barWidth }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
