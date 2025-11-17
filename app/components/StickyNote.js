'use client';

import { useState } from 'react';
import { formatDate } from '../../lib/utils';

const STICKY_COLORS = [
  'bg-yellow-200 border-yellow-300',
  'bg-pink-200 border-pink-300',
  'bg-blue-200 border-blue-300',
  'bg-green-200 border-green-300',
  'bg-purple-200 border-purple-300',
];

const ROTATIONS = [
  '-rotate-1',
  'rotate-1',
  '-rotate-2',
  'rotate-2',
  'rotate-0',
];

export default function StickyNote({
  purchaseDate,
  items,
  onItemClick,
  onMarkAsEaten,
  onMarkAsExpired,
  onDeleteNote,
  colorIndex = 0
}) {
  const [isExpanded, setIsExpanded] = useState(items.length <= 5);

  const stickyColor = STICKY_COLORS[colorIndex % STICKY_COLORS.length];
  const rotation = ROTATIONS[colorIndex % ROTATIONS.length];

  const displayItems = isExpanded ? items : items.slice(0, 4);
  const hasMore = items.length > 4;

  // Count statuses
  const eatenCount = items.filter(item => item.eaten).length;
  const expiredCount = items.filter(item => !item.eaten && item.status === 'expired').length;
  const activeCount = items.filter(item => !item.eaten && item.status !== 'expired').length;

  const handleItemAction = (e, item, action) => {
    e.stopPropagation();
    if (action === 'eaten') {
      onMarkAsEaten(item.id);
    } else if (action === 'expired') {
      onMarkAsExpired(item.id);
    }
  };

  return (
    <div
      className={`sticky-note ${stickyColor} ${rotation} relative p-4 rounded-sm border-2 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Pin/Thumbtack visual at top */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>

      {/* Header with purchase date */}
      <div className="mb-3 pb-2 border-b border-gray-400/30">
        <h3 className="text-sm font-bold text-gray-700">
          📝 Bought {formatDate(purchaseDate)}
        </h3>
        {(eatenCount > 0 || expiredCount > 0) && (
          <div className="text-xs text-gray-600 mt-1">
            {activeCount > 0 && <span>{activeCount} active</span>}
            {eatenCount > 0 && <span className="ml-2">✓ {eatenCount} eaten</span>}
            {expiredCount > 0 && <span className="ml-2 text-red-600">✗ {expiredCount} expired</span>}
          </div>
        )}
      </div>

      {/* Items list */}
      <ul className="space-y-2 mb-2">
        {displayItems.map((item) => (
          <li
            key={item.id}
            className={`text-sm flex items-start justify-between group/item ${
              item.eaten ? 'opacity-60' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick(item);
            }}
          >
            <div className="flex-1 min-w-0">
              {/* Item name with strikethrough if eaten or expired */}
              <span className={`${
                item.eaten ? 'line-through text-green-700' :
                item.status === 'expired' ? 'line-through text-red-600' :
                'text-gray-800'
              }`}>
                {item.name}
              </span>

              {/* Expiry date */}
              <span className={`ml-2 text-xs ${
                item.eaten ? 'text-green-600' :
                item.status === 'expired' ? 'text-red-500 font-bold' :
                item.status === 'expiring_soon' ? 'text-amber-600 font-semibold' :
                'text-gray-500'
              }`}>
                {item.eaten ? '✓ ate it!' :
                 item.status === 'expired' ? 'EXPIRED' :
                 formatDate(item.expiryDate)}
              </span>
            </div>

            {/* Action buttons - show on hover */}
            {!item.eaten && (
              <div className="ml-2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleItemAction(e, item, 'eaten')}
                  className="text-green-600 hover:text-green-800 text-xs px-1.5 py-0.5 rounded hover:bg-white/50"
                  title="Mark as eaten"
                >
                  ✓
                </button>
                {item.status === 'expired' && (
                  <button
                    onClick={(e) => handleItemAction(e, item, 'expired')}
                    className="text-red-600 hover:text-red-800 text-xs px-1.5 py-0.5 rounded hover:bg-white/50"
                    title="Confirm expired"
                  >
                    ✗
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Show more/less toggle */}
      {hasMore && (
        <button
          className="text-xs text-gray-600 hover:text-gray-800 underline"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? 'Show less' : `...and ${items.length - 4} more`}
        </button>
      )}

      {/* Delete note button - shows on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Delete this shopping trip (${items.length} items)?`)) {
            onDeleteNote(purchaseDate);
          }
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        title="Delete entire note"
      >
        🗑️
      </button>
    </div>
  );
}
