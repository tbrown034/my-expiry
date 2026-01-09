'use client';

import { formatDate, formatExpiryDate } from '../../../lib/utils';
import { getCategoryIcon } from '../../../lib/categoryIcons';
import ActionMenu from './ActionMenu';

const STICKY_COLORS = [
  { bg: 'bg-yellow-100', border: 'border-yellow-300', hover: 'hover:bg-yellow-50' },
  { bg: 'bg-pink-100', border: 'border-pink-300', hover: 'hover:bg-pink-50' },
  { bg: 'bg-blue-100', border: 'border-blue-300', hover: 'hover:bg-blue-50' },
  { bg: 'bg-green-100', border: 'border-green-300', hover: 'hover:bg-green-50' },
  { bg: 'bg-purple-100', border: 'border-purple-300', hover: 'hover:bg-purple-50' },
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
  metadata = {},
  isPartial = false,
  partNumber = 1,
  totalParts = 1,
  onItemClick,
  onMarkAsEaten,
  onMarkAsExpired,
  onDeleteNote,
  onEditItem,
  onDeleteItem,
  colorIndex = 0
}) {
  const colorScheme = STICKY_COLORS[colorIndex % STICKY_COLORS.length];
  const rotation = ROTATIONS[colorIndex % ROTATIONS.length];

  // Generate batch description
  const getBatchDescription = () => {
    if (metadata.source === 'receipt' && metadata.storeName) {
      return `${metadata.storeName} Receipt`;
    } else if (metadata.source === 'receipt') {
      return 'Receipt Scan';
    } else {
      return 'Manual Entry';
    }
  };

  const batchDescription = getBatchDescription();

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
      className={`
        sticky-note ${colorScheme.bg} ${colorScheme.border} ${rotation}
        relative p-4 rounded-sm border-2
        transition-all duration-300 interactive group
        min-h-[200px]
      `}
      style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.15)',
      }}
      role="article"
      aria-label={`Shopping trip from ${formatDate(purchaseDate)} with ${items.length} items`}
    >
      {/* Metallic magnet/thumbtack visual - matches HomePage style */}
      <div
        className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
          boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
        }}
        aria-hidden="true"
      ></div>

      {/* Header with batch description and date */}
      <div className="w-full mb-3 pb-2 border-b border-gray-400/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-800 font-handwritten leading-tight">
              <span className="mr-1" role="img" aria-label="Note">📝</span>
              {batchDescription}
              {isPartial && <span className="text-xs ml-1">({partNumber}/{totalParts})</span>}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">{formatDate(purchaseDate)}</p>
          </div>
        </div>
        {(eatenCount > 0 || expiredCount > 0 || activeCount > 0) && (
          <div className="text-xs text-gray-700 mt-2 flex flex-wrap gap-1.5">
            {activeCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                {activeCount} active
              </span>
            )}
            {eatenCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                ✓ {eatenCount} eaten
              </span>
            )}
            {expiredCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                ✗ {expiredCount} expired
              </span>
            )}
          </div>
        )}
      </div>

      {/* Items list - improved readability */}
      <ul className="space-y-2 mb-2" role="list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`
              group/item interactive
              ${item.eaten ? 'opacity-70' : ''}
            `}
          >
            <div
              onClick={(e) => {
                // Only trigger if clicking the item itself, not action buttons
                if (!e.target.closest('.interactive-button')) {
                  onItemClick(item);
                }
              }}
              className={`
                w-full text-left p-2 -mx-2 rounded-lg
                transition-all duration-200
                ${colorScheme.hover}
                flex items-start justify-between gap-2
                cursor-pointer
              `}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onItemClick(item);
                }
              }}
              aria-label={`View details for ${item.name}`}
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {/* Category icon */}
                {(() => {
                  const CategoryIcon = getCategoryIcon(item.category);
                  return (
                    <div className={`
                      w-7 h-7 rounded flex-shrink-0 flex items-center justify-center mt-0.5
                      ${item.eaten ? 'bg-green-200/50' :
                        item.status === 'expired' ? 'bg-red-200/50' :
                        'bg-white/60'}
                    `}>
                      <CategoryIcon className={`w-4 h-4 ${
                        item.eaten ? 'text-green-600' :
                        item.status === 'expired' ? 'text-red-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                  );
                })()}

                <div className="flex-1 min-w-0">
                  {/* Item name with strikethrough if eaten or expired */}
                  <div className={`
                    text-sm sm:text-base font-medium leading-tight
                    ${item.eaten ? 'line-through text-green-700' :
                      item.status === 'expired' ? 'line-through text-red-700' :
                      'text-gray-900'}
                  `}>
                    {item.name}
                  </div>

                  {/* Expiry date with user-friendly format */}
                  <div className="mt-0.5">
                    {item.eaten ? (
                      <span className="text-xs sm:text-sm font-medium text-green-600">✓ Ate it!</span>
                    ) : item.status === 'expired' ? (
                      <span className="text-xs sm:text-sm font-medium text-red-600">⚠️ Expired</span>
                    ) : (() => {
                      const expiry = formatExpiryDate(item.expiryDate);
                      return (
                        <span className={`text-xs sm:text-sm font-medium ${expiry.color}`}>
                          {expiry.text}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Action buttons - delete item and more options */}
              <div className="flex-shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {/* Delete individual item button - always visible */}
                {!item.eaten && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="interactive-button p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                    aria-label={`Delete ${item.name}`}
                    title="Delete this item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                {/* Action menu for other options */}
                <div className="opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity">
                  <ActionMenu
                    actions={[
                      {
                        label: 'View Details',
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ),
                        onClick: () => onItemClick(item),
                        color: 'text-blue-600'
                      },
                      ...(!item.eaten ? [
                        {
                          label: 'Edit Item',
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          ),
                          onClick: () => onEditItem(item.id),
                          color: 'text-amber-600'
                        },
                        {
                          label: 'Mark as Eaten',
                          icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ),
                          onClick: () => handleItemAction({ stopPropagation: () => {} }, item, 'eaten'),
                          color: 'text-green-600'
                        }
                      ] : [])
                    ]}
                    align="right"
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete entire note button - X in top right, always visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteNote(purchaseDate);
        }}
        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all interactive"
        aria-label="Delete entire note"
        title="Delete entire shopping trip"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
