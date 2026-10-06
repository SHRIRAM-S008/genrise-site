"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Eyebrow, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { ALSO_AVAILABLE, INCLUDED, SERVICES, accent } from "@/lib/content";

function ServiceCard({ s, i }: { s: (typeof SERVICES)[number]; i: number }) {
  return (
    <article
      style={{ "--a": accent(i) } as React.CSSProperties}
      className={`group relative flex h-[70vh] min-h-[480px] w-[85vw] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] border border-line p-8 transition-colors duration-500 hover:border-[var(--a)] sm:w-[60vw] md:p-10 lg:w-[34vw] ${
        i % 2 ? "bg-ink-3" : "bg-ink-2"
      }`}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--a)] opacity-20 blur-[90px] transition-opacity duration-700 group-hover:opacity-40" />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--a)]">Service</span>
        <span className="font-serif text-8xl leading-[0.7] text-paper/10 transition-colors duration-500 group-hover:text-[var(--a)]">
          {s.n}
        </span>
      </div>
      <div className="relative">
        <h3 className="text-4xl font-medium leading-[0.95] tracking-[-0.03em] md:text-5xl">{s.title}</h3>
        <p className="mt-5 leading-relaxed text-paper/70">{s.body}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1.5 text-xs text-paper/80">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="services" className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-32 md:px-8 md:pt-48">
        <Eyebrow index="05">Services</Eyebrow>
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <SplitHeading
            lines={["Services that fund", <span key="f" className="text-gradient pr-[0.08em] font-serif italic">the free stuff.</span>]}
            className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-8xl"
          />
          <Reveal>
            <p className="max-w-md text-lg leading-relaxed text-paper/70">
              Hire GenRise Tech for your next project — and help keep public tools free for everyone. We work with clients
              worldwide.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Pinned horizontal scroll */}
      <div ref={ref} style={{ height: `calc(100vh + ${distance}px)` }} className="relative mt-16">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div ref={trackRef} style={{ x }} className="flex gap-4 px-4 md:px-8">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.n} s={s} i={i} />
            ))}
            <div className="flex h-[70vh] min-h-[480px] w-[85vw] shrink-0 flex-col justify-between bg-spectrum rounded-[2rem] p-8 text-[var(--brand-ink)] sm:w-[60vw] md:p-10 lg:w-[34vw]">
              <span className="font-mono text-xs uppercase tracking-[0.2em]">Every project includes</span>
              <ul className="space-y-3 text-xl font-medium md:text-2xl">
                {INCLUDED.map((it) => (
                  <li key={it} className="flex gap-3">
                    <span>✓</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          <div className="mx-4 mt-10 h-px bg-line md:mx-8">
            <motion.div className="h-px bg-[linear-gradient(90deg,var(--lime),var(--sky),var(--violet),var(--pink),var(--ember))]" style={{ width: bar }} />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 md:grid-cols-2 md:px-8">
        {ALSO_AVAILABLE.map((a) => (
          <Reveal key={a.title} className="flex items-center justify-between gap-6 rounded-3xl border border-line p-7">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Also available</div>
              <h3 className="mt-3 text-2xl font-medium">{a.title}</h3>
              <p className="mt-1 text-sm text-mute">{a.body}</p>
            </div>
            <a
              href="#contact"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-volt transition-colors hover:border-volt"
              aria-label={`Ask about ${a.title}`}
            >
              →
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
