"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowRight,
  ImageIcon,
  Play,
  Briefcase,
  MessageCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";

const platforms = [
  { key: "instagram", label: "Instagram", icon: ImageIcon, color: "text-pink-400" },
  { key: "youtube", label: "YouTube", icon: Play, color: "text-red-400" },
  { key: "linkedin", label: "LinkedIn", icon: Briefcase, color: "text-blue-400" },
  { key: "twitter", label: "Twitter / X", icon: MessageCircle, color: "text-cyan-400" },
  { key: "blog", label: "Blog", icon: FileText, color: "text-emerald-400" },
] as const;

const tagsList = [
  "productivity", "study", "tech", "routine", "personal",
  "tutorial", "review", "motivation", "career", "lifestyle",
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description must be under 500 characters").optional(),
  platforms: z.array(z.string()),
  tags: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

export function TextCapture() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      platforms: [],
      tags: [],
    },
    mode: "onChange",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedPlatforms = watch("platforms");
  const selectedTags = watch("tags");
  const currentDescription = watch("description") || "";

  const togglePlatform = (key: string) => {
    const newPlatforms = selectedPlatforms.includes(key)
      ? selectedPlatforms.filter((p) => p !== key)
      : [...selectedPlatforms, key];
    setValue("platforms", newPlatforms, { shouldValidate: true });
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setValue("tags", newTags, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          source: "text",
          sourceLabel: "Manual Text Note",
          platforms: data.platforms,
          tags: data.tags,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save idea");
      }

      toast.success("Idea saved successfully!");
      reset();
      router.refresh();
      router.push("/dashboard/ideas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="form-group">
        <label className="label-base">
          Idea Title <span className="text-red-400">*</span>
        </label>
        <input
          {...register("title")}
          type="text"
          placeholder="What's your content idea?"
          disabled={isSubmitting}
          className={cn(
            "input-base",
            errors.title && "input-error"
          )}
        />
        {errors.title && (
          <p className="text-caption text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="label-base">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={5}
          disabled={isSubmitting}
          placeholder="Describe the idea in detail — angles, key points, references..."
          className={cn(
            "input-base min-h-[100px] py-3 resize-none",
            errors.description && "input-error"
          )}
        />
        <div className="flex justify-between items-center">
          <p className="text-caption">
            {currentDescription.length}/500 characters
          </p>
          {errors.description && (
            <p className="text-caption text-destructive">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Target Platforms */}
      <div>
        <label className="label-base block mb-2">
          Target Platforms
        </label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => {
            const selected = selectedPlatforms.includes(p.key);
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => togglePlatform(p.key)}
                disabled={isSubmitting}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 disabled:opacity-50",
                  selected
                    ? "bg-accent-dim border-violet-500/25 text-text-primary"
                    : "bg-surface-hover border-border text-text-tertiary hover:text-text-secondary hover:border-border-hover"
                )}
              >
                <p.icon className={cn("w-3.5 h-3.5", selected ? p.color : "")} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="label-base block mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tagsList.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                disabled={isSubmitting}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 capitalize disabled:opacity-50",
                  selected
                    ? "bg-accent-dim border-violet-500/25 text-violet-300"
                    : "bg-surface-hover border-border text-text-tertiary hover:text-text-secondary hover:border-border-hover"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Note */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
        <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
        <p className="text-xs text-violet-300/80">
          AI will auto-tag, categorize, and suggest the best platforms for this idea later.
        </p>
      </div>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!isValid || isSubmitting}
        className={cn(
          "btn-base w-full",
          isValid && !isSubmitting
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/20"
            : "bg-surface-hover text-text-tertiary border border-border cursor-not-allowed opacity-70"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving Idea...
          </>
        ) : (
          <>
            Save Idea
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </form>
  );
}
