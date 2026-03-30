"use client";
import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";

interface MobileCarouselProps {
  children: ReactNode[];
  autoScrollMs?: number;
  className?: string;
}

/**
 * MobileCarousel — renders children in a fade carousel on mobile (<640px).
 * On desktop (sm+), hidden via Tailwind sm:hidden — no styled-jsx required.
 * Features: fade transition, touch/swipe, pause on hover/tap, gold dots.
 */
export function MobileCarousel({
  children,
  autoScrollMs = 5000,
  className = "",
}: MobileCarouselProps) {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);
  const paused = useRef(false);
  const total = children.length;

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active) return;
      setFade(false);
      setTimeout(() => {
        setActive(idx);
        setFade(true);
      }, 300);
    },
    [active]
  );

  // Auto-rotate
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) {
        goTo(active === total - 1 ? 0 : active + 1);
      }
    }, autoScrollMs);
    return () => clearInterval(id);
  }, [active, goTo, autoScrollMs, total]);

  // Swipe support
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    paused.current = true; // pause on tap
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goTo(active === total - 1 ? 0 : active + 1);
      else goTo(active === 0 ? total - 1 : active - 1);
    }
    touchStart.current = null;
    // Resume after a brief pause
    setTimeout(() => {
      paused.current = false;
    }, 3000);
  };

  if (total === 0) return null;

  return (
    // sm:hidden — hidden at 640px+ (Tailwind), visible on mobile only
    <div
      className={`sm:hidden ${className}`}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide area */}
      <div
        style={{
          transition: "opacity 0.3s ease",
          opacity: fade ? 1 : 0,
        }}
      >
        {children[active]}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div className="flex justify-center gap-2.5 mt-4">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                border: "none",
                background:
                  active === i ? "#c9a227" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: "background 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
