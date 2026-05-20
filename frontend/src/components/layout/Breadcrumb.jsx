import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter((x) => x);

  if (paths.length === 0) return null;

  return (
    <nav
      className="flex px-5 py-3 text-neutral-700 dark:text-neutral-300 bg-neutral-0 dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6 transition-colors duration-200"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to={`/${paths[0]}/dashboard`}
            className="inline-flex items-center text-sm font-medium text-neutral-700 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400 transition-colors duration-150 focus-ring"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>

        {paths.slice(1).map((path, index) => {
          const routeTo = `/${paths.slice(0, index + 2).join('/')}`;
          const isLast = index === paths.length - 2;

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
              {isLast ? (
                <span className="ml-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 md:ml-2 capitalize">
                  {path.replace(/-/g, ' ')}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="ml-1 text-sm font-medium text-neutral-700 hover:text-brand-600 md:ml-2 dark:text-neutral-400 dark:hover:text-brand-400 transition-colors duration-150 capitalize focus-ring"
                >
                  {path.replace(/-/g, ' ')}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
