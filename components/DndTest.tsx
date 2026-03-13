"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  QUIZ_SIZE, sampleQuestions, ZERO, computeResult,
  type Scores, type Question,
} from "@/lib/data";
import { OrnamentDivider, CornerFlourish, WingDivider, VerticalBar } from "@/components/Ornaments";

// ─── helpers ────────────────────────────────────────────────
function applyWeights(scores: Scores, weights: Partial<Scores>, sign: 1 | -1): Scores {
  const next = { ...scores };
  for (const [k, v] of Object.entries(weights)) {
    (next as Record<string, number>)[k] += sign * (v as number);
  }
  return next;
}

// ─── sub-components ──────────────────────────────────────────
function Divider() {
  return (
    <div className="my-7">
      <OrnamentDivider color="#a07830" />
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

function ArchedHeadline() {
  return (
    <div className="mx-auto -mb-12 w-full max-w-[980px] overflow-visible">
      <svg
        viewBox="0 0 980 220"
        className="h-[8.2rem] w-full overflow-visible"
        role="img"
        aria-label="The Oracle's Mirror"
      >
        <defs>
          <path id="headline-arc" d="M 70 204 Q 490 4 910 204" />
        </defs>
        <text
          fill="#c8a96e"
          fontSize="82"
          letterSpacing="2"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-unifraktur), 'UnifrakturCook', cursive", fontWeight: 700 }}
        >
          <textPath href="#headline-arc" startOffset="50%">
            The Oracle&apos;s Mirror
          </textPath>
        </text>
      </svg>
    </div>
  );
}

// ─── QUIZ VIEW ────────────────────────────────────────────────
function QuizView({
  questions, flipped, cur, answers, onPrev, onPickAndNext,
}: {
  questions: Question[];
  flipped: boolean[];
  cur: number;
  answers: (null | "a" | "b")[];
  onPrev: () => void;
  onPickAndNext: (l: "a" | "b") => void;
}) {
  const q = questions[cur];
  const total = questions.length;
  const answered = answers.filter(Boolean).length;
  const pct = Math.round((answered / total) * 100);
  const selected = answers[cur];

  // Randomised side assignment — keeps scoring correct, varies visual layout
  const isFlipped   = flipped[cur] ?? false;
  const leftKey  = isFlipped ? "b" : "a";
  const rightKey = isFlipped ? "a" : "b";
  const leftOpt  = q[leftKey];
  const rightOpt = q[rightKey];
  const leftChosen  = selected === leftKey;
  const rightChosen = selected === rightKey;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  { onPickAndNext(leftKey); return; }
      if (e.key === "ArrowRight") { onPickAndNext(rightKey); return; }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPickAndNext, leftKey, rightKey]);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="bg-[#0d0906] px-6 pt-0 pb-4 text-center border-b border-[#8b6914]/40">
        <ArchedHeadline />
        <div className="font-cinzel text-[#8b6914] uppercase -mt-1 mb-2">
          <div className="text-[0.72rem] tracking-[3px] leading-[1.2]">
            A Dungeons &amp; Dragons
          </div>
          <div className="text-[0.96rem] tracking-[3px] leading-[1.3] mt-1">
            Personality Test
          </div>
        </div>
        <WingDivider color="#c8a96e" width={242} opacity={1} />
        <p className="font-fell italic text-[1.4rem] text-[#f0ddb0] mt-3 mb-2">
          Would you rather...
        </p>
        {/* Counter + progress bar together */}
        <div className="max-w-sm mx-auto">
          <p className="font-cinzel text-[0.55rem] tracking-[3px] text-[#8b6914] uppercase mb-1">
            {cur + 1} of {total}
          </p>
          <div className="h-[4px] bg-[#3d1507] rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-500"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg,#7a0e0e,#c8a96e)" }}
            />
          </div>
        </div>
      </div>

      {/* Split — full height, OR circle + vertical bar absolutely centred */}
      <div className="flex-1 flex flex-col sm:flex-row relative">

        {/* ── Dark side — left option ── */}
        <button
          onClick={() => onPickAndNext(leftKey)}
          className={`
            flex-1 relative flex flex-col items-center justify-center px-12 py-14
            cursor-pointer transition-all duration-200 group outline-none
            ${leftChosen ? "bg-[#1e1208]" : "bg-[#0d0906] hover:bg-[#140e06]"}
          `}
          style={leftChosen ? { boxShadow: "inset 0 0 0 2px #c8a96e" } : {}}
        >
          <CornerFlourish position="tl" color="#c8a96e" responsive opacity={0.9} />
          <CornerFlourish position="tr" color="#c8a96e" responsive opacity={0.9} />
          <CornerFlourish position="bl" color="#c8a96e" responsive opacity={0.9} />
          <CornerFlourish position="br" color="#c8a96e" responsive opacity={0.9} />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8b6914] text-2xl opacity-25 group-hover:opacity-60 transition-opacity select-none hidden sm:block">◀</span>
          <p className="font-almendra italic text-[1.6rem] text-[#f0ddb0] text-center leading-relaxed max-w-sm">{leftOpt.label}</p>
          {leftChosen && (
            <span className="mt-8 font-cinzel text-[0.7rem] tracking-[3px] text-[#c8a96e] uppercase select-none">✦ Chosen ✦</span>
          )}
        </button>

        {/* ── Vertical bar + OR circle — absolutely centred ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="hidden sm:flex flex-col items-center justify-center h-full">
            <VerticalBar color="#c8a96e" height="calc((100vh - 180px) * 0.3)" opacity={1} />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[3rem] h-[3rem] rounded-full flex items-center justify-center border border-[#8b6914]"
            style={{ background: "#0d0906", boxShadow: "0 0 0 5px #0d0906, 0 0 18px #8b691455" }}
          >
            <span className="font-unifraktur text-[1.15rem] tracking-[0px] text-[#8b6914] select-none leading-none">OR</span>
          </div>
        </div>

        {/* ── Light side — right option ── */}
        <button
          onClick={() => onPickAndNext(rightKey)}
          className={`
            flex-1 relative flex flex-col items-center justify-center px-12 py-14
            cursor-pointer transition-all duration-200 group outline-none
            ${rightChosen ? "bg-[#e8d49e]" : "bg-[#f0ddb0] hover:bg-[#ebd8a8]"}
          `}
          style={rightChosen ? { boxShadow: "inset 0 0 0 2px #7a0e0e" } : {}}
        >
          <CornerFlourish position="tl" color="#6b4a10" responsive opacity={1} />
          <CornerFlourish position="tr" color="#6b4a10" responsive opacity={1} />
          <CornerFlourish position="bl" color="#6b4a10" responsive opacity={1} />
          <CornerFlourish position="br" color="#6b4a10" responsive opacity={1} />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8b6914] text-2xl opacity-25 group-hover:opacity-60 transition-opacity select-none hidden sm:block">▶</span>
          <p className="font-almendra italic text-[1.6rem] text-[#2c1810] text-center leading-relaxed max-w-sm">{rightOpt.label}</p>
          {rightChosen && (
            <span className="mt-8 font-cinzel text-[0.7rem] tracking-[3px] text-[#7a0e0e] uppercase select-none">✦ Chosen ✦</span>
          )}
        </button>

      </div>

      {/* Footer — back only */}
      <div className="bg-[#0d0906] border-t border-[#8b6914]/40 px-8 py-4 flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={cur === 0}
          className="font-cinzel text-[0.72rem] tracking-widest text-[#8b6914] uppercase disabled:opacity-20 hover:not-disabled:text-[#c8a96e] transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          ◀ Back
        </button>
        <div className="w-16" />
      </div>

    </div>
  );
}

// ─── RESULT VIEW ──────────────────────────────────────────────
function ResultView({ scores, questions, onRestart }: { scores: Scores; questions: Question[]; onRestart: () => void }) {
  const {
    className, subclassName, classDesc, raceName,
    topTraits, archetypeLabel, archetypeDesc,
    lawChaos, goodEvil,
    shadowClassName, shadowSubclassName, shadowClassDesc,
    flavorLines,
  } = computeResult(scores, questions);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 py-10">
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

        {/* Corner flourishes */}
        <CornerFlourish position="tl" color="#8b6914" size={88} />
        <CornerFlourish position="tr" color="#8b6914" size={88} />
        <CornerFlourish position="bl" color="#8b6914" size={88} />
        <CornerFlourish position="br" color="#8b6914" size={88} />

        {/* Side vine bars */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <VerticalBar color="#8b6914" height={320} opacity={0.22} />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: "translateY(-50%) scaleX(-1)" }}>
          <VerticalBar color="#8b6914" height={320} opacity={0.22} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-block font-cinzel text-[0.72rem] tracking-[3px] uppercase bg-[#3d1507] border-2 border-[#8b6914] text-[#c8a96e] px-4 py-1.5 mb-3">
              Thy True Form Revealed
            </span>
            <h2 className="font-grenze font-black text-[3rem] text-[#3d1507] leading-tight mt-1">{className}</h2>
            <p className="font-fell italic text-[1.2rem] text-[#6b3020] mt-2">{subclassName}</p>
            <p className="font-fell text-[1rem] text-[#8b5030] mt-1">Suggested Race: {raceName}</p>
            <span className="inline-block mt-3 font-cinzel text-[0.75rem] tracking-wide bg-[#3d1507] text-[#c8a96e] px-4 py-1.5 rounded-sm">
              {lawChaos} {goodEvil}
            </span>
            <p className="font-lora italic font-semibold text-[#5a3a1a] mt-4 text-[1.05rem]">
              &ldquo;{classDesc}&rdquo;
            </p>
          </div>

          <Divider />

          {/* Top traits */}
          <div className="grid grid-cols-6 gap-2 my-4">
            {topTraits.map(t => (
              <StatBox key={t.key} label={t.label} value={t.pct} />
            ))}
          </div>

          <Divider />

          {/* Flavor */}
          <div className="mb-2">
            {flavorLines.map((t, i) => <TraitItem key={i} text={t} />)}
          </div>

          {/* Shadow path */}
          <div className="bg-[#8b691410] border border-[#c8a96e] rounded-sm p-5 my-5">
            <p className="font-cinzel text-[0.68rem] tracking-[2px] uppercase text-[#8b6914] mb-2">
              The Shadow Path — Alternate Build
            </p>
            <p className="font-cinzel text-[1.05rem] text-[#3d1507] mb-2">
              {raceName} {shadowClassName}{shadowSubclassName ? ` / ${shadowSubclassName}` : ""}
            </p>
            <p className="font-lora italic text-[0.95rem] text-[#5a3a1a]">{shadowClassDesc}</p>
          </div>

          {/* Archetype */}
          <div className="bg-[#8b691408] border border-[#a07830] border-dashed rounded-sm p-4 mb-2">
            <p className="font-cinzel text-[0.65rem] tracking-[2px] uppercase text-[#a07830] mb-1">
              Archetype Resonance
            </p>
            <p className="font-cinzel text-[0.92rem] text-[#5a3a1a]">{archetypeLabel}</p>
            <p className="font-lora italic text-[0.9rem] text-[#7a5030] mt-1">{archetypeDesc}</p>
          </div>

          <Divider />

          <button
            onClick={onRestart}
            className="block mx-auto mt-7 font-cinzel text-[0.88rem] tracking-[2px] border-2 border-[#8b6914] text-[#3d1507] px-10 py-3 rounded-sm hover:bg-[#8b691415] transition-colors cursor-pointer"
          >
            ✦ Consult the Oracle Anew ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function DndTest() {
  // Start empty on server; sample on first client mount to avoid SSR/hydration mismatch
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flipped,   setFlipped]   = useState<boolean[]>([]);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<(null | "a" | "b")[]>([]);
  const [scores, setScores] = useState<Scores>({ ...ZERO });
  const [done, setDone] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const q = sampleQuestions(QUIZ_SIZE);
    setQuestions(q);
    setAnswers(Array(q.length).fill(null));
    setFlipped(Array.from({ length: q.length }, () => Math.random() < 0.5));
  }, []);

  const pick = useCallback((l: "a" | "b") => {
    setAnswers(prev => {
      const prevChoice = prev[cur];
      setScores(prevScores => {
        let s = { ...prevScores };
        if (prevChoice) s = applyWeights(s, questions[cur][prevChoice].weights, -1);
        s = applyWeights(s, questions[cur][l].weights, 1);
        return s;
      });
      const next = [...prev];
      next[cur] = l;
      return next;
    });
  }, [cur, questions]);

  const goNext = useCallback(() => {
    if (answers[cur] === null) return;
    if (cur === questions.length - 1) { setDone(true); return; }
    setCur(c => c + 1);
  }, [cur, answers, questions]);

  const pickAndNext = useCallback((l: "a" | "b") => {
    setAnswers(prev => {
      const prevChoice = prev[cur];
      setScores(prevScores => {
        let s = { ...prevScores };
        if (prevChoice) s = applyWeights(s, questions[cur][prevChoice].weights, -1);
        s = applyWeights(s, questions[cur][l].weights, 1);
        return s;
      });
      const next = [...prev];
      next[cur] = l;
      return next;
    });
    if (cur === questions.length - 1) { setDone(true); }
    else { setCur(c => c + 1); }
  }, [cur, questions]);

  const goPrev = useCallback(() => {
    if (cur === 0) return;
    const curAnswer  = answers[cur];
    const prevAnswer = answers[cur - 1];
    // Undo scores for both current and previous question
    setScores(prev => {
      let s = { ...prev };
      if (curAnswer)  s = applyWeights(s, questions[cur][curAnswer].weights, -1);
      if (prevAnswer) s = applyWeights(s, questions[cur - 1][prevAnswer].weights, -1);
      return s;
    });
    // Clear both answers so progress bar drops
    setAnswers(prev => {
      const next = [...prev];
      next[cur]     = null;
      next[cur - 1] = null;
      return next;
    });
    setCur(c => c - 1);
  }, [cur, answers, questions]);

  const restart = useCallback(() => {
    const next = sampleQuestions(QUIZ_SIZE);
    setQuestions(next);
    setAnswers(Array(next.length).fill(null));
    setFlipped(Array.from({ length: next.length }, () => Math.random() < 0.5));
    setScores({ ...ZERO });
    setCur(0);
    setDone(false);
  }, []);

  // Not yet mounted on client — render nothing to avoid SSR mismatch
  if (questions.length === 0) {
    return <div className="min-h-screen bg-[#0d0906]" />;
  }

  if (done) {
    return <ResultView scores={scores} questions={questions} onRestart={restart} />;
  }

  return (
    <QuizView
      questions={questions}
      flipped={flipped}
      cur={cur}
      answers={answers}
      onPrev={goPrev}
      onPickAndNext={pickAndNext}
    />
  );
}
