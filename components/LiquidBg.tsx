export default function LiquidBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Blob 1 — blue */}
      <div
        className="absolute -left-20 -top-20 h-[700px] w-[700px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--th-blob-blue) 0%, transparent 70%)",
          animation: "blob-drift 20s ease-in-out infinite",
        }}
      />

      {/* Blob 2 — purple */}
      <div
        className="absolute -bottom-20 -right-20 h-[600px] w-[600px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--th-blob-purple) 0%, transparent 70%)",
          animation: "blob-drift-2 25s ease-in-out infinite",
        }}
      />

      {/* Blob 3 — teal */}
      <div
        className="absolute left-1/3 top-1/3 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--th-blob-teal) 0%, transparent 70%)",
          animation: "blob-drift-3 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}
