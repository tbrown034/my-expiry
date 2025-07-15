import { useState } from 'react';

export default function BatchAddGroceryForm({ onBatchSubmit, onCancel, isLoadingShelfLife = false }) {
  const [items, setItems] = useState(['']);
  const [newItem, setNewItem] = useState('');

  const addItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, value) => {
    setItems(prev => prev.map((item, i) => i === index ? value : item));
  };

  const handleBatchSubmit = (e) => {
    e.preventDefault();
    const validItems = items.filter(item => item.trim());
    if (validItems.length > 0) {
      onBatchSubmit(validItems);
    }
  };

  const canSubmit = items.some(item => item.trim()) && !isLoadingShelfLife;

  return (
    <form onSubmit={handleBatchSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Batch Add Items with AI</h3>
        <p className="text-sm text-gray-600 mb-4">Add multiple items at once. AI will determine categories and shelf life for all items.</p>
      </div>

      {/* Add new item input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter item name (e.g., Milk, Bananas, Chicken)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem(e);
            }
          }}
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!newItem.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Items list */}
      {items.length > 0 && items.some(item => item.trim()) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Items to process ({items.filter(item => item.trim()).length}):</h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {items.map((item, index) => (
              item.trim() && (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {isLoadingShelfLife ? 'Getting shelf life for all items...' : `Get Shelf Life for ${items.filter(item => item.trim()).length} Items`}
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