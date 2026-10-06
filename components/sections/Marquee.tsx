import { MARQUEE } from "@/lib/content";

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="relative overflow-hidden py-8" aria-hidden>
      <div className="bg-spectrum relative -mx-[5%] w-[110%] -rotate-2 overflow-hidden py-5 text-[var(--brand-ink)]">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-2xl font-medium tracking-tight md:text-4xl">
            {t}
            <span className="font-serif text-3xl italic md:text-5xl">✳</span>
          </span>
          ))}
        </div>
      </div>
    </div>
  );
}
