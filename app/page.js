'use client';

import { useState, useEffect, useCallback } from 'react';
import GroceryList from './components/GroceryList';
import AddGroceryForm from './components/AddGroceryForm';
import BatchAddGroceryForm from './components/BatchAddGroceryForm';
import ReceiptUpload from './components/ReceiptUpload';
import GroceryItemPopup from './components/GroceryItemPopup';
import DocumentAnalysisPopup from './components/DocumentAnalysisPopup';
import BatchGroceryPopup from './components/BatchGroceryPopup';
import GroceryAnalysisPopup from './components/GroceryAnalysisPopup';
import Toast from './components/Toast';
import { storage } from '../lib/storage';
import { calculateDaysUntilExpiry, getExpiryStatus, sortGroceries, getCategoryColorClass } from '../lib/utils';

export default function Home() {
  const [groceries, setGroceries] = useState([]);
  const [sortBy, setSortBy] = useState('expiry');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showGroceryPopup, setShowGroceryPopup] = useState(false);
  const [showBatchPopup, setShowBatchPopup] = useState(false);
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [pendingGroceryItem, setPendingGroceryItem] = useState(null);
  const [batchShelfLifeResult, setBatchShelfLifeResult] = useState(null);
  const [documentAnalysisResult, setDocumentAnalysisResult] = useState(null);
  const [isLoadingShelfLife, setIsLoadingShelfLife] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    const loadGroceries = () => {
      try {
        const stored = storage.getGroceries();
        const updated = stored.map(grocery => ({
          ...grocery,
          daysUntilExpiry: calculateDaysUntilExpiry(grocery.expiryDate),
          status: getExpiryStatus(calculateDaysUntilExpiry(grocery.expiryDate))
        }));
        setGroceries(sortGroceries(updated, sortBy));
      } catch (error) {
        console.error('Error loading groceries:', error);
        showToast('Failed to load groceries', 'error');
      }
    };

    loadGroceries();
    const interval = setInterval(loadGroceries, 60000);
    return () => clearInterval(interval);
  }, [sortBy, showToast]);

  useEffect(() => {
    setGroceries(prev => sortGroceries(prev, sortBy));
  }, [sortBy]);

  const handleAddGrocery = (newGrocery) => {
    try {
      const grocery = storage.addGrocery({
        ...newGrocery,
        daysUntilExpiry: calculateDaysUntilExpiry(newGrocery.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(newGrocery.expiryDate))
      });
      setGroceries(prev => sortGroceries([...prev, grocery], sortBy));
      setShowAddForm(false);
      showToast('Grocery item added successfully!', 'success');
    } catch (error) {
      console.error('Error adding grocery:', error);
      showToast('Failed to add grocery item. Please try again.', 'error');
    }
  };

  const handleDeleteGrocery = useCallback((id) => {
    try {
      storage.deleteGrocery(id);
      setGroceries(prev => prev.filter(g => g.id !== id));
      showToast('Grocery item deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting grocery:', error);
      showToast('Failed to delete grocery item. Please try again.', 'error');
    }
  }, [showToast]);

  const handleAddGroceryWithAI = async (itemName) => {
    if (!itemName.trim()) return;
    
    setIsLoadingShelfLife(true);
    try {
      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: itemName.trim() })
      });

      if (!response.ok) throw new Error('Failed to get shelf life');
      
      const shelfLifeData = await response.json();
      setPendingGroceryItem(shelfLifeData);
      setShowGroceryPopup(true);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error getting shelf life:', error);
      showToast('Could not get shelf life information. Please try again.', 'error');
    } finally {
      setIsLoadingShelfLife(false);
    }
  };

  const handleConfirmGroceryItem = (groceryData) => {
    const grocery = storage.addGrocery({
      ...groceryData,
      daysUntilExpiry: calculateDaysUntilExpiry(groceryData.expiryDate),
      status: getExpiryStatus(calculateDaysUntilExpiry(groceryData.expiryDate))
    });
    setGroceries(prev => sortGroceries([...prev, grocery], sortBy));
    setShowGroceryPopup(false);
    setPendingGroceryItem(null);
  };

  const handleBatchAddGrocery = async (itemNames) => {
    if (!itemNames || itemNames.length === 0) return;
    
    setIsLoadingShelfLife(true);
    try {
      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemNames: itemNames })
      });

      if (!response.ok) throw new Error('Failed to get shelf life');
      
      const batchResult = await response.json();
      setBatchShelfLifeResult(batchResult);
      setShowBatchPopup(true);
      setShowBatchForm(false);
    } catch (error) {
      console.error('Error getting batch shelf life:', error);
      showToast('Could not get shelf life information for some items. Please try again.', 'error');
    } finally {
      setIsLoadingShelfLife(false);
    }
  };

  const handleConfirmBatchItems = (itemsToAdd) => {
    const addedItems = itemsToAdd.map(item => {
      const grocery = storage.addGrocery({
        ...item,
        daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
      });
      return grocery;
    });
    
    setGroceries(prev => sortGroceries([...prev, ...addedItems], sortBy));
    setShowBatchPopup(false);
    setBatchShelfLifeResult(null);
  };

  const handleReceiptAnalyzed = (analysisResult) => {
    setDocumentAnalysisResult(analysisResult);
    setShowDocumentPopup(true);
    setShowDocumentUpload(false);
  };

  const handleConfirmDocumentItems = (itemsToAdd) => {
    const addedItems = itemsToAdd.map(item => {
      const grocery = storage.addGrocery({
        ...item,
        daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
      });
      return grocery;
    });
    
    setGroceries(prev => sortGroceries([...prev, ...addedItems], sortBy));
    setShowDocumentPopup(false);
    setDocumentAnalysisResult(null);
  };

  const handleGetFreshnessInfo = async () => {
    if (groceries.length === 0) {
      showToast('No groceries to analyze', 'warning');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/get-freshness-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groceries })
      });

      if (!response.ok) throw new Error('Failed to get freshness information');
      
      const result = await response.json();
      setAnalysisResult(result);
      setShowAnalysisPopup(true);
      showToast('Freshness information retrieved successfully!', 'success');
    } catch (error) {
      console.error('Error getting freshness information:', error);
      showToast('Could not get freshness information. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all groceries? This action cannot be undone.')) {
      try {
        storage.clearAllGroceries();
        setGroceries([]);
        showToast('All groceries cleared successfully', 'success');
      } catch (error) {
        console.error('Error clearing groceries:', error);
        showToast('Failed to clear groceries. Please try again.', 'error');
      }
    }
  };

  const handleEditGrocery = useCallback((id) => {
    console.log('clicked edit button for item:', id);
    showToast('Edit functionality coming soon!', 'info');
  }, [showToast]);

  return (
    <div className="min-h-screen bg-white relative">
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            My Expiry
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Smart food waste prevention with AI-powered expiry tracking
          </p>
        </div>

        {/* Quick Stats */}
        {Array.isArray(groceries) && groceries.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="border-4 border-gray-400 rounded-lg p-3">
              <div className="text-xl sm:text-2xl font-semibold text-gray-900">{groceries.length || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total</div>
            </div>
            <div className="border-4 border-red-400 rounded-lg p-3">
              <div className="text-xl sm:text-2xl font-semibold text-red-600">{groceries.filter(g => g?.status === 'expired').length || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Expired</div>
            </div>
            <div className="border-4 border-orange-400 rounded-lg p-3">
              <div className="text-xl sm:text-2xl font-semibold text-orange-600">{groceries.filter(g => g?.status === 'expiring_soon').length || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Expiring Soon</div>
            </div>
            <div className="border-4 border-green-400 rounded-lg p-3">
              <div className="text-xl sm:text-2xl font-semibold text-green-600">{groceries.filter(g => g?.status === 'fresh').length || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Fresh</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="border-4 border-gray-400 rounded-lg p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Add Single Item</div>
              <div className="text-xs sm:text-sm text-gray-600">AI-powered shelf life detection</div>
            </div>
          </button>

          <button
            onClick={() => setShowBatchForm(true)}
            className="border-4 border-gray-400 rounded-lg p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Batch Add Items</div>
              <div className="text-xs sm:text-sm text-gray-600">Add multiple items at once</div>
            </div>
          </button>

          <button
            onClick={() => setShowDocumentUpload(true)}
            className="border-4 border-gray-400 rounded-lg p-4 hover:bg-gray-50 transition-colors relative"
          >
            <div className="text-left">
              <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Upload Receipt</div>
              <div className="text-xs sm:text-sm text-gray-600">Scan receipts and photos</div>
            </div>
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded font-medium">
              PDF
            </div>
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Grocery</h2>
              <AddGroceryForm 
                onSubmit={handleAddGrocery}
                onSubmitWithAI={handleAddGroceryWithAI}
                onCancel={() => setShowAddForm(false)}
                isLoadingShelfLife={isLoadingShelfLife}
              />
            </div>
          </div>
        )}

        {showBatchForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-2xl">
              <BatchAddGroceryForm 
                onBatchSubmit={handleBatchAddGrocery}
                onCancel={() => setShowBatchForm(false)}
                isLoadingShelfLife={isLoadingShelfLife}
              />
            </div>
          </div>
        )}

        {showDocumentUpload && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload Receipt</h2>
              <ReceiptUpload 
                onReceiptAnalyzed={handleReceiptAnalyzed}
                onClose={() => setShowDocumentUpload(false)}
                showToast={showToast}
              />
            </div>
          </div>
        )}

        {showGroceryPopup && pendingGroceryItem && (
          <GroceryItemPopup
            item={pendingGroceryItem}
            onConfirm={handleConfirmGroceryItem}
            onCancel={() => {
              setShowGroceryPopup(false);
              setPendingGroceryItem(null);
            }}
          />
        )}

        {showBatchPopup && batchShelfLifeResult && (
          <BatchGroceryPopup
            batchResult={batchShelfLifeResult}
            onConfirm={handleConfirmBatchItems}
            onCancel={() => {
              setShowBatchPopup(false);
              setBatchShelfLifeResult(null);
            }}
          />
        )}

        {showDocumentPopup && documentAnalysisResult && (
          <DocumentAnalysisPopup
            analysisResult={documentAnalysisResult}
            onConfirm={handleConfirmDocumentItems}
            onCancel={() => {
              setShowDocumentPopup(false);
              setDocumentAnalysisResult(null);
            }}
          />
        )}

        {showAnalysisPopup && analysisResult && (
          <GroceryAnalysisPopup
            analysisResult={analysisResult}
            onClose={() => {
              setShowAnalysisPopup(false);
              setAnalysisResult(null);
            }}
          />
        )}

        {groceries.length > 0 && (
          <div className="border-4 border-gray-400 rounded-lg p-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Your Groceries</h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-4 border-gray-400 rounded-md px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <option value="expiry">Sort by Expiry</option>
                  <option value="name">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                  <option value="purchase-date">Sort by Purchase Date</option>
                </select>
                
                <button
                  onClick={handleGetFreshnessInfo}
                  disabled={isAnalyzing}
                  className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-xs sm:text-sm w-full sm:w-auto"
                >
                  {isAnalyzing ? 'Getting info...' : 'Get Freshness Info'}
                </button>

                <button
                  onClick={handleClearAll}
                  className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm w-full sm:w-auto"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            {/* Category Legend */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-600 pt-3 border-t border-gray-200">
              <span className="font-medium text-xs">Categories:</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                <span>Vegetables</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-sm"></div>
                <span>Fruits</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
                <span>Meat</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                <span>Dairy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-lime-500 rounded-sm"></div>
                <span>Pantry</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-sm"></div>
                <span>Beverages</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-sm"></div>
                <span>Other</span>
              </div>
            </div>
          </div>
        )}

        <GroceryList 
          groceries={groceries}
          onDelete={handleDeleteGrocery}
          onEdit={handleEditGrocery}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </div>
  );
}
