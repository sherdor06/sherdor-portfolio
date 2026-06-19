"use client";

import { useEffect, useRef } from "react";

/**
 * Soft accent glow that follows the cursor across the hero. Listens on window
 * but positions relative to its own rect, so it never blocks interaction with
 * the phone mockup (pointer-events-none). Disabled under reduced motion.
 */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && x <= r.width && y >= 0 && y <= r.height;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.opacity = inside ? "1" : "0";
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="spotlight pointer-events-none absolute inset-0 opacity-0"
    />
  );
}
