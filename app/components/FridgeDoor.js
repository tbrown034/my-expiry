'use client';

import { useMemo } from 'react';
import StickyNote from './StickyNote';
import { formatDate } from '../../lib/utils';

export default function FridgeDoor({
  groceries,
  onItemClick,
  onMarkAsEaten,
  onMarkAsExpired,
  onDeleteNote,
  onAddShoppingTrip
}) {
  // Group groceries by purchase date
  const groupedByDate = useMemo(() => {
    const groups = {};

    groceries.forEach(item => {
      const dateKey = item.purchaseDate || new Date().toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    // Sort groups by date (most recent first)
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([date, items], index) => ({
        date,
        items: items.sort((a, b) => {
          // Sort within each group: expired first, then by expiry date
          if (a.eaten && !b.eaten) return 1;
          if (!a.eaten && b.eaten) return -1;
          if (a.status === 'expired' && b.status !== 'expired') return -1;
          if (a.status !== 'expired' && b.status === 'expired') return 1;
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        }),
        colorIndex: index
      }));
  }, [groceries]);

  const stats = useMemo(() => {
    const total = groceries.length;
    const eaten = groceries.filter(g => g.eaten).length;
    const expired = groceries.filter(g => !g.eaten && g.status === 'expired').length;
    const active = total - eaten - expired;
    const expiringSoon = groceries.filter(g => !g.eaten && g.status === 'expiring_soon').length;

    return { total, eaten, expired, active, expiringSoon };
  }, [groceries]);

  return (
    <div className="min-h-screen fridge-door-background">
      {/* Header with fridge title */}
      <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border-b-4 border-gray-300 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
                🧊 My Fridge Door
              </h1>
              <p className="text-sm text-gray-600 mt-1">Your grocery shopping trips at a glance</p>
            </div>

            {/* Stats */}
            {groceries.length > 0 && (
              <div className="flex gap-3 text-sm">
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                  <span className="text-gray-600">Active: </span>
                  <span className="font-bold text-emerald-600">{stats.active}</span>
                </div>
                {stats.expiringSoon > 0 && (
                  <div className="bg-amber-50 px-3 py-2 rounded-lg shadow-sm border border-amber-200">
                    <span className="text-amber-700">Expiring soon: </span>
                    <span className="font-bold text-amber-600">{stats.expiringSoon}</span>
                  </div>
                )}
                {stats.expired > 0 && (
                  <div className="bg-red-50 px-3 py-2 rounded-lg shadow-sm border border-red-200">
                    <span className="text-red-700">Expired: </span>
                    <span className="font-bold text-red-600">{stats.expired}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main fridge door area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {groceries.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border-4 border-dashed border-gray-300">
              <div className="text-6xl mb-4">🧊</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Your fridge is empty!</h2>
              <p className="text-gray-600 mb-6">Start adding groceries to track their freshness</p>
              <button
                onClick={onAddShoppingTrip}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                + Add Your First Shopping Trip
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Sticky notes grid - masonry style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto">
              {groupedByDate.map(({ date, items, colorIndex }) => (
                <div key={date} className="sticky-note-wrapper">
                  <StickyNote
                    purchaseDate={date}
                    items={items}
                    onItemClick={onItemClick}
                    onMarkAsEaten={onMarkAsEaten}
                    onMarkAsExpired={onMarkAsExpired}
                    onDeleteNote={onDeleteNote}
                    colorIndex={colorIndex}
                  />
                </div>
              ))}
            </div>

            {/* Floating action button for adding more */}
            <button
              onClick={onAddShoppingTrip}
              className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center text-3xl z-50 group"
              title="Add shopping trip"
            >
              <span className="group-hover:rotate-90 transition-transform duration-300">+</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
