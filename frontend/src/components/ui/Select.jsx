import React, { useRef, useEffect } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Select Component
 * Custom styled select dropdown
 * @param {string} label - Select label
 * @param {Array} options - Array of { value, label } objects
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message
 * @param {string} helperText - Helper text
 * @param {string} placeholder - Placeholder text
 * @param {boolean} disabled - Disabled state
 * @param {boolean} required - Required field
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} className - Additional classes
 * @param {...any} props - HTML select attributes
 */
const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      value,
      onChange,
      error = '',
      helperText = '',
      placeholder = 'Select an option...',
      disabled = false,
      required = false,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-3 py-2 text-sm h-10',
      lg: 'px-4 py-3 text-base h-12',
    }[size];

    const baseClasses = [
      'w-full rounded-base border appearance-none',
      'bg-neutral-0 dark:bg-neutral-800',
      'text-neutral-900 dark:text-neutral-50',
      'transition-smooth',
      'cursor-pointer',
      'input-ring',
      'disabled:bg-neutral-100 disabled:dark:bg-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed',
      error
        ? 'border-status-critical-500 dark:border-status-critical-400'
        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
            {required && <span className="text-status-critical-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses} pr-10 ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none"
          />

          {/* Error Icon */}
          {error && (
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-status-critical-500 dark:text-status-critical-400">
              <AlertCircle size={18} />
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-status-critical-600 dark:text-status-critical-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
