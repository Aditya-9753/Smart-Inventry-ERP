import React from 'react';

/**
 * Card Component
 * Reusable container with surface styling
 * @param {ReactNode} children - Card content
 * @param {string} variant - 'base' | 'raised' | 'sunken'
 * @param {boolean} hoverable - Add hover effect
 * @param {string} className - Additional classes
 * @param {...any} props - HTML div attributes
 */
const Card = React.forwardRef(
  ({ children, variant = 'base', hoverable = false, className = '', ...props }, ref) => {
    const variantClasses = {
      base: 'surface-base',
      raised: 'surface-raised',
      sunken: 'surface-sunken',
    }[variant];

    return (
      <div
        ref={ref}
        className={`
          ${variantClasses}
          ${hoverable && 'hover:shadow-card transition-smooth cursor-pointer'}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader Component
 */
export const CardHeader = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 ${className}`} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

/**
 * CardBody Component
 */
export const CardBody = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props}>
    {children}
  </div>
));
CardBody.displayName = 'CardBody';

/**
 * CardFooter Component
 */
export const CardFooter = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-lg ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';

export default Card;
