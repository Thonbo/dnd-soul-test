"use client";

import { useState, useCallback } from "react";
import {
  QUESTIONS, CLASSES, RACES, ARCHETYPES, ZERO,
  type Scores, type ClassDef,
} from "@/lib/data";

// ─── helpers ────────────────────────────────────────────────
function applyWeights(scores: Scores, weights: Partial<Scores>, sign: 1 | -1): Scores {
  const next = { ...scores };
  for (const [k, v] of Object.entries(weights)) {
    (next as Record<string, number>)[k] += sign * (v as number);
  }
  return next;
}

const ORDINALS = [
  "FIRST","SECOND","THIRD","FOURTH","FIFTH","SIXTH","SEVENTH","EIGHTH","NINTH","TENTH",
  "ELEVENTH","TWELFTH","THIRTEENTH","FOURTEENTH","FIFTEENTH","SIXTEENTH","SEVENTEENTH",
  "EIGHTEENTH","NINETEENTH","TWENTIETH","TWENTY-FIRST","TWENTY-SECOND","TWENTY-THIRD",
  "TWENTY-FOURTH","TWENTY-FIFTH","TWENTY-SIXTH","TWENTY-SEVENTH","TWENTY-EIGHTH",
  "TWENTY-NINTH","THIRTIETH","THIRTY-FIRST","THIRTY-SECOND",
];

// ─── result engine ───────────────────────────────────────────
function computeResult(scores: Scores) {
  const ranked = [...CLASSES]
    .map(c => ({ ...c, s: c.score(scores) }))
    .sort((a, b) => b.s - a.s);
  const top = ranked[0] as ClassDef & { s: number };
  const second = ranked[1] as ClassDef & { s: number };

  const topRace = [...RACES]
    .map(r => ({ ...r, s: r.score(scores) }))
    .sort((a, b) => b.s - a.s)[0];

  const arches = ARCHETYPES[top.name] ?? [];
  const ai = Math.abs(Math.floor(scores.order - scores.chaos + scores.good - scores.dark)) % arches.length;
  const archetype = arches[ai];

  const lawChaos = scores.order >= scores.chaos ? "Lawful" : "Chaotic";
  const goodEvil = scores.good >= scores.dark
    ? "Good"
    : scores.dark > 6 ? "Evil" : "Neutral";

  const isMagic = scores.magic > scores.martial;
  const isSocial = scores.social > scores.stealth;
  const isNova = scores.nova > scores.sustained;
  const isOrder = scores.order >= scores.chaos;

  return { top, second, topRace, archetype, lawChaos, goodEvil, isMagic, isSocial, isNova, isOrder };
}

// ─── sub-components ──────────────────────────────────────────
function Divider() {
  return (
    <div className="relative my-7">
      <div className="border-t border-[#a07830]" />
      <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f0ddb0] px-3 text-[#8b6914] text-base">
        ⚔
      </span>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[#a07830] bg-[#8b691408] text-center py-3 px-1">
      <span className="font-cinzel block text-[11px] tracking-widest text-[#8b6914] uppercase mb-1">{label}</span>
      <span className="text-[#3d1507] text-2xl font-bold">{value}</span>
    </div>
  );
}

function TraitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 mb-3 text-[#3a2010] leading-relaxed text-[1.05rem]">
      <span className="text-[#8b6914] mt-1 text-sm flex-shrink-0">◆</span>
      <span>{text}</span>
    </div>
  );
}

// ─── QUIZ VIEW ────────────────────────────────────────────────
function QuizView({
  cur, answers, onPick, onPrev, onNext,
}: {
  cur: number;
  answers: (null | "a" | "b")[];
  onPick: (l: "a" | "b") => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const q = QUESTIONS[cur];
  const total = QUESTIONS.length;
  const answered = answers.filter(Boolean).length;
  const pct = Math.round((answered / total) * 100);
  const isLast = cur === total - 1;

  return (
    <>
      {/* Header */}
      <h1 className="font-cinzel-dec text-[2rem] text-center text-[#3d1507] mb-2 leading-tight">
        The Oracle&apos;s Mirror
      </h1>
      <p className="font-cinzel text-[0.82rem] text-center text-[#7a4a2a] italic mb-7 tracking-wide">
        Answer truly — the Oracle sees through pretense
      </p>

      <Divider />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between font-cinzel text-[0.75rem] text-[#7a4a2a] mb-2">
          <span>Inquiry {cur + 1} of {total}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2.5 bg-[#d4b896] rounded border border-[#a07830] overflow-hidden">
          <div
            className="h-full rounded transition-all duration-500"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#7a0e0e,#b83010)" }}
          />
        </div>
      </div>

      {/* Question */}
      <p className="font-cinzel text-[0.72rem] tracking-[2px] uppercase text-[#8b6914] mb-3">
        Inquiry the {ORDINALS[cur] ?? cur + 1}
      </p>
      <p className="font-lora italic font-semibold text-[1.2rem] text-[#2c1810] leading-relaxed mb-7">{q.text}</p>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        {(["a", "b"] as const).map(l => (
          <button
            key={l}
            onClick={() => onPick(l)}
            className={`
              text-left border-2 rounded-sm px-5 py-4 transition-all duration-150 cursor-pointer
              font-lora text-[1.05rem] text-[#2c1810] leading-relaxed
              ${answers[cur] === l
                ? "border-[#7a0e0e] bg-[#7a0e0e12]"
                : "border-[#a07830] hover:border-[#3d1507] hover:bg-[#8b691415] hover:-translate-y-0.5 hover:shadow-md"
              }
            `}
          >
            <span className="font-cinzel text-[0.85rem] text-[#8b6914] block mb-2">{l.toUpperCase()}</span>
            {q[l].label}
          </button>
        ))}
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={cur === 0}
          className="font-cinzel text-[0.82rem] tracking-wide border-2 border-[#8b6914] bg-[#3d1507] text-[#c8a96e] px-6 py-2.5 rounded-sm disabled:opacity-30 hover:not-disabled:bg-[#5c2010] transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          ◀ Prior
        </button>
        <button
          onClick={onNext}
          disabled={answers[cur] === null}
          className="font-cinzel text-[0.82rem] tracking-wide border-2 border-[#8b6914] bg-[#7a0e0e] text-[#c8a96e] px-6 py-2.5 rounded-sm disabled:opacity-30 hover:not-disabled:bg-[#9a1212] transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isLast ? "Reveal My Fate ◆" : "Hence ▶"}
        </button>
      </div>
    </>
  );
}

// ─── RESULT VIEW ──────────────────────────────────────────────
function ResultView({ scores, onRestart }: { scores: Scores; onRestart: () => void }) {
  const { top, second, topRace, archetype, lawChaos, goodEvil, isMagic, isSocial, isNova, isOrder } =
    computeResult(scores);

  const flavorLines = [
    `Alignment: ${lawChaos} ${goodEvil} — ${isOrder ? "You believe the world works best with structure." : "You believe rules are made by people with something to protect."}`,
    `Combat Engine: ${isNova ? "Nova burst — one devastating window that ends fights before they start." : "Sustained engine — you outlast everything through sheer attrition."}`,
    `Social Method: ${isSocial ? "The room shifts when you enter it. People listen before you speak." : "You let your actions speak. Loudly. And usually at someone's expense."}`,
    `Power Source: ${isMagic ? "The arcane or divine bends to your will." : "Steel, sinew, and the unbroken certainty that you are enough."}`,
  ];

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block font-cinzel text-[0.72rem] tracking-[3px] uppercase bg-[#3d1507] border-2 border-[#8b6914] text-[#c8a96e] px-4 py-1.5 mb-3">
          Thy True Form Revealed
        </span>
        <h2 className="font-cinzel-dec text-[2.4rem] text-[#3d1507] leading-tight mt-1">{top.name}</h2>
        <p className="font-cinzel text-[1.05rem] text-[#6b3020] mt-2">{top.sub}</p>
        <p className="font-cinzel text-[0.88rem] text-[#8b5030] mt-1">Suggested Race: {topRace.name}</p>
        <span className="inline-block mt-3 font-cinzel text-[0.75rem] tracking-wide bg-[#3d1507] text-[#c8a96e] px-4 py-1.5 rounded-sm">
          {lawChaos} {goodEvil}
        </span>
        <p className="font-lora italic font-semibold text-[#5a3a1a] mt-4 text-[1.05rem]">&ldquo;{archetype}&rdquo;</p>
      </div>

      <Divider />

      {/* Stats */}
      <div className="grid grid-cols-6 gap-2 my-4">
        {Object.entries(top.stats).map(([k, v]) => (
          <StatBox key={k} label={k} value={v} />
        ))}
      </div>

      <Divider />

      {/* Traits */}
      <div className="mb-2">
        {top.traits.map((t, i) => <TraitItem key={i} text={t} />)}
      </div>

      {/* Secondary build */}
      <div className="bg-[#8b691410] border border-[#c8a96e] rounded-sm p-5 my-5">
        <p className="font-cinzel text-[0.68rem] tracking-[2px] uppercase text-[#8b6914] mb-2">
          The Shadow Path — Multiclass Variant
        </p>
        <p className="font-cinzel text-[1.05rem] text-[#3d1507] mb-2">
          {topRace.name} {top.name} / {top.secondaryClass} ({top.secondarySub})
        </p>
        <p className="font-lora italic text-[0.95rem] text-[#5a3a1a]">{top.secondaryNote}</p>
      </div>

      {/* Also considered */}
      <div className="bg-[#8b691408] border border-[#a07830] border-dashed rounded-sm p-4 mb-2">
        <p className="font-cinzel text-[0.65rem] tracking-[2px] uppercase text-[#a07830] mb-1">
          The Oracle Also Considered
        </p>
        <p className="font-cinzel text-[0.92rem] text-[#5a3a1a]">{second.name} · {second.sub}</p>
        <p className="font-lora italic text-[0.9rem] text-[#7a5030] mt-1">
          If the primary path feels too narrow, the {second.name}&apos;s road runs parallel.
        </p>
      </div>

      <Divider />

      {/* Flavor */}
      <div>
        {flavorLines.map((t, i) => <TraitItem key={i} text={t} />)}
      </div>

      <button
        onClick={onRestart}
        className="block mx-auto mt-7 font-cinzel text-[0.88rem] tracking-[2px] border-2 border-[#8b6914] text-[#3d1507] px-10 py-3 rounded-sm hover:bg-[#8b691415] transition-colors cursor-pointer"
      >
        ✦ Consult the Oracle Anew ✦
      </button>
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function DndTest() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<(null | "a" | "b")[]>(Array(QUESTIONS.length).fill(null));
  const [scores, setScores] = useState<Scores>({ ...ZERO });
  const [done, setDone] = useState(false);

  const pick = useCallback((l: "a" | "b") => {
    setAnswers(prev => {
      const prevChoice = prev[cur];
      setScores(prevScores => {
        let s = { ...prevScores };
        if (prevChoice) s = applyWeights(s, QUESTIONS[cur][prevChoice].weights, -1);
        s = applyWeights(s, QUESTIONS[cur][l].weights, 1);
        return s;
      });
      const next = [...prev];
      next[cur] = l;
      return next;
    });
  }, [cur]);

  const goNext = useCallback(() => {
    if (answers[cur] === null) return;
    if (cur === QUESTIONS.length - 1) { setDone(true); return; }
    setCur(c => c + 1);
  }, [cur, answers]);

  const goPrev = useCallback(() => {
    if (cur > 0) setCur(c => c - 1);
  }, [cur]);

  const restart = useCallback(() => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setScores({ ...ZERO });
    setCur(0);
    setDone(false);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 py-10">
      {/* Scroll */}
      <div
        className="relative w-full max-w-[820px] rounded-sm px-16 py-16 text-[#2c1810]"
        style={{
          background: "#f0ddb0",
          boxShadow: "0 0 0 2px #8b6914, 0 0 0 5px #2c1810, 0 12px 60px #000000cc, inset 0 0 80px #8b691410",
        }}
      >
        {/* Scroll caps */}
        <div className="absolute top-0 left-0 right-0 h-7 rounded-sm"
          style={{ background: "linear-gradient(180deg,#6b4f0e 0%,#c8a96e 40%,#6b4f0e 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-7 rounded-sm"
          style={{ background: "linear-gradient(180deg,#6b4f0e 0%,#c8a96e 40%,#6b4f0e 100%)" }} />

        {/* Content */}
        <div className="relative z-10">
          {done
            ? <ResultView scores={scores} onRestart={restart} />
            : <QuizView cur={cur} answers={answers} onPick={pick} onPrev={goPrev} onNext={goNext} />
          }
        </div>
      </div>
    </div>
  );
}
