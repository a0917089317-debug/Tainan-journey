"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children?: ReactNode;
  /** How strongly the element reacts to scroll. Positive moves it down as it approaches viewport center. */
  speed?: number;
  /** Clamp the max translation in px so scaled/zoomed backgrounds never reveal empty edges. */
  range?: number;
  className?: string;
};

export function Parallax({
  children,
  speed = 0.15,
  range,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      let offset =
        (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
      if (range) offset = Math.max(-range, Math.min(range, offset));
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed, range]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
