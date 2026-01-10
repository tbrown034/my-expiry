'use client';

import { createContext, useContext, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const ModalContext = createContext(null);

// Modal types - matches original MODAL_TYPES
export const MODAL_TYPES = {
  NONE: null,
  ADD_FORM: 'add-form',
  BATCH_FORM: 'batch-form',
  DOCUMENT_UPLOAD: 'document-upload',
  GROCERY_POPUP: 'grocery-popup',
  BATCH_POPUP: 'batch-popup',
  DOCUMENT_POPUP: 'document-popup',
  EDIT: 'edit',
  DETAIL: 'detail',
  CLEAR_CONFIRM: 'clear-confirm',
};

export function ModalProvider({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current modal state from URL
  const modalType = searchParams.get('modal') || MODAL_TYPES.NONE;
  const modalId = searchParams.get('id') || null;

  // Open modal by updating URL search params
  const openModal = useCallback((type, id = null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', type);
    if (id) {
      params.set('id', id);
    } else {
      params.delete('id');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Close modal by removing modal params from URL
  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    params.delete('id');
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  // Check if a specific modal is open
  const isModalOpen = useCallback((type) => {
    return modalType === type;
  }, [modalType]);

  const value = {
    modalType,
    modalId,
    openModal,
    closeModal,
    isModalOpen,
    MODAL_TYPES,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
