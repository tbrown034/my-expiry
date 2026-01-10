'use client';

import { useMemo, useState } from 'react';
import { getFoodEmoji, getCategoryBgColor } from '../../../lib/foodEmojis';

export default function FridgeContents({
  groceries,
  onItemClick,
  onMarkAsEaten,
  onDeleteItem,
}) {
  // Group items by urgency for different shelves
  const { expired, expiringSoon, thisWeek, later, eaten } = useMemo(() => {
    const sorted = [...groceries].sort((a, b) => {
      if (a.eaten && !b.eaten) return 1;
      if (!a.eaten && b.eaten) return -1;
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    });

    return {
      expired: sorted.filter(i => !i.eaten && i.daysUntilExpiry < 0),
      expiringSoon: sorted.filter(i => !i.eaten && i.daysUntilExpiry >= 0 && i.daysUntilExpiry <= 3),
      thisWeek: sorted.filter(i => !i.eaten && i.daysUntilExpiry > 3 && i.daysUntilExpiry <= 7),
      later: sorted.filter(i => !i.eaten && i.daysUntilExpiry > 7),
      eaten: sorted.filter(i => i.eaten),
    };
  }, [groceries]);

  // Get display text for expiry
  const getDaysText = (item) => {
    if (item.eaten) return '✓';
    const days = item.daysUntilExpiry;
    if (days < 0) {
      const daysAgo = Math.abs(days);
      return daysAgo === 1 ? '1d ago' : `${daysAgo}d ago`;
    }
    if (days === 0) return 'Today';
    if (days === 1) return '1d';
    return `${days}d`;
  };

  // Get urgency color
  const getUrgencyColor = (item) => {
    if (item.eaten) return 'text-emerald-600 bg-emerald-100';
    if (item.daysUntilExpiry < 0) return 'text-red-700 bg-red-100';
    if (item.daysUntilExpiry <= 2) return 'text-red-600 bg-red-100';
    if (item.daysUntilExpiry <= 5) return 'text-amber-600 bg-amber-100';
    return 'text-slate-500 bg-slate-100';
  };

  // Food item card component with CSS transitions
  const FoodItem = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);
    const emoji = getFoodEmoji(item.name, item.category);
    const bgColor = getCategoryBgColor(item.category);
    const isUrgent = item.daysUntilExpiry <= 3 && !item.eaten;

    const handleEat = (e) => {
      e.stopPropagation();
      onMarkAsEaten?.(item.id);
    };

    const handleDelete = (e) => {
      e.stopPropagation();
      onDeleteItem?.(item.id);
    };

    return (
      <div
        onClick={() => onItemClick(item)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex flex-col items-center p-2 rounded-xl cursor-pointer
          transition-transform duration-200 ease-out
          ${isHovered && !item.eaten ? '-translate-y-1 scale-105' : ''}
          ${item.eaten ? 'opacity-40' : ''}
          ${isUrgent ? 'bg-red-50/80' : bgColor}
        `}
      >
        {/* Hover action buttons */}
        {!item.eaten && (
          <div
            className={`
              absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20
              transition-all duration-200 ease-out
              ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90 pointer-events-none'}
            `}
          >
            {/* Eat button - 44px touch target */}
            <button
              onClick={handleEat}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-all duration-150 hover:scale-110 active:scale-95"
              title="Mark as eaten"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            {/* Delete button - 44px touch target */}
            <button
              onClick={handleDelete}
              className="w-11 h-11 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-all duration-150 hover:scale-110 active:scale-95"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Emoji container */}
        <div className={`
          w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-1
          ${isUrgent ? 'bg-white shadow-sm ring-2 ring-red-200' : 'bg-white/80 shadow-sm'}
        `}>
          <span className="text-2xl sm:text-3xl">{emoji}</span>
        </div>

        {/* Name - improved truncation */}
        <span className={`
          text-[11px] sm:text-xs font-medium text-center leading-tight w-full px-1
          ${item.eaten ? 'line-through text-slate-400' : 'text-slate-700'}
        `}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          wordBreak: 'break-word',
        }}>
          {item.name}
        </span>

        {/* Expiry badge */}
        <span className={`
          text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded-full
          ${getUrgencyColor(item)}
        `}>
          {getDaysText(item)}
        </span>
      </div>
    );
  };

  // Shelf component
  const Shelf = ({ title, items, emoji, shelfColor = 'bg-white/40' }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-2">
        {/* Shelf label */}
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-base">{emoji}</span>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{title}</span>
          <span className="text-xs text-slate-400 font-medium">({items.length})</span>
        </div>

        {/* Shelf surface with items */}
        <div className={`${shelfColor} rounded-xl mx-3 p-3 backdrop-blur-sm`}>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {items.map(item => (
              <FoodItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Shelf edge */}
        <div className="h-1.5 mx-3 bg-gradient-to-b from-slate-200/80 to-transparent rounded-b-lg" />
      </div>
    );
  };

  // Crisper drawer for items with longer shelf life
  const CrisperDrawer = ({ items }) => {
    if (items.length === 0) return null;

    return (
      <div className="mx-3 mt-3">
        {/* Drawer handle */}
        <div className="flex items-center justify-center py-1">
          <div className="w-20 h-1.5 bg-slate-300 rounded-full shadow-inner" />
        </div>

        {/* Drawer container */}
        <div className="bg-slate-200/60 rounded-xl p-3 border border-slate-300/50 shadow-inner">
          <div className="flex items-center gap-2 px-1 pb-2">
            <span className="text-base">🥬</span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Fresh for a while</span>
          </div>
          <div className="bg-white/50 rounded-lg p-2 backdrop-blur-sm">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {items.map(item => (
                <FoodItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full pb-20">
      {/* Shelves */}
      <div className="pt-2">
        {/* Past Due - expired items */}
        <Shelf
          title="Past Due"
          items={expired}
          emoji="🚨"
          shelfColor="bg-red-200/70"
        />

        <Shelf
          title="Use Soon"
          items={expiringSoon}
          emoji="⚠️"
          shelfColor="bg-red-100/60"
        />

        <Shelf
          title="This Week"
          items={thisWeek}
          emoji="📅"
          shelfColor="bg-amber-100/40"
        />

        <CrisperDrawer items={later} />

        {eaten.length > 0 && (
          <div className="mt-4">
            <Shelf
              title="Eaten"
              items={eaten}
              emoji="✅"
              shelfColor="bg-emerald-100/40"
            />
          </div>
        )}
      </div>
    </div>
  );
}
