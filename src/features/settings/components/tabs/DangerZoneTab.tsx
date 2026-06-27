"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DangerZoneTab() {
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const isConfirmed = confirmation === "DELETE";

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/auth/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      toast.success("Account deleted successfully");
      router.push("/auth/login");
    } catch (err) {
      toast.error("Failed to delete account. Please contact support.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-red-500 tracking-tight">Delete Account</h3>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
              Once you delete your account, there is no going back. Please be certain. 
              This will permanently delete your user profile, all saved ideas, generated content history, and analytics data.
            </p>
          </div>
        </div>

        <div className="h-px bg-red-500/10 w-full" />

        <div className="space-y-4">
          <label className="text-sm font-medium text-text-primary block">
            To confirm, type <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-red-500 border border-border select-all">DELETE</span> below:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DELETE"
              className="w-full sm:w-64 bg-surface border border-red-500/20 rounded-xl px-4 py-2.5 text-sm font-mono text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-red-500/30"
            />
            <button
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
