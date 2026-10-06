"use client";

import { motion } from "motion/react";
import { Eyebrow, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { MISSION, VALUES, VISION, WHY, accent } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="relative px-4 py-32 md:px-8 md:py-48">
      <div className="mx-auto max-w-7xl">
        <Eyebrow index="04">Why GenRise</Eyebrow>
        <SplitHeading
          lines={["Why teams", <span key="c" className="font-serif italic text-mute">choose GenRise.</span>]}
          className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-8xl"
        />

        <div className="mt-20 grid gap-4 md:grid-cols-6">
          {WHY.map((w, i) => (
            <motion.div
              key={w.title}
              className={`group rounded-3xl border border-line bg-ink-2 p-8 transition-colors hover:bg-ink-3 ${
                i < 2 ? "md:col-span-3" : "md:col-span-2"
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <span className="font-mono text-xs" style={{ color: accent(i) }}>0{i + 1}</span>
              <h3 className="mt-10 text-2xl font-medium tracking-tight">{w.title}</h3>
              <p className="mt-2 text-mute">{w.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 grid gap-16 md:grid-cols-2">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-volt">Mission</div>
            <p className="mt-6 font-serif text-3xl leading-snug md:text-5xl">{MISSION}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-volt">Vision</div>
            <p className="mt-6 font-serif text-3xl italic leading-snug text-paper/80 md:text-5xl">{VISION}</p>
          </Reveal>
        </div>

        <div className="mt-32">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Values</div>
          <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 0.06} className="h-full bg-ink p-8">
                <span className="block h-2.5 w-2.5 rounded-full" style={{ background: accent(i) }} />
                <h3 className="mt-6 text-2xl font-medium tracking-tight">{v.title}</h3>
                <p className="mt-2 text-mute">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
