"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Eyebrow, SplitHeading } from "@/components/ui/Reveal";
import { FAQ } from "@/lib/content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-4 py-32 md:px-8 md:py-48">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <Eyebrow index="08">FAQ</Eyebrow>
          <SplitHeading
            lines={["Questions,", <span key="a" className="text-gradient pr-[0.08em] font-serif italic">answered.</span>]}
            className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-7xl"
          />
        </div>
        <div className="border-t border-line">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-xl font-medium tracking-tight md:text-2xl">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xl transition-colors ${
                      isOpen ? "border-volt bg-volt text-ink" : "border-line"
                    }`}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 text-lg leading-relaxed text-paper/70">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
