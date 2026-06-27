"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      } else {
        toast.error("Failed to load settings");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-8 animate-pulse">
        <div className="h-8 bg-surface-hover rounded w-1/4"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-surface-hover rounded w-24"></div>
          <div className="h-10 bg-surface-hover rounded w-24"></div>
          <div className="h-10 bg-surface-hover rounded w-24"></div>
        </div>
        <div className="h-64 bg-surface-hover rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
          Settings
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your ClipCycle account.
        </p>
      </motion.div>

      <SettingsLayout initialSettings={settings} onRefresh={fetchSettings} />
    </div>
  );
}
