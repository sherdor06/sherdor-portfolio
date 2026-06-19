export default function LiquidBg() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Blob 1 — blue */}
      <div
        className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(99,102,241,0.2) 50%, transparent 70%)",
          animation: "blob-drift 18s ease-in-out infinite",
        }}
      />

      {/* Blob 2 — purple */}
      <div
        className="absolute -bottom-20 -right-20 h-[450px] w-[450px] rounded-full opacity-20 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)",
          animation: "blob-drift-2 22s ease-in-out infinite",
        }}
      />

      {/* Blob 3 — teal */}
      <div
        className="absolute left-1/3 top-1/3 h-[350px] w-[350px] rounded-full opacity-15 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.4) 0%, rgba(52,211,153,0.15) 50%, transparent 70%)",
          animation: "blob-drift-3 15s ease-in-out infinite",
        }}
      />
    </div>
  );
}
