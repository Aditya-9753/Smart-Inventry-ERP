import React, { useState } from 'react';

/**
 * Tabs Component
 * Tabbed interface for content organization
 * @param {Array} tabs - Array of { id, label, icon?, content }
 * @param {string} defaultTab - Default active tab ID
 * @param {function} onChange - Callback when tab changes
 * @param {string} variant - 'pills' | 'underline'
 * @param {string} className - Additional classes
 */
const Tabs = React.forwardRef(
  ({ tabs = [], defaultTab, onChange, variant = 'pills', className = '' }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    };

    const tabClass = {
      pills: `
        px-4 py-2 rounded-base font-medium text-sm transition-smooth
        ${
          activeTab === tab.id
            ? 'bg-brand-600 dark:bg-brand-500 text-white'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
        }
      `,
      underline: `
        px-4 py-3 font-medium text-sm transition-smooth border-b-2
        ${
          activeTab === tab.id
            ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
            : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
        }
      `,
    };

    return (
      <div ref={ref} className={className}>
        {/* Tab List */}
        <div
          className={`
            flex gap-1 flex-wrap
            ${
              variant === 'pills'
                ? 'bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg'
                : 'border-b border-neutral-200 dark:border-neutral-700'
            }
          `}
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              className={tabClass[variant].replace(
                /\$\{activeTab === tab\.id\s\?\s'[^']*'\s:\s'[^']*'\}/g,
                activeTab === tab.id
                  ? variant === 'pills'
                    ? 'bg-brand-600 dark:bg-brand-500 text-white'
                    : 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                  : variant === 'pills'
                  ? 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              )}
              className={`
                px-4 py-2 font-medium text-sm transition-smooth rounded-base flex items-center gap-2
                ${
                  variant === 'pills'
                    ? `${
                        activeTab === tab.id
                          ? 'bg-brand-600 dark:bg-brand-500 text-white'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`
                    : `border-b-2 ${
                        activeTab === tab.id
                          ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                          : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`
                }
              `}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={activeTab === tab.id ? 'block' : 'hidden'}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export default Tabs;
