'use client';

import { formatGroceryName, formatCategoryName, getCategoryColorClass, getStatusColor, formatCountdown, calculateHoursUntilExpiry } from '../../lib/utils';

export default function GroceryDetailModal({ grocery, onEdit, onDelete, onClose }) {
  if (!grocery) return null;

  const hoursUntilExpiry = calculateHoursUntilExpiry(grocery.expiryDate);
  const countdown = formatCountdown(hoursUntilExpiry);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Item Name */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {formatGroceryName(grocery.name)}
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-sm ${getCategoryColorClass(grocery.category)}`}></div>
              <span className="text-sm text-gray-600">
                {formatCategoryName(grocery.category)}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(grocery.status)}`}>
              {grocery.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Countdown */}
          <div className="text-center bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {countdown}
            </div>
            <div className="text-sm text-gray-600">
              {hoursUntilExpiry >= 0 ? 'until expiry' : 'past expiry'}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 bg-gray-50 rounded-lg p-4">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Purchase Date
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(grocery.purchaseDate)}
              </div>
              <div className="text-xs text-gray-500">
                {getDaysFromPurchase()}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Expiry Date
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(grocery.expiryDate)}
              </div>
            </div>

            {grocery.storageRecommendations && (
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Storage Tips
                </div>
                <div className="text-sm text-gray-900">
                  {grocery.storageRecommendations}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Added
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(grocery.createdAt)}
              </div>
              {grocery.addedManually && (
                <div className="text-xs text-blue-600 mt-1">
                  Manual entry
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onEdit(grocery.id);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
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
  );
}