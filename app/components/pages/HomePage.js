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
import { Magnet, PlusIcon, FridgeIcon } from "../svg";
import { useGroceries, useToast } from "../../context";
import { getFoodEmoji } from "../../../lib/foodEmojis";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
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

  // Clear result and search again
  const handleClearResult = () => {
    setLookupResult(null);
    setSearchQuery("");
  };

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
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6">
          <div className="w-full max-w-md mx-auto">

            <div className="flex flex-col gap-5 sm:gap-6">

              {/* Add Items - Yellow Note */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springs.gentle}
                className="group relative"
              >
                <Link
                  href="/add"
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
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
                </Link>
              </motion.div>

              {/* My Fridge - Blue Note */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springs.gentle}
                className="group relative"
              >
                <Link
                  href="/fridge"
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
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
                </Link>
              </motion.div>

              {/* Quick Lookup - Green Note */}
              <motion.div
                initial={false}
                animate={lookupResult ? { y: -4, scale: 1.02 } : { y: 0, scale: 1 }}
                transition={springs.gentle}
                className="group relative"
              >
                <div className="relative" style={{ transform: 'rotate(-0.5deg)' }}>
                  {/* Green magnet */}
                  <Magnet
                    ref={el => magnetsRef.current[2] = el}
                    color="green"
                    size={22}
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-sm translate-y-1 group-hover:translate-y-1.5 transition-all duration-200" />
                  <div
                    className="relative bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50 rounded-sm p-4 shadow-lg overflow-hidden"
                    style={{
                      backgroundImage: `
                        linear-gradient(to bottom, transparent 0px, transparent 28px, rgba(6, 95, 70, 0.06) 28px, rgba(6, 95, 70, 0.06) 29px),
                        linear-gradient(to bottom right, #d1fae5 0%, #ecfdf5 50%, #ccfbf1 100%)
                      `,
                      backgroundSize: '100% 30px, 100% 100%',
                    }}
                  >
                    <div className="pt-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-200/60 flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Quick Lookup</h2>
                      </div>

                      {/* Search Input */}
                      <form onSubmit={handleLookup} className="relative mb-3">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="How long does chicken last?"
                          disabled={isSearching}
                          className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white/80 border border-emerald-200 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-slate-700 placeholder:text-slate-400 text-sm transition-all"
                        />
                        <button
                          type="submit"
                          disabled={isSearching || !searchQuery.trim()}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSearching ? (
                            <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 bg-white rounded-lg p-3 shadow-sm border border-emerald-100">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getFoodEmoji(lookupResult.name, lookupResult.category)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-semibold text-slate-800">{lookupResult.name}</span>
                                    <span className="text-xs text-slate-400">{lookupResult.category}</span>
                                  </div>
                                  {lookupResult.storageRecommendations && (
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                      {lookupResult.storageRecommendations}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-xl font-bold text-emerald-600">{lookupResult.shelfLifeDays}</div>
                                  <div className="text-xs text-slate-400">days</div>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={handleAddToFridge}
                                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md transition-colors"
                                >
                                  Add to Fridge
                                </button>
                                <button
                                  onClick={handleClearResult}
                                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-md transition-colors"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!lookupResult && (
                        <p className="text-slate-500 text-xs">
                          Check shelf life without adding to your fridge
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Fridge Handle - Right side */}
        <Link
          href="/fridge"
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
        </Link>

        {/* Freezer Drawer - Bottom menu */}
        <div className="absolute bottom-0 left-0 right-0">
          <FreezerDrawer />
        </div>
      </div>
    </div>
  );
}
