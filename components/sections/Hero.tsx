"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import Magnetic from "@/components/ui/Magnetic";
import { HERO_FACTS } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const INTRO = 2.1; // starts as the preloader curtain lifts

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
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, color-mix(in oklab, var(--volt) 16%, transparent), transparent 70%)`;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-4 pb-10 pt-32 md:px-8"
    >
      {/* Background */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      {/* Aurora */}
      <div className="pointer-events-none absolute inset-0" style={{ opacity: "var(--glow)" }}>
        <motion.div
          className="absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full blur-[120px]"
          style={{ background: "conic-gradient(from 0deg, var(--brand-lime), var(--brand-sky), var(--brand-violet), var(--brand-pink), var(--brand-lime))" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[var(--brand-violet)] blur-[130px]"
          animate={{ x: [0, 120, 0], y: [0, -60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 h-[360px] w-[360px] rounded-full bg-[var(--brand-ember)] blur-[140px]"
          animate={{ x: [0, -140, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.img
        src="/logo-white.png"
        alt=""
        aria-hidden
        className="logo-theme pointer-events-none absolute right-[-6%] top-[18%] w-[55vw] max-w-[820px] opacity-[0.05]"
        style={{ rotate: logoRotate }}
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 2, ease: EASE, delay: INTRO }}
      />

      <motion.div className="relative mx-auto w-full max-w-7xl" style={{ y, scale, opacity: fade }}>
        <motion.div
          className="mb-8 flex items-start gap-3 font-mono text-xs uppercase tracking-[0.2em] text-mute"
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

        <h1 className="text-[13vw] font-medium leading-[0.88] tracking-[-0.05em] md:text-[9.5vw] xl:text-[8.6rem]">
          <Line delay={0}>We build software</Line>
          <Line delay={0.08}>
            &amp; grow <span className="text-gradient pr-[0.08em] font-serif font-normal italic tracking-[-0.02em]">brands.</span>
          </Line>
          <Line delay={0.16} className="text-outline">
            End to end.
          </Line>
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <motion.p
            className="max-w-xl text-lg leading-relaxed text-paper/70 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO + 0.5, duration: 1, ease: EASE }}
          >
            GenRise Tech is a digital marketing and software development company. We design, build and launch websites,
            apps and SaaS products — then grow them with SEO, social media and performance marketing.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 md:justify-end"
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
        </div>

        <motion.dl
          className="mt-16 grid grid-cols-2 border-t border-line pt-8 md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: INTRO + 0.8, duration: 1 }}
        >
          {HERO_FACTS.map((f, i) => (
            <motion.div
              key={f.label}
              className="py-3 pr-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: INTRO + 0.8 + i * 0.1, duration: 0.9, ease: EASE }}
            >
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-serif text-5xl md:text-6xl">{f.value}</dd>
              <dd className="mt-2 text-sm text-mute">{f.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
