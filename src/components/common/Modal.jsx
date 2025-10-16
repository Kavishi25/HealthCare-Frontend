import React, { useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Modal Component
 * Reusable modal dialog with customizable content
 * Handles focus trapping and keyboard navigation
 * 
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size: 'small', 'medium', 'large', 'full' (default: 'medium')
 * @param {boolean} closeOnBackdropClick - Close modal when clicking backdrop (default: true)
 * @param {boolean} closeOnEscape - Close modal when pressing Escape (default: true)
 * @param {boolean} showCloseButton - Show close button in header (default: true)
 * @param {ReactNode} footer - Optional footer content
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Restore body scroll
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

  // Handle escape key press
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

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div 
      className="rasa-modal-overlay" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rasa-modal-title"
    >
      <div 
        className={`rasa-modal-container rasa-modal-${size}`}
        ref={modalRef}
        tabIndex={-1}
      >
        {/* Modal Header */}
        <div className="rasa-modal-header">
          <h2 id="rasa-modal-title" className="rasa-modal-title">
            {title}
          </h2>
          
          {showCloseButton && (
            <button 
              className="rasa-modal-close-btn" 
              onClick={onClose}
              aria-label="Close modal"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="rasa-modal-content">
          {children}
        </div>

        {/* Modal Footer (Optional) */}
        {footer && (
          <div className="rasa-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;