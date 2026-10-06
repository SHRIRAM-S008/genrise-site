"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitHeading } from "@/components/ui/Reveal";
import { SITE } from "@/lib/content";

const PATHS = [
  { want: "Use free tools", cta: "Open GenRise Tools", href: SITE.toolsUrl, external: true },
  { want: "Hire GenRise", cta: "Start a Project", href: "#contact", external: false },
  { want: "Contribute code", cta: "Join on GitHub", href: SITE.github, external: true },
];

export default function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const clip = useTransform(scrollYProgress, [0, 0.4], ["inset(12% 6% 12% 6% round 48px)", "inset(0% 0% 0% 0% round 0px)"]);

  return (
    <motion.section ref={ref} style={{ clipPath: clip }} className="bg-spectrum relative overflow-hidden px-4 py-32 text-[var(--brand-ink)] md:px-8 md:py-48">
      <motion.img
        src="/logo-black.png"
        alt=""
        aria-hidden
        style={{ rotate }}
        className="pointer-events-none absolute -bottom-20 -right-20 w-[60vw] max-w-[900px] opacity-[0.07]"
      />
      <div className="relative mx-auto max-w-7xl">
        <SplitHeading
          lines={["Build something", <span key="m" className="font-serif italic">that matters —</span>, "with us."]}
          className="text-6xl font-medium leading-[0.9] tracking-[-0.05em] md:text-[9rem]"
        />
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--brand-ink)]/70">
          Whether you need a product built, want to grow your business online, or want to contribute to tools real people use
          every day — there&apos;s a place for you at GenRise.
        </p>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {PATHS.map((p, i) => (
            <motion.a
              key={p.want}
              href={p.href}
              target={p.external ? "_blank" : undefined}
              rel={p.external ? "noopener noreferrer" : undefined}
              data-cursor="Go"
              className="group flex min-h-56 flex-col justify-between rounded-3xl bg-ink p-8 text-paper"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">I want to…</span>
              <div>
                <div className="text-3xl font-medium tracking-tight">{p.want}</div>
                <div className="mt-3 flex items-center gap-2 text-volt">
                  {p.cta}
                  <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
