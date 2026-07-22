import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type CoachTacticsVariant =
  | "spelide"
  | "prisma"
  | "femupphojt"
  | "spelmodellLabb"
  | "traningsplanering"
  | "traningsplan"
  | "motstandaranalys"
  | "matchblad"
  | "taktiktavla";

type Point = [number, number];

type AnimationConfig = {
  eyebrow: string;
  title: string;
  description: string;
  cue: string;
  ball: Point[];
  arrow: string;
  whiteMoves: Array<{ index: number; to: Point }>;
  yellowMoves: Array<{ index: number; to: Point }>;
};

const WHITE_433: Point[] = [
  [8, 32], [23, 13], [25, 25], [25, 39], [23, 51], [43, 16], [45, 32], [43, 48], [67, 13], [76, 32], [67, 51],
];

const YELLOW_442: Point[] = [
  [92, 25], [92, 39], [78, 12], [78, 25], [78, 39], [78, 52], [60, 16], [61, 32], [60, 48], [48, 25], [48, 39],
];

const COACH_TACTICS: Record<CoachTacticsVariant, AnimationConfig> = {
  spelide: {
    eyebrow: "Spelidé · 4–3–3 mot 4–4–2",
    title: "Spela ut för att spela framåt",
    description: "Bollen går via sexan utanför deras första press. Yttern står brett, åttan fyller halvrummet.",
    cue: "Scanning · ta ytan · spela nästa",
    ball: [[8, 32], [25, 39], [45, 32], [67, 13], [82, 13]],
    arrow: "M8 32 C25 40 42 31 67 13 S79 13 85 13",
    whiteMoves: [{ index: 5, to: [55, 15] }, { index: 8, to: [76, 9] }],
    yellowMoves: [{ index: 9, to: [38, 27] }, { index: 2, to: [70, 10] }],
  },
  prisma: {
    eyebrow: "Prisma · 4–3–3 mot 4–4–2",
    title: "Testa fokus i matchbilden",
    description: "Ett tydligt pressläge skapar bollvinst. Första passningen går framåt medan laget fyller på.",
    cue: "Fokus · constraint · coachrop · bevis",
    ball: [[56, 32], [48, 32], [43, 32], [60, 22], [78, 13]],
    arrow: "M58 32 C50 32 45 33 43 32 S60 22 80 13",
    whiteMoves: [{ index: 6, to: [51, 32] }, { index: 5, to: [61, 21] }, { index: 9, to: [81, 14] }],
    yellowMoves: [{ index: 7, to: [54, 32] }, { index: 9, to: [43, 28] }],
  },
  femupphojt: {
    eyebrow: "5⁵ · 4–3–3 mot 4–4–2",
    title: "Hitta nästa nivå",
    description: "Scanna innan mottagning, skapa nästa passningsvinkel och spela förbi när pressen kliver.",
    cue: "Riktning · identitet · skede · princip · arbetssätt",
    ball: [[25, 25], [43, 16], [55, 16], [67, 13], [82, 13]],
    arrow: "M25 25 C36 16 45 15 55 16 S68 13 84 13",
    whiteMoves: [{ index: 5, to: [55, 16] }, { index: 8, to: [77, 10] }],
    yellowMoves: [{ index: 9, to: [37, 21] }, { index: 2, to: [70, 11] }],
  },
  spelmodellLabb: {
    eyebrow: "Veckans arbetsyta · 4–3–3 mot 4–4–2",
    title: "Bygg veckans matchbild",
    description: "Laget tränar samma problem som matchen kan ge: spela runt första pressen och attackera nästa yta.",
    cue: "Matchproblem · lärsteg · situation",
    ball: [[8, 32], [25, 13], [43, 16], [61, 16], [76, 9]],
    arrow: "M8 32 C20 15 31 12 43 16 S59 16 77 9",
    whiteMoves: [{ index: 1, to: [31, 10] }, { index: 5, to: [56, 16] }, { index: 8, to: [78, 8] }],
    yellowMoves: [{ index: 9, to: [37, 22] }, { index: 2, to: [69, 10] }],
  },
  traningsplanering: {
    eyebrow: "Träningsplanering · 4–3–3 mot 4–4–2",
    title: "Låt övningen kräva rätt beslut",
    description: "Pressen i övningen stänger mitten. Då måste spelarna skanna, flytta bollen och använda den fria ytterytan.",
    cue: "Problem · yta · beslut · repetition",
    ball: [[43, 32], [25, 39], [23, 51], [43, 48], [67, 51]],
    arrow: "M43 32 C33 35 25 39 23 51 S47 49 68 51",
    whiteMoves: [{ index: 3, to: [30, 54] }, { index: 7, to: [52, 48] }, { index: 10, to: [76, 54] }],
    yellowMoves: [{ index: 7, to: [48, 37] }, { index: 5, to: [66, 49] }],
  },
  traningsplan: {
    eyebrow: "Träningsplan · 4–3–3 mot 4–4–2",
    title: "Gör passets fokus synligt",
    description: "Tre signaler räcker: vem startar pressen, var finns nästa yta och vilket beteende ska upprepas?",
    cue: "Startsignal · nästa yta · återkoppling",
    ball: [[8, 32], [25, 25], [43, 16], [61, 16], [76, 9]],
    arrow: "M8 32 C21 28 29 23 43 16 S61 16 77 9",
    whiteMoves: [{ index: 2, to: [32, 23] }, { index: 5, to: [57, 16] }, { index: 8, to: [77, 8] }],
    yellowMoves: [{ index: 9, to: [39, 20] }, { index: 2, to: [70, 10] }],
  },
  motstandaranalys: {
    eyebrow: "Motståndaranalys · 4–3–3 mot 4–4–2",
    title: "Dra isär deras 4–4–2",
    description: "När deras två forwards stänger mitten gör vi planen bred. Sexan blir fri eller bollen går runt på utsidan.",
    cue: "Se pressen · skapa fri spelare · spela vidare",
    ball: [[8, 32], [25, 51], [43, 48], [61, 48], [78, 51]],
    arrow: "M8 32 C18 43 26 51 43 48 S61 48 80 51",
    whiteMoves: [{ index: 3, to: [32, 54] }, { index: 7, to: [55, 48] }, { index: 10, to: [80, 53] }],
    yellowMoves: [{ index: 10, to: [39, 38] }, { index: 5, to: [68, 49] }],
  },
  matchblad: {
    eyebrow: "Matchblad · 4–3–3 mot 4–4–2",
    title: "Gör första fokus tydligt",
    description: "Matchbladet förankrar en enkel start: pressa utåt tillsammans, säkra mitten och spela nästa aktion med fart.",
    cue: "Pressa utåt · skydda mitten · spela nästa",
    ball: [[61, 32], [48, 32], [43, 32], [55, 22], [76, 13]],
    arrow: "M61 32 C53 32 47 32 43 32 S55 22 78 13",
    whiteMoves: [{ index: 6, to: [50, 32] }, { index: 5, to: [58, 21] }, { index: 8, to: [79, 12] }],
    yellowMoves: [{ index: 7, to: [54, 32] }, { index: 9, to: [43, 27] }],
  },
  taktiktavla: {
    eyebrow: "Taktiktavla · 4–3–3 mot 4–4–2",
    title: "Spelvänd när pressen låser",
    description: "Dra över deras block, spela tillbaka och vänd till den fria yttern. Laget flyttar med bollen och fyller nästa yta.",
    cue: "Locka · säkra · vänd · attackera",
    ball: [[8, 32], [25, 13], [43, 16], [43, 48], [67, 51], [82, 51]],
    arrow: "M8 32 C18 15 32 11 43 16 L43 48 C54 51 66 51 84 51",
    whiteMoves: [{ index: 1, to: [31, 10] }, { index: 7, to: [52, 48] }, { index: 10, to: [79, 53] }],
    yellowMoves: [{ index: 2, to: [70, 10] }, { index: 5, to: [68, 50] }],
  },
};

const LOOP_SECONDS = 4.8;

const CoachTacticsAnimation = ({ variant }: { variant: CoachTacticsVariant }) => {
  const config = COACH_TACTICS[variant];
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const staticFrame = Boolean(paused || reduceMotion);

  const transition = staticFrame
    ? { duration: 0 }
    : { duration: LOOP_SECONDS, times: [0, 0.18, 0.52, 0.78, 1], repeat: Infinity, ease: "easeInOut" as const };

  const track = (start: Point, end?: Point) => {
    const target = end ?? start;
    return { cx: [start[0], start[0], target[0], target[0], start[0]], cy: [start[1], start[1], target[1], target[1], start[1]] };
  };

  const ballTrack = config.ball.length === 5
    ? config.ball
    : [config.ball[0], config.ball[1], config.ball[Math.floor(config.ball.length / 2)], config.ball.at(-1)!, config.ball[0]];

  return (
    <figure className="mx-auto my-10 max-w-5xl overflow-hidden rounded-2xl border border-[#294666] bg-[#071B38] text-white shadow-[0_18px_48px_rgba(4,17,36,0.22)]">
      <div className="flex flex-col gap-3 border-b border-white/15 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <figcaption>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8DB4D8]">{config.eyebrow}</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-white">{config.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#C4D6E8]">{config.description}</p>
        </figcaption>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="min-h-11 self-start rounded-md border border-white/20 px-3 text-xs font-bold text-white transition-colors hover:border-[#FFD83D] hover:text-[#FFD83D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD83D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071B38] sm:self-auto"
          aria-pressed={paused}
        >
          {paused ? "Spela animation" : "Pausa animation"}
        </button>
      </div>

      <div className="relative aspect-[16/8] min-h-64">
        <svg viewBox="0 0 100 64" className="absolute inset-0 h-full w-full" role="img" aria-label={`${config.title}. Vita spelare i 4–3–3 möter gula spelare i 4–4–2.`}>
          <rect width="100" height="64" fill="#0A2749" />
          <rect x="3" y="4" width="94" height="56" rx="1" fill="none" stroke="#7795B3" strokeWidth="0.55" />
          <path d="M50 4V60M3 32H97M14 21V43M86 21V43M3 25H14M3 39H14M86 25H97M86 39H97" fill="none" stroke="#7795B3" strokeWidth="0.45" opacity="0.8" />
          <circle cx="50" cy="32" r="6" fill="none" stroke="#7795B3" strokeWidth="0.45" opacity="0.8" />
          <motion.path d={config.arrow} fill="none" stroke="#98FF54" strokeWidth="0.9" strokeLinecap="round" strokeDasharray="2.4 2.4" animate={staticFrame ? { opacity: 0.9, pathLength: 1 } : { opacity: [0.2, 1, 1, 0.2, 0.2], pathLength: [0, 1, 1, 1, 0] }} transition={transition} />
          {YELLOW_442.map((point, index) => {
            const move = config.yellowMoves.find((item) => item.index === index)?.to;
            return <motion.circle key={`yellow-${index}`} r="2.25" fill="#FFD83D" stroke="#9E7600" strokeWidth="0.45" animate={track(point, move)} transition={transition} />;
          })}
          {WHITE_433.map((point, index) => {
            const move = config.whiteMoves.find((item) => item.index === index)?.to;
            return <motion.circle key={`white-${index}`} r="2.25" fill="#FFFFFF" stroke="#9CB7D1" strokeWidth="0.45" animate={track(point, move)} transition={transition} />;
          })}
          <motion.circle r="1.25" fill="#98FF54" stroke="#071B38" strokeWidth="0.55" animate={{ cx: staticFrame ? config.ball[0][0] : ballTrack.map((point) => point[0]), cy: staticFrame ? config.ball[0][1] : ballTrack.map((point) => point[1]) }} transition={transition} />
        </svg>
        <div className="absolute bottom-4 left-4 rounded bg-[#061527]/85 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#98FF54] backdrop-blur-sm">{config.cue}</div>
        <div className="absolute right-4 top-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#C4D6E8]"><span className="h-2.5 w-2.5 rounded-full bg-white" /> 4–3–3 <span className="ml-2 h-2.5 w-2.5 rounded-full bg-[#FFD83D]" /> 4–4–2</div>
      </div>
    </figure>
  );
};

export default CoachTacticsAnimation;
