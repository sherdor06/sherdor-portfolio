"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Music, Pause } from "lucide-react";

const MUSIC_URL = "/winter777.mp3";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setPlaying(false);
      audio.currentTime = 0;
    };

    const handleCanPlay = () => setLoaded(true);

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplaythrough", handleCanPlay);

    if (audio.readyState >= 3) setLoaded(true);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplaythrough", handleCanPlay);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  return (
    <>
      <audio ref={audioRef} src={MUSIC_URL} preload="auto" loop={false} />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
          playing
            ? "bg-blue-600 text-white music-playing"
            : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white"
        }`}
      >
        {playing ? (
          <div className="flex items-end gap-[3px] h-4">
            <span className="audio-bar w-[3px] rounded-full bg-white" />
            <span className="audio-bar w-[3px] rounded-full bg-white" />
            <span className="audio-bar w-[3px] rounded-full bg-white" />
            <span className="audio-bar w-[3px] rounded-full bg-white" />
          </div>
        ) : (
          <Music className="h-5 w-5" />
        )}
      </button>

      {!loaded && (
        <div className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
        </div>
      )}
    </>
  );
}
