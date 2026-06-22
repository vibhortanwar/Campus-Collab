import React from "react";

/**
 * A simple Error Boundary that catches render errors in its children
 * and shows a fallback UI instead of crashing the whole page.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-center py-10 text-slate-500 text-sm">
            <p>Something went wrong while loading this content.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-3 text-blue-400 hover:underline text-xs"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
