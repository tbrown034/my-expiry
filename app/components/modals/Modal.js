'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { variants } from '../../../lib/motionVariants';

/**
 * Reusable Modal Component
 *
 * Features:
 * - Mobile-first responsive design
 * - Keyboard navigation (Escape to close)
 * - Click outside to close
 * - Focus trap
 * - Smooth animations
 * - Accessibility (ARIA labels, focus management)
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal closes
 * @param {string} title - Modal title (optional)
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl', 'full'
 * @param {boolean} closeOnBackdrop - Allow closing by clicking backdrop
 * @param {boolean} closeOnEscape - Allow closing with Escape key
 * @param {boolean} showCloseButton - Show X button in header
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';

      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            variants={variants.modalSnap}
            initial="initial"
            animate="animate"
            exit="exit"
            tabIndex={-1}
            className={`
              relative bg-white rounded-2xl shadow-2xl w-full
              ${sizeClasses[size]}
              max-h-[90vh] overflow-y-auto
              ${className}
            `}
          >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 sm:px-8 sm:py-5 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl sm:text-2xl font-bold text-gray-900"
                >
                  {title}
                </h2>
              )}

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 interactive"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {children}
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
  );
}

/**
 * Modal Footer Component - for consistent button layouts
 */
export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Modal Buttons - pre-styled for consistency
 */
export function ModalButton({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold
        transition-all duration-200 transform hover:scale-105 active:scale-95
        interactive
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
