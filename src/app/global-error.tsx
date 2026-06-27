"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to external logging service in production
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md bg-surface border border-border rounded-[24px] p-8 text-center shadow-premium relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
          
          <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Something went wrong!
          </h1>
          
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            A critical error occurred while trying to render this page. We've been notified and are looking into it.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-secondary transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Try again
            </button>
            
            <Link 
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-surface-hover text-text-primary font-medium border border-border hover:bg-surface transition-colors"
            >
              <Home className="w-4 h-4" />
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
