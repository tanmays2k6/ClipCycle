"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  parseISO
} from "date-fns";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  MessageSquare,
  Play,
  Briefcase,
  MessageCircle,
  FileText
} from "lucide-react";
import type { Idea, ScheduledPost } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { ScheduleModal } from "@/features/calendar/components/schedule-modal";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

/* ─────────────── Configuration ─────────────── */

const platformIcons: Record<string, React.ElementType> = {
  instagram: MessageSquare,
  youtube: Play,
  linkedin: Briefcase,
  twitter: MessageCircle,
  blog: FileText,
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  missed: "bg-red-500/20 text-red-400 border-red-500/30",
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

/* ─────────────── Draggable Idea (Sidebar) ─────────────── */

function DraggableIdea({ idea }: { idea: Idea }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `idea-${idea.id}`,
    data: { type: "idea", idea },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "p-3 mb-2 rounded-xl border border-border bg-surface cursor-grab hover:border-brand-primary/50 transition-colors shadow-sm",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <p className="text-sm font-semibold text-text-primary line-clamp-1">{idea.title}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">
          {idea.status}
        </span>
      </div>
    </div>
  );
}

/* ─────────────── Draggable Event (Calendar Grid) ─────────────── */

function DraggableEvent({ post, idea }: { post: ScheduledPost; idea?: Idea }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `post-${post.id}`,
    data: { type: "post", post },
  });
  
  const PlatformIcon = platformIcons[post.platform] || MessageSquare;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "p-1.5 mb-1 rounded-lg border text-xs cursor-grab hover:brightness-110 transition-all flex items-center gap-1.5",
        statusColors[post.status] || statusColors.draft,
        isDragging ? "opacity-50 scale-95" : "opacity-100"
      )}
      title={idea?.title || "Unknown Idea"}
    >
      <PlatformIcon className="w-3 h-3 shrink-0" />
      <span className="font-medium truncate">{idea?.title || "Draft"}</span>
      {post.publish_time && (
        <span className="ml-auto text-[9px] opacity-70 shrink-0">{post.publish_time}</span>
      )}
    </div>
  );
}

/* ─────────────── Droppable Day (Calendar Grid) ─────────────── */

function DroppableDay({ 
  day, 
  currentMonth, 
  posts, 
  ideas, 
  onClickDay 
}: { 
  day: Date; 
  currentMonth: Date; 
  posts: ScheduledPost[]; 
  ideas: Idea[];
  onClickDay: (date: Date) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: format(day, "yyyy-MM-dd"),
  });

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        // Don't trigger if clicking an event
        if ((e.target as HTMLElement).closest('[role="button"]')) return;
        onClickDay(day);
      }}
      className={cn(
        "min-h-[120px] p-2 border-r border-b border-border/50 transition-colors relative cursor-pointer",
        !isSameMonth(day, currentMonth) ? "bg-surface/20" : "bg-transparent",
        isOver && "bg-brand-primary/10",
        isToday(day) && "bg-brand-primary/5"
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={cn(
            "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
            isToday(day)
              ? "bg-brand-primary text-white"
              : !isSameMonth(day, currentMonth)
              ? "text-text-tertiary"
              : "text-text-primary"
          )}
        >
          {format(day, "d")}
        </span>
      </div>

      <div className="space-y-1 relative z-10" role="button">
        {posts.map((post) => (
          <DraggableEvent 
            key={post.id} 
            post={post} 
            idea={ideas.find(i => i.id === post.idea_id)} 
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */

export default function CalendarClient({
  initialIdeas,
  initialScheduled,
}: {
  initialIdeas: Idea[];
  initialScheduled: ScheduledPost[];
}) {
  const [ideas] = useState<Idea[]>(initialIdeas);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(initialScheduled);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "today">("month");
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  // Right Panel State
  const [activeDateInfo, setActiveDateInfo] = useState<Date | null>(null);

  // DnD State
  const [activeDragItem, setActiveDragItem] = useState<{ type: string; data: unknown } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  /* ─────────────── Date Logic ─────────────── */
  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const daysToRender = view === "month" ? monthDays : view === "week" ? weekDays : [currentDate];

  const handlePrevious = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    if (view === "week") setCurrentDate(subDays(currentDate, 7));
    if (view === "today") setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    if (view === "week") setCurrentDate(addDays(currentDate, 7));
    if (view === "today") setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setView("today");
  };

  /* ─────────────── Drag & Drop Handlers ─────────────── */
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragItem(active.data.current as { type: string; data: unknown });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    const targetDateStr = over.id as string; // yyyy-MM-dd
    const data = active.data.current as { type: string; idea?: Idea; post?: ScheduledPost };
    
    const supabase = createClient();

    if (data.type === "idea") {
      // Create new scheduled post from draft idea
      const idea = data.idea as Idea;
      
      // We open modal instead of auto-saving to allow setting time & platform
      setSelectedDate(parseISO(targetDateStr));
      setEditingPost({
        id: "",
        user_id: idea.user_id,
        idea_id: idea.id,
        platform: "instagram", // default
        publish_date: targetDateStr,
        publish_time: "09:00",
        priority: "medium",
        status: "scheduled",
        notes: null,
        created_at: "",
        updated_at: ""
      });
      setModalOpen(true);

    } else if (data.type === "post") {
      // Move existing scheduled post to new date
      const post = data.post as ScheduledPost;
      if (post.publish_date === targetDateStr) return; // No change

      // Optimistic update
      setScheduledPosts((prev) => 
        prev.map((p) => p.id === post.id ? { ...p, publish_date: targetDateStr } : p)
      );

      try {
        const { error } = await supabase
          .from("scheduled_posts")
          .update({ publish_date: targetDateStr })
          .eq("id", post.id);
        
        if (error) throw error;
        toast.success("Schedule updated!");
      } catch {
        toast.error("Failed to move post.");
        // Revert (simplified)
        setScheduledPosts(initialScheduled);
      }
    }
  };

  /* ─────────────── Render ─────────────── */

  const drafts = ideas.filter(i => i.status !== "used" && i.status !== "archived");

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Left Sidebar: Drafts */}
        <aside className="w-64 border-r border-border/50 bg-background/50 flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-border/50">
            <h2 className="text-sm font-bold tracking-tight text-text-primary">Content Library</h2>
            <p className="text-xs text-text-tertiary mt-1">Drag drafts to schedule</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Draft Ideas</h3>
              <div className="space-y-2">
                {drafts.map(idea => (
                  <DraggableIdea key={idea.id} idea={idea} />
                ))}
                {drafts.length === 0 && (
                  <div className="text-center py-6 px-4 rounded-xl border border-dashed border-border/50 bg-surface/20 mt-4">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-surface flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-text-tertiary" />
                    </div>
                    <p className="text-sm font-semibold text-text-primary mb-1">No drafts</p>
                    <p className="text-xs text-text-tertiary mb-3">Save ideas first to schedule them here.</p>
                    <Link href="/dashboard/ideas/new" className="text-[11px] font-medium text-brand-primary hover:text-brand-secondary">
                      Go to Ideas &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-16 px-6 border-b border-border/50 flex items-center justify-between shrink-0 bg-surface/30 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-text-primary w-40">
                {format(currentDate, "MMMM yyyy")}
              </h1>
              <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-xl shadow-sm">
                <button onClick={handlePrevious} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={handleToday} className="px-3 py-1 text-xs font-medium text-text-primary rounded-lg hover:bg-surface-hover">
                  Today
                </button>
                <button onClick={handleNext} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 bg-surface border border-border rounded-xl">
                {(["month", "week", "today"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors",
                      view === v ? "bg-background text-brand-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => {
                  setSelectedDate(new Date());
                  setEditingPost(null);
                  setModalOpen(true);
                }}
                className="btn-primary glow py-2 px-3 text-xs"
              >
                <Plus className="w-4 h-4" />
                Schedule
              </button>
            </div>
          </header>

          {/* Grid Header (Days of week) */}
          {view !== "today" && (
            <div className="grid grid-cols-7 border-b border-border/50 bg-surface/20 shrink-0">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
          )}

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto w-full h-full">
              <div 
                className={cn(
                  "h-full border-t border-l border-border/50 rounded-2xl overflow-hidden shadow-sm bg-surface/5 backdrop-blur-sm",
                  view !== "today" ? "grid grid-cols-7" : "grid grid-cols-1"
                )}
                style={{ 
                  gridTemplateRows: view === "month" ? `repeat(${Math.ceil(daysToRender.length / 7)}, minmax(120px, 1fr))` : "1fr"
                }}
              >
                {daysToRender.map((day) => (
                  <DroppableDay 
                    key={day.toISOString()} 
                    day={day} 
                    currentMonth={currentDate}
                    posts={scheduledPosts.filter(p => p.publish_date === format(day, "yyyy-MM-dd"))}
                    ideas={ideas}
                    onClickDay={(d) => {
                      setActiveDateInfo(d);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Day Details */}
        <AnimatePresence>
          {activeDateInfo && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border/50 bg-surface/30 backdrop-blur-md flex flex-col shrink-0 overflow-hidden hidden xl:flex"
            >
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    {format(activeDateInfo, "MMM do, yyyy")}
                  </h3>
                  <p className="text-xs text-text-tertiary mt-1">{format(activeDateInfo, "EEEE")}</p>
                </div>
                <button onClick={() => setActiveDateInfo(null)} className="p-1.5 rounded-lg hover:bg-surface-hover text-text-tertiary">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Scheduled Posts</h4>
                
                {scheduledPosts.filter(p => p.publish_date === format(activeDateInfo, "yyyy-MM-dd")).length === 0 ? (
                  <div className="text-center py-10 px-4 rounded-2xl bg-surface/20 border border-border/50 mt-4">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                      <CalendarIcon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <p className="text-base font-semibold text-text-primary mb-1">Your schedule is clear</p>
                    <p className="text-xs text-text-tertiary mb-5 max-w-[200px] mx-auto leading-relaxed">
                      Drag a draft here or click Add Post to plan your content for this day.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduledPosts.filter(p => p.publish_date === format(activeDateInfo, "yyyy-MM-dd")).map(post => {
                      const idea = ideas.find(i => i.id === post.idea_id);
                      const PlatformIcon = platformIcons[post.platform] || MessageSquare;
                      return (
                        <div key={post.id} className="p-4 rounded-xl border border-border bg-surface shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <PlatformIcon className="w-4 h-4 text-brand-primary" />
                            <span className="text-xs font-semibold text-text-secondary capitalize">{post.platform}</span>
                            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-surface-hover text-text-tertiary">
                              {post.publish_time || "Any time"}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-text-primary mb-1 leading-snug">{idea?.title}</p>
                          <p className="text-xs text-text-tertiary line-clamp-2">{idea?.description}</p>
                          
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                            <button 
                              onClick={() => {
                                setSelectedDate(activeDateInfo);
                                setEditingPost(post);
                                setModalOpen(true);
                              }}
                              className="text-[11px] font-medium text-violet-400 hover:text-violet-300"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <button 
                  onClick={() => {
                    setSelectedDate(activeDateInfo);
                    setEditingPost(null);
                    setModalOpen(true);
                  }}
                  className="w-full mt-6 py-2.5 rounded-xl border border-dashed border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
                >
                  + Add Post
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Drag Overlay for smooth animations */}
        <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeDragItem ? (
             activeDragItem.type === "idea" ? (
               <div className="p-3 rounded-xl border border-brand-primary bg-surface shadow-premium opacity-90 scale-105">
                 <p className="text-sm font-semibold text-text-primary">{(activeDragItem.data as Idea).title}</p>
               </div>
             ) : (
               <div className="p-2 rounded-lg border border-brand-primary bg-brand-primary/20 shadow-premium opacity-90 scale-105">
                 <p className="text-xs font-semibold text-brand-primary">Moving Post...</p>
               </div>
             )
          ) : null}
        </DragOverlay>

      </DndContext>

      {/* Schedule Modal */}
      <ScheduleModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        selectedDate={selectedDate} 
        ideas={drafts}
        existingPost={editingPost}
        onSave={(post) => {
          setScheduledPosts(prev => {
            const exists = prev.find(p => p.id === post.id);
            if (exists) return prev.map(p => p.id === post.id ? post : p);
            return [...prev, post];
          });
        }}
      />
    </div>
  );
}
