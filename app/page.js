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
import EditGroceryModal from './components/EditGroceryModal';
import GroceryDetailModal from './components/GroceryDetailModal';
import LandingPage from './components/LandingPage';
import Toast from './components/Toast';
import FunAlert from './components/FunAlert';
import { ButtonSpinner } from './components/LoadingSpinner';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGrocery, setEditingGrocery] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailGrocery, setDetailGrocery] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
  const [funAlert, setFunAlert] = useState({ isOpen: false, type: 'construction' });
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

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
    const grocery = groceries.find(g => g.id === id);
    if (grocery) {
      setEditingGrocery(grocery);
      setShowEditModal(true);
    }
  }, [groceries]);

  const handleSaveEditedGrocery = (updatedData) => {
    try {
      const updatedGrocery = {
        ...updatedData,
        daysUntilExpiry: calculateDaysUntilExpiry(updatedData.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(updatedData.expiryDate))
      };
      
      const saved = storage.updateGrocery(editingGrocery.id, updatedGrocery);
      if (saved) {
        setGroceries(prev => 
          sortGroceries(
            prev.map(g => g.id === editingGrocery.id ? saved : g), 
            sortBy
          )
        );
        setShowEditModal(false);
        setEditingGrocery(null);
        showToast('Grocery item updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating grocery:', error);
      showToast('Failed to update grocery item. Please try again.', 'error');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingGrocery(null);
  };

  const handleShowDetail = useCallback((id) => {
    const grocery = groceries.find(g => g.id === id);
    if (grocery) {
      setDetailGrocery(grocery);
      setShowDetailModal(true);
    }
  }, [groceries]);

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setDetailGrocery(null);
  };

  const handleStartTracking = (quickAnswerItem = null) => {
    if (quickAnswerItem) {
      try {
        const grocery = storage.addGrocery({
          ...quickAnswerItem,
          daysUntilExpiry: calculateDaysUntilExpiry(quickAnswerItem.expiryDate),
          status: getExpiryStatus(calculateDaysUntilExpiry(quickAnswerItem.expiryDate))
        });
        setGroceries(prev => sortGroceries([...prev, grocery], sortBy));
        showToast('Item added from quick check!', 'success');
      } catch (error) {
        console.error('Error adding quick item:', error);
        showToast('Failed to add item. Please try again.', 'error');
      }
    }
    setShowLanding(false);
  };

  const handleSignIn = () => {
    showToast('Sign in functionality coming soon!', 'info');
  };

  const handleSignUp = () => {
    showToast('Sign up functionality coming soon!', 'info');
  };

  const showFunAlert = (type = 'construction') => {
    setFunAlert({ isOpen: true, type });
  };

  const closeFunAlert = () => {
    setFunAlert({ isOpen: false, type: 'construction' });
  };

  const handleLogoClick = () => {
    setEasterEggClicks(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setShowEasterEgg(true);
        showToast('🎉 You found the secret! Enjoy the rainbow mode! 🌈', 'success');
        setTimeout(() => setShowEasterEgg(false), 10000); // Hide after 10 seconds
        return 0; // Reset counter
      }
      return newCount;
    });
  };

  if (showLanding) {
    return (
      <>
        <LandingPage 
          onStartTracking={handleStartTracking}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 relative">
      {/* Back to Landing Button - Integrated into header */}
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up hover-lift">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div 
                  onClick={handleLogoClick}
                  className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover-lift hover-glow transition-all duration-300 ${
                    showEasterEgg ? 'hover-rainbow animate-heartbeat' : ''
                  }`}
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-300">
                    My Expiry
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 opacity-80">
                    Smart food waste prevention
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLanding(true)}
                className="border-2 border-gray-300 hover:border-emerald-400 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 hover-lift"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {Array.isArray(groceries) && groceries.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 text-center hover-lift hover-glow group">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 group-hover:animate-bounce-gentle">{groceries.length || 0}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Total Items</div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-700" style={{width: '100%'}}></div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 text-center hover-lift group">
              <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1 group-hover:animate-shake">{groceries.filter(g => g?.status === 'expired').length || 0}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Expired</div>
              <div className="w-full h-1.5 bg-red-100 rounded-full mt-3 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-700" style={{width: `${groceries.length ? (groceries.filter(g => g?.status === 'expired').length / groceries.length) * 100 : 0}%`}}></div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 text-center hover-lift group">
              <div className="text-xl sm:text-2xl font-bold text-amber-600 mb-1 group-hover:animate-wiggle">{groceries.filter(g => g?.status === 'expiring_soon').length || 0}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Expiring Soon</div>
              <div className="w-full h-1.5 bg-amber-100 rounded-full mt-3 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700" style={{width: `${groceries.length ? (groceries.filter(g => g?.status === 'expiring_soon').length / groceries.length) * 100 : 0}%`}}></div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 text-center hover-lift hover-glow group">
              <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1 group-hover:animate-heartbeat">{groceries.filter(g => g?.status === 'fresh').length || 0}</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">Fresh</div>
              <div className="w-full h-1.5 bg-green-100 rounded-full mt-3 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700" style={{width: `${groceries.length ? (groceries.filter(g => g?.status === 'fresh').length / groceries.length) * 100 : 0}%`}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 text-left group hover-lift hover-glow"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300 group-hover:animate-bounce-gentle">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 group-hover:text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">Add Single Item</div>
                <div className="text-xs sm:text-sm text-gray-600">AI-powered shelf life detection</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowBatchForm(true)}
            className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 text-left group hover-lift hover-glow"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 group-hover:animate-wiggle">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-blue-700 transition-colors">Batch Add Items</div>
                <div className="text-xs sm:text-sm text-gray-600">Add multiple items at once</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowDocumentUpload(true)}
            className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 text-left group hover-lift hover-glow relative overflow-hidden"
          >
            <div className="flex items-start gap-3 sm:gap-4 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 group-hover:animate-float">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 group-hover:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-purple-700 transition-colors">Upload Receipt</div>
                <div className="text-xs sm:text-sm text-gray-600">Scan receipts and photos</div>
              </div>
            </div>
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md border border-white/20 animate-pulse">
              PDF
            </div>
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-spin-slow">📷</div>
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

        {showEditModal && editingGrocery && (
          <EditGroceryModal
            grocery={editingGrocery}
            onSave={handleSaveEditedGrocery}
            onCancel={handleCancelEdit}
          />
        )}

        {showDetailModal && detailGrocery && (
          <GroceryDetailModal
            grocery={detailGrocery}
            onEdit={handleEditGrocery}
            onDelete={handleDeleteGrocery}
            onClose={handleCloseDetail}
          />
        )}

        {groceries.length > 0 && (
          <div className="bg-white border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Groceries</h2>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-medium text-sm px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <option value="expiry">Sort by Expiry</option>
                    <option value="name">Sort by Name</option>
                    <option value="category">Sort by Category</option>
                    <option value="purchase-date">Sort by Purchase Date</option>
                  </select>
                  
                  <button
                    onClick={handleGetFreshnessInfo}
                    disabled={isAnalyzing}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzing && <ButtonSpinner color="white" size="xs" />}
                    {isAnalyzing ? 'Analyzing...' : 'Get Freshness Info'}
                  </button>

                  <button
                    onClick={() => showFunAlert('construction')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm hover-lift shadow-lg hover:shadow-xl"
                  >
                    🎨 Style Mode
                  </button>
                  
                  <button
                    onClick={handleClearAll}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm hover-lift shadow-lg hover:shadow-xl"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              {/* Category Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 pt-4 border-t border-gray-200">
                <span className="font-semibold text-gray-700">Categories:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span>Vegetables</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                  <span>Fruits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <span>Meat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  <span>Dairy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-lime-500 rounded-full"></div>
                  <span>Pantry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                  <span>Beverages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                  <span>Leftovers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
                  <span>Other</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <GroceryList 
          groceries={groceries}
          onDelete={handleDeleteGrocery}
          onEdit={handleEditGrocery}
          onShowDetail={handleShowDetail}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
        
        <FunAlert 
          isOpen={funAlert.isOpen} 
          onClose={closeFunAlert} 
          type={funAlert.type} 
        />
      </div>
    </div>
  );
}
