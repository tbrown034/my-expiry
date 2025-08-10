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

export default function MainClient({ session }) {
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
          session={session}
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
        <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div 
                  onClick={handleLogoClick}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-3 ${
                    showEasterEgg ? 'animate-bounce' : ''
                  }`}
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-green-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    My Expiry
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Track • Save • Thrive
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLanding(true)}
                className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200 rounded-xl font-semibold text-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {Array.isArray(groceries) && groceries.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="relative bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800">{groceries.length || 0}</div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-2">Total Items</div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-1000 ease-out" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-white/95 backdrop-blur-sm border border-red-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                    <span className="text-lg">⚠️</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-red-600">{groceries.filter(g => g?.status === 'expired').length || 0}</div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-2">Expired</div>
                <div className="w-full h-2 bg-red-50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-1000 ease-out" style={{width: `${groceries.length ? (groceries.filter(g => g?.status === 'expired').length / groceries.length) * 100 : 0}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-white/95 backdrop-blur-sm border border-amber-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                    <span className="text-lg">⏰</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600">{groceries.filter(g => g?.status === 'expiring_soon').length || 0}</div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-2">Expiring Soon</div>
                <div className="w-full h-2 bg-amber-50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000 ease-out" style={{width: `${groceries.length ? (groceries.filter(g => g?.status === 'expiring_soon').length / groceries.length) * 100 : 0}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-white/95 backdrop-blur-sm border border-green-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{groceries.filter(g => g?.status === 'fresh').length || 0}</div>
                </div>
                <div className="text-sm font-medium text-gray-600 mb-2">Fresh</div>
                <div className="w-full h-2 bg-green-50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out" style={{width: `${groceries.length ? (groceries.filter(g => g?.status === 'fresh').length / groceries.length) * 100 : 0}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <button
            onClick={() => setShowAddForm(true)}
            className="relative bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-left group overflow-hidden transform hover:scale-[1.02]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors">Add Single Item</h3>
                <p className="text-sm text-gray-600 leading-relaxed">AI-powered shelf life detection with smart recommendations</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600 font-medium">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  Most Popular
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowBatchForm(true)}
            className="relative bg-white/95 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-left group overflow-hidden transform hover:scale-[1.02]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-700 transition-colors">Batch Add Items</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Add multiple items at once with bulk processing</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-blue-600 font-medium">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Time Saver
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowDocumentUpload(true)}
            className="relative bg-white/95 backdrop-blur-sm border border-purple-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-left group overflow-hidden transform hover:scale-[1.02]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-700 transition-colors">Upload Receipt</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Scan receipts and photos with AI recognition</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-purple-600 font-medium">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  PDF Support
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              NEW
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
          <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="p-6">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">Your Groceries</h2>
                  <p className="text-sm text-gray-600">Manage and track your food inventory</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 shadow-sm"
                  >
                    <option value="expiry">Sort by Expiry</option>
                    <option value="name">Sort by Name</option>
                    <option value="category">Sort by Category</option>
                    <option value="purchase-date">Sort by Purchase Date</option>
                  </select>
                  
                  <button
                    onClick={handleGetFreshnessInfo}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center gap-2 disabled:opacity-50 transform hover:scale-105"
                  >
                    {isAnalyzing && <ButtonSpinner color="white" size="xs" />}
                    {isAnalyzing ? 'Analyzing...' : '🔍 Get Freshness Info'}
                  </button>

                  <button
                    onClick={() => showFunAlert('construction')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm transform hover:scale-105"
                  >
                    🎨 Style Mode
                  </button>
                  
                  <button
                    onClick={handleClearAll}
                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm transform hover:scale-105"
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
              
              {/* Enhanced Category Legend */}
              <div className="bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🏷️</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Category Guide</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-green-100">
                    <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">Vegetables</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-orange-100">
                    <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">Fruits</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-red-100">
                    <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-500 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">Meat</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-blue-100">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">Dairy</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-lime-100">
                    <div className="w-3 h-3 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">Pantry</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-purple-100">
                    <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">Beverages</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-yellow-100">
                    <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">Leftovers</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100">
                    <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-gray-700">Other</span>
                  </div>
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
