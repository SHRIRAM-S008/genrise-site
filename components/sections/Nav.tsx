"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { NAV, SITE } from "@/lib/content";

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
    setScrolled(y > 40);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8"
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? "border border-line bg-ink/70 backdrop-blur-xl" : "border border-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-3 py-2" aria-label="GenRise Tech home">
            <img src="/logo-white.png" alt="" className="logo-theme h-6 w-auto" />
            <span className="hidden text-sm font-medium tracking-tight sm:inline">GenRise Tech</span>
          </a>
          <ul className="hidden items-center gap-8 text-sm text-paper/70 lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="group relative inline-block py-2 transition-colors hover:text-paper">
                  {n.label}
                  <span className="absolute bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-volt transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href={SITE.toolsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-volt px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105 sm:inline-block"
            >
              Explore Free Tools
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-line lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }} className="h-px w-4 bg-paper" />
              <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -3 : 0 }} className="h-px w-4 bg-paper" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-6 pb-12 lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {[...NAV, { label: "Contact", href: "#contact" }].map((n, i) => (
              <motion.a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-serif text-5xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                {n.label}
              </motion.a>
            ))}
            <a href={SITE.toolsUrl} className="mt-8 rounded-full bg-volt py-4 text-center font-medium text-ink">
              Explore Free Tools
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
