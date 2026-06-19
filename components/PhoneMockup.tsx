export default function PhoneMockup() {
  return (
    <div className="relative flex items-center justify-center" aria-hidden="true">
      {/* Glow behind the phone */}
      <div className="absolute h-72 w-48 rounded-[2.5rem] bg-blue-500/10 blur-3xl" />

      {/* Phone frame */}
      <div className="relative h-72 w-48 animate-[float_6s_ease-in-out_infinite] rounded-[2.5rem] border-2 border-slate-700 bg-slate-900 p-3 shadow-2xl shadow-blue-500/5">
        {/* Notch / Dynamic Island */}
        <div className="mx-auto mb-4 h-5 w-20 rounded-full bg-slate-800" />

        {/* Screen content */}
        <div className="space-y-3">
          {/* Header bar */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <div className="h-2 w-16 rounded bg-slate-700" />
            <div className="ml-auto h-2 w-2 rounded-full bg-slate-600" />
          </div>

          {/* Card */}
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3">
            <div className="h-2 w-14 rounded bg-white/30" />
            <div className="mt-2 h-2 w-20 rounded bg-white/20" />
            <div className="mt-3 grid grid-cols-3 gap-1">
              <div className="aspect-square rounded-lg bg-white/15" />
              <div className="aspect-square rounded-lg bg-white/15" />
              <div className="aspect-square rounded-lg bg-white/15" />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5 rounded-lg bg-slate-800 p-2">
              <div className="h-2 w-8 rounded bg-slate-600" />
              <div className="h-3 w-6 rounded bg-blue-400" />
            </div>
            <div className="flex-1 space-y-1.5 rounded-lg bg-slate-800 p-2">
              <div className="h-2 w-8 rounded bg-slate-600" />
              <div className="h-3 w-6 rounded bg-green-400" />
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex justify-around pt-1">
            <div className="h-1 w-6 rounded-full bg-slate-600" />
            <div className="h-1 w-6 rounded-full bg-blue-400" />
            <div className="h-1 w-6 rounded-full bg-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
