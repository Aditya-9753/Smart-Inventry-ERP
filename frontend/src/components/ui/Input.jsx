import React from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

/**
 * Input Component
 * @param {string} label - Input label text
 * @param {string} type - Input type ('text', 'email', 'password', 'number', 'search', etc.)
 * @param {string} error - Error message to display
 * @param {string} helperText - Helper text below input
 * @param {string} placeholder - Placeholder text
 * @param {boolean} disabled - Disabled state
 * @param {boolean} required - Show required indicator
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {ReactNode} leftIcon - Icon to display left
 * @param {ReactNode} rightIcon - Icon to display right
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} className - Additional classes
 * @param {...any} props - HTML input attributes
 */
const Input = React.forwardRef(
  (
    {
      label,
      type = 'text',
      error = '',
      helperText = '',
      placeholder,
      disabled = false,
      required = false,
      size = 'md',
      leftIcon,
      rightIcon,
      value,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-3 py-2 text-sm h-10',
      lg: 'px-4 py-3 text-base h-12',
    }[size];

    const baseClasses = [
      'w-full rounded-base border',
      'bg-neutral-0 dark:bg-neutral-800',
      'text-neutral-900 dark:text-neutral-50',
      'placeholder-neutral-400 dark:placeholder-neutral-500',
      'transition-smooth',
      'input-ring',
      'disabled:bg-neutral-100 disabled:dark:bg-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed',
      error
        ? 'border-status-critical-500 dark:border-status-critical-400'
        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
    ]
      .filter(Boolean)
      .join(' ');

    const actualType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
            {required && <span className="text-status-critical-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 flex-shrink-0 text-neutral-500 dark:text-neutral-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            type={actualType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              ${baseClasses}
              ${sizeClasses}
              ${leftIcon ? 'pl-10' : ''}
              ${type === 'password' || rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />

          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 flex-shrink-0 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 p-0 bg-transparent border-0 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {rightIcon && type !== 'password' && (
            <span className="absolute right-3 flex-shrink-0 text-neutral-500 dark:text-neutral-400 pointer-events-none">
              {rightIcon}
            </span>
          )}

          {error && (
            <span className="absolute right-3 flex-shrink-0 text-status-critical-500 dark:text-status-critical-400">
              <AlertCircle size={18} />
            </span>
          )}

          {!error && value && type !== 'password' && (
            <span className="absolute right-3 flex-shrink-0 text-status-success-500 dark:text-status-success-400">
              <CheckCircle2 size={18} />
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

Input.displayName = 'Input';

export default Input;
