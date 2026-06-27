"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function IdeasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // Log to external logging service in production
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-2">
        <AlertCircle className="w-8 h-8 text-amber-500" />
      </div>
      <h2 className="text-xl font-bold text-text-primary">Failed to load ideas</h2>
      <p className="text-sm text-text-secondary max-w-md">
        We couldn&apos;t load the content ideas. This might be due to a network issue.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => reset()}
        className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Loading
      </motion.button>
    </div>
  );
}
