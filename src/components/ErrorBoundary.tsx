'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    // AniList rate-limits occasionally; sit quiet and let the retry button show.
    if (typeof window !== 'undefined') console.warn(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="mx-auto max-w-md p-8 text-center">
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              We couldn't reach the AniList API. It may be rate-limiting or down.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="btn btn-ghost mt-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.5rem 1rem' }}
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