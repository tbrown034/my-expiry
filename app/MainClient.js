'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserFriendlyMessage } from '../lib/errorHandling';
import FridgeDoor from './components/FridgeDoor';
import FoodInventory from './components/FoodInventory';
import AddGroceryForm from './components/AddGroceryForm';
import BatchAddGroceryForm from './components/BatchAddGroceryForm';
import ReceiptUpload from './components/ReceiptUpload';
import GroceryItemPopup from './components/GroceryItemPopup';
import DocumentAnalysisPopup from './components/DocumentAnalysisPopup';
import BatchGroceryPopup from './components/BatchGroceryPopup';
import GroceryAnalysisPopup from './components/GroceryAnalysisPopup';
import EditGroceryModal from './components/EditGroceryModal';
import GroceryDetailModal from './components/GroceryDetailModal';
import HomePage from './components/HomePage';
import AddToFridgePage from './components/AddToFridgePage';
import TypeItemsPage from './components/TypeItemsPage';
import LandingPage from './components/LandingPage';
import Toast from './components/Toast';
import FunAlert from './components/FunAlert';
import Modal from './components/Modal';
import ConfirmationModal from './components/ConfirmationModal';
import { motion, AnimatePresence } from 'motion/react';
import { variants } from '../lib/motionVariants';
import { storage } from '../lib/storage';
import { calculateDaysUntilExpiry, getExpiryStatus, sortGroceries, getCategoryColorClass } from '../lib/utils';

export default function MainClient() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'add', 'fridge'
  const [previousView, setPreviousView] = useState(null);
  const [groceries, setGroceries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showGroceryPopup, setShowGroceryPopup] = useState(false);
  const [showBatchPopup, setShowBatchPopup] = useState(false);
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [pendingGroceryItem, setPendingGroceryItem] = useState(null);
  const [batchShelfLifeResult, setBatchShelfLifeResult] = useState(null);
  const [pendingBatchItems, setPendingBatchItems] = useState(null); // For "add more items" flow
  const [documentAnalysisResult, setDocumentAnalysisResult] = useState(null);
  const [isLoadingShelfLife, setIsLoadingShelfLife] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGrocery, setEditingGrocery] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailGrocery, setDetailGrocery] = useState(null);
  const [showLanding, setShowLanding] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
  const [funAlert, setFunAlert] = useState({ isOpen: false, type: 'construction' });
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

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
        setGroceries(updated);
      } catch (error) {
        console.error('Error loading groceries:', error);
        showToast('Failed to load groceries', 'error');
      }
    };

    loadGroceries();
    const interval = setInterval(loadGroceries, 60000);
    return () => clearInterval(interval);
  }, [showToast]);

  const handleAddGrocery = (newGrocery) => {
    try {
      const grocery = storage.addGrocery({
        ...newGrocery,
        daysUntilExpiry: calculateDaysUntilExpiry(newGrocery.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(newGrocery.expiryDate))
      });
      setGroceries(prev => [...prev, grocery]);
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
    const batchMetadata = {
      source: 'manual',
      batchId: Date.now().toString(),
      addedAt: new Date().toISOString()
    };

    const grocery = storage.addGrocery({
      ...groceryData,
      batchMetadata,
      daysUntilExpiry: calculateDaysUntilExpiry(groceryData.expiryDate),
      status: getExpiryStatus(calculateDaysUntilExpiry(groceryData.expiryDate))
    });
    setGroceries(prev => [...prev, grocery]);
    setShowGroceryPopup(false);
    setPendingGroceryItem(null);
    setShowAddForm(false);
    showToast('Item added! Viewing your fridge...', 'success');
    setCurrentView('fridge');
  };

  const handleBatchAddGrocery = async (itemNames) => {
    if (!itemNames || itemNames.length === 0) return;

    setIsLoadingShelfLife(true);
    try {
      // Stage 1: Parse items (interpret user input)
      const response = await fetch('/api/parse-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemNames })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Parse items API error:', errorData);
        const error = new Error(errorData.error || errorData.details || 'Failed to parse items');
        throw error;
      }

      const parseResult = await response.json();

      // If we have pending items from "Add More" flow, merge them
      if (pendingBatchItems && pendingBatchItems.length > 0) {
        const mergedItems = [
          ...pendingBatchItems,
          ...parseResult.items.map((item, index) => ({
            ...item,
            id: pendingBatchItems.length + index // Ensure unique IDs
          }))
        ];
        setBatchShelfLifeResult({ ...parseResult, items: mergedItems });
        setPendingBatchItems(null); // Clear pending items
      } else {
        setBatchShelfLifeResult(parseResult); // Contains parsed items without shelf life
      }

      setShowBatchPopup(true);
      setShowBatchForm(false);
    } catch (error) {
      console.error('❌ Error parsing items:', error);
      const userMessage = getUserFriendlyMessage(error, 'parse-items');
      showToast(userMessage, 'error');
    } finally {
      setIsLoadingShelfLife(false);
    }
  };

  const handleAddMoreItems = (currentItems) => {
    // Store current items and navigate back to type page
    setPendingBatchItems(currentItems);
    setShowBatchPopup(false);
    setBatchShelfLifeResult(null);
    // User is already on 'type' view, so they'll see the TypeItemsPage again
  };

  const handleTypeItemsSubmit = async (itemNames) => {
    // Handle submission from TypeItemsPage by calling batch add
    await handleBatchAddGrocery(itemNames);
  };

  const handleConfirmBatchItems = (itemsToAdd) => {
    const batchId = Date.now().toString();
    const batchMetadata = {
      source: 'manual',
      batchId,
      addedAt: new Date().toISOString()
    };

    const addedItems = itemsToAdd.map(item => {
      const grocery = storage.addGrocery({
        ...item,
        batchMetadata,
        daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
      });
      return grocery;
    });

    setGroceries(prev => [...prev, ...addedItems]);
    setShowBatchPopup(false);
    setBatchShelfLifeResult(null);
    setShowBatchForm(false);
    showToast(`${addedItems.length} items added! Viewing your fridge...`, 'success');
    setCurrentView('fridge');
  };

  const handleReceiptAnalyzed = (analysisResult) => {
    setDocumentAnalysisResult(analysisResult);
    setShowDocumentPopup(true);
    setShowDocumentUpload(false);
  };

  const handleConfirmDocumentItems = (itemsToAdd) => {
    const batchId = Date.now().toString();
    const batchMetadata = {
      source: 'receipt',
      storeName: documentAnalysisResult?.storeName || null,
      batchId,
      addedAt: new Date().toISOString()
    };

    const addedItems = itemsToAdd.map(item => {
      const grocery = storage.addGrocery({
        ...item,
        batchMetadata,
        daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
      });
      return grocery;
    });

    setGroceries(prev => [...prev, ...addedItems]);
    setShowDocumentPopup(false);
    setDocumentAnalysisResult(null);
    setShowDocumentUpload(false);
    showToast(`${addedItems.length} items added from receipt! Viewing your fridge...`, 'success');
    setCurrentView('fridge');
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
    setShowClearAllConfirm(true);
  };

  const handleConfirmClearAll = () => {
    try {
      storage.clearAllGroceries();
      setGroceries([]);
      showToast('All groceries cleared successfully', 'success');
    } catch (error) {
      console.error('Error clearing groceries:', error);
      showToast('Failed to clear groceries. Please try again.', 'error');
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
          prev.map(g => g.id === editingGrocery.id ? saved : g)
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
    // Always go to tracking functionality
    if (quickAnswerItem) {
      // Store the quick answer item in localStorage for the tracking page
      localStorage.setItem('quickAnswerItem', JSON.stringify(quickAnswerItem));
    }
    window.location.href = '/tracking';
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

  const handleMarkAsEaten = useCallback((id) => {
    try {
      const updated = storage.markAsEaten(id);
      if (updated) {
        setGroceries(prev =>
          prev.map(g => g.id === id ? { ...g, eaten: true, eatenAt: updated.eatenAt } : g)
        );
        showToast('Marked as eaten! 🎉', 'success');
      }
    } catch (error) {
      console.error('Error marking as eaten:', error);
      showToast('Failed to mark item as eaten', 'error');
    }
  }, [showToast]);

  const handleMarkAsExpired = useCallback((id) => {
    try {
      const updated = storage.markAsExpired(id);
      if (updated) {
        setGroceries(prev =>
          prev.map(g => g.id === id ? { ...g, markedExpired: true } : g)
        );
        showToast('Marked as expired', 'warning');
      }
    } catch (error) {
      console.error('Error marking as expired:', error);
      showToast('Failed to mark item as expired', 'error');
    }
  }, [showToast]);

  const handleDeleteNote = useCallback((purchaseDate) => {
    try {
      storage.deleteByPurchaseDate(purchaseDate);
      setGroceries(prev => prev.filter(g => g.purchaseDate !== purchaseDate));
      showToast('Shopping trip deleted', 'success');
    } catch (error) {
      console.error('Error deleting note:', error);
      showToast('Failed to delete shopping trip', 'error');
    }
  }, [showToast]);

  const handleItemClick = useCallback((item) => {
    setDetailGrocery(item);
    setShowDetailModal(true);
  }, []);

  const handleAddShoppingTrip = () => {
    setPreviousView(currentView);
    setCurrentView('add');
  };

  const handleNavigate = (view) => {
    setPreviousView(currentView);
    setCurrentView(view);
  };

  const handleSelectAddMethod = (method) => {
    if (method === 'single') {
      setShowAddForm(true);
    } else if (method === 'manual') {
      setCurrentView('type');
    } else if (method === 'batch') {
      setShowBatchForm(true);
    } else if (method === 'receipt') {
      setShowDocumentUpload(true);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleBackToAdd = () => {
    setCurrentView('add');
  };

  const handleBackFromAdd = () => {
    if (previousView) {
      setCurrentView(previousView);
      setPreviousView(null);
    } else {
      setCurrentView('home');
    }
  };

  if (showLanding) {
    return (
      <>
        <LandingPage
          onStartTracking={handleStartTracking}
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

  // Render different views with page transitions
  return (
    <>
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            variants={variants.fridgeSlide}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <HomePage onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentView === 'add' && (
          <motion.div
            key="add"
            variants={variants.fridgeSlide}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AddToFridgePage
              onSelectMethod={handleSelectAddMethod}
              onBack={handleBackFromAdd}
            />
          </motion.div>
        )}

        {currentView === 'type' && (
          <motion.div
            key="type"
            variants={variants.fridgeSlide}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <TypeItemsPage
              onSubmit={handleTypeItemsSubmit}
              onBack={() => setCurrentView('add')}
              initialItems={pendingBatchItems}
              isLoading={isLoadingShelfLife}
            />
          </motion.div>
        )}

        {currentView === 'fridge' && (
          <motion.div
            key="fridge"
            variants={variants.fridgeSlide}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FridgeDoor
                groceries={groceries}
                onItemClick={handleItemClick}
                onMarkAsEaten={handleMarkAsEaten}
                onMarkAsExpired={handleMarkAsExpired}
                onDeleteNote={handleDeleteNote}
                onEditItem={handleEditGrocery}
                onDeleteItem={handleDeleteGrocery}
                onAddShoppingTrip={handleAddShoppingTrip}
                onBack={handleBackToHome}
              />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast - always visible */}
      <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        {/* Add Forms - Using Reusable Modal Component */}
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Add New Grocery"
          size="md"
        >
          <AddGroceryForm
            onSubmit={handleAddGrocery}
            onSubmitWithAI={handleAddGroceryWithAI}
            onCancel={() => setShowAddForm(false)}
            isLoadingShelfLife={isLoadingShelfLife}
          />
        </Modal>

        <Modal
          isOpen={showBatchForm}
          onClose={() => setShowBatchForm(false)}
          size="lg"
        >
          <BatchAddGroceryForm
            onBatchSubmit={handleBatchAddGrocery}
            onCancel={() => setShowBatchForm(false)}
            isLoadingShelfLife={isLoadingShelfLife}
          />
        </Modal>

        <Modal
          isOpen={showDocumentUpload}
          onClose={() => setShowDocumentUpload(false)}
          title="Take a Photo of Receipt"
          size="lg"
        >
          <ReceiptUpload
            onReceiptAnalyzed={handleReceiptAnalyzed}
            onClose={() => setShowDocumentUpload(false)}
            showToast={showToast}
          />
        </Modal>

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
              setPendingBatchItems(null);
            }}
            onAddMoreItems={handleAddMoreItems}
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

        {/* Modals always available */}
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
            isOpen={showDetailModal}
            onEdit={handleEditGrocery}
            onDelete={handleDeleteGrocery}
            onClose={handleCloseDetail}
          />
        )}

        <FunAlert
          isOpen={funAlert.isOpen}
          onClose={closeFunAlert}
          type={funAlert.type}
        />

        <ConfirmationModal
          isOpen={showClearAllConfirm}
          onClose={() => setShowClearAllConfirm(false)}
          onConfirm={handleConfirmClearAll}
          title="Delete All Groceries?"
          message="Are you sure you want to delete all groceries? This action cannot be undone."
          confirmText="Delete All"
          cancelText="Cancel"
          variant="danger"
        />
      </>
    );
}
