"use client";

import { motion, useTransform, type MotionValue, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
 * Hand-built 2D illustrations. Line work uses currentColor (follows the theme / card text colour),
 * fills use the fixed brand palette or the card accent `var(--a)`. Strokes draw on when scrolled into view.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const ORIGIN = { transformBox: "fill-box", transformOrigin: "center" } as const;
const BOTTOM = { transformBox: "fill-box", transformOrigin: "bottom" } as const;

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (d: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.4, ease: EASE, delay: d }, opacity: { duration: 0.01, delay: d } },
  }),
};
const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: (d: number = 0) => ({ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 18, delay: d } }),
};
const rise: Variants = {
  hidden: { scaleY: 0 },
  show: (d: number = 0) => ({ scaleY: 1, transition: { duration: 0.9, ease: EASE, delay: d } }),
};

function Svg({ viewBox, className, children }: { viewBox: string; className?: string; children: React.ReactNode }) {
  return (
    <motion.svg
      viewBox={viewBox}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </motion.svg>
  );
}

/** Gentle idle bob (CSS, so draw-on variants still reach the children). */
function Float({ children, d = 0, amp = 6, dur = 4 }: { children: React.ReactNode; d?: number; amp?: number; dur?: number }) {
  return (
    <g className="art-float" style={{ "--amp": `${-amp}px`, animationDuration: `${dur}s`, animationDelay: `${d}s` } as React.CSSProperties}>
      {children}
    </g>
  );
}

function Sparkle({ x, y, s = 1, fill, d = 0 }: { x: number; y: number; s?: number; fill: string; d?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <motion.g variants={pop} custom={d} style={ORIGIN}>
        <path
          d="M0 -10 C 1 -2, 2 -1, 10 0 C 2 1, 1 2, 0 10 C -1 2, -2 1, -10 0 C -2 -1, -1 -2, 0 -10 Z"
          fill={fill}
          stroke="none"
          className="art-spin"
        />
      </motion.g>
    </g>
  );
}

// ---------------------------------------------------------------- What We Do

export function BuildArt({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 400 260" className={className}>
      {/* back window */}
      <motion.rect x="140" y="20" width="230" height="150" rx="14" variants={draw} custom={0} />
      <motion.path d="M140 46 H370" variants={draw} custom={0.2} />
      {[160, 174, 188].map((cx, i) => (
        <motion.circle key={cx} cx={cx} cy="33" r="3.5" fill="currentColor" stroke="none" variants={pop} custom={0.4 + i * 0.05} style={ORIGIN} />
      ))}
      <motion.rect x="160" y="62" width="90" height="10" rx="5" fill="currentColor" fillOpacity="0.25" stroke="none" variants={pop} custom={0.6} style={ORIGIN} />
      <motion.rect x="160" y="82" width="190" height="36" rx="8" fill="white" fillOpacity="0.45" stroke="none" variants={pop} custom={0.7} style={ORIGIN} />
      <motion.rect x="160" y="128" width="56" height="28" rx="6" fill="white" fillOpacity="0.45" stroke="none" variants={pop} custom={0.8} style={ORIGIN} />
      <motion.rect x="226" y="128" width="56" height="28" rx="6" fill="white" fillOpacity="0.45" stroke="none" variants={pop} custom={0.85} style={ORIGIN} />
      <motion.rect x="292" y="128" width="58" height="28" rx="6" fill="white" fillOpacity="0.45" stroke="none" variants={pop} custom={0.9} style={ORIGIN} />
      {/* front code window */}
      <Float amp={5}>
        <motion.rect x="40" y="96" width="210" height="140" rx="14" fill="currentColor" fillOpacity="0.1" variants={draw} custom={0.3} />
        <motion.path d="M92 140 L70 162 L92 184" strokeWidth="5" variants={draw} custom={0.9} />
        <motion.path d="M128 194 L150 130" strokeWidth="5" variants={draw} custom={1.05} />
        <motion.path d="M186 140 L208 162 L186 184" strokeWidth="5" variants={draw} custom={1.2} />
      </Float>
      {/* cursor */}
      <Float d={1} amp={8} dur={3.2}>
        <motion.path d="M318 186 L350 204 L336 208 L330 222 Z" fill="white" variants={pop} custom={1.3} style={ORIGIN} />
      </Float>
      <Sparkle x={110} y={50} fill="white" d={1.4} />
      <Sparkle x={380} y={222} s={0.7} fill="currentColor" d={1.5} />
    </Svg>
  );
}

export function GrowArt({ className }: { className?: string }) {
  const bars = [40, 62, 86, 112, 146];
  return (
    <Svg viewBox="0 0 400 260" className={className}>
      <motion.path d="M40 224 H340" variants={draw} custom={0} />
      <motion.path d="M40 224 V40" variants={draw} custom={0.1} />
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={64 + i * 52}
          y={224 - h}
          width="34"
          height={h}
          rx="6"
          fill="white"
          fillOpacity={0.3 + i * 0.1}
          stroke="none"
          style={BOTTOM}
          variants={rise}
          custom={0.3 + i * 0.1}
        />
      ))}
      <motion.path d="M70 170 C 120 160, 140 140, 180 128 S 250 96, 300 60" strokeWidth="4" variants={draw} custom={0.9} />
      <motion.path d="M282 56 L304 58 L298 80" strokeWidth="4" variants={draw} custom={1.8} />
      {/* sprout on the tallest bar */}
      <motion.path d="M289 78 C 289 66, 291 58, 292 48" strokeWidth="3" variants={draw} custom={1.6} />
      <motion.path d="M291 58 C 280 54, 274 44, 276 34 C 288 36, 293 46, 291 58 Z" fill="white" fillOpacity="0.8" variants={pop} custom={1.9} style={ORIGIN} />
      <motion.path d="M292 50 C 300 42, 312 40, 318 44 C 314 54, 302 56, 292 50 Z" fill="white" fillOpacity="0.8" variants={pop} custom={2} style={ORIGIN} />
      {/* SEO magnifier */}
      <Float amp={7} dur={3.6}>
        <motion.circle cx="350" cy="120" r="24" fill="white" fillOpacity="0.35" variants={draw} custom={1.2} />
        <motion.path d="M367 137 L384 154" strokeWidth="6" variants={draw} custom={1.5} />
        <motion.path d="M340 120 H360 M350 110 V130" strokeWidth="3" variants={draw} custom={1.7} />
      </Float>
      <Sparkle x={120} y={60} fill="white" d={1.8} />
    </Svg>
  );
}

export function ScaleArt({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 400 260" className={className}>
      {/* cloud */}
      <motion.path
        d="M110 120 C 80 120, 70 84, 98 74 C 98 40, 146 30, 162 58 C 176 34, 226 40, 224 78 C 256 78, 262 120, 230 120 Z"
        fill="currentColor"
        fillOpacity="0.1"
        variants={draw}
        custom={0}
      />
      {/* servers */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <motion.rect x="270" y={70 + i * 42} width="96" height="32" rx="8" fill="white" fillOpacity="0.35" variants={draw} custom={0.3 + i * 0.15} />
          <motion.circle cx="286" cy={86 + i * 42} r="4" fill="currentColor" stroke="none" variants={pop} custom={0.8 + i * 0.1} style={ORIGIN} />
          <motion.path d={`M302 ${86 + i * 42} H350`} variants={draw} custom={0.9 + i * 0.1} />
        </g>
      ))}
      <motion.path d="M224 100 C 246 100, 250 86, 270 86" strokeDasharray="4 6" variants={draw} custom={1.1} />
      {/* shield */}
      <Float amp={6}>
        <motion.path d="M160 132 L208 148 V182 C 208 212, 184 230, 160 238 C 136 230, 112 212, 112 182 V148 Z" fill="white" fillOpacity="0.7" variants={draw} custom={0.5} />
        <motion.path d="M140 186 L156 202 L184 170" strokeWidth="5" variants={draw} custom={1.3} />
      </Float>
      {/* orbit */}
      <motion.ellipse cx="160" cy="186" rx="96" ry="28" strokeDasharray="3 7" strokeOpacity="0.6" variants={draw} custom={1} />
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "160px 186px" }}>
        <g transform="translate(160 186) scale(1 0.29) translate(-160 -186)">
          <circle cx="256" cy="186" r="9" fill="white" stroke="none" />
        </g>
      </motion.g>
      <Sparkle x={70} y={200} fill="white" d={1.5} />
      <Sparkle x={340} y={40} s={0.7} fill="currentColor" d={1.6} />
    </Svg>
  );
}

// ---------------------------------------------------------------- Services

const ACC = "var(--a)";

function Gear({ cx, cy, r, dir, d }: { cx: number; cy: number; r: number; dir: 1 | -1; d: number }) {
  return (
    <motion.g variants={pop} custom={d} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <motion.g animate={{ rotate: 360 * dir }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r={r} strokeWidth="9" strokeDasharray="7 6" stroke={ACC} />
        <circle cx={cx} cy={cy} r={r - 6} fill={ACC} fillOpacity="0.15" />
        <circle cx={cx} cy={cy} r={r * 0.32} />
      </motion.g>
    </motion.g>
  );
}

export function ServiceArt({ id, className }: { id: string; className?: string }) {
  const content: Record<string, React.ReactNode> = {
    "IT Consulting": (
      <>
        <motion.circle cx="70" cy="76" r="44" variants={draw} custom={0} />
        <motion.circle cx="70" cy="76" r="4" fill="currentColor" variants={pop} custom={0.5} style={ORIGIN} />
        <motion.g animate={{ rotate: [-25, 20, -25] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "70px 76px" }}>
          <path d="M70 40 L78 76 L70 112 L62 76 Z" fill={ACC} stroke="none" />
        </motion.g>
        <motion.path d="M118 92 C 140 120, 160 70, 186 96 S 206 110, 210 70" strokeDasharray="4 6" variants={draw} custom={0.6} />
        <motion.path d="M210 70 V34 L232 42 L210 50" fill={ACC} variants={pop} custom={1.2} style={ORIGIN} />
      </>
    ),
    "Custom Software": (
      <>
        <Gear cx={88} cy={78} r={38} dir={1} d={0} />
        <Gear cx={150} cy={56} r={24} dir={-1} d={0.2} />
        <motion.rect x="160" y="88" width="64" height="46" rx="8" variants={draw} custom={0.4} />
        <motion.path d="M172 104 H210 M172 118 H196" variants={draw} custom={0.8} />
      </>
    ),
    "SaaS Development": (
      <>
        <motion.path d="M66 62 C 46 62, 42 38, 60 32 C 60 10, 92 6, 102 24 C 112 8, 146 14, 144 38 C 164 38, 166 62, 146 62 Z" fill={ACC} fillOpacity="0.2" variants={draw} custom={0} />
        <motion.path d="M104 62 V84" strokeDasharray="3 5" variants={draw} custom={0.5} />
        <motion.rect x="40" y="84" width="160" height="56" rx="10" variants={draw} custom={0.4} />
        {[0, 1, 2, 3].map((i) => (
          <motion.rect key={i} x={56 + i * 18} y={124 - (i + 1) * 7} width="10" height={(i + 1) * 7} rx="2" fill={ACC} stroke="none" style={BOTTOM} variants={rise} custom={0.8 + i * 0.08} />
        ))}
        {[0, 1, 2].map((i) => (
          <motion.circle key={i} cx={150 + i * 14} cy="112" r="8" fill="currentColor" fillOpacity={0.15 + i * 0.15} variants={pop} custom={1 + i * 0.1} style={ORIGIN} />
        ))}
      </>
    ),
    "Web Design": (
      <>
        <motion.path d="M30 120 C 70 30, 150 150, 200 50" strokeWidth="3" stroke={ACC} variants={draw} custom={0} />
        <motion.path d="M70 60 L110 90 M160 110 L200 50" strokeOpacity="0.5" variants={draw} custom={0.5} />
        {[
          [70, 60],
          [110, 90],
          [160, 110],
        ].map(([x, y], i) => (
          <motion.rect key={i} x={x - 5} y={y - 5} width="10" height="10" fill="currentColor" variants={pop} custom={0.8 + i * 0.1} style={ORIGIN} />
        ))}
        <Float amp={5}>
          <motion.path d="M200 50 L214 22 L228 50 L214 66 Z" fill={ACC} variants={pop} custom={1.1} style={ORIGIN} />
        </Float>
        {["var(--brand-lime)", "var(--brand-sky)", "var(--brand-violet)", "var(--brand-pink)"].map((c, i) => (
          <motion.circle key={c} cx={40 + i * 22} cy="34" r="8" fill={c} stroke="none" variants={pop} custom={1.2 + i * 0.06} style={ORIGIN} />
        ))}
      </>
    ),
    "Web Development": (
      <>
        <motion.rect x="30" y="20" width="190" height="120" rx="12" variants={draw} custom={0} />
        <motion.path d="M30 42 H220" variants={draw} custom={0.2} />
        <motion.path d="M78 70 C 66 70, 70 90, 60 90 C 70 90, 66 110, 78 110" strokeWidth="4" stroke={ACC} variants={draw} custom={0.6} />
        <motion.path d="M112 70 C 124 70, 120 90, 130 90 C 120 90, 124 110, 112 110" strokeWidth="4" stroke={ACC} variants={draw} custom={0.75} />
        <motion.rect x="150" y="62" width="52" height="20" rx="5" fill="currentColor" fillOpacity="0.15" stroke="none" variants={pop} custom={0.9} style={ORIGIN} />
        <motion.rect x="150" y="90" width="52" height="34" rx="5" fill={ACC} fillOpacity="0.4" stroke="none" variants={pop} custom={1} style={ORIGIN} />
      </>
    ),
    "Information Security": (
      <>
        <motion.path d="M100 14 L156 32 V72 C 156 108, 128 128, 100 138 C 72 128, 44 108, 44 72 V32 Z" fill={ACC} fillOpacity="0.15" variants={draw} custom={0} />
        <motion.rect x="82" y="70" width="36" height="30" rx="6" fill={ACC} stroke="none" variants={pop} custom={0.7} style={ORIGIN} />
        <motion.path d="M89 70 V60 C 89 46, 111 46, 111 60 V70" strokeWidth="4" variants={draw} custom={0.8} />
        <motion.g animate={{ y: [0, 96, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M36 26 H164" stroke={ACC} strokeWidth="2" strokeOpacity="0.8" />
        </motion.g>
        <motion.path d="M180 50 H220 M180 70 H210 M180 90 H224" strokeOpacity="0.5" variants={draw} custom={1} />
      </>
    ),
    "Digital Marketing": (
      <>
        <motion.path d="M40 70 L110 40 V120 L40 96 Z" fill={ACC} fillOpacity="0.25" variants={draw} custom={0} />
        <motion.rect x="26" y="68" width="16" height="30" rx="4" fill="currentColor" variants={pop} custom={0.4} style={ORIGIN} />
        <motion.path d="M54 100 L62 128 H74 L68 102" variants={draw} custom={0.5} />
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${126 + i * 16} ${56 - i * 8} C ${140 + i * 20} ${70 - i * 4}, ${140 + i * 20} ${90 + i * 4}, ${126 + i * 16} ${104 + i * 8}`}
            stroke={ACC}
            strokeWidth="3"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        <motion.path d="M190 130 L204 112 L216 120 L232 92" strokeWidth="3" variants={draw} custom={0.9} />
      </>
    ),
  };

  return (
    <Svg viewBox="0 0 240 150" className={className}>
      {content[id]}
    </Svg>
  );
}

// ---------------------------------------------------------------- Process roadmap

const ROUTE = "M40 20 C 300 20, 300 110, 160 110 S 20 200, 160 200 S 320 290, 300 290";
const STOPS = [
  [40, 20],
  [238, 50],
  [160, 110],
  [76, 160],
  [190, 206],
  [300, 290],
];
const STOP_COLORS = ["var(--lime)", "var(--sky)", "var(--violet)", "var(--pink)", "var(--ember)", "var(--lime)"];

export function RoadmapArt({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  useEffect(() => setLen(pathRef.current?.getTotalLength() ?? 0), []);

  const point = (p: number) => {
    const el = pathRef.current;
    if (!el || !len) return { x: 40, y: 20, a: 0 };
    const l = Math.min(len, Math.max(0, p * len));
    const a = el.getPointAtLength(l);
    const b = el.getPointAtLength(Math.min(len, l + 1));
    return { x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
  };
  const transform = useTransform(progress, (p) => {
    const { x, y, a } = point(p);
    return `translate(${x}px, ${y}px) rotate(${a}deg)`;
  });
  const trail = useTransform(progress, (p) => Math.max(0.001, p));

  return (
    <svg viewBox="0 0 340 320" className={className} fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
      <path ref={pathRef} d={ROUTE} strokeWidth="2" strokeDasharray="2 8" strokeOpacity="0.35" />
      <motion.path d={ROUTE} strokeWidth="3" stroke="url(#route-grad)" style={{ pathLength: trail }} />
      <defs>
        <linearGradient id="route-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--lime)" />
          <stop offset="0.5" stopColor="var(--violet)" />
          <stop offset="1" stopColor="var(--ember)" />
        </linearGradient>
      </defs>
      {STOPS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="var(--bg)" stroke={STOP_COLORS[i]} strokeWidth="3" />
          <text x={x + 16} y={y + 4} fill="currentColor" stroke="none" fontSize="11" fontFamily="var(--font-geist-mono)" opacity="0.5">
            0{i + 1}
          </text>
        </g>
      ))}
      {/* paper plane */}
      <motion.g style={{ transform }}>
        <g transform="translate(-14 -10)">
          <path d="M0 10 L28 0 L18 24 L13 14 Z" fill="var(--fg)" stroke="var(--fg)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 14 L28 0" stroke="var(--bg)" strokeWidth="1.5" />
        </g>
      </motion.g>
    </svg>
  );
}

// ---------------------------------------------------------------- Why GenRise

export function VennArt({ className }: { className?: string }) {
  const circles = [
    { cx: 120, cy: 100, label: "Build", c: "var(--brand-sky)", lx: 82, ly: 80 },
    { cx: 200, cy: 100, label: "Grow", c: "var(--brand-pink)", lx: 214, ly: 80 },
    { cx: 160, cy: 168, label: "Secure", c: "var(--brand-lime)", lx: 138, ly: 210 },
  ];
  return (
    <Svg viewBox="0 0 320 260" className={className}>
      {circles.map((c, i) => (
        <Float key={c.label} d={i * 0.7} amp={5} dur={5}>
          <motion.circle cx={c.cx} cy={c.cy} r="70" fill={c.c} fillOpacity="0.28" stroke={c.c} strokeWidth="2" variants={pop} custom={i * 0.15} style={ORIGIN} />
          <motion.text x={c.lx} y={c.ly} fill="currentColor" stroke="none" fontSize="14" fontFamily="var(--font-geist-mono)" letterSpacing="2" variants={pop} custom={0.6 + i * 0.1}>
            {c.label.toUpperCase()}
          </motion.text>
        </Float>
      ))}
      <Sparkle x={160} y={124} s={1.3} fill="currentColor" d={1} />
      <motion.text x="143" y="152" fill="currentColor" stroke="none" fontSize="11" fontFamily="var(--font-geist-mono)" opacity="0.7" variants={pop} custom={1.1}>
        YOU
      </motion.text>
    </Svg>
  );
}

// ---------------------------------------------------------------- FAQ

export function FaqArt({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 320 230" className={className}>
      <Float amp={5}>
        <motion.path d="M30 30 H200 A 18 18 0 0 1 218 48 V120 A 18 18 0 0 1 200 138 H90 L56 166 V138 H48 A 18 18 0 0 1 30 120 Z" fill="var(--brand-violet)" fillOpacity="0.18" stroke="var(--violet)" variants={draw} custom={0} />
        <motion.path d="M104 70 C 104 50, 144 50, 144 70 C 144 86, 124 86, 124 100" strokeWidth="6" stroke="var(--violet)" variants={draw} custom={0.6} />
        <motion.circle cx="124" cy="116" r="4.5" fill="var(--violet)" stroke="none" variants={pop} custom={1.2} style={ORIGIN} />
      </Float>
      <Float d={1.2} amp={6} dur={4.6}>
        <motion.path d="M160 140 H272 A 16 16 0 0 1 288 156 V188 A 16 16 0 0 1 272 204 H262 V226 L238 204 H176 A 16 16 0 0 1 160 188 V156 A 16 16 0 0 1 176 140 Z" fill="var(--brand-lime)" fillOpacity="0.2" stroke="var(--lime)" variants={draw} custom={0.4} />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={204 + i * 20}
            cy="172"
            r="5"
            fill="var(--lime)"
            stroke="none"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 1.2, delay: i * 0.18, repeat: Infinity }}
          />
        ))}
      </Float>
      <Sparkle x={262} y={60} fill="var(--pink)" d={1.3} />
      <Sparkle x={30} y={200} s={0.7} fill="var(--sky)" d={1.4} />
    </Svg>
  );
}
