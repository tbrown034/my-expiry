'use client';

import { useMemo, useRef, useEffect, useCallback } from 'react';
import { getFoodEmoji, getCategoryBgColor } from '../../../lib/foodEmojis';
import gsap from 'gsap';

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
      if (daysAgo === 1) return '1d ago';
      return `${daysAgo}d ago`;
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

  // Food item card component with GSAP animations
  const FoodItem = ({ item }) => {
    const emoji = getFoodEmoji(item.name, item.category);
    const bgColor = getCategoryBgColor(item.category);
    const isUrgent = item.daysUntilExpiry <= 3 && !item.eaten;

    const containerRef = useRef(null);
    const actionsRef = useRef(null);
    const eatBtnRef = useRef(null);
    const deleteBtnRef = useRef(null);

    // Setup initial state for action buttons
    useEffect(() => {
      if (actionsRef.current && !item.eaten) {
        gsap.set(actionsRef.current, { opacity: 0, y: 8, scale: 0.8 });
        gsap.set([eatBtnRef.current, deleteBtnRef.current], { scale: 0.5, opacity: 0 });
      }
    }, [item.eaten]);

    const handleMouseEnter = useCallback(() => {
      if (!actionsRef.current || item.eaten) return;

      // Animate container lift
      gsap.to(containerRef.current, {
        y: -4,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Fade in actions container
      gsap.to(actionsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: 'back.out(1.7)'
      });

      // Stagger in buttons
      gsap.to([eatBtnRef.current, deleteBtnRef.current], {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        stagger: 0.08,
        ease: 'back.out(2)'
      });
    }, [item.eaten]);

    const handleMouseLeave = useCallback(() => {
      if (!actionsRef.current || item.eaten) return;

      // Reset container
      gsap.to(containerRef.current, {
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: 'power2.inOut'
      });

      // Fade out actions
      gsap.to(actionsRef.current, {
        opacity: 0,
        y: 8,
        scale: 0.8,
        duration: 0.2,
        ease: 'power2.in'
      });

      gsap.to([eatBtnRef.current, deleteBtnRef.current], {
        scale: 0.5,
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in'
      });
    }, [item.eaten]);

    const handleEat = useCallback((e) => {
      e.stopPropagation();
      if (!eatBtnRef.current) return;

      // Satisfying click animation
      gsap.timeline()
        .to(eatBtnRef.current, {
          scale: 1.4,
          duration: 0.15,
          ease: 'power2.out'
        })
        .to(eatBtnRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        })
        .to(containerRef.current, {
          scale: 0.9,
          opacity: 0.5,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => onMarkAsEaten?.(item.id)
        });
    }, [item.id, onMarkAsEaten]);

    const handleDelete = useCallback((e) => {
      e.stopPropagation();
      if (!deleteBtnRef.current) return;

      // Shake and fade out animation
      gsap.timeline()
        .to(deleteBtnRef.current, {
          scale: 1.3,
          duration: 0.1,
          ease: 'power2.out'
        })
        .to(containerRef.current, {
          x: -5,
          duration: 0.05,
          ease: 'power2.inOut'
        })
        .to(containerRef.current, {
          x: 5,
          duration: 0.05,
          ease: 'power2.inOut'
        })
        .to(containerRef.current, {
          x: -3,
          duration: 0.05,
          ease: 'power2.inOut'
        })
        .to(containerRef.current, {
          x: 0,
          scale: 0.8,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => onDeleteItem?.(item.id)
        });
    }, [item.id, onDeleteItem]);

    const handleButtonHover = useCallback((ref, entering) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        scale: entering ? 1.15 : 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    }, []);

    return (
      <div
        ref={containerRef}
        onClick={() => onItemClick(item)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative flex flex-col items-center p-2 rounded-xl cursor-pointer
          ${item.eaten ? 'opacity-40' : ''}
          ${isUrgent ? 'bg-red-50/80' : bgColor}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Hover action buttons - graceful floating icons */}
        {!item.eaten && (
          <div
            ref={actionsRef}
            className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
          >
            {/* Eat button */}
            <button
              ref={eatBtnRef}
              onClick={handleEat}
              onMouseEnter={() => handleButtonHover(eatBtnRef, true)}
              onMouseLeave={() => handleButtonHover(eatBtnRef, false)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
              style={{ willChange: 'transform' }}
              title="Mark as eaten"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>

            {/* Delete button */}
            <button
              ref={deleteBtnRef}
              onClick={handleDelete}
              onMouseEnter={() => handleButtonHover(deleteBtnRef, true)}
              onMouseLeave={() => handleButtonHover(deleteBtnRef, false)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30"
              style={{ willChange: 'transform' }}
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
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

        {/* Name */}
        <span className={`
          text-[11px] sm:text-xs font-medium text-center leading-tight max-w-full truncate
          ${item.eaten ? 'line-through text-slate-400' : 'text-slate-700'}
        `}>
          {item.name.length > 10 ? item.name.substring(0, 10) + '…' : item.name}
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
