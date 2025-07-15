'use client';

import { useState, useEffect } from 'react';
import { Category } from '../../lib/types';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Grocery Item</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shelf Life (Days)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleShelfLifeChange(-1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{formData.shelfLifeDays}</span>
              <button
                type="button"
                onClick={() => handleShelfLifeChange(1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Add Item
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