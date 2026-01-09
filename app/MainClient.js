'use client';

import { useState, useEffect, useCallback, useReducer } from 'react';
import { getUserFriendlyMessage } from '../lib/errorHandling';
// Pages
import FridgeDoor from './components/pages/FridgeDoor';
import HomePage from './components/pages/HomePage';
import AddToFridgePage from './components/pages/AddToFridgePage';
import TypeItemsPage from './components/pages/TypeItemsPage';
// Forms
import AddGroceryForm from './components/forms/AddGroceryForm';
import BatchAddGroceryForm from './components/forms/BatchAddGroceryForm';
import ReceiptUpload from './components/forms/ReceiptUpload';
// Modals
import Modal from './components/modals/Modal';
import ConfirmationModal from './components/modals/ConfirmationModal';
import GroceryItemPopup from './components/modals/GroceryItemPopup';
import DocumentAnalysisPopup from './components/modals/DocumentAnalysisPopup';
import BatchGroceryPopup from './components/modals/BatchGroceryPopup';
import EditGroceryModal from './components/modals/EditGroceryModal';
import GroceryDetailModal from './components/modals/GroceryDetailModal';
// UI
import Toast from './components/ui/Toast';
import ProcessingOverlay from './components/ui/ProcessingOverlay';
import { motion, AnimatePresence } from 'motion/react';
import { variants } from '../lib/motionVariants';
import { storage } from '../lib/storage';
import { calculateDaysUntilExpiry, getExpiryStatus } from '../lib/utils';
import { getRandomTestItems } from '../lib/testData';

// Modal types for consolidated modal state
const MODAL_TYPES = {
  NONE: null,
  ADD_FORM: 'addForm',
  BATCH_FORM: 'batchForm',
  DOCUMENT_UPLOAD: 'documentUpload',
  GROCERY_POPUP: 'groceryPopup',
  BATCH_POPUP: 'batchPopup',
  DOCUMENT_POPUP: 'documentPopup',
  EDIT: 'edit',
  DETAIL: 'detail',
  CLEAR_CONFIRM: 'clearConfirm',
};

// Reducer for modal state management
function modalReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return { type: action.modal, data: action.data || null };
    case 'CLOSE':
      return { type: MODAL_TYPES.NONE, data: null };
    default:
      return state;
  }
}

export default function MainClient() {
  // Core navigation state
  const [currentView, setCurrentView] = useState('home');
  const [previousView, setPreviousView] = useState(null);

  // Data state
  const [groceries, setGroceries] = useState([]);

  // Consolidated modal state (replaces 10+ individual modal states)
  const [modal, dispatchModal] = useReducer(modalReducer, { type: MODAL_TYPES.NONE, data: null });

  // Pending data for multi-step flows
  const [pendingData, setPendingData] = useState({
    groceryItem: null,
    batchResult: null,
    batchItems: null,
    documentResult: null,
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // UI feedback state
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  // Processing overlay state (for dev testing)
  const [processing, setProcessing] = useState({
    isVisible: false,
    logs: [],
    currentStep: ''
  });

  const addProcessingLog = useCallback((message, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    }).slice(0, 12);
    setProcessing(prev => ({
      ...prev,
      logs: [...prev.logs, { time, message, type }]
    }));
  }, []);

  const setProcessingStep = useCallback((step) => {
    setProcessing(prev => ({ ...prev, currentStep: step }));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Helper to open modals
  const openModal = useCallback((modalType, data = null) => {
    dispatchModal({ type: 'OPEN', modal: modalType, data });
  }, []);

  // Helper to close modals
  const closeModal = useCallback(() => {
    dispatchModal({ type: 'CLOSE' });
  }, []);

  // Load groceries on mount with proper error handling
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
      } catch {
        showToast('Failed to load groceries', 'error');
      }
    };

    loadGroceries();
    const interval = setInterval(loadGroceries, 60000);
    return () => clearInterval(interval);
  }, [showToast]);

  const handleAddGrocery = useCallback((newGrocery) => {
    try {
      const grocery = storage.addGrocery({
        ...newGrocery,
        daysUntilExpiry: calculateDaysUntilExpiry(newGrocery.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(newGrocery.expiryDate))
      });
      setGroceries(prev => [...prev, grocery]);
      closeModal();
      showToast('Grocery item added successfully!', 'success');
    } catch {
      showToast('Failed to add grocery item. Please try again.', 'error');
    }
  }, [closeModal, showToast]);

  const handleDeleteGrocery = useCallback((id) => {
    try {
      storage.deleteGrocery(id);
      setGroceries(prev => prev.filter(g => g.id !== id));
      showToast('Grocery item deleted successfully', 'success');
    } catch {
      showToast('Failed to delete grocery item. Please try again.', 'error');
    }
  }, [showToast]);

  const handleAddGroceryWithAI = useCallback(async (itemName) => {
    if (!itemName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/get-shelf-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: itemName.trim() })
      });

      if (!response.ok) throw new Error('Failed to get shelf life');

      const shelfLifeData = await response.json();
      setPendingData(prev => ({ ...prev, groceryItem: shelfLifeData }));
      openModal(MODAL_TYPES.GROCERY_POPUP);
    } catch {
      showToast('Could not get shelf life information. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [openModal, showToast]);

  const handleConfirmGroceryItem = useCallback((groceryData) => {
    try {
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
      closeModal();
      setPendingData(prev => ({ ...prev, groceryItem: null }));
      showToast('Item added! Viewing your fridge...', 'success');
      setCurrentView('fridge');
    } catch {
      showToast('Failed to add item. Please try again.', 'error');
    }
  }, [closeModal, showToast]);

  const handleBatchAddGrocery = useCallback(async (itemNames) => {
    if (!itemNames || itemNames.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/parse-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemNames })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.details || 'Failed to parse items');
      }

      const parseResult = await response.json();

      // If we have pending items from "Add More" flow, merge them
      if (pendingData.batchItems && pendingData.batchItems.length > 0) {
        const mergedItems = [
          ...pendingData.batchItems,
          ...parseResult.items.map((item, index) => ({
            ...item,
            id: pendingData.batchItems.length + index
          }))
        ];
        setPendingData(prev => ({ ...prev, batchResult: { ...parseResult, items: mergedItems }, batchItems: null }));
      } else {
        setPendingData(prev => ({ ...prev, batchResult: parseResult }));
      }

      openModal(MODAL_TYPES.BATCH_POPUP);
    } catch (error) {
      const userMessage = getUserFriendlyMessage(error, 'parse-items');
      showToast(userMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [pendingData.batchItems, openModal, showToast]);

  const handleTypeItemsSubmit = useCallback(async (itemNames) => {
    await handleBatchAddGrocery(itemNames);
  }, [handleBatchAddGrocery]);

  const handleConfirmBatchItems = useCallback((itemsToAdd) => {
    try {
      const batchId = Date.now().toString();
      const batchMetadata = {
        source: 'manual',
        batchId,
        addedAt: new Date().toISOString()
      };

      const addedItems = itemsToAdd.map(item => {
        return storage.addGrocery({
          ...item,
          batchMetadata,
          daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
          status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
        });
      });

      setGroceries(prev => [...prev, ...addedItems]);
      closeModal();
      setPendingData(prev => ({ ...prev, batchResult: null }));
      showToast(`${addedItems.length} items added! Viewing your fridge...`, 'success');
      setCurrentView('fridge');
    } catch {
      showToast('Failed to add items. Please try again.', 'error');
    }
  }, [closeModal, showToast]);

  const handleReceiptAnalyzed = useCallback((result) => {
    setPendingData(prev => ({ ...prev, documentResult: result }));
    openModal(MODAL_TYPES.DOCUMENT_POPUP);
  }, [openModal]);

  const handleConfirmDocumentItems = useCallback((itemsToAdd) => {
    try {
      const batchId = Date.now().toString();
      const batchMetadata = {
        source: 'receipt',
        storeName: pendingData.documentResult?.storeName || null,
        batchId,
        addedAt: new Date().toISOString()
      };

      const addedItems = itemsToAdd.map(item => {
        return storage.addGrocery({
          ...item,
          batchMetadata,
          daysUntilExpiry: calculateDaysUntilExpiry(item.expiryDate),
          status: getExpiryStatus(calculateDaysUntilExpiry(item.expiryDate))
        });
      });

      setGroceries(prev => [...prev, ...addedItems]);
      closeModal();
      setPendingData(prev => ({ ...prev, documentResult: null }));
      showToast(`${addedItems.length} items added from receipt! Viewing your fridge...`, 'success');
      setCurrentView('fridge');
    } catch {
      showToast('Failed to add items. Please try again.', 'error');
    }
  }, [pendingData.documentResult, closeModal, showToast]);

  const handleClearAll = useCallback(() => {
    openModal(MODAL_TYPES.CLEAR_CONFIRM);
  }, [openModal]);

  const handleConfirmClearAll = useCallback(() => {
    try {
      storage.clearAllGroceries();
      setGroceries([]);
      closeModal();
      showToast('All groceries cleared successfully', 'success');
    } catch {
      showToast('Failed to clear groceries. Please try again.', 'error');
    }
  }, [closeModal, showToast]);

  const handleEditGrocery = useCallback((id) => {
    const grocery = groceries.find(g => g.id === id);
    if (grocery) {
      openModal(MODAL_TYPES.EDIT, grocery);
    }
  }, [groceries, openModal]);

  const handleSaveEditedGrocery = useCallback((updatedData) => {
    try {
      const updatedGrocery = {
        ...updatedData,
        daysUntilExpiry: calculateDaysUntilExpiry(updatedData.expiryDate),
        status: getExpiryStatus(calculateDaysUntilExpiry(updatedData.expiryDate))
      };

      const saved = storage.updateGrocery(modal.data.id, updatedGrocery);
      if (saved) {
        setGroceries(prev =>
          prev.map(g => g.id === modal.data.id ? saved : g)
        );
        closeModal();
        showToast('Grocery item updated successfully!', 'success');
      }
    } catch {
      showToast('Failed to update grocery item. Please try again.', 'error');
    }
  }, [modal.data, closeModal, showToast]);

  const handleShowDetail = useCallback((id) => {
    const grocery = groceries.find(g => g.id === id);
    if (grocery) {
      openModal(MODAL_TYPES.DETAIL, grocery);
    }
  }, [groceries, openModal]);

  const handleStartTracking = useCallback((quickAnswerItem = null) => {
    if (quickAnswerItem) {
      try {
        localStorage.setItem('quickAnswerItem', JSON.stringify(quickAnswerItem));
      } catch {
        // localStorage may be unavailable, continue anyway
      }
    }
    window.location.href = '/tracking';
  }, []);

  const handleMarkAsEaten = useCallback((id) => {
    try {
      const updated = storage.markAsEaten(id);
      if (updated) {
        setGroceries(prev =>
          prev.map(g => g.id === id ? { ...g, eaten: true, eatenAt: updated.eatenAt } : g)
        );
        showToast('Marked as eaten! 🎉', 'success');
      }
    } catch {
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
    } catch {
      showToast('Failed to mark item as expired', 'error');
    }
  }, [showToast]);

  const handleDeleteNote = useCallback((purchaseDate) => {
    try {
      storage.deleteByPurchaseDate(purchaseDate);
      setGroceries(prev => prev.filter(g => g.purchaseDate !== purchaseDate));
      showToast('Shopping trip deleted', 'success');
    } catch {
      showToast('Failed to delete shopping trip', 'error');
    }
  }, [showToast]);

  const handleItemClick = useCallback((item) => {
    openModal(MODAL_TYPES.DETAIL, item);
  }, [openModal]);

  const handleAddShoppingTrip = useCallback(() => {
    setPreviousView(currentView);
    setCurrentView('add');
  }, [currentView]);

  const handleNavigate = useCallback((view) => {
    setPreviousView(currentView);
    setCurrentView(view);
  }, [currentView]);

  const handleTestBatch = useCallback(async () => {
    // Reset and show processing overlay
    setProcessing({ isVisible: true, logs: [], currentStep: '' });
    setCurrentView('fridge');

    const testItems = getRandomTestItems();
    addProcessingLog(`Generated ${testItems.length} random test items`, 'success');
    addProcessingLog(`Items: ${testItems.slice(0, 3).join(', ')}${testItems.length > 3 ? '...' : ''}`, 'info');

    setProcessingStep('Parsing items with AI...');
    addProcessingLog('POST /api/parse-items', 'network');

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/parse-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: testItems })
      });

      const elapsed = Date.now() - startTime;
      addProcessingLog(`Response received (${elapsed}ms)`, 'network');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.details || 'Failed to parse items');
      }

      const parseResult = await response.json();
      addProcessingLog(`Parsed ${parseResult.items?.length || 0} items successfully`, 'success');

      setProcessingStep('Fetching shelf life data...');
      addProcessingLog('POST /api/get-shelf-life (batch)', 'network');

      // The BatchGroceryPopup will fetch shelf life, but we can show the popup now
      setPendingData(prev => ({ ...prev, batchResult: parseResult }));

      addProcessingLog('Processing complete!', 'success');
      setProcessingStep('Done!');

      // Small delay to show completion, then show popup
      await new Promise(resolve => setTimeout(resolve, 500));
      setProcessing(prev => ({ ...prev, isVisible: false }));
      openModal(MODAL_TYPES.BATCH_POPUP);

    } catch (error) {
      addProcessingLog(`Error: ${error.message}`, 'error');
      setProcessingStep('Failed');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessing(prev => ({ ...prev, isVisible: false }));
      const userMessage = getUserFriendlyMessage(error, 'parse-items');
      showToast(userMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addProcessingLog, setProcessingStep, openModal, showToast]);

  const handleSelectAddMethod = useCallback((method) => {
    if (method === 'single') {
      openModal(MODAL_TYPES.ADD_FORM);
    } else if (method === 'manual') {
      setCurrentView('type');
    } else if (method === 'batch') {
      openModal(MODAL_TYPES.BATCH_FORM);
    } else if (method === 'receipt') {
      openModal(MODAL_TYPES.DOCUMENT_UPLOAD);
    } else if (method === 'testBatch') {
      handleTestBatch();
    }
  }, [openModal, handleTestBatch]);

  const handleBackToHome = useCallback(() => {
    setCurrentView('home');
  }, []);

  const handleBackFromAdd = useCallback(() => {
    if (previousView) {
      setCurrentView(previousView);
      setPreviousView(null);
    } else {
      setCurrentView('home');
    }
  }, [previousView]);

  // Render different views with page transitions
  return (
    <>
      <div className="overflow-x-hidden">
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
                initialItems={pendingData.batchItems}
                isLoading={isLoading}
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
                onClearAll={handleClearAll}
                onBack={handleBackToHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Processing overlay for dev testing */}
      <ProcessingOverlay
        isVisible={processing.isVisible}
        logs={processing.logs}
        currentStep={processing.currentStep}
      />

      {/* Add Forms - Using Reusable Modal Component */}
      <Modal
        isOpen={modal.type === MODAL_TYPES.ADD_FORM}
        onClose={closeModal}
        title="Add New Grocery"
        size="md"
      >
        <AddGroceryForm
          onSubmit={handleAddGrocery}
          onSubmitWithAI={handleAddGroceryWithAI}
          onCancel={closeModal}
          isLoadingShelfLife={isLoading}
        />
      </Modal>

      <Modal
        isOpen={modal.type === MODAL_TYPES.BATCH_FORM}
        onClose={closeModal}
        size="lg"
      >
        <BatchAddGroceryForm
          onBatchSubmit={handleBatchAddGrocery}
          onCancel={closeModal}
          isLoadingShelfLife={isLoading}
        />
      </Modal>

      <Modal
        isOpen={modal.type === MODAL_TYPES.DOCUMENT_UPLOAD}
        onClose={closeModal}
        title="Take a Photo of Receipt"
        size="lg"
      >
        <ReceiptUpload
          onReceiptAnalyzed={handleReceiptAnalyzed}
          onClose={closeModal}
          showToast={showToast}
        />
      </Modal>

      {modal.type === MODAL_TYPES.GROCERY_POPUP && pendingData.groceryItem && (
        <GroceryItemPopup
          item={pendingData.groceryItem}
          onConfirm={handleConfirmGroceryItem}
          onCancel={() => {
            closeModal();
            setPendingData(prev => ({ ...prev, groceryItem: null }));
          }}
        />
      )}

      {modal.type === MODAL_TYPES.BATCH_POPUP && pendingData.batchResult && (
        <BatchGroceryPopup
          batchResult={pendingData.batchResult}
          onConfirm={handleConfirmBatchItems}
          onCancel={() => {
            closeModal();
            setPendingData(prev => ({ ...prev, batchResult: null, batchItems: null }));
          }}
        />
      )}

      {modal.type === MODAL_TYPES.DOCUMENT_POPUP && pendingData.documentResult && (
        <DocumentAnalysisPopup
          analysisResult={pendingData.documentResult}
          onConfirm={handleConfirmDocumentItems}
          onCancel={() => {
            closeModal();
            setPendingData(prev => ({ ...prev, documentResult: null }));
          }}
        />
      )}

      {modal.type === MODAL_TYPES.EDIT && modal.data && (
        <EditGroceryModal
          grocery={modal.data}
          onSave={handleSaveEditedGrocery}
          onCancel={closeModal}
        />
      )}

      {modal.type === MODAL_TYPES.DETAIL && modal.data && (
        <GroceryDetailModal
          grocery={modal.data}
          isOpen={true}
          onEdit={handleEditGrocery}
          onDelete={handleDeleteGrocery}
          onClose={closeModal}
        />
      )}

      <ConfirmationModal
        isOpen={modal.type === MODAL_TYPES.CLEAR_CONFIRM}
        onClose={closeModal}
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
