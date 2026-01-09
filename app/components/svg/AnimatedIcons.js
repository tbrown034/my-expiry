"use client";

import { useRef, useEffect, forwardRef } from "react";
import { gsap } from "gsap";

/**
 * DrawSVG-style animated icons
 */

// Utility hook for DrawSVG-style animation
function useDrawSVG(ref, options = {}) {
  const { delay = 0, duration = 0.8, ease = "power2.out", trigger = true } = options;

  useEffect(() => {
    if (!ref.current || !trigger) return;

    const paths = ref.current.querySelectorAll("path, line, circle, rect, polyline");

    paths.forEach((path) => {
      const length = path.getTotalLength?.() || 100;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration,
      ease,
      stagger: 0.1,
      delay,
    });
  }, [ref, delay, duration, ease, trigger]);
}

// Plus icon (for Add Items)
export const PlusIcon = forwardRef(function PlusIcon(
  { size = 24, color = "currentColor", animate = true, className = "" },
  ref
) {
  const svgRef = useRef(null);
  useDrawSVG(svgRef, { delay: 0.3, trigger: animate });

  return (
    <svg
      ref={(el) => {
        svgRef.current = el;
        if (ref) ref.current = el;
      }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
});

// Fridge icon (for My Fridge)
export const FridgeIcon = forwardRef(function FridgeIcon(
  { size = 24, color = "currentColor", animate = true, className = "" },
  ref
) {
  const svgRef = useRef(null);
  useDrawSVG(svgRef, { delay: 0.5, trigger: animate });

  return (
    <svg
      ref={(el) => {
        svgRef.current = el;
        if (ref) ref.current = el;
      }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
      <path d="M4 10h16" />
      <path d="M8 7v0" />
      <path d="M8 14v2" />
    </svg>
  );
});
