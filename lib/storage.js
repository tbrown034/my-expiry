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
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groceries));
    } catch (error) {
      console.error('Failed to save groceries:', error);
    }
  },

  addGrocery: (grocery) => {
    const groceries = storage.getGroceries();
    const newGrocery = {
      ...grocery,
      id: typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    groceries.push(newGrocery);
    storage.saveGroceries(groceries);
    return newGrocery;
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
  }
};