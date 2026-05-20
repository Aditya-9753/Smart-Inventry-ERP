import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Drawer Component
 * Side drawer/sidebar modal for navigation or settings
 * @param {boolean} isOpen - Control drawer visibility
 * @param {function} onClose - Callback when drawer should close
 * @param {string} title - Drawer title
 * @param {ReactNode} children - Drawer content
 * @param {string} position - 'left' | 'right' (default: 'right')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} closeOnEscape - Close on ESC key (default: true)
 * @param {boolean} closeOnBackdropClick - Close when clicking outside (default: true)
 */
const Drawer = React.forwardRef(
  (
    {
      isOpen = false,
      onClose = () => {},
      title,
      children,
      position = 'right',
      size = 'md',
      closeOnEscape = true,
      closeOnBackdropClick = true,
    },
    ref
  ) => {
    const drawerRef = useRef(null);

    useEffect(() => {
      if (!isOpen) return;

      // Focus trap
      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.length) {
        focusableElements[0]?.focus();
      }

      // Handle ESC key
      const handleKeyDown = (e) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, closeOnEscape, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'w-64',
      md: 'w-96',
      lg: 'w-full md:w-[600px]',
    }[size];

    const positionClasses = {
      left: 'left-0',
      right: 'right-0',
    }[position];

    const slideClasses = {
      left: 'animate-slide-in',
      right: '-translate-x-full group-[.open]:translate-x-0',
    }[position];

    return (
      <>
        {/* Backdrop */}
        <div
          className="overlay-backdrop fixed inset-0 z-40 animate-fade-in"
          onClick={() => closeOnBackdropClick && onClose()}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          ref={drawerRef}
          className={`
            fixed top-0 ${positionClasses} h-full ${sizeClasses}
            bg-neutral-0 dark:bg-neutral-900 shadow-modal
            border-r border-neutral-200 dark:border-neutral-700
            z-50 flex flex-col ${slideClasses} transition-transform duration-300
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            {title && (
              <h2
                id="drawer-title"
                className="text-lg font-bold text-neutral-950 dark:text-neutral-0"
              >
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="ml-auto p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors focus-ring"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </>
    );
  }
);

Drawer.displayName = 'Drawer';

export default Drawer;
