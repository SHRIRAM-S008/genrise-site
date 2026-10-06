"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  cursor?: string;
  external?: boolean;
  className?: string;
};

export default function Magnetic({ href, children, variant = "solid", cursor, external, className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const styles =
    variant === "solid"
      ? "bg-volt text-ink"
      : "border border-paper/20 text-paper hover:border-paper/60";

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cursor={cursor}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-medium transition-colors ${styles} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      {variant === "solid" && (
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
      )}
    </motion.a>
  );
}
