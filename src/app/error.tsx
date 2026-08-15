'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground rounded-full px-6 py-3 text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-transparent border border-border rounded-full px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
