"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Magnetic from "@/components/ui/Magnetic";
import { Eyebrow, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { KITS, PRODUCT_HIGHLIGHTS, SITE, accent } from "@/lib/content";

const FilmPlayer = dynamic(() => import("@/components/remotion/FilmPlayer"), {
  ssr: false,
  loading: () => <div className="aspect-video w-full bg-ink-2" />,
});

function KitCard({ kit, i }: { kit: (typeof KITS)[number]; i: number }) {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const glow = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, color-mix(in oklab, ${accent(i)} 22%, transparent), transparent 70%)`;
  const big = i === 0;

  return (
    <motion.a
      href={SITE.toolsUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Open"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-200);
        my.set(-200);
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.07 }}
      style={{ "--a": accent(i) } as React.CSSProperties}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-ink-2 p-7 transition-colors hover:border-[var(--a)] ${
        big ? "min-h-72 sm:col-span-2 sm:row-span-2" : i === KITS.length - 1 ? "min-h-56 lg:col-span-2" : "min-h-56"
      }`}
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">{kit.name}</span>
        <span className="text-mute transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--a)]">↗</span>
      </div>
      <div className="relative">
        <div className={`font-serif leading-none text-[var(--a)] ${big ? "text-[9rem] md:text-[12rem]" : "text-7xl"}`}>{kit.count}</div>
        <p className="mt-3 text-sm text-paper/70">{kit.for}</p>
      </div>
    </motion.a>
  );
}

export default function Product() {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [64, 28]);

  return (
    <section id="product" className="relative px-4 py-32 md:px-8 md:py-48">
      <div className="mx-auto max-w-7xl">
        <Eyebrow index="03">Featured product</Eyebrow>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <SplitHeading
            lines={["GenRise Tools.", <span key="s" className="font-serif italic text-mute">57+ tools, all in your browser.</span>]}
            className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-8xl"
          />
          <Reveal>
            <p className="text-lg leading-relaxed text-paper/70">
              Our proof that the free-first model works. Every tool runs 100% on your device using Canvas, WebAssembly and
              modern File APIs. No uploads, no accounts, no limits.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Magnetic href={SITE.toolsUrl} external cursor="Open">
                Open GenRise Tools ↗
              </Magnetic>
              <Magnetic href={SITE.github} external variant="ghost">
                View Source
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <div ref={frameRef} className="mt-20 [perspective:1600px]">
          <motion.div
            style={{ scale, rotateX, borderRadius: radius }}
            className="relative overflow-hidden border border-line bg-ink-2 shadow-[0_60px_160px_-40px_color-mix(in_oklab,var(--violet)_45%,transparent)]"
          >
            <div className="flex items-center gap-2 border-b border-line px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-paper/15" />
              <span className="h-3 w-3 rounded-full bg-paper/15" />
              <span className="h-3 w-3 rounded-full bg-paper/15" />
              <span className="ml-4 font-mono text-xs text-mute">tools.genrisetech.in</span>
            </div>
            <FilmPlayer />
          </motion.div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.06} className="h-full bg-ink p-7">
              <div className="font-mono text-xs" style={{ color: accent(i) }}>0{i + 1}</div>
              <h3 className="mt-6 text-xl font-medium">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{h.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 flex items-end justify-between gap-6">
          <h3 className="text-3xl font-medium tracking-tight md:text-5xl">
            Seven kits. <span className="font-serif italic text-mute">One promise.</span>
          </h3>
        </div>
        <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KITS.map((k, i) => (
            <KitCard key={k.name} kit={k} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
