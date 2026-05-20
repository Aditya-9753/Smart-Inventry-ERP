import React from 'react';
import Button from './Button';

/**
 * EmptyState Component
 * UI for empty states, no results, or missing data
 * @param {string} icon - Icon component to display
 * @param {string} title - Empty state title
 * @param {string} description - Detailed description
 * @param {string} actionLabel - Primary action button label
 * @param {function} onAction - Callback for primary action
 * @param {ReactNode} secondaryAction - Secondary action button
 * @param {string} variant - 'default' | 'search' | 'error' | 'no-access'
 * @param {string} className - Additional classes
 */
const EmptyState = React.forwardRef(
  (
    {
      icon: Icon,
      title = 'No data',
      description = 'There is nothing to display right now.',
      actionLabel,
      onAction,
      secondaryAction,
      variant = 'default',
      className = '',
    },
    ref
  ) => {
    const iconColorClasses = {
      default: 'text-neutral-400 dark:text-neutral-600',
      search: 'text-neutral-400 dark:text-neutral-600',
      error: 'text-status-critical-400 dark:text-status-critical-600',
      'no-access': 'text-status-warning-400 dark:text-status-warning-600',
    }[variant];

    const bgClasses = {
      default: 'bg-neutral-50 dark:bg-neutral-900',
      search: 'bg-neutral-50 dark:bg-neutral-900',
      error: 'bg-status-critical-50 dark:bg-status-critical-900/20',
      'no-access': 'bg-status-warning-50 dark:bg-status-warning-900/20',
    }[variant];

    return (
      <div
        ref={ref}
        className={`
          flex flex-col items-center justify-center py-12 px-4
          rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700
          ${bgClasses} ${className}
        `}
      >
        {/* Icon */}
        {Icon && (
          <div className={`mb-4 ${iconColorClasses}`}>
            <Icon size={48} strokeWidth={1.5} />
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-sm mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryAction && secondaryAction}
        </div>
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
