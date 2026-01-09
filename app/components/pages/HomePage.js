"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { springs } from "../../../lib/motionVariants";
import {
  animateMagnetsEntrance,
  createMagnetFloat,
} from "../../../lib/gsapAnimations";
import FreezerDrawer from "../layout/FreezerDrawer";
import { Magnet, PlusIcon, FridgeIcon } from "../svg";

export default function HomePage({ onNavigate }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs for magnet animations
  const magnetsRef = useRef([]);
  const floatAnimsRef = useRef([]);

  // Initialize magnet animations on mount
  useEffect(() => {
    setIsLoaded(true);

    const magnets = magnetsRef.current.filter(Boolean);
    const floatAnims = floatAnimsRef.current;

    if (magnets.length > 0) {
      animateMagnetsEntrance(magnets, { delay: 0.3, stagger: 0.15 });
      magnets.forEach((magnet) => {
        const anim = createMagnetFloat(magnet);
        floatAnims.push(anim);
      });
    }

    return () => {
      floatAnims.forEach(anim => anim?.kill());
    };
  }, []);

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-slate-900 flex flex-col">
      {/* Fridge Door */}
      <div className="flex-1 flex bg-slate-600 max-w-4xl w-full mx-auto shadow-2xl relative">

        {/* Door Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col gap-5 sm:gap-6">

              {/* Add Items - Yellow Note */}
              <motion.button
                onClick={() => onNavigate("add")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springs.gentle}
                className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
              >
                <div className="relative" style={{ transform: 'rotate(-1deg)' }}>
                  {/* Red magnet - on the fridge, holding the note */}
                  <Magnet
                    ref={el => magnetsRef.current[0] = el}
                    color="red"
                    size={22}
                    className="absolute -top-2.5 left-6 z-20"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-sm translate-y-1 translate-x-0.5 group-hover:translate-y-1.5 transition-all duration-200" />
                  <div
                    className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 rounded-sm p-4 shadow-lg overflow-hidden"
                    style={{
                      backgroundImage: `
                        linear-gradient(to bottom, transparent 0px, transparent 28px, rgba(180, 83, 9, 0.08) 28px, rgba(180, 83, 9, 0.08) 29px),
                        linear-gradient(to bottom right, #fef9c3 0%, #fefce8 50%, #fef3c7 100%)
                      `,
                      backgroundSize: '100% 30px, 100% 100%',
                    }}
                  >
                    <div className="pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-amber-200/60 flex items-center justify-center">
                          <PlusIcon size={18} color="#b45309" animate={isLoaded} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Add Items</h2>
                      </div>
                      <p className="text-slate-600 text-sm">
                        Track groceries with AI-powered expiry dates
                      </p>
                      <div className="mt-3 inline-flex items-center text-emerald-700 font-medium text-sm">
                        <span>Get started</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* My Fridge - Blue Note */}
              <motion.button
                onClick={() => onNavigate("fridge")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springs.gentle}
                className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
              >
                <div className="relative" style={{ transform: 'rotate(1deg)' }}>
                  {/* Blue magnet - on the fridge, holding the note */}
                  <Magnet
                    ref={el => magnetsRef.current[1] = el}
                    color="blue"
                    size={22}
                    className="absolute -top-2.5 right-6 z-20"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-sm translate-y-1 -translate-x-0.5 group-hover:translate-y-1.5 transition-all duration-200" />
                  <div
                    className="relative bg-gradient-to-br from-sky-100 via-sky-50 to-blue-50 rounded-sm p-4 shadow-lg overflow-hidden"
                    style={{
                      backgroundImage: `
                        linear-gradient(to bottom, transparent 0px, transparent 28px, rgba(3, 105, 161, 0.06) 28px, rgba(3, 105, 161, 0.06) 29px),
                        linear-gradient(to bottom right, #e0f2fe 0%, #f0f9ff 50%, #dbeafe 100%)
                      `,
                      backgroundSize: '100% 30px, 100% 100%',
                    }}
                  >
                    <div className="pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-sky-200/60 flex items-center justify-center">
                          <FridgeIcon size={18} color="#0369a1" animate={isLoaded} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">My Fridge</h2>
                      </div>
                      <p className="text-slate-600 text-sm">
                        See what&apos;s in stock and expiring soon
                      </p>
                      <div className="mt-3 inline-flex items-center text-sky-700 font-medium text-sm">
                        <span>View items</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>

            </div>
          </div>
        </div>

        {/* Fridge Handle - Right side */}
        <button
          onClick={() => onNavigate("fridge")}
          className="absolute right-3 top-1/2 -translate-y-1/2 group flex items-center gap-2"
          aria-label="Open fridge"
        >
          {/* Hint text */}
          <span className="text-xs text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity">
            Open
          </span>
          {/* Handle bar */}
          <div className="w-2.5 h-24 sm:h-28 rounded-full bg-slate-400 hover:bg-slate-300 transition-colors shadow-inner"
            style={{
              boxShadow: "inset -1px 0 3px rgba(0,0,0,0.3), 1px 0 2px rgba(255,255,255,0.1)"
            }}
          />
        </button>

        {/* Freezer Drawer - Bottom menu */}
        <div className="absolute bottom-0 left-0 right-0">
          <FreezerDrawer />
        </div>
      </div>
    </div>
  );
}
