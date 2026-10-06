"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RoadmapArt } from "@/components/art/Art";
import { Eyebrow, SplitHeading } from "@/components/ui/Reveal";
import { PROCESS, accent } from "@/lib/content";

export default function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative px-4 py-32 md:px-8 md:py-48">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow index="03">How we work</Eyebrow>
          <SplitHeading
            lines={["Simple.", "Transparent.", <span key="n" className="text-gradient pr-[0.08em] font-serif italic">No surprises.</span>]}
            className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-7xl"
          />
          <RoadmapArt progress={scrollYProgress} className="mt-14 hidden w-full max-w-[300px] text-paper lg:block" />
        </div>
        <ol ref={ref} className="relative pl-10 md:pl-16">
          <div className="absolute left-[7px] top-2 h-full w-px bg-line md:left-[11px]" />
          <motion.div className="absolute left-[7px] top-2 w-[2px] bg-[linear-gradient(180deg,var(--lime),var(--sky),var(--violet),var(--pink),var(--ember))] md:left-[11px]" style={{ height }} />
          {PROCESS.map((p, i) => (
            <motion.li
              key={p.title}
              className="relative pb-16 last:pb-0"
              initial={{ opacity: 0.2 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-45% 0px -45% 0px" }}
              transition={{ duration: 0.5 }}
            >
              <span className="absolute -left-10 top-3 h-4 w-4 rounded-full border-2 bg-ink md:-left-16 md:h-6 md:w-6" style={{ borderColor: accent(i) }} />
              <div className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: accent(i) }}>Step 0{i + 1}</div>
              <h3 className="mt-3 text-4xl font-medium tracking-[-0.03em] md:text-6xl">{p.title}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-paper/70">{p.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
