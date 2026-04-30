import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/")({
  component: SorryPage,
  head: () => ({
    meta: [
      { title: "I'm Sorry 🥺🌸" },
      { name: "description", content: "A cute and playful apology — please talk to me again 🥹" },
    ],
  }),
});

// Each step in the apology flow. The final step has no "No" button.
const steps = [
  { question: "Matladavaaaaaa nathooooooo? 🥺", hint: "noo clickk cheyakuuuuuu 🥺" },
  { question: "Athikam ahhhh, matladuuuuuuuuu😭", hint: "pleasesuuuuuuuuuuuu? 🌸" },
  { question: "antheee leeeeeeee, matho eda matladuthav🥺(musukoni matladuuuu)", hint: "I'm begging now(demanding also)😭" },
  { question: "Matladalsindheeeeeeeee chuuuuuuuu😤", hint: "vere option ledhuuuuu😤✨", noEscape: true },
];

function SorryPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [yesScale, setYesScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = steps[step];

  // Reset No-button position when the step changes
  useEffect(() => {
    setNoPos(null);
  }, [step]);

  const fireConfetti = () => {
    const end = Date.now() + 1500;
    const colors = ["#ff6fa6", "#c084fc", "#ffb4d8", "#fda4af", "#fbcfe8"];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors, scalar: 1.2 });
  };

  const handleYes = () => {
    setDone(true);
    setTimeout(fireConfetti, 150);
  };

  const handleNo = () => {
    if (step < steps.length - 1) setStep(step + 1);
    setYesScale((s) => Math.min(s + 0.15, 1.8));
  };

  // Move "No" away from cursor for playful effect
  const dodge = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const maxX = rect.width - 120;
    const maxY = rect.height - 60;
    const x = Math.random() * maxX - maxX / 2;
    const y = Math.random() * maxY - maxY / 2;
    setNoPos({ x: x * 0.5, y: y * 0.4 });
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: "var(--gradient-sorry)" }}
    >
      {/* Floating background hearts */}
      <FloatingHearts />

      <div
        ref={containerRef}
        className="glass-card relative z-10 w-full max-w-md rounded-3xl px-8 py-10 text-center shadow-[var(--shadow-soft)]"
      >
        {!done ? (
          <div key={step} className="animate-pop-in">
            {/* Cute SVG illustration */}
            <div className="mx-auto mb-4 animate-float">
              <BunnyWithHeart />
            </div>

            <h1 className="mb-2 text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              {current.question}
            </h1>
            <p className="mb-8 text-sm text-muted-foreground">{current.hint}</p>

            <div className="relative flex items-center justify-center gap-4">
              <button
                onClick={handleYes}
                onMouseEnter={() => setYesScale((s) => Math.max(s, 1.2))}
                style={{ transform: `scale(${yesScale})` }}
                className="rounded-full bg-gradient-to-r from-[oklch(0.7_0.2_350)] to-[oklch(0.65_0.22_320)] px-8 py-3 text-lg font-semibold text-white shadow-[var(--shadow-glow)] transition-transform duration-300 hover:brightness-110"
              >
                Yes 🌟
              </button>

              {!current.noEscape && (
                <button
                  onClick={handleNo}
                  onMouseEnter={dodge}
                  style={{
                    transform: noPos ? `translate(${noPos.x}px, ${noPos.y}px)` : undefined,
                    transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  className="rounded-full border border-border bg-white/70 px-6 py-3 text-base font-medium text-foreground shadow-md hover:bg-white"
                >
                  No 🙈
                </button>
              )}
            </div>

            {current.noEscape && (
              <p className="mt-6 animate-wiggle text-xs text-[oklch(0.55_0.2_350)]">
                (no other option, sorryyy 😤🌸)
              </p>
            )}
          </div>
        ) : (
          <div className="animate-pop-in">
            <div className="mx-auto mb-4 text-7xl">🥹🎉</div>
            <h1 className="mb-3 text-3xl font-extrabold text-[oklch(0.55_0.22_350)]">
              YAY! You're talking to me again
            </h1>
            <p className="text-base text-muted-foreground">
              Best friend unlocked again 🌸✨
            </p>
            <div className="mt-6 flex justify-center gap-2 text-3xl">
              <span className="animate-float" style={{ animationDelay: "0s" }}>🌸</span>
              <span className="animate-float" style={{ animationDelay: "0.3s" }}>✨</span>
              <span className="animate-float" style={{ animationDelay: "0.6s" }}>🦋</span>
              <span className="animate-float" style={{ animationDelay: "0.9s" }}>🌼</span>
            </div>
            <button
              onClick={fireConfetti}
              className="mt-8 rounded-full bg-white/70 px-6 py-2 text-sm font-medium text-foreground shadow-md hover:bg-white"
            >
              More confetti! 🎉
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function FloatingHearts() {
  const hearts = ["🌸", "✨", "🌼", "🦋", "🌷", "🎀"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute animate-float text-3xl opacity-60"
          style={{
            top: `${(i * 17) % 90}%`,
            left: `${(i * 29) % 95}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        >
          {h}
        </span>
      ))}
    </div>
  );
}

function BunnyWithHeart() {
  return (
    <svg width="110" height="110" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ears */}
      <ellipse cx="42" cy="28" rx="9" ry="22" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
      <ellipse cx="78" cy="28" rx="9" ry="22" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
      <ellipse cx="42" cy="32" rx="4" ry="14" fill="#fbcfe8" />
      <ellipse cx="78" cy="32" rx="4" ry="14" fill="#fbcfe8" />
      {/* Head */}
      <circle cx="60" cy="65" r="32" fill="#fef3f7" stroke="#f9a8d4" strokeWidth="2" />
      {/* Cheeks */}
      <circle cx="42" cy="72" r="5" fill="#fbcfe8" opacity="0.8" />
      <circle cx="78" cy="72" r="5" fill="#fbcfe8" opacity="0.8" />
      {/* Eyes (closed cute) */}
      <path d="M48 62 Q52 58 56 62" stroke="#7c2d4a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M64 62 Q68 58 72 62" stroke="#7c2d4a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Nose + mouth */}
      <path d="M60 70 l-2 2 h4 z" fill="#ec4899" />
      <path d="M60 74 Q57 78 54 76 M60 74 Q63 78 66 76" stroke="#7c2d4a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Flower (friendship) */}
      <g transform="translate(60 102)">
        <circle r="5" fill="#fde68a" />
        <circle cx="0" cy="-7" r="4" fill="#f9a8d4" />
        <circle cx="0" cy="7" r="4" fill="#f9a8d4" />
        <circle cx="-7" cy="0" r="4" fill="#f9a8d4" />
        <circle cx="7" cy="0" r="4" fill="#f9a8d4" />
        <circle cx="-5" cy="-5" r="4" fill="#fbcfe8" />
        <circle cx="5" cy="-5" r="4" fill="#fbcfe8" />
        <circle cx="-5" cy="5" r="4" fill="#fbcfe8" />
        <circle cx="5" cy="5" r="4" fill="#fbcfe8" />
        <circle r="3" fill="#fcd34d" />
      </g>
    </svg>
  );
}
