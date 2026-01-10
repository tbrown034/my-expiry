'use client';

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { storage } from '../../lib/storage';
import { calculateDaysUntilExpiry, getExpiryStatus } from '../../lib/utils';

const GroceryContext = createContext(null);

// Action types
const ACTIONS = {
  SET: 'SET',
  ADD: 'ADD',
  ADD_BATCH: 'ADD_BATCH',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DELETE_BY_PURCHASE_DATE: 'DELETE_BY_PURCHASE_DATE',
  CLEAR: 'CLEAR',
  MARK_EATEN: 'MARK_EATEN',
  MARK_EXPIRED: 'MARK_EXPIRED',
};

function groceryReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET:
      return action.groceries;
    case ACTIONS.ADD:
      return [...state, action.grocery];
    case ACTIONS.ADD_BATCH:
      return [...state, ...action.groceries];
    case ACTIONS.UPDATE:
      return state.map(g => g.id === action.id ? { ...g, ...action.updates } : g);
    case ACTIONS.DELETE:
      return state.filter(g => g.id !== action.id);
    case ACTIONS.DELETE_BY_PURCHASE_DATE:
      return state.filter(g => g.purchaseDate !== action.purchaseDate);
    case ACTIONS.CLEAR:
      return [];
    case ACTIONS.MARK_EATEN:
      return state.map(g => g.id === action.id ? { ...g, eaten: true, eatenAt: action.eatenAt } : g);
    case ACTIONS.MARK_EXPIRED:
      return state.map(g => g.id === action.id ? { ...g, markedExpired: true } : g);
    default:
      return state;
  }
}

// Helper to enrich grocery with computed fields
function enrichGrocery(grocery) {
  const daysUntilExpiry = calculateDaysUntilExpiry(grocery.expiryDate);
  return {
    ...grocery,
    daysUntilExpiry,
    status: getExpiryStatus(daysUntilExpiry),
  };
}

export function GroceryProvider({ children }) {
  const [groceries, dispatch] = useReducer(groceryReducer, []);

  // Load groceries on mount and refresh every 60 seconds
  useEffect(() => {
    const loadGroceries = () => {
      try {
        const stored = storage.getGroceries();
        const enriched = stored.map(enrichGrocery);
        dispatch({ type: ACTIONS.SET, groceries: enriched });
      } catch {
        // Silent fail - toast will be shown by consuming component if needed
      }
    };

    loadGroceries();
    const interval = setInterval(loadGroceries, 60000);
    return () => clearInterval(interval);
  }, []);

  // Add single grocery
  const addGrocery = useCallback((groceryData, batchMetadata = null) => {
    try {
      const metadata = batchMetadata || {
        source: 'manual',
        batchId: Date.now().toString(),
        addedAt: new Date().toISOString(),
      };

      const saved = storage.addGrocery({
        ...groceryData,
        batchMetadata: metadata,
      });

      const enriched = enrichGrocery(saved);
      dispatch({ type: ACTIONS.ADD, grocery: enriched });
      return { success: true, grocery: enriched };
    } catch {
      return { success: false, error: 'Failed to add grocery item' };
    }
  }, []);

  // Add batch of groceries
  const addBatch = useCallback((items, source = 'manual', storeName = null) => {
    try {
      const batchId = Date.now().toString();
      const batchMetadata = {
        source,
        storeName,
        batchId,
        addedAt: new Date().toISOString(),
      };

      const savedItems = items.map(item => {
        const saved = storage.addGrocery({
          ...item,
          batchMetadata,
        });
        return enrichGrocery(saved);
      });

      dispatch({ type: ACTIONS.ADD_BATCH, groceries: savedItems });
      return { success: true, count: savedItems.length };
    } catch {
      return { success: false, error: 'Failed to add items' };
    }
  }, []);

  // Update grocery
  const updateGrocery = useCallback((id, updates) => {
    try {
      const saved = storage.updateGrocery(id, updates);
      if (saved) {
        const enriched = enrichGrocery(saved);
        dispatch({ type: ACTIONS.UPDATE, id, updates: enriched });
        return { success: true, grocery: enriched };
      }
      return { success: false, error: 'Item not found' };
    } catch {
      return { success: false, error: 'Failed to update item' };
    }
  }, []);

  // Delete grocery
  const deleteGrocery = useCallback((id) => {
    try {
      storage.deleteGrocery(id);
      dispatch({ type: ACTIONS.DELETE, id });
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to delete item' };
    }
  }, []);

  // Delete by purchase date (shopping trip)
  const deleteByPurchaseDate = useCallback((purchaseDate) => {
    try {
      storage.deleteByPurchaseDate(purchaseDate);
      dispatch({ type: ACTIONS.DELETE_BY_PURCHASE_DATE, purchaseDate });
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to delete shopping trip' };
    }
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    try {
      storage.clearAllGroceries();
      dispatch({ type: ACTIONS.CLEAR });
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to clear groceries' };
    }
  }, []);

  // Mark as eaten
  const markAsEaten = useCallback((id) => {
    try {
      const updated = storage.markAsEaten(id);
      if (updated) {
        dispatch({ type: ACTIONS.MARK_EATEN, id, eatenAt: updated.eatenAt });
        return { success: true };
      }
      return { success: false, error: 'Item not found' };
    } catch {
      return { success: false, error: 'Failed to mark as eaten' };
    }
  }, []);

  // Mark as expired
  const markAsExpired = useCallback((id) => {
    try {
      const updated = storage.markAsExpired(id);
      if (updated) {
        dispatch({ type: ACTIONS.MARK_EXPIRED, id });
        return { success: true };
      }
      return { success: false, error: 'Item not found' };
    } catch {
      return { success: false, error: 'Failed to mark as expired' };
    }
  }, []);

  // Get grocery by ID
  const getGroceryById = useCallback((id) => {
    return groceries.find(g => g.id === id) || null;
  }, [groceries]);

  const value = {
    groceries,
    addGrocery,
    addBatch,
    updateGrocery,
    deleteGrocery,
    deleteByPurchaseDate,
    clearAll,
    markAsEaten,
    markAsExpired,
    getGroceryById,
  };

  return (
    <GroceryContext.Provider value={value}>
      {children}
    </GroceryContext.Provider>
  );
}

export function useGroceries() {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGroceries must be used within a GroceryProvider');
  }
  return context;
}
