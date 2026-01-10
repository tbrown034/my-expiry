import { checkStorageStatus, findDuplicates, checkAddLimit, LIMITS } from './validation';

const STORAGE_KEY = 'expiry_groceries';

export const storage = {
  getGroceries: () => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveGroceries: (groceries) => {
    if (typeof window === 'undefined') return { success: false, error: 'Server-side rendering' };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groceries));
      return { success: true };
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        return { success: false, error: 'Storage is full. Please remove some items to continue.', quotaExceeded: true };
      }
      return { success: false, error: 'Failed to save groceries' };
    }
  },

  /**
   * Check storage status before adding items
   * @returns {{ available: boolean, itemCount: number, nearLimit: boolean, atLimit: boolean, reason?: string }}
   */
  checkStatus: () => {
    return checkStorageStatus();
  },

  /**
   * Find potential duplicate items
   * @param {Object} newItem - Item to check for duplicates
   * @returns {Array} - Array of potential duplicates
   */
  findDuplicates: (newItem) => {
    const groceries = storage.getGroceries();
    return findDuplicates(groceries, newItem);
  },

  /**
   * Check if we can add more items
   * @param {number} count - Number of items to add
   * @returns {{ allowed: boolean, warning?: string }}
   */
  canAdd: (count = 1) => {
    const groceries = storage.getGroceries();
    return checkAddLimit(groceries.length, count);
  },

  addGrocery: (grocery) => {
    const groceries = storage.getGroceries();

    // Check if at limit
    const addCheck = checkAddLimit(groceries.length, 1);
    if (!addCheck.allowed) {
      return { success: false, error: addCheck.warning };
    }

    const newGrocery = {
      ...grocery,
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    groceries.push(newGrocery);

    const saveResult = storage.saveGroceries(groceries);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }

    return {
      success: true,
      grocery: newGrocery,
      warning: addCheck.warning  // May contain near-limit warning
    };
  },

  /**
   * Add multiple groceries with validation
   * @param {Array} items - Array of grocery items
   * @returns {{ success: boolean, added: Array, error?: string, warning?: string }}
   */
  addGroceries: (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return { success: false, added: [], error: 'No items to add' };
    }

    const groceries = storage.getGroceries();

    // Check if we can add all items
    const addCheck = checkAddLimit(groceries.length, items.length);
    if (!addCheck.allowed) {
      return { success: false, added: [], error: addCheck.warning };
    }

    const newGroceries = items.map(item => ({
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    groceries.push(...newGroceries);

    const saveResult = storage.saveGroceries(groceries);
    if (!saveResult.success) {
      return { success: false, added: [], error: saveResult.error };
    }

    return {
      success: true,
      added: newGroceries,
      warning: addCheck.warning
    };
  },

  updateGrocery: (id, updates) => {
    const groceries = storage.getGroceries();
    const index = groceries.findIndex(g => g.id === id);
    if (index !== -1) {
      groceries[index] = {
        ...groceries[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      storage.saveGroceries(groceries);
      return groceries[index];
    }
    return null;
  },

  deleteGrocery: (id) => {
    const groceries = storage.getGroceries();
    const filtered = groceries.filter(g => g.id !== id);
    storage.saveGroceries(filtered);
    return filtered;
  },

  clearAllGroceries: () => {
    storage.saveGroceries([]);
    return [];
  },

  markAsEaten: (id) => {
    const groceries = storage.getGroceries();
    const index = groceries.findIndex(g => g.id === id);
    if (index !== -1) {
      groceries[index] = {
        ...groceries[index],
        eaten: true,
        eatenAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storage.saveGroceries(groceries);
      return groceries[index];
    }
    return null;
  },

  markAsExpired: (id) => {
    const groceries = storage.getGroceries();
    const index = groceries.findIndex(g => g.id === id);
    if (index !== -1) {
      groceries[index] = {
        ...groceries[index],
        markedExpired: true,
        updatedAt: new Date().toISOString()
      };
      storage.saveGroceries(groceries);
      return groceries[index];
    }
    return null;
  },

  deleteByPurchaseDate: (purchaseDate) => {
    const groceries = storage.getGroceries();
    const filtered = groceries.filter(g => g.purchaseDate !== purchaseDate);
    storage.saveGroceries(filtered);
    return filtered;
  }
};