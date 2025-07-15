'use client';

import { useState, useEffect } from 'react';
import { Category } from '../../lib/types';

export default function BatchGroceryPopup({ batchResult, onConfirm, onCancel }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (batchResult?.items) {
      setItems(batchResult.items.map((item, index) => ({
        id: index,
        name: item.name,
        category: item.category || item.estimatedCategory || Category.OTHER,
        purchaseDate: new Date().toISOString().split('T')[0],
        shelfLifeDays: parseInt(item.shelfLifeDays) || 7,
        expiryDate: getExpiryDate(new Date().toISOString().split('T')[0], parseInt(item.shelfLifeDays) || 7)
      })));
    }
  }, [batchResult]);

  const getExpiryDate = (purchaseDate, shelfLifeDays) => {
    try {
      const purchase = new Date(purchaseDate);
      if (isNaN(purchase.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      
      const validShelfLifeDays = parseInt(shelfLifeDays) || 7;
      const expiry = new Date(purchase);
      expiry.setDate(expiry.getDate() + validShelfLifeDays);
      
      if (isNaN(expiry.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      
      return expiry.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error calculating expiry date:', error);
      return new Date().toISOString().split('T')[0];
    }
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        if (field === 'purchaseDate' || field === 'shelfLifeDays') {
          updated.expiryDate = getExpiryDate(updated.purchaseDate, updated.shelfLifeDays);
        }
        
        return updated;
      }
      return item;
    }));
  };

  const adjustShelfLife = (id, delta) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateItem(id, 'shelfLifeDays', Math.max(1, item.shelfLifeDays + delta));
    }
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleConfirm = () => {
    const itemsToAdd = items.map(item => ({
      name: item.name,
      category: item.category,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
      addedManually: true
    }));
    onConfirm(itemsToAdd);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Review AI-Generated Shelf Life Information</h2>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            Review and adjust the AI-generated categories and shelf life for your items. Purchase date defaults to today.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={item.purchaseDate}
                      onChange={(e) => updateItem(item.id, 'purchaseDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Shelf Life (Days)
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => adjustShelfLife(item.id, -1)}
                        className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.shelfLifeDays}</span>
                      <button
                        type="button"
                        onClick={() => adjustShelfLife(item.id, 1)}
                        className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={item.expiryDate}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No items to review.
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t">
          <button
            onClick={handleConfirm}
            disabled={items.length === 0}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Add Items ({items.length})
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}