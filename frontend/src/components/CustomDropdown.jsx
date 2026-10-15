import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * CustomDropdown
 * A robust, accessible, and glitch-free dropdown component designed for navigation headers.
 * Features:
 * - Hover bridge preventing premature exit closure
 * - Dual trigger mode (hover with forgiving timeout + click toggle)
 * - Safe viewport alignment ('left', 'center', 'right')
 * - Keyboard Escape listener and click-outside dismissal
 */
export default function CustomDropdown({
  id,
  isOpen: controlledIsOpen,
  onOpenChange,
  trigger,
  children,
  align = 'left', // 'left' | 'center' | 'right'
  width = 'auto',
  hoverable = true,
  hoverDelay = 260,
  className = '',
  panelClassName = '',
  closeOnClickInside = false,
  offset = 8
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  const closeDropdown = useCallback(() => {
    if (isControlled) {
      if (onOpenChange) onOpenChange(false);
    } else {
      setInternalIsOpen(false);
    }
  }, [isControlled, onOpenChange]);

  const setOpenState = useCallback((state) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (isControlled) {
      if (onOpenChange) onOpenChange(state);
    } else {
      setInternalIsOpen(state);
    }
  }, [isControlled, onOpenChange]);

  const handleMouseEnter = () => {
    if (!hoverable) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenState(true);
  };

  const handleMouseLeave = () => {
    if (!hoverable) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpenState(false);
    }, hoverDelay);
  };

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    setOpenState(!isOpen);
  };

  // Click outside and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenState(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenState(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setOpenState]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Compute alignment class for dropdown panel
  const getAlignmentStyle = () => {
    switch (align) {
      case 'right':
        return 'right-0 left-auto origin-top-right';
      case 'center':
        return 'left-1/2 -translate-x-1/2 origin-top';
      case 'left':
      default:
        return 'left-0 right-auto origin-top-left';
    }
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Slot */}
      <div 
        onClick={handleTriggerClick}
        className="cursor-pointer select-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {typeof trigger === 'function' ? trigger({ isOpen }) : trigger}
      </div>

      {/* Dropdown Panel with Invisible Hover Bridge */}
      {isOpen && (
        <div
          style={{ 
            width: typeof width === 'number' ? `${width}px` : width,
            top: `calc(100% + ${offset}px)`,
            maxHeight: 'calc(100vh - 90px)'
          }}
          className={`custom-dropdown-panel absolute z-[9999] flex flex-col ${getAlignmentStyle()} ${panelClassName}`}
          onClick={(e) => {
            if (closeOnClickInside) {
              setOpenState(false);
            } else {
              e.stopPropagation();
            }
          }}
        >
          {/* Invisible hover bridge to eliminate premature mouse-leave events */}
          {hoverable && (
            <div 
              className="absolute -top-3 left-0 right-0 h-4 bg-transparent pointer-events-auto" 
              aria-hidden="true" 
            />
          )}

          {/* Children Content with Viewport Clamping & Custom Scrollbar */}
          <div 
            style={{ maxHeight: 'calc(100vh - 100px)' }}
            className="custom-dropdown-card bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-y-auto overflow-x-hidden text-gray-800 animate-dropdown-fade"
          >
            {typeof children === 'function' ? children({ close: closeDropdown }) : children}
          </div>
        </div>
      )}
    </div>
  );
}
