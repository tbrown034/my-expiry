'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { variants, staggerConfigs, springs } from '../../lib/motionVariants';
import StickyNote from './StickyNote';
import { formatDate } from '../../lib/utils';

export default function FridgeDoor({
  groceries,
  onItemClick,
  onMarkAsEaten,
  onMarkAsExpired,
  onDeleteNote,
  onEditItem,
  onDeleteItem,
  onAddShoppingTrip,
  onBack
}) {
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'expiring', 'alphabetical'
  // Group groceries by batchId, split into chunks of max 5 items
  const groupedByBatch = useMemo(() => {
    const ITEMS_PER_NOTE = 5;
    const batches = {};

    groceries.forEach(item => {
      const batchKey = item.batchMetadata?.batchId || item.purchaseDate || 'unknown';
      if (!batches[batchKey]) {
        batches[batchKey] = {
          items: [],
          metadata: item.batchMetadata || {
            source: 'manual',
            addedAt: item.createdAt || new Date().toISOString()
          },
          purchaseDate: item.purchaseDate
        };
      }
      batches[batchKey].items.push(item);
    });

    // Convert to array and sort based on sortBy
    const sortedBatches = Object.entries(batches).sort(([, a], [, b]) => {
      if (sortBy === 'recent') {
        // Most recent first
        return new Date(b.metadata.addedAt) - new Date(a.metadata.addedAt);
      } else if (sortBy === 'expiring') {
        // Soonest to expire first
        const aEarliestExpiry = Math.min(...a.items.filter(i => !i.eaten).map(i => new Date(i.expiryDate)));
        const bEarliestExpiry = Math.min(...b.items.filter(i => !i.eaten).map(i => new Date(i.expiryDate)));
        return aEarliestExpiry - bEarliestExpiry;
      } else if (sortBy === 'alphabetical') {
        // Alphabetical by batch description
        const aDesc = a.metadata.source === 'receipt' && a.metadata.storeName ? a.metadata.storeName : 'Manual';
        const bDesc = b.metadata.source === 'receipt' && b.metadata.storeName ? b.metadata.storeName : 'Manual';
        return aDesc.localeCompare(bDesc);
      }
      return 0;
    });

    // Split large batches into multiple notes
    const notes = [];
    let colorIndex = 0;

    sortedBatches.forEach(([batchId, batch]) => {
      // Sort items within batch
      const sortedItems = batch.items.sort((a, b) => {
        if (a.eaten && !b.eaten) return 1;
        if (!a.eaten && b.eaten) return -1;
        if (a.status === 'expired' && b.status !== 'expired') return -1;
        if (a.status !== 'expired' && b.status === 'expired') return 1;
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      });

      // Split into chunks of ITEMS_PER_NOTE
      for (let i = 0; i < sortedItems.length; i += ITEMS_PER_NOTE) {
        const chunk = sortedItems.slice(i, i + ITEMS_PER_NOTE);
        notes.push({
          batchId,
          noteId: `${batchId}-${i}`,
          items: chunk,
          metadata: batch.metadata,
          purchaseDate: batch.purchaseDate,
          colorIndex: colorIndex++,
          isPartial: sortedItems.length > ITEMS_PER_NOTE,
          partNumber: Math.floor(i / ITEMS_PER_NOTE) + 1,
          totalParts: Math.ceil(sortedItems.length / ITEMS_PER_NOTE)
        });
      }
    });

    return notes;
  }, [groceries, sortBy]);

  const stats = useMemo(() => {
    const total = groceries.length;
    const eaten = groceries.filter(g => g.eaten).length;
    const expired = groceries.filter(g => !g.eaten && g.status === 'expired').length;
    const active = total - eaten - expired;
    const expiringSoon = groceries.filter(g => !g.eaten && g.status === 'expiring_soon').length;

    return { total, eaten, expired, active, expiringSoon };
  }, [groceries]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Refrigerator Door Background with 3D effects */}
      <div className="relative min-h-screen" style={{ perspective: '1000px' }}>
        <div
          className="min-h-screen bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Metallic texture - brushed steel effect */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px)` }}
          />
          {/* Ambient light reflection */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.05) 100%)' }}
          />
          {/* Subtle vignette for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.15)' }}
          />
          {/* Subtle edge shadow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15), inset 0 0 3px rgba(0,0,0,0.1)' }}
          />

      {/* Navigation buttons */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm text-slate-200 rounded-lg border border-slate-600/50 shadow-lg transition-all flex items-center gap-2 text-sm font-medium hover:shadow-xl interactive"
            aria-label="Go back"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <button
            onClick={onAddShoppingTrip}
            className="px-4 py-2 bg-emerald-500/90 hover:bg-emerald-600/90 backdrop-blur-sm text-white rounded-lg shadow-lg transition-all flex items-center gap-2 text-sm font-medium hover:shadow-emerald-500/30 hover:shadow-xl interactive"
            aria-label="Add more food"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add More Food
          </button>
        </div>
      </div>

      {/* Main fridge door area */}
      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {groceries.length === 0 ? (
          // Empty state - sticky note style for consistency
          <div className="text-center py-12 sm:py-20 animate-fade-in-up">
            <div
              className="inline-block bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 rounded-sm shadow-2xl p-8 sm:p-12 max-w-md mx-auto relative"
              style={{ transform: 'rotate(-1deg)' }}
            >
              {/* Red magnet - top center */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                }}
              />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">Your fridge is empty</h2>
              <p className="text-slate-700 text-sm sm:text-base mb-6 leading-relaxed">
                Start tracking your groceries to reduce waste and save money
              </p>
              <button
                onClick={onAddShoppingTrip}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 interactive flex items-center justify-center gap-2"
                aria-label="Add items to your fridge"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Items
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sticky notes grid - cascading entrance with stagger */}
            <motion.div
              variants={variants.fade}
              initial="initial"
              animate="animate"
              transition={staggerConfigs.stickyNotesCascade}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 auto-rows-auto"
            >
              {groupedByBatch.map((note) => (
                <motion.div
                  key={note.noteId}
                  variants={variants.stickyNoteEnter}
                  transition={springs.magnetSnap}
                  whileHover={{ y: -8, rotate: note.colorIndex % 2 === 0 ? -1 : 1, scale: 1.02 }}
                  className="sticky-note-wrapper"
                >
                  <StickyNote
                    purchaseDate={note.purchaseDate}
                    items={note.items}
                    metadata={note.metadata}
                    isPartial={note.isPartial}
                    partNumber={note.partNumber}
                    totalParts={note.totalParts}
                    onItemClick={onItemClick}
                    onMarkAsEaten={onMarkAsEaten}
                    onMarkAsExpired={onMarkAsExpired}
                    onDeleteNote={onDeleteNote}
                    onEditItem={onEditItem}
                    onDeleteItem={onDeleteItem}
                    colorIndex={note.colorIndex}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Floating action button - enhanced for dark background */}
            <button
              onClick={onAddShoppingTrip}
              className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-emerald-400/60 ring-4 ring-emerald-500/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 flex items-center justify-center z-50 group interactive"
              aria-label="Add shopping trip"
              title="Add shopping trip"
            >
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </>
        )}

        {/* Feature badges as mini post-it notes - matching HomePage */}
        {groceries.length > 0 && (
          <div className="mt-12 sm:mt-16 pb-8 flex justify-center" role="list" aria-label="Features">
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
        )}
      </div>

        </div>
      </div>
    </div>
  );
}
