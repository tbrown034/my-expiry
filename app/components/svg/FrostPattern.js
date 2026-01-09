"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/**
 * Animated frost pattern for fridge surfaces
 * Creates a subtle, professional ice crystal effect
 */
export default function FrostPattern({
  className = "",
  opacity = 0.08,
  animate = true,
}) {
  const patternRef = useRef(null);
  const crystalsRef = useRef([]);

  useEffect(() => {
    if (!animate || !patternRef.current) return;

    // Copy ref for cleanup
    const crystals = crystalsRef.current.filter(Boolean);

    // Subtle shimmer effect on crystals
    crystals.forEach((crystal, i) => {
      gsap.to(crystal, {
        opacity: gsap.utils.random(0.3, 0.7),
        scale: gsap.utils.random(0.95, 1.05),
        duration: gsap.utils.random(2, 4),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.3,
      });
    });

    return () => {
      crystals.forEach((crystal) => gsap.killTweensOf(crystal));
    };
  }, [animate]);

  return (
    <svg
      ref={patternRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Frost crystal gradient */}
        <radialGradient id="frostGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Ice crystal pattern */}
        <pattern id="icePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* Small crystals */}
          <path
            d="M10 10 L10 20 M5 15 L15 15 M7 12 L13 18 M13 12 L7 18"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <path
            d="M60 30 L60 45 M52 37 L68 37 M55 32 L65 42 M65 32 L55 42"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M80 80 L80 95 M72 87 L88 87 M75 82 L85 92 M85 82 L75 92"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <path
            d="M30 70 L30 82 M24 76 L36 76 M27 72 L33 80 M33 72 L27 80"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.35"
          />
        </pattern>
      </defs>

      {/* Base frost layer */}
      <rect width="100%" height="100%" fill="url(#icePattern)" />

      {/* Individual animated crystals */}
      <g className="frost-crystals">
        {/* Large crystal cluster - top left */}
        <g
          ref={(el) => (crystalsRef.current[0] = el)}
          transform="translate(50, 80)"
        >
          <path
            d="M0 -20 L0 20 M-15 0 L15 0 M-10 -10 L10 10 M10 -10 L-10 10"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="3" fill="url(#frostGlow)" />
        </g>

        {/* Medium crystal - top right */}
        <g
          ref={(el) => (crystalsRef.current[1] = el)}
          transform="translate(320, 120)"
        >
          <path
            d="M0 -15 L0 15 M-12 0 L12 0 M-8 -8 L8 8 M8 -8 L-8 8"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="2" fill="url(#frostGlow)" />
        </g>

        {/* Small crystal - center */}
        <g
          ref={(el) => (crystalsRef.current[2] = el)}
          transform="translate(200, 300)"
        >
          <path
            d="M0 -10 L0 10 M-8 0 L8 0 M-5 -5 L5 5 M5 -5 L-5 5"
            stroke="white"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </g>

        {/* Crystal cluster - bottom left */}
        <g
          ref={(el) => (crystalsRef.current[3] = el)}
          transform="translate(80, 450)"
        >
          <path
            d="M0 -18 L0 18 M-14 0 L14 0 M-9 -9 L9 9 M9 -9 L-9 9"
            stroke="white"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <circle cx="0" cy="0" r="2.5" fill="url(#frostGlow)" />
        </g>

        {/* Small crystal - right side */}
        <g
          ref={(el) => (crystalsRef.current[4] = el)}
          transform="translate(350, 400)"
        >
          <path
            d="M0 -12 L0 12 M-10 0 L10 0 M-6 -6 L6 6 M6 -6 L-6 6"
            stroke="white"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>

        {/* Tiny crystal accents */}
        <g
          ref={(el) => (crystalsRef.current[5] = el)}
          transform="translate(150, 180)"
        >
          <path
            d="M0 -6 L0 6 M-5 0 L5 0"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </g>

        <g
          ref={(el) => (crystalsRef.current[6] = el)}
          transform="translate(280, 520)"
        >
          <path
            d="M0 -8 L0 8 M-6 0 L6 0 M-4 -4 L4 4 M4 -4 L-4 4"
            stroke="white"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
