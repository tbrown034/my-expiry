"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function FreezerDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative bg-slate-700">
      {/* Handle bar - large touch target */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex flex-col items-center gap-1.5 hover:bg-slate-600/50 active:bg-slate-600/70 transition-colors min-h-[56px] cursor-pointer"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <div className="w-12 h-1.5 rounded-full bg-slate-400" />
        <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
          {isOpen ? "Close" : "Menu"}
        </span>
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-slate-800 rounded-t-2xl max-h-[80vh] overflow-y-auto"
            >
              {/* Handle */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-4 flex justify-center min-h-[48px]"
              >
                <div className="w-10 h-1.5 rounded-full bg-slate-600" />
              </button>

              {/* Content */}
              <nav className="px-4 pb-8 space-y-2">
                {/* Primary Actions - Large Touch Targets */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Link
                    href="/add"
                    className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 hover:from-amber-500/30 hover:to-orange-500/20 transition-all min-h-[88px] cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-amber-400">Add Items</span>
                  </Link>

                  <Link
                    href="/fridge"
                    className="flex flex-col items-center gap-2 px-4 py-5 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 hover:from-sky-500/30 hover:to-blue-500/20 transition-all min-h-[88px] cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <rect x="5" y="2" width="14" height="20" rx="2" />
                        <line x1="5" y1="9" x2="19" y2="9" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-sky-400">My Fridge</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-700 my-3" />

                {/* Secondary Links */}
                <Link
                  href="/about"
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors min-h-[56px]"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <span className="font-medium">About</span>
                </Link>

                <Link
                  href="/tracking"
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors min-h-[56px]"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <span className="font-medium">Stats</span>
                </Link>

                {/* Divider */}
                <div className="h-px bg-slate-700 my-3" />

                {/* Footer */}
                <div className="flex items-center justify-between px-4 pt-2 text-xs text-slate-500">
                  <span>&copy; {new Date().getFullYear()} Food Xpiry</span>
                  <a
                    href="https://github.com/tbrown034/food-xpiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-400 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
