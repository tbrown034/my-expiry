'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { variants, springs } from '../../lib/motionVariants';

export default function ActionMenu({ actions = [], align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleActionClick = (action) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Menu trigger button */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="interactive-button p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        aria-label="Open actions menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {/* Dropdown menu with paper-float animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            variants={variants.dropdownFloat}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            role="menu"
            aria-orientation="vertical"
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(action);
                }}
                disabled={action.disabled}
                whileHover={!action.disabled ? {
                  x: 4,
                  backgroundColor: "rgba(0, 0, 0, 0.02)"
                } : {}}
                transition={{ duration: 0.15 }}
                className={`
                  w-full text-left px-4 py-3 text-sm font-medium
                  flex items-center gap-3
                  ${action.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : `${action.color || 'text-gray-700'}`
                  }
                  ${index > 0 ? 'border-t border-gray-100' : ''}
                `}
                role="menuitem"
                aria-label={action.label}
              >
                {action.icon && (
                  <span className="flex-shrink-0 w-5 h-5" aria-hidden="true">
                    {action.icon}
                  </span>
                )}
                <span className="flex-1">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
