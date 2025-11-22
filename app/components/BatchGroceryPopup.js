'use client';

import { useState, useEffect, useRef } from 'react';
import { Category } from '../../lib/types';

export default function BatchGroceryPopup({ batchResult, onConfirm, onCancel, onAddMoreItems }) {
  const [items, setItems] = useState([]);
  const [stage, setStage] = useState(1); // 1 = review parsed items, 2 = review shelf life
  const [isLoadingShelfLife, setIsLoadingShelfLife] = useState(false);
  const [error, setError] = useState(null);

  // Optimistic prefetching state
  const [prefetchedData, setPrefetchedData] = useState(null);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [prefetchTimestamp, setPrefetchTimestamp] = useState(null);
  const debounceTimerRef = useRef(null);
  const prefetchAbortRef = useRef(null);
  const prefetchPromiseRef = useRef(null); // Track in-flight prefetch promise

  useEffect(() => {
    if (batchResult?.items) {
      // Determine which stage based on whether items have shelf life data
      const hasShelfLife = batchResult.items[0]?.shelfLifeDays !== undefined;
      setStage(hasShelfLife ? 2 : 1);

      const today = new Date().toISOString().split('T')[0];
      setItems(batchResult.items.map((item, index) => ({
        id: index,
        name: item.name || '',
        modifier: item.modifier || '',
        quantity: item.quantity || 1,
        category: item.category || Category.OTHER,
        foodType: item.foodType || 'store-bought',
        purchaseDate: item.purchaseDate || today, // Default to today
        // Stage 2 fields
        shelfLifeDays: item.shelfLifeDays,
        expiryDate: item.expiryDate,
        storageRecommendations: item.storageRecommendations,
        source: item.source,
        confidence: item.confidence,
        isPerishable: item.isPerishable
      })));
    }
  }, [batchResult]);

  // Optimistic prefetching: debounce items changes and prefetch shelf life
  useEffect(() => {
    // Only prefetch in stage 1 with valid items
    if (stage !== 1 || items.length === 0) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Mark any in-flight prefetch as stale
    setPrefetchTimestamp(null);
    prefetchPromiseRef.current = null; // Clear any in-flight prefetch

    // Set new timer to start prefetch after 2 seconds of no edits
    debounceTimerRef.current = setTimeout(() => {
      console.log('🚀 Starting background prefetch for', items.length, 'items...');
      setIsPrefetching(true);
      const prefetchStartTime = Date.now();

      // Create and store the promise
      const prefetchPromise = (async () => {
        try {
          const response = await fetch('/api/get-shelf-life', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: items.map(item => ({
                name: item.name,
                modifier: item.modifier,
                quantity: item.quantity,
                category: item.category,
                foodType: item.foodType
              }))
            })
          });

          if (!response.ok) {
            throw new Error('Prefetch failed');
          }

          const result = await response.json();

          // Store prefetched data with timestamp
          setPrefetchedData({
            result,
            itemsSnapshot: JSON.stringify(items.map(i => ({
              id: i.id,
              name: i.name,
              modifier: i.modifier,
              category: i.category,
              foodType: i.foodType,
              quantity: i.quantity
            })))
          });
          setPrefetchTimestamp(prefetchStartTime);
          console.log('✨ Prefetch completed successfully!');
          return result;
        } catch (err) {
          console.log('Prefetch failed (non-critical):', err.message);
          throw err;
        } finally {
          setIsPrefetching(false);
          prefetchPromiseRef.current = null; // Clear the promise ref
        }
      })();

      prefetchPromiseRef.current = prefetchPromise;
    }, 2000); // 2 second debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [items, stage]);

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleGetShelfLife = async () => {
    setError(null);

    // Check if we have valid prefetched data
    const currentItemsSnapshot = JSON.stringify(items.map(i => ({
      id: i.id,
      name: i.name,
      modifier: i.modifier,
      category: i.category,
      foodType: i.foodType,
      quantity: i.quantity
    })));

    const hasFreshPrefetch =
      prefetchedData &&
      prefetchTimestamp &&
      prefetchedData.itemsSnapshot === currentItemsSnapshot &&
      (Date.now() - prefetchTimestamp) < 30000; // Less than 30 seconds old

    console.log('🔍 Prefetch check:', {
      hasPrefetchedData: !!prefetchedData,
      hasTimestamp: !!prefetchTimestamp,
      snapshotsMatch: prefetchedData?.itemsSnapshot === currentItemsSnapshot,
      age: prefetchTimestamp ? (Date.now() - prefetchTimestamp) / 1000 : null,
      hasInFlightPrefetch: !!prefetchPromiseRef.current,
      willUsePrefetch: hasFreshPrefetch
    });

    if (hasFreshPrefetch) {
      // Use prefetched data for instant transition
      console.log('✅ Using prefetched data - instant transition!');
      const result = prefetchedData.result;
      setItems(prev => prev.map((item, index) => ({
        ...item,
        ...result.items[index],
        id: item.id,  // preserve original id
        purchaseDate: item.purchaseDate // preserve purchase date
      })));
      setStage(2);
      return;
    }

    // Check if there's an in-flight prefetch we can wait for
    if (prefetchPromiseRef.current) {
      console.log('⏳ Waiting for in-flight prefetch to complete...');
      setIsLoadingShelfLife(true);

      try {
        const result = await prefetchPromiseRef.current;
        console.log('✅ In-flight prefetch completed - using result!');
        setItems(prev => prev.map((item, index) => ({
          ...item,
          ...result.items[index],
          id: item.id,
          purchaseDate: item.purchaseDate
        })));
        setStage(2);
        setIsLoadingShelfLife(false);
        return;
      } catch (err) {
        console.log('In-flight prefetch failed, making new request...');
        // Fall through to make a new request
      }
    }

    console.log('📞 No valid prefetch, making new API call...');

    // No valid prefetch, make API call normally
    setIsLoadingShelfLife(true);

    try {
      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            modifier: item.modifier,
            quantity: item.quantity,
            category: item.category,
            foodType: item.foodType
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get shelf life');
      }

      const result = await response.json();

      // Update items with shelf life data
      setItems(prev => prev.map((item, index) => ({
        ...item,
        ...result.items[index],
        id: item.id // preserve original id
      })));

      setStage(2);
    } catch (err) {
      console.error('Error getting shelf life:', err);
      setError('Failed to get shelf life information. Please try again.');
    } finally {
      setIsLoadingShelfLife(false);
    }
  };

  const adjustShelfLife = (id, delta) => {
    const item = items.find(i => i.id === id);
    if (item && item.shelfLifeDays !== undefined) {
      const newDays = Math.max(1, item.shelfLifeDays + delta);
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + newDays);
      updateItem(id, 'shelfLifeDays', newDays);
      updateItem(id, 'expiryDate', newExpiry.toISOString().split('T')[0]);
    }
  };

  const handleConfirm = () => {
    const itemsToAdd = items.map(item => ({
      name: item.name,
      modifier: item.modifier,
      category: item.category,
      foodType: item.foodType,
      purchaseDate: item.purchaseDate, // Use the user-selected date
      expiryDate: item.expiryDate,
      shelfLifeDays: item.shelfLifeDays,
      storageRecommendations: item.storageRecommendations,
      source: item.source,
      confidence: item.confidence,
      isPerishable: item.isPerishable,
      addedManually: true
    }));
    onConfirm(itemsToAdd);
  };

  const getConfidenceBadge = (confidence) => {
    const styles = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[confidence] || styles.low}`}>
        {confidence}
      </span>
    );
  };

  const getSourceBadge = (source) => {
    if (source?.includes('USDA')) {
      return <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">USDA</span>;
    }
    if (source?.includes('FDA')) {
      return <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">FDA</span>;
    }
    return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">AI Est.</span>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {stage === 1 ? 'Step 1: Review Parsed Items' : 'Step 2: Review Shelf Life'}
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${stage >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${stage >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
          </div>
        </div>

        {/* Info Banner */}
        <div className={`mb-4 p-3 rounded-md ${stage === 1 ? 'bg-blue-50' : 'bg-green-50'}`}>
          <p className={`text-sm ${stage === 1 ? 'text-blue-800' : 'text-green-800'}`}>
            {stage === 1
              ? 'Review and adjust the AI-parsed items. Edit names, categories, or types before getting shelf life data.'
              : 'Shelf life data from official sources (USDA/FDA). Adjust if needed, then add to your fridge.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                {stage === 1 ? (
                  // Stage 1: Edit parsed items
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Modifier</label>
                      <input
                        type="text"
                        value={item.modifier}
                        onChange={(e) => updateItem(item.id, 'modifier', e.target.value)}
                        placeholder="brand, size, etc."
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bought On</label>
                      <input
                        type="date"
                        value={item.purchaseDate}
                        onChange={(e) => updateItem(item.id, 'purchaseDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={item.foodType}
                        onChange={(e) => updateItem(item.id, 'foodType', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="store-bought">Store-bought</option>
                        <option value="premade">Premade/Deli</option>
                        <option value="leftover">Leftover</option>
                      </select>
                    </div>
                    <div className="md:col-span-1 flex justify-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Stage 2: Show shelf life with source
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.modifier && <p className="text-sm text-gray-500">{item.modifier}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {getSourceBadge(item.source)}
                        {getConfidenceBadge(item.confidence)}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <span className="ml-1 font-medium">{item.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-1 font-medium">{item.foodType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Shelf Life:</span>
                        <button
                          onClick={() => adjustShelfLife(item.id, -1)}
                          className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                        >-</button>
                        <span className="font-bold text-blue-600">{item.shelfLifeDays} days</span>
                        <button
                          onClick={() => adjustShelfLife(item.id, 1)}
                          className="w-5 h-5 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                        >+</button>
                      </div>
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <span className="ml-1 font-medium">{item.expiryDate}</span>
                      </div>
                    </div>

                    {item.storageRecommendations && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        💡 {item.storageRecommendations}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No items to review.
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t">
          {stage === 1 ? (
            <>
              {onAddMoreItems && (
                <button
                  onClick={() => onAddMoreItems(items)}
                  className="px-4 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors flex items-center gap-2"
                  title="Add more items to this batch"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add More
                </button>
              )}
              <button
                onClick={handleGetShelfLife}
                disabled={items.length === 0 || isLoadingShelfLife}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                {isLoadingShelfLife ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Looking up shelf life...
                  </>
                ) : (
                  <>
                    Get Shelf Life ({items.length})
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
              <button
                onClick={onCancel}
                className="px-6 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStage(1)}
                className="px-4 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={items.length === 0}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                Add to Fridge ({items.length})
              </button>
              <button
                onClick={onCancel}
                className="px-6 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
