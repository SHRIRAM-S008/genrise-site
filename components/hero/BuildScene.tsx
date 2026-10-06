"use client";

import {
  backOut,
  cubicBezier,
  easeIn,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
 * A website that builds itself, launches, then grows — on one looping clock `t` (seconds).
 * Every element derives its state from `t`, so the scene is deterministic and loops cleanly.
 *
 *   0.5 – 4.3   Build   blocks fly in from depth, code types in sync
 *   4.6 – 6.6   Launch  deploy command, "Deployed" card with score rings, shimmer sweep
 *   6.4 – 11    Grow    analytics panel, traffic curve, marketing events, cursor clicks CTA
 *  14.2 – 15.8  Reset   everything flies back into depth
 */
const CYCLE = 16;
const HOLD = 11.5; // frame shown when motion is reduced
const START = -2.2; // wait for the preloader curtain

const W = 960;
const H = 680;

const ease = cubicBezier(0.16, 1, 0.3, 1);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const prog = (t: number, a: number, b: number, e: (x: number) => number = ease) => e(clamp01((t - a) / (b - a)));
/** 0 → 1 while entering at `a`, back to 0 while leaving at `out`. */
const life = (t: number, a: number, dur: number, out = 14.2) => Math.min(prog(t, a, a + dur), 1 - prog(t, out, out + 0.6));

// ---------- Browser blocks ----------

type BlockDef = { id: string; tag: string; at: number; box: string; code: React.ReactNode; chars: number };

const T = ({ c }: { c: string }) => <span className="text-[var(--sky)]">{c}</span>;
const A = ({ c }: { c: string }) => <span className="text-[var(--pink)]">{c}</span>;
const S = ({ c }: { c: string }) => <span className="text-[var(--lime)]">{c}</span>;
const P = ({ c }: { c: string }) => <span className="text-mute">{c}</span>;

const BLOCKS: BlockDef[] = [
  { id: "nav", tag: "<Nav/>", at: 0.5, box: "left-[3%] top-[3%] w-[94%] h-[9%]", chars: 17, code: <><P c="<" /><T c="Nav" /> <A c="links" /><P c="={" />4<P c="} />" /></> },
  { id: "title", tag: "<Hero/>", at: 0.95, box: "left-[5%] top-[18%] w-[46%] h-[27%]", chars: 26, code: <><P c="<" /><T c="Hero" /> <A c="title" /><P c="=" /><S c={'"Grow with us"'} /> <P c="/>" /></> },
  { id: "visual", tag: "<Visual/>", at: 1.4, box: "left-[56%] top-[16%] w-[39%] h-[38%]", chars: 24, code: <><P c="<" /><T c="Visual" /> <A c="style" /><P c="=" /><S c={'"aurora"'} /> <P c="/>" /></> },
  { id: "cta", tag: "<Button/>", at: 1.85, box: "left-[5%] top-[48%] w-[20%] h-[7%]", chars: 29, code: <><P c="<" /><T c="Button" /><P c=">" />Get started<P c="</" /><T c="Button" /><P c=">" /></> },
  { id: "card1", tag: "<Card/>", at: 2.3, box: "left-[5%] top-[62%] w-[28%] h-[24%]", chars: 19, code: <><P c="<" /><T c="Card" /> <A c="icon" /><P c="=" /><S c={'"seo"'} /> <P c="/>" /></> },
  { id: "card2", tag: "<Card/>", at: 2.75, box: "left-[36%] top-[62%] w-[28%] h-[24%]", chars: 21, code: <><P c="<" /><T c="Card" /> <A c="icon" /><P c="=" /><S c={'"speed"'} /> <P c="/>" /></> },
  { id: "card3", tag: "<Card/>", at: 3.2, box: "left-[67%] top-[62%] w-[28%] h-[24%]", chars: 22, code: <><P c="<" /><T c="Card" /> <A c="icon" /><P c="=" /><S c={'"secure"'} /> <P c="/>" /></> },
  { id: "footer", tag: "<Footer/>", at: 3.65, box: "left-[3%] top-[90%] w-[94%] h-[6%]", chars: 10, code: <><P c="<" /><T c="Footer" /> <P c="/>" /></> },
];

function BlockContent({ id }: { id: string }) {
  const line = "rounded-full bg-paper/15";
  switch (id) {
    case "nav":
      return (
        <div className="flex h-full items-center gap-3 px-3">
          <span className="h-3 w-3 rounded-full bg-[conic-gradient(var(--brand-lime),var(--brand-sky),var(--brand-violet),var(--brand-lime))]" />
          <span className={`${line} h-1.5 w-12`} />
          <span className="ml-auto flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`${line} h-1.5 w-8`} />
            ))}
          </span>
          <span className="h-4 w-12 rounded-full bg-volt" />
        </div>
      );
    case "title":
      return (
        <div className="flex h-full flex-col justify-center gap-2.5 px-1">
          <span className="h-5 w-[92%] rounded-md bg-paper/80" />
          <span className="h-5 w-[70%] rounded-md bg-[linear-gradient(90deg,var(--violet),var(--pink))]" />
          <span className={`${line} mt-2 h-1.5 w-[85%]`} />
          <span className={`${line} h-1.5 w-[75%]`} />
          <span className={`${line} h-1.5 w-[55%]`} />
        </div>
      );
    case "visual":
      return (
        <div className="relative h-full overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--brand-violet),var(--brand-pink)_45%,var(--brand-amber))]">
          <div className="absolute -left-6 top-6 h-28 w-28 rounded-full bg-[var(--brand-sky)] opacity-80 blur-2xl" />
          <div className="absolute bottom-[-20%] right-[-10%] h-36 w-36 rounded-full bg-[var(--brand-lime)] opacity-70 blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_45%)]" />
          <div className="absolute bottom-3 left-3 rounded-full bg-white/25 px-2 py-0.5 font-mono text-[9px] text-white backdrop-blur">
            hero.webp
          </div>
        </div>
      );
    case "cta":
      return <div className="flex h-full items-center justify-center rounded-full bg-volt text-[10px] font-medium text-ink">Get started</div>;
    case "card1":
    case "card2":
    case "card3": {
      const c = { card1: "var(--lime)", card2: "var(--sky)", card3: "var(--ember)" }[id];
      return (
        <div className="flex h-full flex-col justify-between rounded-xl bg-ink-3 p-3">
          <span className="h-6 w-6 rounded-lg" style={{ background: c, boxShadow: `0 0 18px ${c}` }} />
          <div className="space-y-1.5">
            <span className="block h-2 w-[70%] rounded-full bg-paper/60" />
            <span className={`block ${line} h-1.5 w-[90%]`} />
            <span className={`block ${line} h-1.5 w-[60%]`} />
          </div>
        </div>
      );
    }
    default:
      return (
        <div className="flex h-full items-center justify-between px-3">
          <span className={`${line} h-1.5 w-16`} />
          <span className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`${line} h-1.5 w-6`} />
            ))}
          </span>
        </div>
      );
  }
}

function Block({ def, t }: { def: BlockDef; t: MotionValue<number> }) {
  const s = def.at;
  const out = 14.2 + BLOCKS.indexOf(def) * 0.05;
  const opacity = useTransform(t, (v) => Math.min(prog(v, s, s + 0.3), 1 - prog(v, out + 0.3, out + 0.7)));
  const z = useTransform(t, (v) => 380 * (1 - prog(v, s, s + 0.9)) + 420 * prog(v, out, out + 0.7, easeIn));
  const rotateX = useTransform(t, (v) => -55 * (1 - prog(v, s, s + 0.9)) - 40 * prog(v, out, out + 0.7, easeIn));
  const y = useTransform(t, (v) => -50 * (1 - prog(v, s, s + 0.9)));
  const fill = useTransform(t, (v) => prog(v, s + 0.75, s + 1.25));
  const wire = useTransform(fill, (f) => 1 - f * 0.9);
  const tagO = useTransform(t, (v) => Math.min(prog(v, s + 0.2, s + 0.5), 1 - prog(v, s + 1.5, s + 1.9)));

  return (
    <motion.div className={`absolute ${def.box}`} style={{ opacity, z, rotateX, y, transformStyle: "preserve-3d" }}>
      <motion.div className="absolute inset-0 rounded-lg border border-dashed border-[var(--sky)]" style={{ opacity: wire }} />
      <motion.div className="absolute inset-0" style={{ opacity: fill }}>
        <BlockContent id={def.id} />
      </motion.div>
      <motion.span
        className="absolute -top-5 left-0 rounded bg-[var(--sky)] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[var(--brand-ink)]"
        style={{ opacity: tagO }}
      >
        {def.tag}
      </motion.span>
    </motion.div>
  );
}

// ---------- Glass panels ----------

const glass =
  "rounded-2xl border border-line bg-ink-2/75 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl";

function CodeLine({ t, at, chars, children }: { t: MotionValue<number>; at: number; chars: number; children: React.ReactNode }) {
  const width = useTransform(t, (v) => `${prog(v, at, at + 0.4, (x) => x) * chars}ch`);
  const opacity = useTransform(t, (v) => (v < at ? 0 : 1 - prog(v, 14.2, 14.8)));
  const caret = useTransform(t, (v) => (v >= at && v < at + 0.55 ? 1 : 0));
  return (
    <motion.div className="flex h-[18px] items-center" style={{ opacity }}>
      <motion.span className="inline-block overflow-hidden whitespace-nowrap" style={{ width }}>
        {children}
      </motion.span>
      <motion.span className="ml-px inline-block h-3.5 w-[2px] bg-volt" style={{ opacity: caret }} />
    </motion.div>
  );
}

function CodePanel({ t }: { t: MotionValue<number> }) {
  const o = useTransform(t, (v) => life(v, 0.1, 0.6, 14.6));
  const z = useTransform(t, (v) => 150 + 120 * (1 - prog(v, 0.1, 0.9)));
  return (
    <motion.div className={`absolute left-0 top-[330px] w-[340px] ${glass}`} style={{ opacity: o, z }}>
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[var(--brand-ember)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--brand-amber)]" />
        <span className="h-2 w-2 rounded-full bg-[var(--brand-lime)]" />
        <span className="ml-3 font-mono text-[10px] text-mute">app/page.tsx</span>
      </div>
      <div className="space-y-0.5 px-4 py-3 font-mono text-[11px] text-paper">
        {BLOCKS.map((b, i) => (
          <div key={b.id} className="flex gap-3">
            <span className="w-3 text-right text-paper/25">{i + 1}</span>
            <CodeLine t={t} at={b.at} chars={b.chars}>
              {b.code}
            </CodeLine>
          </div>
        ))}
        <div className="mt-2 flex gap-3 border-t border-line pt-2">
          <span className="w-3 text-[var(--lime)]">$</span>
          <CodeLine t={t} at={4.6} chars={14}>
            deploy <A c="--prod" />
          </CodeLine>
        </div>
      </div>
    </motion.div>
  );
}

function Ring({ t, at, label, color }: { t: MotionValue<number>; at: number; label: string; color: string }) {
  const p = useTransform(t, (v) => prog(v, at, at + 1.1));
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="34" height="34" viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="3" />
        <motion.circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" style={{ pathLength: p }} />
      </svg>
      <span className="font-mono text-[9px] uppercase tracking-wider text-mute">{label}</span>
    </div>
  );
}

function DeployCard({ t }: { t: MotionValue<number> }) {
  const o = useTransform(t, (v) => life(v, 5.1, 0.5, 13.8));
  const scale = useTransform(t, (v) => 0.8 + 0.2 * prog(v, 5.1, 5.7, backOut));
  const z = useTransform(t, (v) => 260 + 80 * (1 - prog(v, 5.1, 5.8)));
  return (
    <motion.div className={`absolute left-[360px] top-[18px] px-5 py-4 ${glass}`} style={{ opacity: o, scale, z }}>
      <div className="flex items-center gap-2 text-sm font-medium text-paper">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-lime)] text-[11px] text-[var(--brand-ink)]">✓</span>
        Deployed to production
      </div>
      <div className="mt-3 flex gap-5 text-paper">
        <Ring t={t} at={5.5} label="Perf" color="var(--brand-lime)" />
        <Ring t={t} at={5.7} label="SEO" color="var(--brand-sky)" />
        <Ring t={t} at={5.9} label="A11y" color="var(--brand-violet)" />
      </div>
    </motion.div>
  );
}

const CURVE = "M0 92 C 30 88, 45 80, 70 76 S 110 70, 130 56 S 170 44, 190 30 S 230 12, 260 6";

function AnalyticsPanel({ t }: { t: MotionValue<number> }) {
  const o = useTransform(t, (v) => life(v, 6.4, 0.6, 14));
  const z = useTransform(t, (v) => 230 + 140 * (1 - prog(v, 6.4, 7.2)));
  const x = useTransform(t, (v) => 60 * (1 - prog(v, 6.4, 7.2)));
  const line = useTransform(t, (v) => prog(v, 6.9, 9, cubicBezier(0.45, 0, 0.2, 1)));
  const area = useTransform(t, (v) => prog(v, 8, 9.2) * 0.9);
  return (
    <motion.div className={`absolute left-[640px] top-[392px] w-[300px] p-4 ${glass}`} style={{ opacity: o, z, x }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-paper">Organic traffic</span>
        <span className="rounded-full bg-[color-mix(in_oklab,var(--lime)_18%,transparent)] px-2 py-0.5 font-mono text-[10px] text-[var(--lime)]">
          ↗ growing
        </span>
      </div>
      <svg viewBox="0 0 260 100" className="mt-3 h-[96px] w-full overflow-visible">
        <defs>
          <linearGradient id="bs-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--brand-violet)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--brand-violet)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bs-line" x1="0" x2="1">
            <stop offset="0" stopColor="var(--brand-sky)" />
            <stop offset="0.5" stopColor="var(--brand-violet)" />
            <stop offset="1" stopColor="var(--brand-pink)" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((y) => (
          <line key={y} x1="0" x2="260" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.07" />
        ))}
        <motion.path d={`${CURVE} L 260 100 L 0 100 Z`} fill="url(#bs-area)" style={{ opacity: area }} />
        <motion.path d={CURVE} fill="none" stroke="url(#bs-line)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: line }} />
      </svg>
      <div className="mt-3 flex h-10 items-end gap-1.5">
        {[0.35, 0.5, 0.42, 0.62, 0.7, 0.86, 1].map((h, i) => (
          <Bar key={i} t={t} at={7.2 + i * 0.12} h={h} />
        ))}
        <span className="ml-2 self-center font-mono text-[9px] uppercase tracking-wider text-mute">Leads</span>
      </div>
    </motion.div>
  );
}

function Bar({ t, at, h }: { t: MotionValue<number>; at: number; h: number }) {
  const scaleY = useTransform(t, (v) => prog(v, at, at + 0.6, backOut) * h);
  return <motion.span className="w-full origin-bottom rounded-sm bg-[var(--lime)]" style={{ height: "100%", scaleY }} />;
}

const EVENTS = [
  { label: "New lead", icon: "✦", at: 7.6, pos: "left-[24px] top-[150px]", z: 240, color: "var(--brand-lime)" },
  { label: "Campaign live", icon: "◉", at: 8.4, pos: "left-[730px] top-[96px]", z: 300, color: "var(--brand-pink)" },
  { label: "Ranking up", icon: "↑", at: 9.2, pos: "left-[800px] top-[270px]", z: 330, color: "var(--brand-sky)" },
  { label: "+1 sign-up", icon: "+", at: 10, pos: "left-[400px] top-[612px]", z: 200, color: "var(--brand-amber)" },
];

function EventChip({ ev, t, i }: { ev: (typeof EVENTS)[number]; t: MotionValue<number>; i: number }) {
  const o = useTransform(t, (v) => life(v, ev.at, 0.4, 13.6 + i * 0.1));
  const scale = useTransform(t, (v) => 0.6 + 0.4 * prog(v, ev.at, ev.at + 0.5, backOut));
  const bob = useTransform(t, (v) => Math.sin(v * 1.6 + i) * 6);
  return (
    <motion.div
      className={`absolute ${ev.pos} flex items-center gap-2 rounded-full border border-line bg-ink-2/80 py-1.5 pl-1.5 pr-3.5 text-xs font-medium text-paper shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl`}
      style={{ opacity: o, scale, y: bob, z: ev.z }}
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-[var(--brand-ink)]"
        style={{ background: ev.color, boxShadow: `0 0 16px ${ev.color}` }}
      >
        {ev.icon}
      </span>
      {ev.label}
    </motion.div>
  );
}

function Cursor({ t }: { t: MotionValue<number> }) {
  const o = useTransform(t, (v) => life(v, 9.4, 0.3, 12.8));
  const left = useTransform(t, (v) => `${78 - 64 * prog(v, 9.6, 10.6, cubicBezier(0.65, 0, 0.35, 1))}%`);
  const top = useTransform(t, (v) => `${84 - 32 * prog(v, 9.6, 10.6, cubicBezier(0.65, 0, 0.35, 1))}%`);
  const press = useTransform(t, (v) => 1 - 0.18 * Math.sin(Math.PI * prog(v, 10.7, 10.95, (x) => x)));
  const ripple = useTransform(t, (v) => prog(v, 10.75, 11.5));
  const rippleO = useTransform(ripple, (r) => (r > 0 && r < 1 ? 1 - r : 0));
  const rippleS = useTransform(ripple, (r) => 0.3 + r * 2.4);
  return (
    <motion.div className="absolute" style={{ left, top, opacity: o, z: 40 }}>
      <motion.span
        className="absolute -left-5 -top-5 h-10 w-10 rounded-full border-2 border-volt"
        style={{ opacity: rippleO, scale: rippleS }}
      />
      <motion.svg width="22" height="22" viewBox="0 0 24 24" style={{ scale: press }} className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
        <path d="M4 2l16 9-7 2-3 7z" fill="white" stroke="#07070a" strokeWidth="1.5" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
}

// ---------- Scene ----------

export default function BuildScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const inView = useInView(wrapRef);
  const t = useMotionValue(START);
  const reduced = useRef(false);

  // Camera follows the pointer
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, (v) => -17 + v * 8), { stiffness: 60, damping: 18 });
  const rotateX = useSpring(useTransform(py, (v) => 14 - v * 7), { stiffness: 60, damping: 18 });

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) t.set(HOLD);

    const el = wrapRef.current!;
    const ro = new ResizeObserver(() => setScale(Math.min(el.clientWidth / W, el.clientHeight / H) * 0.94));
    ro.observe(el);

    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [t, px, py]);

  useAnimationFrame((_, delta) => {
    // The intro delay always runs in real time; once the loop is going, pause while off-screen.
    if (reduced.current || (!inView && t.get() >= 0)) return;
    const next = t.get() + Math.min(delta, 64) / 1000;
    t.set(next >= CYCLE ? next - CYCLE : next);
  });

  const frameIn = useTransform(t, (v) => (v < 0 ? prog(v, -1.4, -0.2) : 1));
  const frameZ = useTransform(frameIn, (f) => -260 * (1 - f));
  const shimmerX = useTransform(t, (v) => `${-60 + 220 * prog(v, 5.4, 6.6, (x) => x)}%`);
  const shimmerO = useTransform(t, (v) => (v > 5.4 && v < 6.6 ? 1 : 0));
  const guides = useTransform(t, (v) => Math.min(prog(v, 0.2, 0.8), 1 - prog(v, 4.6, 5.3)) * 0.5);
  const glow = useTransform(t, (v) => 0.35 + 0.35 * prog(v, 6.4, 8));

  return (
    <div ref={wrapRef} className="pointer-events-none relative h-full w-full select-none" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})`, perspective: 1800 }}
      >
        {/* Light behind the scene */}
        <motion.div
          className="absolute left-[18%] top-[12%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,var(--brand-violet),transparent_65%)] blur-3xl"
          style={{ opacity: glow }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ rotateX, rotateY, rotateZ: 3, transformStyle: "preserve-3d" }}
        >
          {/* Browser */}
          <motion.div
            className="absolute left-[150px] top-[110px] h-[450px] w-[680px] rounded-2xl border border-line bg-ink-2 shadow-[0_60px_140px_-30px_rgba(0,0,0,0.55)]"
            style={{ opacity: frameIn, z: frameZ, transformStyle: "preserve-3d" }}
          >
            <div className="flex h-9 items-center gap-1.5 border-b border-line px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
              <span className="mx-auto rounded-md bg-paper/[0.06] px-12 py-1 font-mono text-[10px] text-mute">yourbrand.com</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 top-9 overflow-visible" style={{ transformStyle: "preserve-3d" }}>
              <motion.div className="absolute inset-0 flex justify-between px-[3%]" style={{ opacity: guides }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="h-full w-[6%] bg-[color-mix(in_oklab,var(--sky)_14%,transparent)]" />
                ))}
              </motion.div>
              {BLOCKS.map((b) => (
                <Block key={b.id} def={b} t={t} />
              ))}
              <Cursor t={t} />
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-2xl">
                <motion.div
                  className="absolute inset-y-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
                  style={{ left: shimmerX, opacity: shimmerO }}
                />
              </div>
            </div>
          </motion.div>

          <CodePanel t={t} />
          <DeployCard t={t} />
          <AnalyticsPanel t={t} />
          {EVENTS.map((ev, i) => (
            <EventChip key={ev.label} ev={ev} t={t} i={i} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
