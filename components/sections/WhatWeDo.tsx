"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Eyebrow, SplitHeading } from "@/components/ui/Reveal";
import { PILLARS } from "@/lib/content";

function PillarCard({
  pillar,
  i,
  total,
  progress,
}: {
  pillar: (typeof PILLARS)[number];
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each card shrinks slightly as later cards stack on top of it.
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - i) * 0.05]);
  const accent = [
    "bg-[linear-gradient(135deg,var(--brand-lime),var(--brand-sky))] text-[var(--brand-ink)]",
    "bg-[linear-gradient(135deg,var(--brand-violet),var(--brand-pink))] text-white",
    "bg-[linear-gradient(135deg,var(--brand-ember),var(--brand-amber))] text-[var(--brand-ink)]",
  ][i % 3];

  return (
    <div className="sticky flex min-h-[78vh] items-start justify-center" style={{ top: `${96 + i * 28}px` }}>
      <motion.article
        style={{ scale }}
        className={`relative flex min-h-[62vh] w-full gap-10 origin-top flex-col justify-between overflow-hidden rounded-[2rem] p-8 md:p-14 ${accent}`}
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-sm uppercase tracking-[0.2em] opacity-60">What we do</span>
          <span className="font-serif text-[22vw] leading-[0.7] opacity-90 md:text-[12rem]">{pillar.n}</span>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <h3 className="text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-7xl">{pillar.title}</h3>
          <div>
            <p className="max-w-md text-lg leading-relaxed opacity-80 md:text-xl">{pillar.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {pillar.items.map((it) => (
                <li key={it} className="rounded-full border border-current/25 px-3 py-1.5 text-xs font-medium md:text-sm">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function WhatWeDo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="what-we-do" className="relative px-4 py-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Eyebrow index="01">What we do</Eyebrow>
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <SplitHeading
            lines={["One team to", <span key="p" className="text-gradient pr-[0.08em] font-serif italic">build, grow &amp; scale.</span>]}
            className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-8xl"
          />
          <p className="max-w-md text-lg leading-relaxed text-paper/70">
            Most businesses juggle a developer, a designer and a marketing agency. We&apos;re all three — so your product and
            your growth plan are built together, by people who talk to each other.
          </p>
        </div>
        <div ref={ref} className="mt-20">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.n} pillar={p} i={i} total={PILLARS.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
