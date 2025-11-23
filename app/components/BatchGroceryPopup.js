'use client';

import { useState, useEffect, useRef } from 'react';
import { Category } from '../../lib/types';
import { getRandomFacts } from '../../lib/foodSafetyFacts';

export default function BatchGroceryPopup({ batchResult, onConfirm, onCancel, onAddMoreItems }) {
  const [items, setItems] = useState([]);
  const [stage, setStage] = useState(1); // 1 = review parsed items, 2 = review shelf life
  const [isLoadingShelfLife, setIsLoadingShelfLife] = useState(false);
  const [error, setError] = useState(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [foodFacts, setFoodFacts] = useState([]);

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

  // Rotate food facts while loading
  useEffect(() => {
    if (isLoadingShelfLife) {
      // Get random facts when loading starts
      setFoodFacts(getRandomFacts(5));
      setCurrentFactIndex(0);

      // Rotate through facts every 4 seconds
      const interval = setInterval(() => {
        setCurrentFactIndex(prev => (prev + 1) % 5);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isLoadingShelfLife]);

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

  const stickyNoteColors = [
    'from-yellow-100 via-yellow-50 to-amber-50',
    'from-pink-100 via-pink-50 to-rose-50',
    'from-blue-100 via-blue-50 to-sky-50',
    'from-green-100 via-green-50 to-emerald-50',
    'from-purple-100 via-purple-50 to-violet-50',
    'from-orange-100 via-orange-50 to-amber-50',
  ];

  const magnetColors = [
    'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
    'radial-gradient(circle at 30% 30%, #f472b6 0%, #ec4899 50%, #be185d 100%)',
    'radial-gradient(circle at 30% 30%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)',
    'radial-gradient(circle at 30% 30%, #4ade80 0%, #22c55e 50%, #15803d 100%)',
    'radial-gradient(circle at 30% 30%, #a78bfa 0%, #8b5cf6 50%, #6d28d9 100%)',
    'radial-gradient(circle at 30% 30%, #fb923c 0%, #f97316 50%, #c2410c 100%)',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-6xl h-[100dvh] sm:max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 rounded-none sm:rounded-lg shadow-2xl relative">
        {/* Metallic texture */}
        <div className="absolute inset-0 opacity-30 pointer-events-none rounded-lg"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px)` }}
        />
        {/* Light reflection */}
        <div className="absolute inset-0 pointer-events-none rounded-lg"
          style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.05) 100%)' }}
        />

        {/* Header with step indicators as mini sticky notes */}
        <div className="relative z-10 p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-500/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 order-2 sm:order-1">
              {stage === 1 ? 'Check Your Items' : 'Review Shelf Life'}
            </h2>

            <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
              {/* Step 1 mini note */}
              <div className="relative" style={{ transform: 'rotate(-2deg)' }}>
                <div
                  className="absolute -top-2 sm:-top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-3 sm:h-3 rounded-full"
                  style={{
                    background: stage >= 1 ? 'radial-gradient(circle at 30% 30%, #4ade80 0%, #22c55e 50%, #15803d 100%)' : 'radial-gradient(circle at 30% 30%, #9ca3af 0%, #6b7280 50%, #4b5563 100%)',
                    boxShadow: '0 2px 3px rgba(0,0,0,0.3)',
                  }}
                />
                <div className={`bg-gradient-to-br ${stage >= 1 ? 'from-green-100 via-green-50 to-emerald-50' : 'from-gray-100 via-gray-50 to-slate-50'} rounded-sm px-4 py-2.5 sm:px-3 sm:py-2 shadow-md`}>
                  <span className="font-bold text-slate-700 text-base sm:text-sm">1</span>
                </div>
              </div>

              <div className="w-6 sm:w-8 h-px bg-slate-400"></div>

              {/* Step 2 mini note */}
              <div className="relative" style={{ transform: 'rotate(2deg)' }}>
                <div
                  className="absolute -top-2 sm:-top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-3 sm:h-3 rounded-full"
                  style={{
                    background: stage >= 2 ? 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #2563eb 50%, #1e40af 100%)' : 'radial-gradient(circle at 30% 30%, #9ca3af 0%, #6b7280 50%, #4b5563 100%)',
                    boxShadow: '0 2px 3px rgba(0,0,0,0.3)',
                  }}
                />
                <div className={`bg-gradient-to-br ${stage >= 2 ? 'from-blue-100 via-blue-50 to-sky-50' : 'from-gray-100 via-gray-50 to-slate-50'} rounded-sm px-4 py-2.5 sm:px-3 sm:py-2 shadow-md`}>
                  <span className="font-bold text-slate-700 text-base sm:text-sm">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner as sticky note */}
        <div className="relative z-10 px-4 sm:px-6 pt-3 sm:pt-4">
          <div className="relative inline-block w-full sm:w-auto" style={{ transform: 'rotate(-0.5deg)' }}>
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-4 sm:h-4 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
              }}
            />
            <div className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-amber-50 rounded-sm px-3 sm:px-4 py-2.5 sm:py-3 shadow-md w-full sm:max-w-3xl">
              <p className="text-sm sm:text-sm text-slate-700">
                {stage === 1
                  ? '💡 Review and edit your items below. Make sure everything looks right before we look up shelf life!'
                  : '✅ Shelf life data from USDA/FDA. Adjust if needed, then add to your fridge.'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="relative z-10 px-6 pt-4">
            <div className="relative inline-block" style={{ transform: 'rotate(0.5deg)' }}>
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #f87171 0%, #dc2626 50%, #991b1b 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                }}
              />
              <div className="bg-gradient-to-br from-red-100 via-red-50 to-rose-50 rounded-sm px-4 py-3 shadow-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Items List - Grid of sticky notes */}
        <div className="flex-1 overflow-y-auto relative z-10 p-4 sm:p-6 pb-24 sm:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item, index) => {
              const colorClass = stickyNoteColors[index % stickyNoteColors.length];
              const magnetColor = magnetColors[index % magnetColors.length];
              const rotation = (index % 3 === 0) ? -1.5 : (index % 3 === 1) ? 1 : -0.5;

              return (
                <div key={item.id} className="relative group">
                  {stage === 1 ? (
                    // Stage 1: Edit parsed items as sticky note
                    <div
                      className="relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      {/* Shadow */}
                      <div className="absolute inset-0 bg-black/20 rounded-sm translate-y-2 translate-x-1" />

                      {/* Magnet */}
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10"
                        style={{
                          background: magnetColor,
                          boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                        }}
                      />

                      {/* Sticky note */}
                      <div className={`relative bg-gradient-to-br ${colorClass} rounded-sm p-5 sm:p-4 shadow-lg`}>
                        {/* Delete button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="space-y-4 sm:space-y-3 pt-2">
                          {/* Name */}
                          <div>
                            <label className="block text-sm sm:text-xs font-medium text-slate-600 mb-1.5 sm:mb-1">Item Name</label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              className="w-full bg-transparent border-b-2 border-slate-300 focus:border-slate-600 px-1 py-2 sm:py-1 text-base sm:text-sm text-slate-800 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Patrick Hand', cursive, sans-serif" }}
                            />
                          </div>

                          {/* Modifier */}
                          <div>
                            <label className="block text-sm sm:text-xs font-medium text-slate-600 mb-1.5 sm:mb-1">Details (optional)</label>
                            <input
                              type="text"
                              value={item.modifier}
                              onChange={(e) => updateItem(item.id, 'modifier', e.target.value)}
                              placeholder="brand, size..."
                              className="w-full bg-transparent border-b border-slate-300 focus:border-slate-600 px-1 py-2 sm:py-1 text-base sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Patrick Hand', cursive, sans-serif" }}
                            />
                          </div>

                          {/* Purchase Date */}
                          <div>
                            <label className="block text-sm sm:text-xs font-medium text-slate-600 mb-1.5 sm:mb-1">Bought On</label>
                            <input
                              type="date"
                              value={item.purchaseDate}
                              onChange={(e) => updateItem(item.id, 'purchaseDate', e.target.value)}
                              max={new Date().toISOString().split('T')[0]}
                              className="w-full bg-white/50 border border-slate-300 rounded px-3 py-2.5 sm:px-2 sm:py-1 text-base sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            />
                          </div>

                          {/* Category & Type */}
                          <div className="grid grid-cols-2 gap-3 sm:gap-2">
                            <div>
                              <label className="block text-sm sm:text-xs font-medium text-slate-600 mb-1.5 sm:mb-1">Category</label>
                              <select
                                value={item.category}
                                onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                className="w-full bg-white/50 border border-slate-300 rounded px-3 py-2.5 sm:px-2 sm:py-1 text-sm sm:text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                              >
                                <option value={Category.DAIRY}>Dairy</option>
                                <option value={Category.MEAT}>Meat</option>
                                <option value={Category.VEGETABLES}>Veggies</option>
                                <option value={Category.FRUITS}>Fruits</option>
                                <option value={Category.BAKERY}>Bakery</option>
                                <option value={Category.FROZEN}>Frozen</option>
                                <option value={Category.PANTRY}>Pantry</option>
                                <option value={Category.BEVERAGES}>Drinks</option>
                                <option value={Category.OTHER}>Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm sm:text-xs font-medium text-slate-600 mb-1.5 sm:mb-1">Type</label>
                              <select
                                value={item.foodType}
                                onChange={(e) => updateItem(item.id, 'foodType', e.target.value)}
                                className="w-full bg-white/50 border border-slate-300 rounded px-3 py-2.5 sm:px-2 sm:py-1 text-sm sm:text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                              >
                                <option value="store-bought">Store</option>
                                <option value="premade">Deli</option>
                                <option value="leftover">Leftover</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Stage 2: Show shelf life with source as sticky note
                    <div
                      className="relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      {/* Shadow */}
                      <div className="absolute inset-0 bg-black/20 rounded-sm translate-y-2 translate-x-1" />

                      {/* Magnet */}
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10"
                        style={{
                          background: magnetColor,
                          boxShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                        }}
                      />

                      {/* Sticky note */}
                      <div className={`relative bg-gradient-to-br ${colorClass} rounded-sm p-4 shadow-lg`}>
                        {/* Delete button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="space-y-3 pt-2">
                          {/* Item name */}
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg" style={{ fontFamily: "'Patrick Hand', cursive, sans-serif" }}>
                              {item.name}
                            </h3>
                            {item.modifier && (
                              <p className="text-sm text-slate-600 mt-1">{item.modifier}</p>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="flex gap-2 flex-wrap">
                            {getSourceBadge(item.source)}
                            {getConfidenceBadge(item.confidence)}
                          </div>

                          {/* Details */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Category:</span>
                              <span className="font-medium text-slate-800">{item.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Type:</span>
                              <span className="font-medium text-slate-800">{item.foodType}</span>
                            </div>
                          </div>

                          {/* Shelf Life Adjuster */}
                          <div className="bg-white/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">Shelf Life:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => adjustShelfLife(item.id, -1)}
                                  className="w-6 h-6 rounded-full bg-slate-300 hover:bg-slate-400 flex items-center justify-center text-slate-700 font-bold transition-colors"
                                >-</button>
                                <span className="font-bold text-emerald-600 min-w-[60px] text-center">{item.shelfLifeDays} days</span>
                                <button
                                  onClick={() => adjustShelfLife(item.id, 1)}
                                  className="w-6 h-6 rounded-full bg-slate-300 hover:bg-slate-400 flex items-center justify-center text-slate-700 font-bold transition-colors"
                                >+</button>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-600">Expires:</span>
                              <span className="font-medium text-slate-800">{item.expiryDate}</span>
                            </div>
                          </div>

                          {/* Storage recommendations */}
                          {item.storageRecommendations && (
                            <div className="text-xs text-slate-700 bg-amber-50 border-l-2 border-amber-400 p-2 rounded">
                              💡 {item.storageRecommendations}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="relative inline-block" style={{ transform: 'rotate(-1deg)' }}>
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #9ca3af 0%, #6b7280 50%, #4b5563 100%)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                  <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-slate-50 rounded-sm px-6 py-4 shadow-md">
                    <p className="text-slate-500">No items to review</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-4 border-t border-slate-500/50 bg-slate-600/30 pb-safe">
          {stage === 1 ? (
            <>
              {onAddMoreItems && (
                <button
                  onClick={() => onAddMoreItems(items)}
                  className="w-full sm:w-auto px-5 py-3.5 sm:py-3 bg-emerald-500/90 hover:bg-emerald-600 backdrop-blur-sm text-white rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 font-medium hover:shadow-emerald-500/30 hover:shadow-xl interactive text-base sm:text-sm"
                  title="Add more items to this batch"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add More
                </button>
              )}
              <button
                onClick={handleGetShelfLife}
                disabled={items.length === 0 || isLoadingShelfLife}
                className="flex-1 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 sm:py-3 px-6 rounded-lg disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 font-semibold text-base sm:text-sm min-h-[48px]"
              >
                {isLoadingShelfLife ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="font-semibold">Looking up shelf life data...</span>
                    </div>
                    <div className="text-xs opacity-90 text-center max-w-md">
                      This typically takes less than a minute
                    </div>
                    {foodFacts.length > 0 && (
                      <div className="mt-2 text-sm opacity-95 text-center max-w-lg px-4 animate-fade-in">
                        <span className="font-medium">💡 Did you know?</span> {foodFacts[currentFactIndex]}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    Get Shelf Life ({items.length})
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
              <button
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm text-slate-200 rounded-lg border border-slate-600/50 shadow-lg transition-all font-medium hover:shadow-xl text-base sm:text-sm min-h-[48px]"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStage(1)}
                className="w-full sm:w-auto px-5 py-3.5 sm:py-3 bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm text-slate-200 rounded-lg border border-slate-600/50 shadow-lg transition-all flex items-center justify-center gap-2 font-medium text-base sm:text-sm min-h-[48px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={items.length === 0}
                className="flex-1 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3.5 sm:py-3 px-6 rounded-lg disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all font-semibold text-base sm:text-sm min-h-[48px]"
              >
                Add to Fridge ({items.length})
              </button>
              <button
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm text-slate-200 rounded-lg border border-slate-600/50 shadow-lg transition-all font-medium text-base sm:text-sm min-h-[48px]"
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
