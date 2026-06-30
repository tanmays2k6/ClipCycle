"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
  Copy,
  Trash2,
  MoreVertical,
  Play,
  Briefcase,
  MessageCircle,
  FileText,
  ImageIcon
} from "lucide-react";
import type { Idea } from "@/types/database";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";

const platformIcons: Record<string, React.ElementType> = {
  instagram: ImageIcon,
  youtube: Play,
  linkedin: Briefcase,
  twitter: MessageCircle,
  blog: FileText,
};

const platformColors: Record<string, string> = {
  instagram: "text-pink-400 bg-pink-400/10",
  youtube: "text-red-400 bg-red-400/10",
  linkedin: "text-blue-400 bg-blue-400/10",
  twitter: "text-cyan-400 bg-cyan-400/10",
  blog: "text-emerald-400 bg-emerald-400/10",
};

export default function PublishedClient({ initialPublished }: { initialPublished: Idea[] }) {
  const [published, setPublished] = useState<Idea[]>(initialPublished);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = published.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = (id: string) => {
    // Optimistic delete
    setPublished(published.filter(p => p.id !== id));
    toast.success("Record removed from published history");
  };

  const handleDuplicate = (id: string) => {
    toast.success("Idea duplicated as Draft");
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full flex flex-col min-h-full pb-16">
      
      {/* Breadcrumb */}
      <div className="pt-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-medium text-text-tertiary">
          <span>Workspace</span>
          <span>/</span>
          <span className="text-text-secondary">Published</span>
        </div>
      </div>

      {/* Page Header */}
      <header className="px-4 sm:px-6 lg:px-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Published Content</h1>
          <p className="text-sm text-text-tertiary mt-1">Review and analyze your previously published ideas.</p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-sm">
          
          {/* Search Bar */}
          <div className="relative w-full md:max-w-[400px] group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search published content..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 h-10 px-3 rounded-xl bg-background border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors shadow-sm">
              <ArrowUpDown className="w-4 h-4" /> Sort by Date
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6 flex-1">
        {filtered.length > 0 ? (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-6 py-4 text-[13px] font-semibold text-text-secondary">Post Title</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-text-secondary">Platform</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-text-secondary">Date Published</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-text-secondary">Views</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-text-secondary">Engagement</th>
                    <th className="px-6 py-4 text-[13px] font-semibold text-text-secondary text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((item) => {
                    const platform = item.published_platform || "linkedin";
                    const PlatformIcon = platformIcons[platform] || Briefcase;
                    const colorClasses = platformColors[platform] || platformColors.linkedin;
                    
                    return (
                      <tr key={item.id} className="hover:bg-surface-hover/50 transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/ideas/${item.id}`} className="font-medium text-sm text-text-primary hover:text-brand-primary transition-colors line-clamp-1">
                            {item.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize", colorClasses)}>
                            <PlatformIcon className="w-3.5 h-3.5" />
                            {platform}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {item.published_at ? format(parseISO(item.published_at), "MMM d, yyyy") : "Recently"}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                          {Math.floor(Math.random() * 5000) + 100} {/* Placeholder */}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                          {Math.floor(Math.random() * 500) + 10} {/* Placeholder */}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDuplicate(item.id)} className="p-1.5 text-text-tertiary hover:text-brand-primary rounded-md hover:bg-brand-primary/10 transition-colors" title="Duplicate">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-text-tertiary hover:text-red-400 rounded-md hover:bg-red-400/10 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <Link href={`/dashboard/ideas/${item.id}`} className="p-1.5 text-text-tertiary hover:text-text-primary rounded-md hover:bg-surface-hover transition-colors" title="Open">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center py-24">
             <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6 shadow-premium glass-premium card-hover-border relative overflow-hidden">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 relative z-10" />
             </div>
             <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-2">No published content yet</h3>
             <p className="text-sm text-text-secondary mb-8 leading-relaxed max-w-sm mx-auto">
               You haven't published any content. Generate AI content from an idea to get started.
             </p>
             <Link href="/dashboard/ideas" className="btn-primary glow px-6 py-3">
               <span className="relative z-10 font-semibold tracking-wide flex items-center gap-2">
                 Go to Idea Vault
               </span>
             </Link>
          </div>
        )}
      </div>

    </div>
  );
}
