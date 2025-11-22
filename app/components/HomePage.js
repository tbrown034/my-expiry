"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { gestures, springs } from "../../lib/motionVariants";

export default function HomePage({ onNavigate }) {
  const [doorOpen, setDoorOpen] = useState(false);
  const [hasOpenedDoor, setHasOpenedDoor] = useState(false);

  const handleHandleClick = () => {
    if (doorOpen) return;
    setDoorOpen(true);
    setHasOpenedDoor(true);
    setTimeout(() => {
      setDoorOpen(false);
      onNavigate('fridge');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-stretch justify-center overflow-hidden">
      <div className="relative w-full min-h-screen" style={{ perspective: '1000px' }}>

        {/* Inside of fridge */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-300 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b from-yellow-100/80 to-transparent transition-opacity duration-300 ${doorOpen ? 'opacity-100' : 'opacity-0'}`} />
          <div className="absolute inset-x-4 top-1/4 h-1 bg-slate-400/50 rounded" />
          <div className="absolute inset-x-4 top-1/2 h-1 bg-slate-400/50 rounded" />
          <div className="absolute inset-x-4 top-3/4 h-1 bg-slate-400/50 rounded" />
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${doorOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center px-8">
              <p className="text-slate-500 font-medium text-sm">Close the door!</p>
            </div>
          </div>
        </div>

        {/* Fridge Door */}
        <div
          className={`relative min-h-screen bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 overflow-hidden shadow-2xl transition-transform duration-700 ease-out ${doorOpen ? 'origin-left' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: doorOpen ? 'rotateY(-35deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Metallic texture - brushed steel effect */}
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px)` }}
          />
          {/* Ambient light reflection */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.05) 100%)' }}
          />
          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.15)' }}
          />
          {/* Subtle edge shadow instead of heavy border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 0 3px rgba(0,0,0,0.1)',
            }}
          />

          {/* Embossed brand mark - premium appliance detail */}
          <div
            className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 pointer-events-none select-none"
            style={{
              color: 'transparent',
              textShadow: '1px 1px 1px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.2)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-slate-500/30">My Expiry</span>
          </div>

          {/* Handle - More realistic fridge handle */}
          <button
            onClick={handleHandleClick}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 group cursor-grab active:cursor-grabbing"
          >
            <div className={`relative transition-all duration-200 group-hover:scale-105 ${doorOpen ? 'opacity-50' : ''}`}>
              {/* Handle bar */}
              <div
                className="w-3 sm:w-4 h-28 sm:h-36 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #a1a1aa 0%, #e4e4e7 30%, #f4f4f5 50%, #e4e4e7 70%, #a1a1aa 100%)',
                  boxShadow: '-3px 0 10px rgba(0,0,0,0.3), inset 1px 0 3px rgba(255,255,255,0.8), inset -1px 0 2px rgba(0,0,0,0.1)',
                }}
              />
              {/* Top mount */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-2 sm:h-3 rounded-t-full"
                style={{
                  background: 'linear-gradient(180deg, #71717a 0%, #a1a1aa 100%)',
                  boxShadow: '0 -2px 4px rgba(0,0,0,0.2)',
                }}
              />
              {/* Bottom mount */}
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-2 sm:h-3 rounded-b-full"
                style={{
                  background: 'linear-gradient(0deg, #71717a 0%, #a1a1aa 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </div>
            {!hasOpenedDoor && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-xs text-slate-300 bg-slate-800/90 px-2 py-1 rounded shadow">Try me!</span>
              </div>
            )}
          </button>

          {/* Content area */}
          <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-10 py-6 pr-10 sm:pr-14">

            {/* Sticky Notes - Organic but intentional layout */}
            <div className="relative w-full max-w-4xl mx-auto">

              {/* Mobile: Stacked with offset | Desktop: Side by side with stagger */}
              <div className="flex flex-col md:flex-row md:items-start md:gap-8 lg:gap-12 space-y-6 md:space-y-0">

                {/* PRIMARY CTA: Add Items - Yellow Note */}
                {/* Positioned slightly left, prominent, inviting */}
                <motion.button
                  onClick={() => onNavigate("add")}
                  whileHover={{ y: -8, rotate: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={springs.gentle}
                  className="w-full md:w-1/2 max-w-xs md:max-w-sm group relative md:mt-0 mx-auto md:mx-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-600 rounded-sm"
                >
                  <div
                    className="relative"
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    {/* Shadow */}
                    <div className="absolute inset-0 bg-black/25 rounded-sm translate-y-2 translate-x-1 group-hover:translate-y-3 group-hover:bg-black/30 transition-all duration-300" />

                    {/* Note */}
                    <div className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 rounded-sm p-5 sm:p-6 shadow-lg group-hover:-translate-y-1 group-active:translate-y-0 transition-transform duration-300">
                      {/* Red magnet - top left area */}
                      <div
                        className="absolute -top-3 left-6 sm:left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
                          boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                        }}
                      />

                      <div className="pt-2">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-200/60 flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                            Add Items
                          </h2>
                        </div>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                          Track your groceries with AI-powered expiry dates
                        </p>
                        <div className="mt-4 sm:mt-5 inline-flex items-center text-emerald-700 font-semibold text-sm group-hover:text-emerald-800">
                          <span>Get started</span>
                          <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* SECONDARY CTA: My Fridge - Blue Note */}
                {/* Slightly lower on desktop, offset rotation */}
                <motion.button
                  onClick={() => onNavigate("fridge")}
                  whileHover={{ y: -8, rotate: 1, scale: 1.02 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={springs.gentle}
                  className="w-full md:w-1/2 max-w-xs md:max-w-sm group relative md:mt-8 lg:mt-12 mx-auto md:ml-auto md:mr-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-600 rounded-sm"
                >
                  <div
                    className="relative"
                    style={{ transform: 'rotate(2.5deg)' }}
                  >
                    {/* Shadow */}
                    <div className="absolute inset-0 bg-black/25 rounded-sm translate-y-2 -translate-x-1 group-hover:translate-y-3 group-hover:bg-black/30 transition-all duration-300" />

                    {/* Note */}
                    <div className="relative bg-gradient-to-br from-sky-100 via-sky-50 to-blue-50 rounded-sm p-5 sm:p-6 shadow-lg group-hover:-translate-y-1 group-active:translate-y-0 transition-transform duration-300">
                      {/* Blue magnet - top right area */}
                      <div
                        className="absolute -top-3 right-6 sm:right-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)',
                          boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                        }}
                      />

                      <div className="pt-2">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-sky-200/60 flex items-center justify-center">
                            <svg className="w-5 h-5 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                            My Fridge
                          </h2>
                        </div>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                          See what you have and what&apos;s expiring soon
                        </p>
                        <div className="mt-4 sm:mt-5 inline-flex items-center text-sky-700 font-semibold text-sm group-hover:text-sky-800">
                          <span>View items</span>
                          <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>

              </div>

            </div>

            {/* Feature badges as mini post-it notes */}
            <div className="mt-10 sm:mt-12 flex justify-center" role="list" aria-label="Features">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {/* Scan Receipts - Pink note */}
                <div className="relative" role="listitem" style={{ transform: 'rotate(-1.5deg)' }}>
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #f472b6 0%, #ec4899 50%, #be185d 100%)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                    }}
                  />
                  <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-rose-50 rounded-sm w-24 h-24 sm:w-28 sm:h-28 p-3 shadow-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-slate-700 leading-tight">Scan Receipts</span>
                    </div>
                  </div>
                </div>

                {/* Track Expiry Dates - Green note */}
                <div className="relative" role="listitem" style={{ transform: 'rotate(1deg)' }}>
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #4ade80 0%, #22c55e 50%, #15803d 100%)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                    }}
                  />
                  <div className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 rounded-sm w-24 h-24 sm:w-28 sm:h-28 p-3 shadow-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-slate-700 leading-tight">Track Expiry Dates</span>
                    </div>
                  </div>
                </div>

                {/* Reduce Food Waste - Blue note */}
                <div className="relative" role="listitem" style={{ transform: 'rotate(-0.5deg)' }}>
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                    }}
                  />
                  <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-sky-50 rounded-sm w-24 h-24 sm:w-28 sm:h-28 p-3 shadow-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-slate-700 leading-tight">Reduce Food Waste</span>
                    </div>
                  </div>
                </div>

                {/* Smart Reminders - Purple note */}
                <div className="relative" role="listitem" style={{ transform: 'rotate(1.5deg)' }}>
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #a78bfa 0%, #8b5cf6 50%, #6d28d9 100%)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                    }}
                  />
                  <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-violet-50 rounded-sm w-24 h-24 sm:w-28 sm:h-28 p-3 shadow-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium text-slate-700 leading-tight">Smart Reminders</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
