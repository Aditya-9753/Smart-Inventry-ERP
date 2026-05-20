import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Stretch to container width
 * @param {boolean} isLoading - Show spinner and disable button
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional Tailwind classes
 * @param {ReactNode} children - Button content
 * @param {ReactNode} icon - Icon to display left of text
 * @param {ReactNode} rightIcon - Icon to display right of text
 * @param {...any} props - HTML button attributes
 */
const Button = React.forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      className = '',
      children,
      icon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-smooth rounded-base',
      'focus-ring',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      fullWidth && 'w-full',
    ]
      .filter(Boolean)
      .join(' ');

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }[size];

    const variantClasses = {
      primary:
        'bg-brand-600 dark:bg-brand-500 text-white hover:bg-brand-700 dark:hover:bg-brand-600 active:bg-brand-800 dark:active:bg-brand-700',
      secondary:
        'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-300 dark:hover:bg-neutral-600 active:bg-neutral-400 dark:active:bg-neutral-500',
      ghost:
        'bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700',
      danger:
        'bg-status-critical-600 dark:bg-status-critical-500 text-white hover:bg-status-critical-700 dark:hover:bg-status-critical-600 active:bg-status-critical-800 dark:active:bg-status-critical-700',
      success:
        'bg-status-success-600 dark:bg-status-success-500 text-white hover:bg-status-success-700 dark:hover:bg-status-success-600 active:bg-status-success-800 dark:active:bg-status-success-700',
      warning:
        'bg-status-warning-600 dark:bg-status-warning-500 text-white hover:bg-status-warning-700 dark:hover:bg-status-warning-600 active:bg-status-warning-800 dark:active:bg-status-warning-700',
    }[variant];

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {icon && !isLoading && <span className="flex-shrink-0">{icon}</span>}
        {isLoading && <Loader2 size={16} className="animate-spin flex-shrink-0" />}
        <span>{children}</span>
        {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
