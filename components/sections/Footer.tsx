"use client";

import { motion } from "motion/react";
import { SERVICES, SITE } from "@/lib/content";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "GenRise Tools", href: SITE.toolsUrl },
      { label: "Roadmap", href: "#about" },
      { label: "Request a Tool", href: `${SITE.github}/issues` },
    ],
  },
  {
    title: "Services",
    links: SERVICES.map((s) => ({ label: s.title, href: "#services" })),
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: SITE.github },
      { label: "Contribute", href: "#open-source" },
      { label: "LinkedIn", href: SITE.linkedin },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export default function Footer() {
  const word = "GenRise".split("");
  return (
    <footer className="relative overflow-hidden border-t border-line px-4 pt-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <img src="/logo-white.png" alt="GenRise Tech" className="logo-theme h-10 w-auto" />
            <p className="mt-6 max-w-xs text-mute">Real software for real problems — free and open for everyone.</p>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-mute">{c.title}</h4>
              <ul className="mt-4 space-y-1 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-block py-1.5 text-paper/80 transition-colors hover:text-volt"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div
          className="mt-24 flex select-none justify-center overflow-hidden"
          aria-hidden
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true }}
        >
          {word.map((ch, i) => (
            <motion.span
              key={i}
              className="text-gradient inline-block text-[24vw] font-medium leading-[0.8] tracking-[-0.07em] xl:text-[21rem]"
              variants={{ hidden: { y: "100%" }, shown: { y: "0%" } }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>

        <div className="flex flex-col justify-between gap-3 border-t border-line py-8 text-sm text-mute md:flex-row">
          <span>© {new Date().getFullYear()} GenRise Tech. Made with care in India.</span>
          <span>Open source at heart.</span>
        </div>
      </div>
    </footer>
  );
}
