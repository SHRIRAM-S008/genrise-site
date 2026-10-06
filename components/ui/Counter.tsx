"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function Counter({ to, suffix = "", delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, delay]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
