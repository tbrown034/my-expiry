'use client';

import { useMemo, useState } from 'react';
import { getFoodEmoji, getCategoryBgColor } from '../../../lib/foodEmojis';

export default function FridgeContents({
  groceries,
  onItemClick,
  onMarkAsEaten,
  onDeleteItem,
}) {
  // Group identical items (same name + expiry date) with quantity
  const groupItems = (items) => {
    const grouped = new Map();
    items.forEach(item => {
      const key = `${item.name.toLowerCase()}-${item.expiryDate}`;
      if (grouped.has(key)) {
        const existing = grouped.get(key);
        existing.quantity += 1;
        existing.ids.push(item.id);
      } else {
        grouped.set(key, {
          ...item,
          quantity: 1,
          ids: [item.id],
        });
      }
    });
    return Array.from(grouped.values());
  };

  // Group items by urgency for different shelves
  const { expired, expiringSoon, thisWeek, later, eaten } = useMemo(() => {
    const sorted = [...groceries].sort((a, b) => {
      if (a.eaten && !b.eaten) return 1;
      if (!a.eaten && b.eaten) return -1;
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    });

    return {
      expired: groupItems(sorted.filter(i => !i.eaten && i.daysUntilExpiry < 0)),
      expiringSoon: groupItems(sorted.filter(i => !i.eaten && i.daysUntilExpiry >= 0 && i.daysUntilExpiry <= 3)),
      thisWeek: groupItems(sorted.filter(i => !i.eaten && i.daysUntilExpiry > 3 && i.daysUntilExpiry <= 7)),
      later: groupItems(sorted.filter(i => !i.eaten && i.daysUntilExpiry > 7)),
      eaten: groupItems(sorted.filter(i => i.eaten)),
    };
  }, [groceries]);

  // Get display text for expiry - shows remaining freshness
  const getDaysText = (item) => {
    if (item.eaten) return 'Eaten';
    const days = item.daysUntilExpiry;
    if (days < 0) {
      const daysAgo = Math.abs(days);
      return daysAgo === 1 ? 'Expired 1d' : `Expired ${daysAgo}d`;
    }
    if (days === 0) return 'Use today';
    if (days === 1) return '1d left';
    return `${days}d left`;
  };

  // Get urgency styles
  const getUrgencyStyle = (item) => {
    if (item.eaten) return { badge: 'text-emerald-700 bg-emerald-100/90', glow: '' };
    if (item.daysUntilExpiry < 0) return { badge: 'text-red-700 bg-red-100/90', glow: 'shadow-red-200/50' };
    if (item.daysUntilExpiry <= 2) return { badge: 'text-red-600 bg-red-100/90', glow: 'shadow-red-200/50' };
    if (item.daysUntilExpiry <= 5) return { badge: 'text-amber-700 bg-amber-100/90', glow: 'shadow-amber-200/50' };
    return { badge: 'text-slate-600 bg-white/80', glow: '' };
  };

  // Food item - sits on the shelf
  const FoodItem = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);
    const emoji = getFoodEmoji(item.name, item.category);
    const isUrgent = item.daysUntilExpiry <= 3 && !item.eaten;
    const urgencyStyle = getUrgencyStyle(item);
    const quantity = item.quantity || 1;

    // Use first id from grouped items
    const handleEat = (e) => {
      e.stopPropagation();
      const id = item.ids ? item.ids[0] : item.id;
      onMarkAsEaten?.(id);
    };

    const handleDelete = (e) => {
      e.stopPropagation();
      const id = item.ids ? item.ids[0] : item.id;
      onDeleteItem?.(id);
    };

    return (
      <div
        onClick={() => onItemClick(item)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col items-center cursor-pointer group"
      >
        {/* Hover action buttons */}
        {!item.eaten && (
          <div
            className={`
              absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30
              transition-all duration-500 ease-out
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
            `}
          >
            <button
              onClick={handleEat}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white flex items-center justify-center shadow-lg ring-1 ring-white/30 transition-all duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer"
              title="Mark as eaten"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white flex items-center justify-center shadow-lg ring-1 ring-white/30 transition-all duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* The food emoji - sitting on shelf */}
        <div className={`
          relative transition-all duration-500 ease-out
          ${isHovered && !item.eaten ? '-translate-y-1.5' : ''}
          ${item.eaten ? 'opacity-40 grayscale' : ''}
        `}>
          {/* Emoji with subtle shadow */}
          <span
            className={`text-3xl sm:text-4xl block transition-all duration-500 ease-out ${isUrgent ? 'animate-pulse' : ''}`}
            style={{
              filter: isHovered
                ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                : 'drop-shadow(0 2px 3px rgba(0,0,0,0.08))'
            }}
          >
            {emoji}
          </span>

          {/* Quantity badge */}
          {quantity > 1 && (
            <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-md ring-1 ring-white/20">
              {quantity}
            </div>
          )}

          {/* Reflection on shelf surface */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-gradient-to-b from-black/5 to-transparent rounded-full blur-sm" />
        </div>

        {/* Label below food */}
        <div className={`
          mt-1.5 text-center transition-opacity duration-500 ease-out
          ${isHovered ? 'opacity-100' : 'opacity-80'}
        `}>
          <span className={`
            text-[10px] sm:text-[11px] font-medium leading-tight block
            ${item.eaten ? 'line-through text-slate-400' : 'text-slate-700'}
          `}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: '60px',
          }}>
            {item.name}
          </span>
          <span className={`
            text-[9px] sm:text-[10px] font-bold mt-0.5 px-1.5 py-0.5 rounded-full inline-block
            ${urgencyStyle.badge}
          `}>
            {getDaysText(item)}
          </span>
        </div>
      </div>
    );
  };

  // Delete all items in a category
  const handleDeleteAll = (items) => {
    items.forEach(item => {
      const ids = item.ids || [item.id];
      ids.forEach(id => onDeleteItem?.(id));
    });
  };

  // Glass shelf with realistic 3D appearance
  const GlassShelf = ({ title, subtitle, items, emoji, urgent = false }) => {
    if (items.length === 0) return null;

    // Count total items including quantities
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
      <div className="relative mb-2">
        {/* Shelf header */}
        <div className="flex items-center justify-between px-3 pt-2 pb-1">
          <div className={`
            flex items-center gap-2 px-2.5 py-1.5 rounded-lg shadow-sm
            ${urgent ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-slate-600 to-slate-500'}
          `}>
            <span className="text-sm">{emoji}</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white tracking-wide">{title}</span>
              {subtitle && <span className="text-[9px] text-white/60">{subtitle}</span>}
            </div>
            <span className="text-[10px] text-white/80 font-semibold ml-1">({totalCount})</span>
          </div>

          {/* Delete all button */}
          <button
            onClick={() => handleDeleteAll(items)}
            className="px-2.5 py-1.5 text-[10px] font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          >
            Clear all
          </button>
        </div>

        {/* Food items sitting on shelf */}
        <div className="pt-12 pb-3 px-4">
          <div className="flex flex-wrap gap-x-5 gap-y-14 sm:gap-x-6 sm:gap-y-16 justify-start items-end min-h-[80px]">
            {items.map(item => (
              <FoodItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Glass shelf surface - the actual shelf */}
        <div className="relative mx-2">
          {/* Shelf top surface - glass with subtle blue tint */}
          <div className="h-3 relative">
            {/* Glass gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-100/40 via-white/60 to-cyan-50/30 rounded-t-sm" />
            {/* Shine line */}
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            {/* Front edge highlight */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-slate-300/50 via-slate-200/70 to-slate-300/50" />
          </div>

          {/* Shelf front edge - 3D depth */}
          <div className="h-2 bg-gradient-to-b from-slate-300/80 via-slate-200/60 to-slate-100/40 rounded-b-sm shadow-sm" />

          {/* Chrome bracket hints on sides */}
          <div className="absolute -left-1 top-0 w-2 h-full bg-gradient-to-r from-slate-400/60 to-transparent rounded-l" />
          <div className="absolute -right-1 top-0 w-2 h-full bg-gradient-to-l from-slate-400/60 to-transparent rounded-r" />
        </div>
      </div>
    );
  };

  // Crisper drawer at the bottom
  const CrisperDrawer = ({ items }) => {
    if (items.length === 0) return null;

    // Count total items including quantities
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
      <div className="relative mx-2 mt-4">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg shadow-sm bg-gradient-to-r from-emerald-600 to-emerald-500">
            <span className="text-sm">🥬</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white tracking-wide">Fresh</span>
              <span className="text-[9px] text-white/60">More than a week</span>
            </div>
            <span className="text-[10px] text-white/80 font-semibold ml-1">({totalCount})</span>
          </div>

          {/* Delete all button */}
          <button
            onClick={() => handleDeleteAll(items)}
            className="px-2.5 py-1.5 text-[10px] font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          >
            Clear all
          </button>
        </div>

        {/* Drawer container */}
        <div className="relative">
          {/* Drawer handle */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
            <div className="w-16 h-3 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-300 rounded-t-lg shadow-sm border border-slate-300/50" />
          </div>

          {/* Drawer body - translucent plastic look */}
          <div className="pt-12 pb-4 px-4 bg-gradient-to-b from-emerald-50/50 via-white/40 to-emerald-50/30 rounded-xl border border-slate-200/50 shadow-inner backdrop-blur-sm">
            {/* Inner frost texture */}
            <div className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.6) 0%, transparent 40%)'
              }}
            />

            <div className="relative flex flex-wrap gap-x-5 gap-y-14 sm:gap-x-6 sm:gap-y-16 justify-start items-end min-h-[80px]">
              {items.map(item => (
                <FoodItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Drawer bottom edge */}
          <div className="h-2 bg-gradient-to-b from-slate-200/60 to-slate-300/40 rounded-b-xl shadow-sm" />
        </div>
      </div>
    );
  };

  // Eaten items section - small collapsed area
  const EatenSection = ({ items }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (items.length === 0) return null;

    return (
      <div className="mx-2 mt-6 mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-50/80 hover:bg-emerald-100/80 rounded-lg transition-colors w-full"
        >
          <span className="text-base">✅</span>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Eaten</span>
          <span className="text-xs text-emerald-600/70 font-medium">({items.length})</span>
          <svg
            className={`w-4 h-4 text-emerald-600 ml-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-3 pt-10 px-3 pb-3 flex flex-wrap gap-x-5 gap-y-14 sm:gap-x-6 sm:gap-y-16 justify-start items-end">
            {items.map(item => (
              <FoodItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-full pb-24 relative">
      {/* Fridge interior background - cool white with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100/80 pointer-events-none" />

      {/* Fridge interior light effect - brighter at top */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(255,255,255,0.9) 0%, transparent 70%)'
        }}
      />

      {/* Subtle frost texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30M10 10L50 50M50 10L10 50' stroke='%23e2e8f0' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Shelves */}
      <div className="relative pt-4">
        {/* Past Due - top shelf (bad items at eye level) */}
        <GlassShelf
          title="Past Due"
          subtitle="Already expired"
          items={expired}
          emoji="🚨"
          urgent={true}
        />

        {/* Expiring Soon */}
        <GlassShelf
          title="Use Soon"
          subtitle="Within 3 days"
          items={expiringSoon}
          emoji="⚠️"
          urgent={true}
        />

        {/* This Week */}
        <GlassShelf
          title="This Week"
          subtitle="4-7 days left"
          items={thisWeek}
          emoji="📅"
        />

        {/* Crisper Drawer - bottom for fresh items */}
        <CrisperDrawer items={later} />

        {/* Eaten Section - collapsible */}
        <EatenSection items={eaten} />
      </div>

      {/* Empty state */}
      {groceries.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-6xl mb-4">🧊</div>
            <p className="text-slate-500 font-medium">Your fridge is empty</p>
            <p className="text-slate-400 text-sm mt-1">Add some items to get started</p>
          </div>
        </div>
      )}
    </div>
  );
}
