import { useState } from 'react';
import { Category } from '../../../lib/types';
import { ButtonSpinner } from '../ui/LoadingSpinner';

export default function AddGroceryForm({ onSubmit, onSubmitWithAI, onCancel, isLoadingShelfLife = false }) {
  const [formData, setFormData] = useState({
    name: '',
    category: Category.OTHER,
    expiryDate: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    addedManually: true
  });
  const [useAI, setUseAI] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name) {
      if (useAI) {
        onSubmitWithAI(formData.name);
      } else if (formData.expiryDate) {
        onSubmit(formData);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={useAI}
              onChange={() => setUseAI(true)}
              className="mr-2"
            />
            <span className="text-sm font-medium">Use AI for shelf life</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!useAI}
              onChange={() => setUseAI(false)}
              className="mr-2"
            />
            <span className="text-sm font-medium">Manual entry</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Item Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Milk, Bananas, Chicken"
          autoFocus
          required
        />
      </div>

      {!useAI && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoadingShelfLife || (!useAI && !formData.expiryDate)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
        >
          {isLoadingShelfLife && <ButtonSpinner color="white" />}
          {isLoadingShelfLife ? 'Getting shelf life...' : useAI ? 'Get Shelf Life' : 'Add Item'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}