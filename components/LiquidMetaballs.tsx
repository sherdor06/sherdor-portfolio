/**
 * Gooey "liquid" metaballs: solid color blobs that merge fluidly via an SVG goo
 * filter (Gaussian blur + alpha contrast). Sits behind the hero content. Decorative
 * only; the drifting animation is disabled under reduced motion (see globals.css).
 */
export default function LiquidMetaballs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Goo filter definition */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="metaball-layer absolute inset-0 opacity-40"
        style={{ filter: "url(#liquid-goo)" }}
      >
        <span
          className="absolute left-[8%] top-[20%] h-56 w-56 rounded-full"
          style={{
            background: "var(--th-accent)",
            animation: "blob-drift 18s ease-in-out infinite",
          }}
        />
        <span
          className="absolute left-[22%] top-[45%] h-44 w-44 rounded-full"
          style={{
            background: "#a855f7",
            animation: "blob-drift-2 22s ease-in-out infinite",
          }}
        />
        <span
          className="absolute right-[14%] top-[28%] h-52 w-52 rounded-full"
          style={{
            background: "#2dd4bf",
            animation: "blob-drift-3 20s ease-in-out infinite",
          }}
        />
        <span
          className="absolute right-[26%] bottom-[16%] h-40 w-40 rounded-full"
          style={{
            background: "#6366f1",
            animation: "blob-drift-4 26s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
