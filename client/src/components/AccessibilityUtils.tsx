import React, { useEffect, useRef } from 'react';

/**
 * Skip Navigation Link Component
 * Allows keyboard users to skip to main content
 */
export const SkipNavLink: React.FC<{ targetId?: string }> = ({ 
  targetId = 'main-content' 
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="skip-nav-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        padding: '8px 16px',
        background: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '0 0 4px 4px',
        fontSize: '14px',
        fontWeight: 'bold',
        transform: 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
      }}
      onFocus={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.left = '16px';
      }}
      onBlur={(e) => {
        e.target.style.transform = 'translateY(-100%)';
        e.target.style.left = '-9999px';
      }}
    >
      Skip to main content
    </a>
  );
};

/**
 * Focus Management Hook
 * Automatically manages focus for better UX
 */
export const useFocusManagement = (shouldFocus: boolean = false) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return ref;
};

/**
 * Announce to Screen Readers Component
 * For dynamic content announcements
 */
interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  id?: string;
}

export const ScreenReaderAnnouncement: React.FC<AnnouncementProps> = ({
  message,
  priority = 'polite',
  id = 'sr-announcement'
}) => {
  return (
    <div
      id={id}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {message}
    </div>
  );
};

/**
 * Accessible Modal Component
 * Traps focus and manages keyboard navigation
 */
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  id?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  id = 'accessible-modal'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocus.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Trap focus within modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      // Handle Escape key
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleTabKey);
      document.addEventListener('keydown', handleEscapeKey);

      return () => {
        document.removeEventListener('keydown', handleTabKey);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    } else if (previousFocus.current) {
      // Restore focus when modal closes
      previousFocus.current.focus();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-body`}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          ref={modalRef}
          className="modal-content"
          tabIndex={-1}
        >
          <div className="modal-header">
            <h5 id={`${id}-title`} className="modal-title">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close modal"
            ></button>
          </div>
          <div id={`${id}-body`} className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Accessible Form Field Component
 * Properly associates labels, errors, and help text
 */
interface AccessibleFieldProps {
  id: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

export const AccessibleField: React.FC<AccessibleFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  helpText,
  required = false,
  placeholder,
  children
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(' ');

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {children || (
        <input
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : 'false'}
        />
      )}

      {helpText && (
        <div id={helpId} className="form-text">
          {helpText}
        </div>
      )}

      {error && (
        <div id={errorId} className="invalid-feedback" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

/**
 * Accessible Button Component
 * Provides proper ARIA attributes and loading states
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  loading = false,
  loadingText = 'Loading...',
  children,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      className={`btn btn-${variant} ${className}`}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
    >
      {loading && (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Loading...</span>
        </>
      )}
      {loading ? loadingText : children}
    </button>
  );
};

/**
 * Progress Indicator Component
 * Accessible progress bar with screen reader updates
 */
interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md'
}) => {
  const percentage = Math.round((value / max) * 100);
  const sizeClass = size === 'sm' ? 'progress-sm' : size === 'lg' ? 'progress-lg' : '';

  return (
    <div className="progress-wrapper">
      {label && (
        <div className="d-flex justify-content-between mb-1">
          <span className="small text-muted">{label}</span>
          {showPercentage && (
            <span className="small text-muted">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`progress ${sizeClass}`} style={{ height: size === 'sm' ? '4px' : size === 'lg' ? '12px' : '8px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${percentage}%`}
        />
      </div>
    </div>
  );
};

/**
 * Keyboard Navigation Hook
 * Handles arrow key navigation for lists and grids
 */
export const useKeyboardNavigation = (
  itemCount: number,
  columns: number = 1,
  onSelect?: (index: number) => void
) => {
  const [focusIndex, setFocusIndex] = React.useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newIndex = focusIndex;

    switch (e.key) {
      case 'ArrowDown':
        newIndex = Math.min(focusIndex + columns, itemCount - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(focusIndex - columns, 0);
        break;
      case 'ArrowRight':
        if (columns === 1) {
          newIndex = Math.min(focusIndex + 1, itemCount - 1);
        } else {
          newIndex = focusIndex % columns === columns - 1 ? focusIndex : focusIndex + 1;
        }
        break;
      case 'ArrowLeft':
        if (columns === 1) {
          newIndex = Math.max(focusIndex - 1, 0);
        } else {
          newIndex = focusIndex % columns === 0 ? focusIndex : focusIndex - 1;
        }
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = itemCount - 1;
        break;
      case 'Enter':
      case ' ':
        onSelect?.(focusIndex);
        e.preventDefault();
        return;
      default:
        return;
    }

    e.preventDefault();
    setFocusIndex(newIndex);
    itemRefs.current[newIndex]?.focus();
  };

  const getItemProps = (index: number) => ({
    ref: (el: HTMLElement | null) => {
      itemRefs.current[index] = el;
    },
    tabIndex: index === focusIndex ? 0 : -1,
    onKeyDown: handleKeyDown,
    onClick: () => onSelect?.(index),
  });

  return { getItemProps, focusIndex, setFocusIndex };
};