'use client';

import { formatGroceryName, formatCategoryName, formatCountdown, calculateHoursUntilExpiry } from '../../../lib/utils';

export default function GroceryDetailModal({ grocery, onEdit, onDelete, onMarkAsEaten, onClose, isOpen }) {
  if (!grocery || !isOpen) return null;

  const hoursUntilExpiry = calculateHoursUntilExpiry(grocery.expiryDate);
  const countdown = formatCountdown(hoursUntilExpiry);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysFromPurchase = () => {
    if (!grocery.purchaseDate) return 'Unknown';
    const purchase = new Date(grocery.purchaseDate);
    const today = new Date();
    const diffTime = today - purchase;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'fresh': return '✅';
      case 'expiring_soon': return '⚠️';
      case 'expired': return '❌';
      default: return '📦';
    }
  };

  // Sticky note color based on status
  const getNoteColor = (status) => {
    switch (status) {
      case 'fresh': return 'from-green-100 via-green-50 to-emerald-50';
      case 'expiring_soon': return 'from-yellow-100 via-yellow-50 to-amber-50';
      case 'expired': return 'from-red-100 via-red-50 to-rose-50';
      default: return 'from-blue-100 via-blue-50 to-sky-50';
    }
  };

  const getMagnetColor = (status) => {
    switch (status) {
      case 'fresh': return 'radial-gradient(circle at 30% 30%, #4ade80 0%, #22c55e 50%, #15803d 100%)';
      case 'expiring_soon': return 'radial-gradient(circle at 30% 30%, #fbbf24 0%, #f59e0b 50%, #d97706 100%)';
      case 'expired': return 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)';
      default: return 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Note Detail Card */}
        <div className="relative animate-scale-in" style={{ transform: 'rotate(-1deg)' }}>
          {/* Shadow */}
          <div className="absolute inset-0 bg-black/20 rounded-sm translate-y-2 translate-x-1" />

          {/* Magnet */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full z-10"
            style={{
              background: getMagnetColor(grocery.status),
              boxShadow: '0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.4)',
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center shadow-lg z-20 transition-all hover:scale-110"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Sticky Note */}
          <div className={`relative bg-gradient-to-br ${getNoteColor(grocery.status)} rounded-sm shadow-2xl p-6 sm:p-8`}>
            <div className="space-y-4">
              {/* Item Name & Status */}
              <div className="text-center border-b-2 border-slate-300 pb-4">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {formatGroceryName(grocery.name)}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-slate-600">{formatCategoryName(grocery.category)}</span>
                  <span className="text-slate-400">•</span>
                  <span className={`text-sm font-medium ${
                    grocery.status === 'fresh' ? 'text-green-600' :
                    grocery.status === 'expiring_soon' ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {grocery.status.replace('_', ' ')} {getStatusEmoji(grocery.status)}
                  </span>
                </div>
              </div>

              {/* Freshness Display */}
              <div className={`text-center rounded-lg p-4 border-2 ${
                grocery.status === 'fresh' ? 'bg-green-50 border-green-200' :
                grocery.status === 'expiring_soon' ? 'bg-amber-50 border-amber-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div className={`text-3xl font-bold mb-1 ${
                  grocery.status === 'fresh' ? 'text-green-700' :
                  grocery.status === 'expiring_soon' ? 'text-amber-700' :
                  'text-red-700'
                }`}>
                  {countdown}
                </div>
                <div className="text-sm text-slate-600">
                  {hoursUntilExpiry >= 0 ? 'remains fresh' : 'past best-by date'}
                </div>
              </div>

              {/* Details Grid */}
              <div className="space-y-3">
                <div className="bg-white/50 rounded-lg p-3 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600 mb-1">🛒 Purchased</div>
                  <div className="text-sm text-slate-800 font-medium">{formatDate(grocery.purchaseDate)}</div>
                  <div className="text-xs text-slate-500">{getDaysFromPurchase()}</div>
                </div>

                <div className="bg-white/50 rounded-lg p-3 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600 mb-1">📅 Expires</div>
                  <div className="text-sm text-slate-800 font-medium">{formatDate(grocery.expiryDate)}</div>
                </div>

                {grocery.storageRecommendations && (
                  <div className="bg-amber-50 rounded-lg p-3 border-l-3 border-amber-400">
                    <div className="text-xs font-semibold text-amber-700 mb-1">💡 Storage Tips</div>
                    <div className="text-sm text-slate-700">{grocery.storageRecommendations}</div>
                  </div>
                )}

                {/* Source & Info */}
                <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600 mb-2">ℹ️ Information Source</div>
                  <div className="text-sm text-slate-700">
                    {grocery.source ? (
                      <span>Shelf life data from <span className="font-medium">{grocery.source}</span></span>
                    ) : (
                      <span>Based on USDA food safety guidelines</span>
                    )}
                  </div>
                  {grocery.confidence && (
                    <div className="text-xs text-slate-500 mt-1">
                      Confidence: {grocery.confidence}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 mt-2">
                    Note: Actual freshness may vary based on storage conditions.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                {/* Primary action - Mark as Eaten */}
                <button
                  onClick={() => {
                    onMarkAsEaten?.(grocery.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  aria-label="Mark as eaten"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Eaten
                </button>

                {/* Secondary actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onEdit(grocery.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all"
                    aria-label="Edit item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(grocery.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all"
                    aria-label="Delete item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}