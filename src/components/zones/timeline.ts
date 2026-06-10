/**
 * TimelineController — deterministisk 30-sekunders tidslinje för
 * PitchZonesAnimation. Egen rAF-klocka (inte framer-motion) så att:
 *  - scrubbing är gratis (alla visuella värden är rena funktioner av t)
 *  - play/pause/seek/reset blir trivialt
 *  - animationen är verifierbar i headless-browsers (framer tweenar inte
 *    under navigator.webdriver, en ren rAF-klocka gör det)
 */

import { useCallback, useEffect, useRef, useState } from "react";

/** Mjuk standardeasing för alla zonrörelser (spec: easeInOutCubic). */
export const easeInOutCubic = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/**
 * Fas-progress: 0 före `start`, easad 0→1 mellan `start`..`end`, 1 efter.
 * Grundbyggstenen för alla reveal-effekter.
 */
export const phase = (
  t: number,
  start: number,
  end: number,
  ease: (x: number) => number = easeInOutCubic
): number => ease(clamp01((t - start) / (end - start)));

/** Puls: 0→1→0 över [start, end] (för korta "lys upp"-ögonblick). */
export const pulseIn = (t: number, start: number, end: number): number => {
  const p = clamp01((t - start) / (end - start));
  return Math.sin(p * Math.PI);
};

/** Kontinuerlig puls (för t.ex. gyllene zonen) — deterministisk av t. */
export const oscillate = (t: number, periodS: number): number =>
  0.5 + 0.5 * Math.sin(((t % periodS) / periodS) * Math.PI * 2);

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export interface Keyframe {
  /** Tidpunkt i sekunder. */
  at: number;
  /** Värdet vid tidpunkten. */
  v: number;
}

/**
 * Keyframe-interpolation: easat värde mellan närmaste två frames.
 * Frames måste vara sorterade på `at`. Före första/efter sista → clamp.
 */
export function kf(
  t: number,
  frames: Keyframe[],
  ease: (x: number) => number = easeInOutCubic
): number {
  if (frames.length === 0) return 0;
  if (t <= frames[0].at) return frames[0].v;
  const last = frames[frames.length - 1];
  if (t >= last.at) return last.v;
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (t >= a.at && t <= b.at) {
      return lerp(a.v, b.v, ease(clamp01((t - a.at) / (b.at - a.at))));
    }
  }
  return last.v;
}

export interface Timeline {
  /** Aktuell tid i sekunder, 0..duration. */
  t: number;
  playing: boolean;
  /** True när tidslinjen nått slutet (utan loop). */
  done: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  /** Hoppa till given tid (pausar inte). */
  seek: (t: number) => void;
  restart: () => void;
}

export function useTimeline(
  duration: number,
  opts: { autoPlay?: boolean; loop?: boolean; onComplete?: () => void } = {}
): Timeline {
  const { autoPlay = true, loop = false, onComplete } = opts;
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [done, setDone] = useState(false);
  const lastTs = useRef<number | null>(null);
  const rafId = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!playing) {
      lastTs.current = null;
      return;
    }
    const tick = (ts: number) => {
      if (lastTs.current === null) lastTs.current = ts;
      // Clamp dt: efter flik-byte/throttling ska klockan inte hoppa.
      const dt = Math.min((ts - lastTs.current) / 1000, 0.1);
      lastTs.current = ts;
      setT((prev) => {
        const next = prev + dt;
        if (next >= duration) {
          if (loop) return next % duration;
          setPlaying(false);
          setDone(true);
          onCompleteRef.current?.();
          return duration;
        }
        return next;
      });
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [playing, duration, loop]);

  const play = useCallback(() => {
    setDone(false);
    setT((prev) => (prev >= duration ? 0 : prev));
    setPlaying(true);
  }, [duration]);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);
  const seek = useCallback(
    (v: number) => {
      setDone(false);
      setT(Math.max(0, Math.min(duration, v)));
    },
    [duration]
  );
  const restart = useCallback(() => {
    setDone(false);
    setT(0);
    setPlaying(true);
  }, []);

  return { t, playing, done, play, pause, toggle, seek, restart };
}
