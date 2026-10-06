"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import { Eyebrow, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { CONTRIBUTE_ROLES, CONTRIBUTE_WHY, SITE } from "@/lib/content";

const SCRIPT = [
  { prompt: true, text: "git clone github.com/SHRIRAM-S008/Genrise-tools" },
  { prompt: false, text: "Cloning into 'Genrise-tools'… done." },
  { prompt: true, text: "git checkout -b feat/new-tool" },
  { prompt: true, text: 'git commit -m "feat: add a tool people need"' },
  { prompt: true, text: "git push origin feat/new-tool" },
  { prompt: false, text: "✓ Pull request opened — welcome to GenRise." },
];

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!inView || line >= SCRIPT.length) return;
    const current = SCRIPT[line];
    if (!current.prompt) {
      const t = setTimeout(() => setLine((l) => l + 1), 450);
      return () => clearTimeout(t);
    }
    if (chars < current.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 22);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLine((l) => l + 1);
      setChars(0);
    }, 350);
    return () => clearTimeout(t);
  }, [inView, line, chars]);

  return (
    <div ref={ref} className="overflow-hidden rounded-3xl border border-line bg-ink-2 font-mono text-sm">
      <div className="flex items-center justify-between border-b border-line px-5 py-3 text-xs text-mute">
        <span>~/genrise</span>
        <span>zsh</span>
      </div>
      <div className="min-h-[300px] space-y-2 p-6 leading-relaxed">
        {SCRIPT.slice(0, line + 1).map((l, i) => {
          const typing = i === line && l.prompt;
          const text = typing ? l.text.slice(0, chars) : l.text;
          return (
            <div key={i} className={l.prompt ? "text-paper" : l.text.startsWith("✓") ? "text-volt" : "text-mute"}>
              {l.prompt && <span className="mr-2 text-volt">❯</span>}
              {text}
              {typing && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-volt" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OpenSource() {
  return (
    <section id="open-source" className="relative overflow-hidden px-4 py-32 md:px-8 md:py-48">
      <div className="bg-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <Eyebrow index="06">Join the team</Eyebrow>
        <SplitHeading
          lines={["Built in the open.", <span key="b" className="text-gradient pr-[0.08em] font-serif italic">Built by everyone.</span>]}
          className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-8xl"
        />

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xl leading-relaxed text-paper/75">
              GenRise isn&apos;t just a company — it&apos;s a place where developers build things that matter. Read the code,
              report a bug, suggest a feature, or ship a new tool that real people use every day.
            </p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
              {CONTRIBUTE_WHY.map((w) => (
                <div key={w.title} className="bg-ink p-6">
                  <h3 className="font-medium">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{w.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Terminal />
            <ol className="mt-8 space-y-4">
              {["Star and fork the repo on GitHub.", "Pick a good first issue — or propose a new tool.", "Open a pull request. We review every one."].map(
                (s, i) => (
                  <li key={s} className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-volt">0{i + 1}</span>
                    <span className="text-lg">{s}</span>
                  </li>
                ),
              )}
            </ol>
            <div className="mt-8">
              <Magnetic href={SITE.github} external cursor="Fork">
                Start Contributing on GitHub ↗
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 border-t border-line">
          {CONTRIBUTE_ROLES.map((r, i) => (
            <motion.div
              key={r.role}
              className="group relative grid grid-cols-[1fr_auto] items-center gap-4 overflow-hidden border-b border-line py-6 md:grid-cols-[1fr_1.4fr_auto] md:py-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-volt transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
              <span className="relative text-3xl font-medium tracking-tight transition-colors group-hover:text-ink md:text-5xl">
                {r.role}
              </span>
              <span className="relative hidden text-paper/70 transition-colors group-hover:text-ink md:block">{r.action}</span>
              <span className="relative font-mono text-xs uppercase tracking-[0.2em] text-mute transition-colors group-hover:text-ink">
                Join →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
