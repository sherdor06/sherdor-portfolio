"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Music, Volume2 } from "lucide-react";

const MUSIC_URL = "/winter777.mp3";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let blocked = true;

    const handleEnded = () => {
      setPlaying(false);
      audio.currentTime = 0;
    };

    audio.addEventListener("ended", handleEnded);

    const tryAutoplay = () => {
      audio.play().then(() => {
        blocked = false;
        setPlaying(true);
      }).catch(() => {
        setAutoplayBlocked(true);
      });
    };

    if (audio.readyState >= 3) {
      tryAutoplay();
    } else {
      audio.addEventListener("canplaythrough", tryAutoplay, { once: true });
    }

    const handleInteraction = () => {
      if (blocked) {
        audio.play().then(() => {
          blocked = false;
          setPlaying(true);
          setAutoplayBlocked(false);
        }).catch(() => {});
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplaythrough", tryAutoplay);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
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
      <audio ref={audioRef} src={MUSIC_URL} preload="auto" loop />

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

      {autoplayBlocked && !playing && (
        <div className="fixed bottom-24 right-6 z-50">
          <div className="flex items-center gap-2 rounded-full bg-slate-800/90 px-4 py-2 text-xs text-slate-300 shadow-lg backdrop-blur-md">
            <Volume2 className="h-3 w-3 text-blue-400" />
            Sahifani bossangiz musiqa ijro etiladi
          </div>
        </div>
      )}
    </>
  );
}
