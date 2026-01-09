"use client";

import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 relative overflow-hidden">
      {/* Metallic texture */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px)` }}
      />
      {/* Light reflection */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.05) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 py-6 max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white py-2 px-3 -ml-3 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </Link>

        {/* Main sticky note */}
        <div className="mt-6 relative" style={{ transform: 'rotate(-0.5deg)' }}>
          {/* Shadow */}
          <div className="absolute inset-0 bg-black/25 rounded-sm translate-y-2 translate-x-1" />

          {/* Note */}
          <div className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 rounded-sm p-6 sm:p-8 shadow-lg">
            {/* Red magnet */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
              }}
            />

            {/* Header */}
            <div className="text-center mb-6 pt-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">About Food Xpiry</h1>
              <p className="text-slate-500">Track your groceries, reduce waste</p>
            </div>

            {/* Content */}
            <div className="space-y-4 text-slate-700">
              <p className="leading-relaxed">
                <strong>Food Xpiry</strong> helps you track what{"'"}s in your fridge so nothing goes to waste.
                Simply add your groceries and get AI-powered expiry predictions.
              </p>

              <div className="bg-white/50 rounded-lg p-4 border border-amber-200">
                <h3 className="font-semibold text-slate-800 mb-2">Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>AI-powered shelf life predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>Batch add items from receipts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>Visual fridge organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>Track eaten vs wasted food</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/50 rounded-lg p-4 border border-amber-200">
                <h3 className="font-semibold text-slate-800 mb-2">Built With</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-slate-200 rounded">Next.js</span>
                  <span className="px-2 py-1 bg-slate-200 rounded">Tailwind CSS</span>
                  <span className="px-2 py-1 bg-slate-200 rounded">Claude AI</span>
                  <span className="px-2 py-1 bg-slate-200 rounded">Vercel</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer note */}
        <div className="mt-6 relative" style={{ transform: 'rotate(1deg)' }}>
          <div className="absolute inset-0 bg-black/25 rounded-sm translate-y-2 translate-x-1" />
          <div className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-sky-50 rounded-sm p-6 shadow-lg">
            {/* Blue magnet */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
              }}
            />

            <div className="text-center pt-4">
              <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                TB
              </div>
              <h3 className="font-semibold text-slate-800">Built by Trevor Brown</h3>
              <p className="text-slate-500 text-sm mt-1">Full-Stack Developer</p>

              <div className="flex justify-center gap-3 mt-4">
                <a
                  href="https://github.com/tbrown034/food-xpiry"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://trevorthewebdeveloper.com/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>Open source • Made with care</p>
        </div>
      </div>
    </div>
  );
}
