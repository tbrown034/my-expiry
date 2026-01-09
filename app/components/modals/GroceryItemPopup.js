'use client';

import { useState, useEffect } from 'react';
import { Category } from '../../../lib/types';
import { formatExpiryDate } from '../../../lib/utils';

export default function GroceryItemPopup({ item, onConfirm, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.estimatedCategory || Category.OTHER,
    purchaseDate: new Date().toISOString().split('T')[0],
    shelfLifeDays: item?.shelfLifeDays || 7,
    expiryDate: ''
  });

  useEffect(() => {
    const calculateExpiryDate = () => {
      const purchaseDate = new Date(formData.purchaseDate);
      const expiryDate = new Date(purchaseDate);
      expiryDate.setDate(expiryDate.getDate() + formData.shelfLifeDays);
      return expiryDate.toISOString().split('T')[0];
    };

    setFormData(prev => ({
      ...prev,
      expiryDate: calculateExpiryDate()
    }));
  }, [formData.purchaseDate, formData.shelfLifeDays]);

  const handleShelfLifeChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      shelfLifeDays: Math.max(1, prev.shelfLifeDays + delta)
    }));
  };

  const handleConfirm = () => {
    onConfirm({
      name: formData.name,
      category: formData.category,
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate,
      addedManually: false
    });
  };

  const expiryInfo = formData.expiryDate ? formatExpiryDate(formData.expiryDate) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <div className="relative" style={{ transform: 'rotate(-1deg)' }}>
          {/* Shadow */}
          <div className="absolute inset-0 bg-black/20 rounded-sm translate-y-2 translate-x-1" />

          {/* Magnet */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full z-10"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.4)',
            }}
          />

          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center shadow-lg z-20 transition-all hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Sticky Note */}
          <div className="relative bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 rounded-sm shadow-2xl p-6">
            {/* Header */}
            <div className="mb-4 pb-3 border-b-2 border-slate-300">
              <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Patrick Hand', cursive, sans-serif" }}>
                Confirm Item
              </h2>
            </div>

            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-transparent border-b-2 border-slate-300 focus:border-slate-600 px-1 py-2 text-lg text-slate-800 focus:outline-none transition-colors"
                  style={{ fontFamily: "'Patrick Hand', cursive, sans-serif" }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-white/50 border border-slate-300 rounded px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value={Category.DAIRY}>Dairy</option>
                  <option value={Category.MEAT}>Meat</option>
                  <option value={Category.VEGETABLES}>Vegetables</option>
                  <option value={Category.FRUITS}>Fruits</option>
                  <option value={Category.BAKERY}>Bakery</option>
                  <option value={Category.FROZEN}>Frozen</option>
                  <option value={Category.PANTRY}>Pantry</option>
                  <option value={Category.BEVERAGES}>Beverages</option>
                  <option value={Category.OTHER}>Other</option>
                </select>
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Bought On</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/50 border border-slate-300 rounded px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Shelf Life & Expiry Display */}
              <div className={`rounded-lg p-3 ${expiryInfo?.urgent ? 'bg-red-50/80' : 'bg-white/50'}`}>
                {expiryInfo && (
                  <div className={`text-center text-lg font-bold mb-2 ${expiryInfo.color}`}>
                    {expiryInfo.text}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShelfLifeChange(-1)}
                      className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-colors"
                    >−</button>
                    <span className="font-bold text-slate-700 min-w-[60px] text-center">
                      {formData.shelfLifeDays} days
                    </span>
                    <button
                      type="button"
                      onClick={() => handleShelfLifeChange(1)}
                      className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold transition-colors"
                    >+</button>
                  </div>
                  <span className="text-xs text-slate-500">{formData.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Add to Fridge
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}