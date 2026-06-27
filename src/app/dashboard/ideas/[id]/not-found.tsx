"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function IdeaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6"
      >
        <AlertCircle className="w-10 h-10 text-red-400" />
      </motion.div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Idea Not Found</h2>
      <p className="text-text-secondary max-w-sm mb-8">
        The idea you are trying to view does not exist or may have been deleted.
      </p>
      <Link
        href="/dashboard/ideas"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-text-primary hover:bg-surface-hover transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Vault
      </Link>
    </div>
  );
}
