"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import BuildScene from "@/components/hero/BuildScene";
import Magnetic from "@/components/ui/Magnetic";
import { HERO_FACTS } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const INTRO = 2.6; // starts as the preloader curtain lifts

function Line({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "115%", rotate: 4 }}
        animate={{ y: "0%", rotate: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: INTRO + delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0.45, 0.95], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-10 pt-28 md:px-8 lg:pt-32"
    >
      {/* Quiet stage: dot grid + soft light, so the scene carries the colour */}
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_45%,black,transparent)]" />
      <div className="pointer-events-none absolute right-[-10%] top-[5%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand-violet)_35%,transparent),transparent_65%)] blur-3xl" style={{ opacity: "var(--glow)" }} />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[50vh] w-[40vw] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand-sky)_30%,transparent),transparent_65%)] blur-3xl" style={{ opacity: "var(--glow)" }} />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-0">
        {/* Copy */}
        <motion.div className="relative z-10" style={{ y: textY, opacity: fade }}>
          <motion.div
            className="mb-7 flex items-start gap-3 font-mono text-xs uppercase tracking-[0.2em] text-mute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: INTRO, duration: 1 }}
          >
            <span className="relative mt-1 flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
            </span>
            <span>Digital Marketing · Software Development · IT Consulting</span>
          </motion.div>

          <h1 className="text-[15vw] font-medium leading-[0.88] tracking-[-0.05em] sm:text-[12vw] lg:text-[6.4vw] xl:text-[6.2rem]">
            <Line delay={0}>We build</Line>
            <Line delay={0.07}>software &amp;</Line>
            <Line delay={0.14}>
              grow <span className="text-gradient pr-[0.08em] font-serif font-normal italic tracking-[-0.02em]">brands.</span>
            </Line>
            <Line delay={0.21} className="text-outline">
              End to end.
            </Line>
          </h1>

          <motion.p
            className="mt-8 max-w-lg text-lg leading-relaxed text-paper/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO + 0.5, duration: 1, ease: EASE }}
          >
            GenRise Tech is a digital marketing and software development company. We design, build and launch websites,
            apps and SaaS products — then grow them with SEO, social media and performance marketing.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO + 0.65, duration: 1, ease: EASE }}
          >
            <Magnetic href="#contact" cursor="Let's go">
              Start a Project <span aria-hidden>→</span>
            </Magnetic>
            <Magnetic href="#services" variant="ghost">
              Explore Services
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Self-building website */}
        <motion.div
          className="relative h-[340px] sm:h-[460px] lg:-mr-[4vw] lg:h-[74vh] lg:max-h-[720px]"
          style={{ y: sceneY, scale: sceneScale }}
        >
          <BuildScene />
        </motion.div>
      </div>

      <motion.dl
        className="relative mx-auto mt-10 grid w-full max-w-7xl grid-cols-2 border-t border-line pt-6 md:grid-cols-4"
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: INTRO + 0.8, duration: 1 }}
      >
        {HERO_FACTS.map((f, i) => (
          <motion.div
            key={f.label}
            className="py-2 pr-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO + 0.8 + i * 0.1, duration: 0.9, ease: EASE }}
          >
            <dt className="sr-only">{f.label}</dt>
            <dd className="font-serif text-4xl md:text-5xl">{f.value}</dd>
            <dd className="mt-1 text-sm text-mute">{f.label}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
}
