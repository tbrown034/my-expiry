'use client';

import FridgeContents from '../ui/FridgeContents';

export default function FridgeDoor({
  groceries,
  onItemClick,
  onMarkAsEaten,
  onMarkAsExpired,
  onDeleteNote,
  onEditItem,
  onDeleteItem,
  onAddShoppingTrip,
  onClearAll,
  onBack
}) {
  return (
    <div className="min-h-[calc(100dvh-64px)] bg-slate-900 flex flex-col">
      <div className="flex-1 flex max-w-4xl w-full mx-auto">
        {/* Open Door Edge with Handle - LEFT side (door swung open counter-clockwise) */}
        <button
          onClick={onBack}
          className="w-12 sm:w-14 bg-slate-500 flex flex-col items-center justify-center relative group hover:bg-slate-400 transition-colors shadow-lg"
          aria-label="Close fridge"
        >
          {/* Door surface texture */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-500" />

          {/* Door edge highlight - right side catches light */}
          <div className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-l from-slate-400/50 to-transparent" />

          {/* Handle bar */}
          <div
            className="relative w-3 h-28 sm:h-32 rounded-full bg-slate-300 group-hover:bg-slate-200 transition-colors"
            style={{
              boxShadow: "inset 1px 0 3px rgba(0,0,0,0.3), -1px 0 2px rgba(255,255,255,0.2), 2px 0 8px rgba(0,0,0,0.2)"
            }}
          />

          {/* Close hint */}
          <span className="absolute bottom-6 text-[10px] text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity -rotate-90 origin-center whitespace-nowrap font-medium">
            Close
          </span>
        </button>

        {/* Fridge Interior - white/light gray like inside of a real fridge */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-100 to-slate-200 shadow-2xl relative overflow-hidden">

          {/* Fridge interior side wall effect - right */}
          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-slate-300 to-transparent z-0" />

          {/* Top bar - like fridge top interior */}
          <div className="relative z-10 flex items-center gap-2 px-4 py-3 bg-slate-200/80 backdrop-blur-sm">
            <button
              onClick={onBack}
              className="px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
            <div className="flex-1 text-center">
              <span className="text-sm font-medium text-slate-500">My Fridge</span>
            </div>
            {groceries.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                title="Delete all items"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            )}
            <button
              onClick={onAddShoppingTrip}
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
              </svg>
              Add
            </button>
          </div>

          {/* Main content - always show fridge shelves */}
          <div className="flex-1 overflow-auto relative z-10">
            <FridgeContents
              groceries={groceries}
              onItemClick={onItemClick}
              onMarkAsEaten={onMarkAsEaten}
              onDeleteItem={onDeleteItem}
            />
          </div>

          {/* FAB - always show */}
          <button
            onClick={onAddShoppingTrip}
            className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all flex items-center justify-center z-50"
            title="Add food"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
