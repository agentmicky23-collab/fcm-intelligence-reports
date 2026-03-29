"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface FinalHookCarouselProps {
  onGetReport: (tier?: "insight" | "intelligence") => void;
}

export function FinalHookCarousel({ onGetReport }: FinalHookCarouselProps) {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);
  const paused = useRef(false);
  const total = 3;

  const goTo = useCallback(
    (idx: number) => {
      setFade(false);
      setTimeout(() => {
        setActive(idx);
        setFade(true);
      }, 350);
    },
    []
  );

  // Auto-rotate
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) {
        goTo(active === total - 1 ? 0 : active + 1);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [active, goTo]);

  // Swipe support
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goTo(active === total - 1 ? 0 : active + 1);
      else goTo(active === 0 ? total - 1 : active - 1);
    }
    touchStart.current = null;
  };

  const btnClass =
    "inline-block mt-6 px-8 py-3 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 hover:brightness-110";

  return (
    <section
      id="contact"
      className="relative"
      style={{ background: "#0a0e14", padding: "80px 0" }}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="mx-auto px-4"
        style={{ maxWidth: 800 }}
      >
        {/* Slide area */}
        <div
          style={{
            minHeight: 320,
            transition: "opacity 0.35s ease",
            opacity: fade ? 1 : 0,
          }}
        >
          {active === 0 && <Slide1 onCTA={() => onGetReport("insight")} btnClass={btnClass} />}
          {active === 1 && <Slide2 onCTA={() => onGetReport("intelligence")} btnClass={btnClass} />}
          {active === 2 && <Slide3 onCTA={() => onGetReport("insight")} btnClass={btnClass} />}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "none",
                background: active === i ? "#c9a227" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Slide 1: Time Reality ─────────────────────────────── */
function Slide1({ onCTA, btnClass }: { onCTA: () => void; btnClass: string }) {
  return (
    <div className="text-center">
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(40px, 8vw, 64px)",
          fontWeight: 700,
          color: "#c9a227",
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        40+ hours
      </p>
      <div
        style={{
          width: 80,
          height: 2,
          background: "rgba(201,162,39,0.5)",
          margin: "0 auto 24px",
        }}
      />
      <p style={{ color: "#e6edf3", fontSize: "1.15rem", lineHeight: 1.7, marginBottom: 4 }}>
        That&apos;s how long it takes to gather what&apos;s in an Intelligence report.
      </p>
      <p style={{ color: "#8b949e", fontSize: "1.05rem", lineHeight: 1.7 }}>
        Or get it verified, scored, and actionable in 48 hours.
      </p>
      <button
        onClick={onCTA}
        className={btnClass}
        style={{ background: "#c9a227", color: "#0a0e14" }}
      >
        Get Report — £199 →
      </button>
    </div>
  );
}

/* ── Slide 2: Real Outcome ─────────────────────────────── */
function Slide2({ onCTA, btnClass }: { onCTA: () => void; btnClass: string }) {
  return (
    <div className="text-center" style={{ maxWidth: 640, margin: "0 auto" }}>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(20px, 4vw, 26px)",
          fontStyle: "italic",
          color: "#e6edf3",
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        &ldquo;The report found the seller was hiding £22,000 in liabilities. We walked.&rdquo;
      </p>
      <p style={{ color: "#c9a227", fontSize: "0.95rem", fontWeight: 600 }}>
        — Manchester buyer, avoided bad deal
      </p>
      <button
        onClick={onCTA}
        className={btnClass}
        style={{ background: "#c9a227", color: "#0a0e14" }}
      >
        Get Intelligence Report →
      </button>
    </div>
  );
}

/* ── Slide 3: Risk / Reward Scale ──────────────────────── */
function Slide3({ onCTA, btnClass }: { onCTA: () => void; btnClass: string }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      {/* Risk bar */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "#e6edf3", fontSize: "0.9rem", fontWeight: 600, marginBottom: 6 }}>
          Risk without intelligence
        </p>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, height: 14, overflow: "hidden" }}>
          <div style={{ width: "90%", height: "100%", background: "linear-gradient(90deg, #e74c3c, #c0392b)", borderRadius: 6, transition: "width 1s ease" }} />
        </div>
        <p style={{ color: "#e74c3c", fontSize: "0.85rem", marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
          £50k–£200k at stake
        </p>
      </div>

      {/* Cost bar */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "#e6edf3", fontSize: "0.9rem", fontWeight: 600, marginBottom: 6 }}>
          Cost of intelligence
        </p>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, height: 14, overflow: "hidden" }}>
          <div style={{ width: "10%", height: "100%", background: "linear-gradient(90deg, #27ae60, #2ecc71)", borderRadius: 6, transition: "width 1s ease" }} />
        </div>
        <p style={{ color: "#27ae60", fontSize: "0.85rem", marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
          £199–£499
        </p>
      </div>

      <p className="text-center" style={{ color: "#c9a227", fontSize: "1.1rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
        Average buyer savings: £12,000.
      </p>
      <div className="text-center">
        <button
          onClick={onCTA}
          className={btnClass}
          style={{ background: "#c9a227", color: "#0a0e14" }}
        >
          Get Report →
        </button>
      </div>
    </div>
  );
}
