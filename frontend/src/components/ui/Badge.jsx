import React from 'react';

/**
 * Badge Component
 * Status indicator badges for inventory, roles, and states
 * @param {string} variant - 'success' | 'warning' | 'critical' | 'info' | 'neutral'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {ReactNode} icon - Icon to display left
 * @param {ReactNode} rightIcon - Icon to display right
 * @param {ReactNode} children - Badge content
 * @param {string} className - Additional classes
 */
const Badge = React.forwardRef(
  (
    {
      variant = 'neutral',
      size = 'md',
      icon,
      rightIcon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }[size];

    const variantClasses = {
      success:
        'bg-status-success-100 dark:bg-status-success-900/30 text-status-success-700 dark:text-status-success-300',
      warning:
        'bg-status-warning-100 dark:bg-status-warning-900/30 text-status-warning-700 dark:text-status-warning-300',
      critical:
        'bg-status-critical-100 dark:bg-status-critical-900/30 text-status-critical-700 dark:text-status-critical-300',
      info: 'bg-status-info-100 dark:bg-status-info-900/30 text-status-info-700 dark:text-status-info-300',
      neutral:
        'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300',
      brand:
        'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300',
    }[variant];

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 font-medium rounded-base whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
