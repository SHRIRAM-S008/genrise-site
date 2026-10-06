"use client";

import { useState } from "react";
import { Eyebrow, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { SITE } from "@/lib/content";

const TOPICS = ["A service", "Contributing", "A tool request", "Something else"];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");

  const body = `Hi GenRise, I'm ${name || "…"} (${email || "…"}).\nI'm interested in: ${topic}.\n\n${message}`;
  const waHref = `${SITE.whatsapp}?text=${encodeURIComponent(body)}`;
  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent(`GenRise enquiry — ${topic}`)}&body=${encodeURIComponent(body)}`;

  const field =
    "w-full border-b border-line bg-transparent py-4 text-xl outline-none transition-colors placeholder:text-paper/30 focus:border-volt";

  return (
    <section id="contact" className="relative px-4 py-32 md:px-8 md:py-48">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div className="min-w-0">
          <Eyebrow index="09">Contact</Eyebrow>
          <SplitHeading
            lines={["Let's", <span key="t" className="text-gradient pr-[0.08em] font-serif italic">talk.</span>]}
            className="text-6xl font-medium leading-[0.9] tracking-[-0.05em] md:text-[9rem]"
          />
          <Reveal>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-paper/70">
              Have a project, an idea for a free tool, or want to join as a contributor? Send us a message — we reply within
              24 hours.
            </p>
            <dl className="mt-12 space-y-6">
              {[
                { k: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
                { k: "WhatsApp", v: SITE.phoneDisplay, href: SITE.whatsapp },
                { k: "LinkedIn", v: "/company/genrise-tech", href: SITE.linkedin },
                { k: "GitHub", v: "SHRIRAM-S008/Genrise-tools", href: SITE.github },
              ].map((c) => (
                <div key={c.k} className="group flex items-baseline justify-between gap-6 border-b border-line pb-2">
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-mute">{c.k}</dt>
                  <dd className="min-w-0 text-right">
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-2 text-lg [overflow-wrap:anywhere] transition-colors hover:text-volt"
                    >
                      {c.v}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-mute">Based in India · Working worldwide</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="min-w-0 rounded-[2rem] border border-line bg-ink-2 p-6 sm:p-8 md:p-12">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Your name" required />
              </label>
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                  placeholder="you@company.com"
                  required
                />
              </label>
            </div>
            <fieldset>
              <legend className="font-mono text-xs uppercase tracking-[0.2em] text-mute">I&apos;m interested in</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      topic === t ? "border-volt bg-volt text-ink" : "border-line hover:border-paper/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`${field} resize-none`}
                placeholder="Tell us about your idea…"
              />
            </label>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full bg-volt px-6 py-4 text-center font-medium text-ink transition-transform hover:scale-[1.02]"
              >
                Send on WhatsApp
              </a>
              <a
                href={mailHref}
                className="flex-1 rounded-full border border-line px-6 py-4 text-center font-medium transition-colors hover:border-paper/60"
              >
                Send by Email
              </a>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
