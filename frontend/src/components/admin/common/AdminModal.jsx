import React, { useEffect } from 'react';
import { X } from 'lucide-react';

// ============================================================================
// Admin Modal Dialog Component
// Accessible popup for confirm dialogs, rejection notes, and PII reveal prompts
// ============================================================================

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '540px',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-card"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{title}</h3>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ padding: '4px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body">{children}</div>

        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
