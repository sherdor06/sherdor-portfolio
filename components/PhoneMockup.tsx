"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function useRealtimeClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function WifiIcon({ active }: { active: boolean }) {
  const c = active ? "text-blue-400" : "text-slate-600";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${c}`} stroke="currentColor" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BluetoothIcon({ active }: { active: boolean }) {
  const c = active ? "text-green-400" : "text-slate-600";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${c}`} stroke="currentColor" strokeWidth="2">
      <polyline points="6 7 18 13 12 17 12 2 18 6 6 13" />
    </svg>
  );
}

function AirplaneIcon({ active }: { active: boolean }) {
  const c = active ? "text-orange-400" : "text-slate-600";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${c}`} stroke="currentColor" strokeWidth="2">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-5-8-8-5z" />
    </svg>
  );
}

function FlutterF({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const posRef = useRef({ x: 60, y: 140 });
  const velRef = useRef({ x: 0.5, y: 0.4 });
  const [, forceRender] = useState(0);

  const sync = useCallback(() => {
    forceRender((n) => (n + 1) % 1000);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    const w = rect.width - margin * 2;
    const h = rect.height - margin * 2;
    const size = 28;

    let raf: number;

    const tick = () => {
      const p = posRef.current;
      const v = velRef.current;

      let nx = p.x + v.x;
      let ny = p.y + v.y;

      if (nx < margin || nx > w - size) {
        v.x *= -0.8;
        nx = Math.max(margin, Math.min(w - size, nx));
      }
      if (ny < margin || ny > h - size) {
        v.y *= -0.8;
        ny = Math.max(margin, Math.min(h - size, ny));
      }

      const speed = Math.sqrt(v.x * v.x + v.y * v.y);
      if (speed < 0.3 && speed > 0) {
        const scale = 0.3 / speed;
        v.x *= scale;
        v.y *= scale;
      }
      if (speed > 2) {
        const scale = 2 / speed;
        v.x *= scale;
        v.y *= scale;
      }

      posRef.current = { x: nx, y: ny };
      sync();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [containerRef, sync]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    const w = rect.width - margin * 2;
    const h = rect.height - margin * 2;
    const size = 28;

    const handleMouse = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const p = posRef.current;
      const cx = p.x + size / 2;
      const cy = p.y + size / 2;
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 60) {
        const angle = Math.atan2(dy, dx);
        const force = (60 - dist) / 60;
        const nx = p.x + Math.cos(angle) * force * 14;
        const ny = p.y + Math.sin(angle) * force * 14;
        posRef.current = {
          x: Math.max(margin, Math.min(w - size, nx)),
          y: Math.max(margin, Math.min(h - size, ny)),
        };
        sync();
      }
    };

    el.addEventListener("mousemove", handleMouse);
    return () => el.removeEventListener("mousemove", handleMouse);
  }, [containerRef, sync]);

  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: posRef.current.x, top: posRef.current.y }}
    >
      <img
        src="/flutter_logo.png"
        alt=""
        className="h-7 w-7 drop-shadow-lg"
      />
    </div>
  );
}

export default function PhoneMockup() {
  const now = useRealtimeClock();
  const { theme } = useTheme();
  const screenRef = useRef<HTMLDivElement>(null);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const dayName = DAYS[now.getDay()];
  const monthName = MONTHS[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  const glowColor =
    theme === "colorful"
      ? "bg-purple-500/15"
      : "bg-blue-500/10";

  const isLight = theme === "light";
  const frameBorder = isLight ? "border-slate-300" : "border-slate-700";
  const frameBg = isLight ? "bg-white" : "bg-black";
  const innerBg = isLight ? "bg-white" : "bg-black";
  const clockColor = isLight ? "text-slate-900" : "text-white";
  const homeIndicator = isLight ? "bg-black/20" : "bg-white/30";

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow behind the phone */}
      <div className={`absolute h-[500px] w-[280px] rounded-[3.5rem] blur-3xl ${glowColor}`} />

      {/* Phone frame */}
      <div
        className={`relative h-[500px] w-[242px] animate-[float_6s_ease-in-out_infinite] rounded-[3rem] border-[3px] ${frameBorder} bg-black p-[3px] shadow-2xl shadow-blue-500/10`}
      >
        {/* Left side: Silent switch (top), Volume up, Volume down */}
        <div className="absolute left-[-4px] top-[72px] h-[14px] w-[3px] rounded-r-sm bg-slate-500" />
        <div className="absolute left-[-4px] top-[98px] h-[30px] w-[3px] rounded-r-sm bg-slate-600" />
        <div className="absolute left-[-4px] top-[138px] h-[30px] w-[3px] rounded-r-sm bg-slate-600" />

        {/* Right side: Power button */}
        <div className="absolute right-[-4px] top-[110px] h-[40px] w-[3px] rounded-l-sm bg-slate-600" />
        {/* Inner bezel / screen area */}
        <div className={`h-full w-full overflow-hidden rounded-[2.7rem] ${innerBg}`}>
          {/* Dynamic Island */}
          <div className="relative mx-auto mt-2.5 h-6 w-[76px] rounded-full bg-black">
            <div className="absolute inset-0 rounded-full border border-slate-800" />
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
          </div>

          {/* Screen content */}
          <div ref={screenRef} className="relative mt-5 space-y-4 overflow-hidden px-4 pb-4">
          <FlutterF containerRef={screenRef} />

          {/* Time / Lock screen */}
          <div className="text-center">
            <div className={`text-2xl font-light tracking-widest ${clockColor}`}>
              {hours}:{minutes}
            </div>
            <div className="text-[10px] text-slate-500">
              {dayName}, {monthName} {date}, {year}
            </div>
          </div>

          {/* iOS Widgets grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-2 row-span-1 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 p-3">
              <div className="text-[10px] font-semibold text-white/80">Weather</div>
              <div className="text-xl font-thin text-white">24°</div>
              <div className="text-[10px] text-white/60">Sunny</div>
            </div>
            <div className="col-span-2 rounded-2xl bg-slate-200 p-3">
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Activity
              </div>
              <div className="mt-1 flex gap-1">
                <div className="h-6 w-2 rounded-full bg-green-500/60" />
                <div className="h-4 w-2 self-end rounded-full bg-green-500/40" />
                <div className="h-7 w-2 rounded-full bg-green-500/80" />
                <div className="h-5 w-2 self-end rounded-full bg-green-500/50" />
                <div className="h-6 w-2 rounded-full bg-green-500/60" />
              </div>
            </div>
          </div>

          {/* App icons row */}
          <div className="grid grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl ${
                  i === 0
                    ? "bg-blue-500"
                    : i === 1
                      ? "bg-green-500"
                      : i === 2
                        ? "bg-red-500"
                        : i === 3
                          ? "bg-purple-500"
                          : i === 4
                            ? "bg-orange-500"
                            : i === 5
                              ? "bg-teal-500"
                              : i === 6
                                ? "bg-indigo-500"
                                : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          {/* iOS Control Center toggles */}
          <div className="flex justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <WifiIcon active />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
              <BluetoothIcon active />
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isLight ? "bg-slate-200" : "bg-slate-800"}`}>
              <AirplaneIcon active={false} />
            </div>
          </div>

          {/* iOS Home indicator */}
          <div className="flex justify-center pt-1">
            <div className={`h-1 w-28 rounded-full ${homeIndicator}`} />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
