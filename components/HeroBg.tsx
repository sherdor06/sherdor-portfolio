export default function HeroBg() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Large gradient orbs */}
      <div
        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-[blob-drift_20s_ease-in-out_infinite] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(99,102,241,0.15) 40%, transparent 65%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[550px] w-[550px] animate-[blob-drift-2_25s_ease-in-out_infinite] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.15) 40%, transparent 65%)",
        }}
      />
      <div
        className="absolute left-1/4 top-1/2 h-[400px] w-[400px] animate-[blob-drift-3_18s_ease-in-out_infinite] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.25) 0%, rgba(52,211,153,0.1) 40%, transparent 65%)",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
