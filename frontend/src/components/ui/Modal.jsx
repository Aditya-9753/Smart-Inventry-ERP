import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Modal Component
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal title
 * @param {string} description - Modal description/aria-label
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Footer actions/buttons
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} closeOnEscape - Close on ESC key (default: true)
 * @param {boolean} closeOnBackdropClick - Close when clicking outside (default: true)
 * @param {string} className - Additional classes for modal content
 */
const Modal = React.forwardRef(
  (
    {
      isOpen = false,
      onClose = () => {},
      title,
      description,
      children,
      footer,
      size = 'md',
      closeOnEscape = true,
      closeOnBackdropClick = true,
      className = '',
    },
    ref
  ) => {
    const modalRef = useRef(null);
    const initialFocusRef = useRef(null);

    useEffect(() => {
      if (!isOpen) return;

      // Focus trap - focus first focusable element
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.length) {
        initialFocusRef.current = focusableElements[0];
        initialFocusRef.current?.focus();
      }

      // Handle ESC key
      const handleKeyDown = (e) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose();
        }

        // Focus trap - cycle through focusable elements
        if (e.key === 'Tab' && focusableElements?.length) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
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
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-4xl',
    }[size];

    return (
      <>
        {/* Backdrop */}
        <div
          className="overlay-backdrop fixed inset-0 z-40 animate-fade-in"
          onClick={() => closeOnBackdropClick && onClose()}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          role="presentation"
        >
          {/* Modal Content */}
          <div
            ref={modalRef}
            className={`
              w-full ${sizeClasses} bg-neutral-0 dark:bg-neutral-900
              rounded-lg shadow-modal border border-neutral-200 dark:border-neutral-700
              flex flex-col max-h-[90vh] pointer-events-auto animate-slide-in
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-describedby={description ? 'modal-description' : undefined}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <h2
                    id="modal-title"
                    className="text-xl font-bold text-neutral-950 dark:text-neutral-0"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p
                      id="modal-description"
                      className="text-sm text-neutral-600 dark:text-neutral-400 mt-1"
                    >
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors focus-ring"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Body */}
            <div className={`flex-1 overflow-y-auto p-6 ${className}`}>{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-lg">
                {footer}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

Modal.displayName = 'Modal';

/**
 * Convenience hook for modal state management
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}

export default Modal;
