import React from 'react';

/**
 * PageHeader Component
 * A consistent, premium layout header for dashboard subpages
 * @param {string|ReactNode} title - Title of the page
 * @param {string|ReactNode} description - Subtitle or explanation
 * @param {ReactNode} action - Primary action button or elements to render on the right
 * @param {string} className - Additional container styling classes
 */
const PageHeader = ({ title, description, action, className = '' }) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800 ${className}`}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
