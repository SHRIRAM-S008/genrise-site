"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts children into view once. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line-by-line headline reveal. Each array item is one line. */
export function SplitHeading({
  lines,
  className = "",
  delay = 0,
  as: Tag = "h2",
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
}) {
  const MotionTag = motion[Tag];
  return (
    <MotionTag className={className} initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%", rotate: 3 }, shown: { y: "0%", rotate: 0 } }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

export function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <Reveal className="mb-8 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-mute">
      <span style={{ color: `var(--${["lime", "sky", "violet", "pink", "ember"][(parseInt(index, 10) - 1) % 5]})` }}>{index}</span>
      <span className="h-px w-10 bg-paper/20" />
      <span>{children}</span>
    </Reveal>
  );
}
