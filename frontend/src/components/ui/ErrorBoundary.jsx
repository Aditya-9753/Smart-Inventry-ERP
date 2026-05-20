import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

/**
 * ErrorBoundary Component
 * Catches React errors and displays graceful error UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Optionally reload the page
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-0 dark:bg-neutral-950">
          <div className="w-full max-w-md">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-status-critical-100 dark:bg-status-critical-900/30 rounded-full">
                <AlertTriangle
                  size={48}
                  className="text-status-critical-600 dark:text-status-critical-400"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-neutral-950 dark:text-neutral-0 mb-2">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
              We're sorry for the inconvenience. An unexpected error has occurred. Please try
              refreshing the page or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-auto max-h-48">
                <p className="text-xs font-mono text-status-critical-600 dark:text-status-critical-400 mb-2">
                  Error Details:
                </p>
                <pre className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
                    <p className="font-semibold mb-1">Component Stack:</p>
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button variant="primary" fullWidth onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="secondary" fullWidth onClick={() => window.location.href = '/'}>
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
