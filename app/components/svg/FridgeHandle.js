"use client";

export default function FridgeHandle({
  onClick,
  isOpen = false,
  showPulse = true,
  className = ""
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Hint text */}
      {showPulse && !isOpen && (
        <span className="text-xs text-slate-400 animate-pulse">
          Open
        </span>
      )}

      <button
        onClick={onClick}
        className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full"
        aria-label="Open fridge door"
        style={{ opacity: isOpen ? 0.5 : 1 }}
      >
        {/* Simple vertical handle bar */}
        <div
          className="w-3 h-28 sm:h-32 rounded-full bg-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
          style={{
            boxShadow: "inset -1px 0 2px rgba(255,255,255,0.5), 1px 0 4px rgba(0,0,0,0.2)"
          }}
        />
      </button>
    </div>
  );
}
