import React from 'react';

/**
 * SkeletonLoader Component
 * Placeholder skeleton for loading states
 * @param {string} variant - 'text' | 'card' | 'circle' | 'table-row' | 'avatar'
 * @param {number} count - Number of skeleton items to render
 * @param {string} className - Additional classes
 */
const SkeletonLoader = React.forwardRef(
  ({ variant = 'text', count = 1, className = '' }, ref) => {
    const skeletons = Array.from({ length: count }, (_, i) => i);

    const renderSkeleton = (key) => {
      switch (variant) {
        case 'text':
          return (
            <div key={key} className="space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse-soft" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse-soft w-5/6" />
            </div>
          );

        case 'card':
          return (
            <div
              key={key}
              className="surface-base p-6 space-y-4 animate-pulse-soft"
            >
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6" />
              </div>
              <div className="flex gap-2 pt-4">
                <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded flex-1" />
                <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded flex-1" />
              </div>
            </div>
          );

        case 'circle':
          return (
            <div
              key={key}
              className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse-soft"
            />
          );

        case 'avatar':
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse-soft" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
              </div>
            </div>
          );

        case 'table-row':
          return (
            <tr key={key} className="animate-pulse-soft">
              <td className="px-4 py-3">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
              </td>
            </tr>
          );

        case 'grid':
          return (
            <div
              key={key}
              className="space-y-3 animate-pulse-soft"
            >
              <div className="h-40 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div ref={ref} className={`${className}`}>
        {variant === 'table-row' ? (
          <>{skeletons.map((i) => renderSkeleton(i))}</>
        ) : variant === 'grid' ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {skeletons.map((i) => renderSkeleton(i))}
          </div>
        ) : (
          <div className="space-y-4">
            {skeletons.map((i) => renderSkeleton(i))}
          </div>
        )}
      </div>
    );
  }
);

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;
