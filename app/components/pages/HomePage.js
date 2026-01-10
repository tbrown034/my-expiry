"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { springs } from "../../../lib/motionVariants";
import {
  animateMagnetsEntrance,
  createMagnetFloat,
} from "../../../lib/gsapAnimations";
import FreezerDrawer from "../layout/FreezerDrawer";
import { Magnet } from "../svg";
import { useGroceries, useToast } from "../../context";
import { getFoodEmoji } from "../../../lib/foodEmojis";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(true); // Start as true to show content immediately
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const router = useRouter();
  const { addGrocery } = useGroceries();
  const toast = useToast();

  // Refs for magnet animations
  const magnetsRef = useRef([]);
  const floatAnimsRef = useRef([]);

  // Quick lookup function
  const handleLookup = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLookupResult(null);

    try {
      const response = await fetch("/api/parse-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [searchQuery.trim()] }),
      });

      if (!response.ok) throw new Error("Lookup failed");

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setLookupResult(data.items[0]);
      }
    } catch (error) {
      toast.error("Could not look up item. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Add result to fridge
  const handleAddToFridge = () => {
    if (!lookupResult) return;
    addGrocery(lookupResult);
    toast.success(`${lookupResult.name} added to fridge!`);
    setLookupResult(null);
    setSearchQuery("");
    router.push("/fridge");
  };

  // Clear result
  const handleClearResult = () => {
    setLookupResult(null);
    setSearchQuery("");
  };

  // Initialize magnet animations on mount
  useEffect(() => {
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
      <div className="flex-1 flex bg-gradient-to-b from-slate-500 via-slate-550 to-slate-600 max-w-4xl w-full mx-auto shadow-2xl relative">

        {/* Ambient light reflection at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

        {/* Subtle brushed metal texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)`
        }} />

        {/* Door Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 pt-6 pb-20 relative">
          <div className="w-full max-w-md mx-auto">

            <div className="flex flex-col gap-5 sm:gap-6">

              {/* Add Items - Yellow Sticky Note */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -3 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30, rotate: -1.5 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ y: -8, scale: 1.02, rotate: 0 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                <Link href="/add" className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-600 rounded">
                  {/* Red magnet with glow */}
                  <Magnet
                    ref={el => magnetsRef.current[0] = el}
                    color="red"
                    size={28}
                    className="absolute -top-3.5 left-8 z-20 drop-shadow-lg"
                  />

                  {/* Soft shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/30 rounded-lg translate-y-2 translate-x-1 blur-md group-hover:translate-y-3 group-hover:blur-lg transition-all duration-500" />

                  {/* Note with glass effect */}
                  <div className="relative rounded-lg overflow-hidden">
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50/95 to-orange-50/90" />

                    {/* Glass shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />

                    {/* Inner glow */}
                    <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-white/40 via-amber-50/20 to-transparent" />

                    {/* Content */}
                    <div className="relative p-5 backdrop-blur-[2px]">
                      {/* Top edge highlight */}
                      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

                      <div className="flex items-center gap-4">
                        {/* Icon with depth */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-orange-500 rounded-xl blur-md opacity-40" />
                          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Add Items</h2>
                          <p className="text-slate-500 text-sm mt-0.5">
                            Track with smart expiry dates
                          </p>
                        </div>

                        {/* Arrow pill */}
                        <div className="w-8 h-8 rounded-full bg-amber-100/80 flex items-center justify-center group-hover:bg-amber-200/80 transition-colors shadow-inner">
                          <svg className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* My Fridge - Blue Sticky Note */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 3 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30, rotate: 1.5 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ y: -8, scale: 1.02, rotate: 0 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                <Link href="/fridge" className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-600 rounded">
                  {/* Blue magnet with glow */}
                  <Magnet
                    ref={el => magnetsRef.current[1] = el}
                    color="blue"
                    size={28}
                    className="absolute -top-3.5 right-8 z-20 drop-shadow-lg"
                  />

                  {/* Soft shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/30 rounded-lg translate-y-2 -translate-x-1 blur-md group-hover:translate-y-3 group-hover:blur-lg transition-all duration-500" />

                  {/* Note with glass effect */}
                  <div className="relative rounded-lg overflow-hidden">
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50/95 to-indigo-50/90" />

                    {/* Glass shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />

                    {/* Inner glow */}
                    <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-white/40 via-sky-50/20 to-transparent" />

                    {/* Content */}
                    <div className="relative p-5 backdrop-blur-[2px]">
                      {/* Top edge highlight */}
                      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

                      <div className="flex items-center gap-4">
                        {/* Icon with depth */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-sky-500 rounded-xl blur-md opacity-40" />
                          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-sky-500 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <rect x="4" y="2" width="16" height="20" rx="2" />
                              <line x1="4" y1="10" x2="20" y2="10" />
                              <circle cx="8" cy="6" r="1" fill="currentColor" />
                              <circle cx="8" cy="14" r="1" fill="currentColor" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h2 className="text-lg font-bold text-slate-800 tracking-tight">My Fridge</h2>
                          <p className="text-slate-500 text-sm mt-0.5">
                            View items & expiring soon
                          </p>
                        </div>

                        {/* Arrow pill */}
                        <div className="w-8 h-8 rounded-full bg-sky-100/80 flex items-center justify-center group-hover:bg-sky-200/80 transition-colors shadow-inner">
                          <svg className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Quick Lookup - Green Sticky Note */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="group relative"
              >
                <motion.div
                  animate={lookupResult ? { y: -4, scale: 1.01 } : { y: 0, scale: 1 }}
                  transition={springs.gentle}
                >
                  {/* Green magnet with glow */}
                  <Magnet
                    ref={el => magnetsRef.current[2] = el}
                    color="green"
                    size={28}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg"
                  />

                  {/* Soft shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/30 rounded-lg translate-y-2 blur-md transition-all duration-500" />

                  {/* Note with glass effect */}
                  <div className="relative rounded-lg overflow-hidden">
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50/95 to-teal-50/90" />

                    {/* Glass shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />

                    {/* Inner glow */}
                    <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-white/40 via-emerald-50/20 to-transparent" />

                    {/* Content */}
                    <div className="relative p-5 backdrop-blur-[2px]">
                      {/* Top edge highlight */}
                      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

                      <div className="flex items-center gap-4 mb-4">
                        {/* Icon with depth */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-md opacity-40" />
                          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Quick Lookup</h2>
                          <p className="text-slate-500 text-sm mt-0.5">
                            Check shelf life instantly
                          </p>
                        </div>
                      </div>

                      {/* Search Input */}
                      <form onSubmit={handleLookup} className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="How long does chicken last?"
                          disabled={isSearching}
                          className="w-full px-4 py-3 pr-12 rounded-xl bg-white/70 backdrop-blur-sm border border-emerald-200/60 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 text-slate-700 placeholder:text-slate-400 text-sm transition-all shadow-sm"
                        />
                        <button
                          type="submit"
                          disabled={isSearching || !searchQuery.trim()}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md ring-1 ring-white/20"
                        >
                          {isSearching ? (
                            <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          )}
                        </button>
                      </form>

                      {/* Result Display */}
                      <AnimatePresence>
                        {lookupResult && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm ring-1 ring-emerald-200/50">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                                  <span className="text-2xl">{getFoodEmoji(lookupResult.name, lookupResult.category)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-slate-800">{lookupResult.name}</div>
                                  {lookupResult.storageRecommendations && (
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                      {lookupResult.storageRecommendations}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right pl-2">
                                  <div className="text-2xl font-bold bg-gradient-to-br from-emerald-500 to-teal-500 bg-clip-text text-transparent">{lookupResult.shelfLifeDays}</div>
                                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">days</div>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={handleAddToFridge}
                                  className="flex-1 py-2.5 bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm font-semibold rounded-lg transition-all shadow-md ring-1 ring-white/20 active:scale-[0.98]"
                                >
                                  Add to Fridge
                                </button>
                                <button
                                  onClick={handleClearResult}
                                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-lg transition-all active:scale-[0.98]"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!lookupResult && (
                        <p className="text-slate-400 text-xs mt-3">
                          Check shelf life without adding to your fridge
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Fridge Handle - Right side */}
        <Link
          href="/fridge"
          className="absolute right-3 top-1/2 -translate-y-1/2 group flex items-center gap-2 cursor-pointer z-20"
          aria-label="Open fridge"
        >
          <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors font-medium tracking-wide">
            Open
          </span>
          <div className="relative">
            {/* Handle glow */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-all" />
            <div
              className="relative w-3 h-28 sm:h-32 rounded-full bg-gradient-to-b from-slate-300 via-slate-350 to-slate-400 group-hover:from-slate-200 group-hover:to-slate-300 transition-all shadow-xl"
              style={{
                boxShadow: "inset -2px 0 6px rgba(0,0,0,0.3), inset 2px 0 6px rgba(255,255,255,0.1), 0 0 20px rgba(0,0,0,0.3)"
              }}
            />
          </div>
        </Link>

        {/* Freezer Drawer - Bottom Menu */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <FreezerDrawer />
        </div>
      </div>
    </div>
  );
}
