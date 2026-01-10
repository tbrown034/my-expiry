"use client";

import { Magnet } from "../svg";

export default function AddToFridgePage({ onSelectMethod, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 relative overflow-hidden">
      {/* Ambient light reflection at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

      {/* Subtle brushed metal texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)`
      }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col px-4 sm:px-6">
        {/* Back button */}
        <div className="pt-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white py-2.5 px-3 -ml-3 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium text-sm">Back</span>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="w-full max-w-md mx-auto">

            {/* Single sticky note with options - Premium glass style */}
            <div className="relative group" style={{ transform: 'rotate(-1deg)' }}>
              {/* Red magnet - matches HomePage */}
              <Magnet
                color="red"
                size={28}
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg"
              />

              {/* Soft shadow with blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/30 rounded-lg translate-y-2 blur-md" />

              {/* Note with glass effect */}
              <div className="relative rounded-lg overflow-hidden">
                {/* Base gradient - yellow/amber */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50/95 to-orange-50/90" />

                {/* Glass shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />

                {/* Inner glow */}
                <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-white/40 via-amber-50/20 to-transparent" />

                {/* Content */}
                <div className="relative p-5 sm:p-6 backdrop-blur-[2px]">
                  {/* Top edge highlight */}
                  <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

                  {/* Header */}
                  <div className="text-center mb-5 pt-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Add Items</h2>
                    <p className="text-slate-500 text-sm mt-1">How would you like to add?</p>
                  </div>

                  {/* Options list */}
                  <div className="space-y-3">
                    {/* Type Items option */}
                    <button
                      onClick={() => onSelectMethod("manual")}
                      className="w-full group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 rounded-xl"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/50 hover:bg-white/70 border border-amber-200/40 hover:border-amber-300/60 transition-all duration-200 active:scale-[0.98] shadow-sm">
                        {/* Icon with glow */}
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-amber-400 rounded-xl blur-md opacity-30" />
                          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-slate-800">Type Items</h3>
                          <p className="text-slate-500 text-sm">Enter items manually</p>
                        </div>
                        {/* Arrow pill */}
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 flex items-center justify-center group-hover/btn:bg-amber-200/80 transition-colors shadow-inner">
                          <svg className="w-4 h-4 text-amber-600 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Scan Receipt option */}
                    <button
                      onClick={() => onSelectMethod("receipt")}
                      className="w-full group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded-xl"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/50 hover:bg-white/70 border border-emerald-200/40 hover:border-emerald-300/60 transition-all duration-200 active:scale-[0.98] shadow-sm">
                        {/* Icon with glow */}
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-emerald-400 rounded-xl blur-md opacity-30" />
                          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-slate-800">Scan Receipt</h3>
                          <p className="text-slate-500 text-sm">Take a photo of your receipt</p>
                        </div>
                        {/* Arrow pill */}
                        <div className="w-8 h-8 rounded-full bg-emerald-100/80 flex items-center justify-center group-hover/btn:bg-emerald-200/80 transition-colors shadow-inner">
                          <svg className="w-4 h-4 text-emerald-600 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Test Batch option - Dev testing */}
                    {process.env.NODE_ENV === 'development' && (
                      <button
                        onClick={() => onSelectMethod("testBatch")}
                        className="w-full group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 rounded-xl"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/50 hover:bg-white/70 border border-purple-200/40 hover:border-purple-300/60 transition-all duration-200 active:scale-[0.98] shadow-sm">
                          {/* Icon with glow */}
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-purple-400 rounded-xl blur-md opacity-30" />
                            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400 via-violet-500 to-purple-500 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                              <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-semibold text-slate-800">Test Batch</h3>
                            <p className="text-slate-500 text-sm">Random items for dev testing</p>
                          </div>
                          {/* Arrow pill */}
                          <div className="w-8 h-8 rounded-full bg-purple-100/80 flex items-center justify-center group-hover/btn:bg-purple-200/80 transition-colors shadow-inner">
                            <svg className="w-4 h-4 text-purple-600 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Helper tip */}
                  <p className="text-slate-400 text-xs text-center mt-5">
                    Today&apos;s date will be used as purchase date
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
