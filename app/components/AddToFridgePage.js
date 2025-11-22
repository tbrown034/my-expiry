"use client";

export default function AddToFridgePage({ onSelectMethod, onBack }) {
  return (
    <div className="h-full flex-1 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 relative overflow-hidden">
      {/* Metallic texture */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px)` }}
      />
      {/* Light reflection */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.05) 100%)' }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.12)' }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col px-4 sm:px-6 md:px-10">
        {/* Back button */}
        <div className="pt-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white py-2 px-3 -ml-3 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="w-full max-w-md mx-auto">

            {/* Single sticky note with options */}
            <div className="relative" style={{ transform: 'rotate(-1deg)' }}>
              {/* Shadow */}
              <div className="absolute inset-0 bg-black/25 rounded-sm translate-y-2 translate-x-1" />

              {/* Note */}
              <div className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 rounded-sm p-6 sm:p-8 shadow-lg">
                {/* Red magnet */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                  }}
                />

                {/* Header */}
                <div className="text-center mb-6 pt-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Add Items</h2>
                  <p className="text-slate-500 text-sm mt-1">How would you like to add?</p>
                </div>

                {/* Options list */}
                <div className="space-y-3">
                  {/* Type Items option */}
                  <button
                    onClick={() => onSelectMethod("manual")}
                    className="w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 hover:bg-white/80 border-2 border-transparent hover:border-amber-300 transition-all duration-200 group-active:scale-[0.98]">
                      <div className="w-10 h-10 rounded-lg bg-amber-200/60 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-slate-800">Type Items</h3>
                        <p className="text-slate-500 text-sm">Enter items manually</p>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Scan Receipt option */}
                  <button
                    onClick={() => onSelectMethod("receipt")}
                    className="w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50 hover:bg-white/80 border-2 border-transparent hover:border-emerald-300 transition-all duration-200 group-active:scale-[0.98]">
                      <div className="w-10 h-10 rounded-lg bg-emerald-200/60 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-slate-800">Scan Receipt</h3>
                        <p className="text-slate-500 text-sm">Take a photo of your receipt</p>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Helper tip */}
                <p className="text-slate-400 text-xs text-center mt-6">
                  Today&apos;s date will be used as purchase date
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
