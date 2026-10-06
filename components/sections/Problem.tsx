"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Eyebrow, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { PROBLEM } from "@/lib/content";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

function PaywallCard({ title, detail, i }: { title: string; detail: string; i: number }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-8"
      initial={{ opacity: 0, y: 60, rotate: i % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
    >
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-ember">Paywall 0{i + 1}</div>
      <div className="relative mt-10 inline-block text-3xl font-medium tracking-tight">
        {title}
        <motion.span
          className="absolute left-0 top-1/2 h-[3px] w-full origin-left bg-ember"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.5 + i * 0.12 }}
        />
      </div>
      <p className="mt-3 text-mute">{detail}</p>
    </motion.div>
  );
}

export default function Problem() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = PROBLEM.statement.split(" ");

  return (
    <section className="relative px-4 py-32 md:px-8 md:py-48">
      <div className="mx-auto max-w-7xl">
        <Eyebrow index="01">The problem</Eyebrow>
        <SplitHeading
          lines={["The internet is full of", <span key="p" className="font-serif italic text-mute">paywalls for simple things.</span>]}
          className="max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-8xl"
        />
        <p ref={ref} className="mt-20 max-w-5xl text-3xl leading-[1.25] tracking-tight md:text-5xl">
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>

        <div className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEM.paywalls.map((p, i) => (
            <PaywallCard key={p.title} {...p} i={i} />
          ))}
        </div>

        <Reveal className="mt-24 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl font-serif text-4xl italic leading-tight md:text-6xl">{PROBLEM.closing}</p>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-volt">→ Here&apos;s how</span>
        </Reveal>
      </div>
    </section>
  );
}
