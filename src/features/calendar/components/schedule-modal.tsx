"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, Calendar, Clock, Link2, FileText, Briefcase, MessageCircle, ImageIcon, Play, Tag, Flag } from "lucide-react";
import type { Idea, IdeaPlatform, ScheduledPost } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  ideas: Idea[];
  existingPost?: ScheduledPost | null;
  onSave: (post: ScheduledPost) => void;
}

const platforms: { id: IdeaPlatform; label: string; icon: React.ElementType }[] = [
  { id: "instagram", label: "Instagram", icon: ImageIcon },
  { id: "youtube", label: "YouTube", icon: Play },
  { id: "linkedin", label: "LinkedIn", icon: Briefcase },
  { id: "twitter", label: "Twitter", icon: MessageCircle },
  { id: "blog", label: "Blog", icon: FileText },
];

export function ScheduleModal({ isOpen, onClose, selectedDate, ideas, existingPost, onSave }: ScheduleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    idea_id: existingPost?.idea_id || "",
    platform: existingPost?.platform || "twitter",
    publish_time: existingPost?.publish_time || "09:00",
    priority: existingPost?.priority || "medium",
    notes: existingPost?.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idea_id) {
      toast.error("Please select an idea to schedule.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const payload = {
        user_id: userData.user.id,
        idea_id: formData.idea_id,
        platform: formData.platform as IdeaPlatform,
        publish_date: format(selectedDate, "yyyy-MM-dd"),
        publish_time: formData.publish_time,
        priority: formData.priority,
        status: existingPost?.status || "scheduled",
        notes: formData.notes,
      };

      let result;
      if (existingPost?.id) {
        const { data, error } = await supabase
          .from("scheduled_posts")
          .update(payload)
          .eq("id", existingPost.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("scheduled_posts")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      toast.success(`Post successfully ${existingPost ? 'updated' : 'scheduled'}!`);
      onSave(result as ScheduledPost);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-surface border border-border rounded-2xl shadow-premium overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50">
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  {existingPost ? "Edit Scheduled Post" : "Schedule Content"}
                </h2>
                <p className="text-sm text-text-tertiary mt-1">
                  {format(selectedDate, "EEEE, MMMM do, yyyy")}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Select Idea */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> Select Idea
                </label>
                <select
                  value={formData.idea_id}
                  onChange={(e) => setFormData({ ...formData, idea_id: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-background border border-border text-sm text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-all outline-none"
                  required
                >
                  <option value="" disabled>Select an idea from your vault...</option>
                  {ideas.map((idea) => (
                    <option key={idea.id} value={idea.id}>
                      {idea.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as IdeaPlatform })}
                    className="w-full h-11 px-3 rounded-xl bg-background border border-border text-sm text-text-primary focus:border-brand-primary transition-all outline-none"
                  >
                    {platforms.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Time
                  </label>
                  <input
                    type="time"
                    value={formData.publish_time}
                    onChange={(e) => setFormData({ ...formData, publish_time: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-background border border-border text-sm text-text-primary focus:border-brand-primary transition-all outline-none"
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Flag className="w-4 h-4" /> Priority
                </label>
                <div className="flex gap-3">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={cn(
                        "flex-1 h-10 rounded-xl text-sm font-medium border transition-all capitalize",
                        formData.priority === p 
                          ? "bg-brand-primary/10 border-brand-primary/50 text-brand-primary" 
                          : "bg-background border-border text-text-tertiary hover:border-text-secondary"
                      )}
                    >
                      {p}
                    </motion.button>
                  ))}
                </div>
              </div>

               {/* Notes */}
               <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any specific instructions for publishing..."
                  className="w-full h-24 p-3 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-primary transition-all outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary glow px-6"
                >
                  {isSubmitting ? "Saving..." : (existingPost ? "Update Schedule" : "Schedule Content")}
                </motion.button>
              </div>

            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
