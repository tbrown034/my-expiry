'use client';

import { useState, useEffect } from 'react';
import { Category } from '../../../lib/types';
import { getFoodEmoji } from '../../../lib/foodEmojis';

export default function BatchGroceryPopup({ batchResult, onConfirm, onCancel }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  // Load items and fetch shelf life
  useEffect(() => {
    if (!batchResult?.items) return;

    const today = new Date().toISOString().split('T')[0];
    const initialItems = batchResult.items.map((item, index) => ({
      id: index,
      name: item.name || '',
      modifier: item.modifier || '',
      category: item.category || Category.OTHER,
      foodType: item.foodType || 'store-bought',
      purchaseDate: item.purchaseDate || today,
      shelfLifeDays: item.shelfLifeDays,
      expiryDate: item.expiryDate,
      storageRecommendations: item.storageRecommendations,
      source: item.source,
      confidence: item.confidence,
    }));

    // Check if we already have shelf life data
    if (initialItems[0]?.shelfLifeDays !== undefined) {
      setItems(initialItems);
      setIsLoading(false);
      return;
    }

    // Fetch shelf life data
    setItems(initialItems);
    fetchShelfLife(initialItems);
  }, [batchResult]);

  const fetchShelfLife = async (itemsToFetch) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToFetch.map(item => ({
            name: item.name,
            modifier: item.modifier,
            category: item.category,
            foodType: item.foodType,
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to get shelf life');

      const result = await response.json();
      setItems(prev => prev.map((item, index) => ({
        ...item,
        ...result.items[index],
        id: item.id,
        purchaseDate: item.purchaseDate,
      })));
    } catch (err) {
      setError('Failed to get shelf life. You can still add items manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const adjustDays = (id, delta) => {
    const item = items.find(i => i.id === id);
    if (item?.shelfLifeDays !== undefined) {
      const newDays = Math.max(1, item.shelfLifeDays + delta);
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + newDays);
      setItems(prev => prev.map(i =>
        i.id === id ? { ...i, shelfLifeDays: newDays, expiryDate: newExpiry.toISOString().split('T')[0] } : i
      ));
    }
  };

  const handleConfirm = () => {
    onConfirm(items.map(item => ({
      name: item.name,
      modifier: item.modifier,
      category: item.category,
      foodType: item.foodType,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
      shelfLifeDays: item.shelfLifeDays,
      storageRecommendations: item.storageRecommendations,
      source: item.source,
      confidence: item.confidence,
      addedManually: true
    })));
  };

  const getExpiryText = (days) => {
    if (days === undefined) return '';
    if (days < 0) return 'Expired';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days <= 3) return `${days} days`;
    if (days <= 7) return `${days} days`;
    return `${days} days`;
  };

  const getExpiryColor = (days) => {
    if (days === undefined) return 'text-slate-500';
    if (days < 0) return 'text-red-600';
    if (days <= 2) return 'text-red-500';
    if (days <= 5) return 'text-amber-500';
    return 'text-emerald-600';
  };

  // Loading state - sticky note style
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="relative" style={{ transform: 'rotate(-1deg)' }}>
          {/* Red magnet - on the fridge, holding the note */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full z-20"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
            }}
          />

          {/* Shadow */}
          <div className="absolute inset-0 bg-black/25 rounded-sm translate-y-2 translate-x-1" />

          {/* Note */}
          <div
            className="relative w-80 rounded-sm p-6 shadow-xl overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, transparent 0px, transparent 28px, rgba(180, 83, 9, 0.08) 28px, rgba(180, 83, 9, 0.08) 29px),
                linear-gradient(to bottom right, #fef9c3 0%, #fefce8 50%, #fef3c7 100%)
              `,
              backgroundSize: '100% 30px, 100% 100%',
            }}
          >

            {/* Content */}
            <div className="pt-2 text-center">
              {/* Spinner */}
              <div className="w-12 h-12 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
                <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Getting Shelf Life...
              </h3>

              {/* Info */}
              <p className="text-amber-700 font-medium text-sm mb-3">
                {items.length} items to look up
              </p>

              <p className="text-slate-400 text-xs">
                This usually takes a few seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Add to Fridge?
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {items.length} items ready to add
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && !isLoading && (
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-200">
            <p className="text-sm text-amber-700">{error}</p>
          </div>
        )}

        {/* Items list */}
        {!isLoading && (
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {items.map(item => (
                <div key={item.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  {editingId === item.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Editing</span>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-sm text-emerald-600 font-medium"
                        >
                          Done
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Item name"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {Object.values(Category).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <select
                          value={item.foodType}
                          onChange={(e) => updateItem(item.id, 'foodType', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="store-bought">Store-bought</option>
                          <option value="premade">Deli/Premade</option>
                          <option value="leftover">Leftover</option>
                        </select>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove item
                      </button>
                    </div>
                  ) : (
                    // Display mode
                    <div className="flex items-center gap-3">
                      {/* Emoji */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{getFoodEmoji(item.name, item.category)}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 truncate">{item.name}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{item.category}</span>
                          {item.shelfLifeDays !== undefined && (
                            <>
                              <span>•</span>
                              <span className={getExpiryColor(item.shelfLifeDays)}>
                                {getExpiryText(item.shelfLifeDays)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Days adjuster */}
                      {item.shelfLifeDays !== undefined && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustDays(item.id, -1)}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-slate-700">
                            {item.shelfLifeDays}d
                          </span>
                          <button
                            onClick={() => adjustDays(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}

                      {/* Edit button */}
                      <button
                        onClick={() => setEditingId(item.id)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {items.length === 0 && !isLoading && (
                <div className="py-12 text-center text-slate-400">
                  <p>No items to add</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        {!isLoading && items.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Add {items.length} Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
