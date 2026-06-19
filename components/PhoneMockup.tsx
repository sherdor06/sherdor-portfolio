"use client";

import { useEffect, useState } from "react";

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

export default function PhoneMockup() {
  const now = useRealtimeClock();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const dayName = DAYS[now.getDay()];
  const monthName = MONTHS[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();

  return (
    <div className="relative flex items-center justify-center" aria-hidden="true">
      {/* Glow behind the phone */}
      <div className="absolute h-[500px] w-[280px] rounded-[3.5rem] bg-blue-500/10 blur-3xl" />

      {/* Phone frame */}
      <div className="relative h-[500px] w-[250px] animate-[float_6s_ease-in-out_infinite] rounded-[3rem] border-2 border-slate-700 bg-black p-4 shadow-2xl shadow-blue-500/10">
        {/* Dynamic Island */}
        <div className="relative mx-auto mb-6 h-7 w-24 rounded-full bg-black">
          <div className="absolute inset-0 rounded-full border border-slate-800" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
        </div>

        {/* Screen content */}
        <div className="space-y-4">
          {/* Time / Lock screen */}
          <div className="text-center">
            <div className="text-2xl font-light tracking-widest text-white">
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
            <div className="col-span-2 rounded-2xl bg-slate-800 p-3">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Activity
              </div>
              <div className="mt-1 flex gap-1">
                <div className="h-6 w-2 rounded-full bg-green-400/60" />
                <div className="h-4 w-2 self-end rounded-full bg-green-400/40" />
                <div className="h-7 w-2 rounded-full bg-green-400/80" />
                <div className="h-5 w-2 self-end rounded-full bg-green-400/50" />
                <div className="h-6 w-2 rounded-full bg-green-400/60" />
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
                                : "bg-slate-700"
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
              <AirplaneIcon active={false} />
            </div>
          </div>

          {/* iOS Home indicator */}
          <div className="flex justify-center pt-1">
            <div className="h-1 w-28 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
