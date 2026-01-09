"use client";

import { forwardRef, useId } from "react";

/**
 * SVG Magnet - Perfect circles that scale beautifully
 * Colors: red, blue, green, pink, yellow, purple
 */
const colorSchemes = {
  red: {
    light: "#f87171",
    main: "#dc2626",
    dark: "#991b1b",
  },
  blue: {
    light: "#60a5fa",
    main: "#2563eb",
    dark: "#1e40af",
  },
  green: {
    light: "#4ade80",
    main: "#22c55e",
    dark: "#15803d",
  },
  pink: {
    light: "#f472b6",
    main: "#ec4899",
    dark: "#be185d",
  },
  yellow: {
    light: "#fbbf24",
    main: "#f59e0b",
    dark: "#d97706",
  },
  purple: {
    light: "#a78bfa",
    main: "#8b5cf6",
    dark: "#6d28d9",
  },
};

const Magnet = forwardRef(function Magnet(
  { color = "red", size = 24, className = "", style = {} },
  ref
) {
  const colors = colorSchemes[color] || colorSchemes.red;
  const uniqueId = useId();
  const id = `magnet-${color}-${uniqueId.replace(/:/g, '')}`;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Shadow */}
      <ellipse
        cx="12"
        cy="14"
        rx="9"
        ry="3"
        fill="black"
        opacity="0.2"
      />

      {/* Main sphere */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={`url(#${id}-gradient)`}
      />

      {/* Top highlight */}
      <ellipse
        cx="9"
        cy="8"
        rx="4"
        ry="3"
        fill="white"
        opacity="0.4"
      />

      {/* Small specular highlight */}
      <circle
        cx="8"
        cy="7"
        r="1.5"
        fill="white"
        opacity="0.7"
      />

      <defs>
        <radialGradient
          id={`${id}-gradient`}
          cx="0.3"
          cy="0.3"
          r="0.7"
          fx="0.3"
          fy="0.3"
        >
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="50%" stopColor={colors.main} />
          <stop offset="100%" stopColor={colors.dark} />
        </radialGradient>
      </defs>
    </svg>
  );
});

export default Magnet;
