"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, CheckCircle2, Clock, Sparkles, TrendingUp, TrendingDown, ArrowRight,
  Flame, Target, Zap, Plus, Activity, FileText, LayoutGrid, MessageCircle, Play, 
  Layers, Send, Briefcase, Compass, Wand2, Bell, Hash, Edit2, Trash2, Heart, X, Camera, Mic, Loader2, AlertTriangle, Search
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { Idea } from "@/types/database";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { toast } from "sonner";
import { TabBar, TabPanel } from "@/components/shared/tabs";
import { Logo } from "@/components/ui/logo";
import {
  TextCapture,
  ScreenshotCapture,
  VoiceCapture,
  InstagramCapture,
  YoutubeCapture,
} from "@/features/ideas";

/* ─────────────── Mock Data ─────────────── */

const mockActivity = [
  { id: 1, title: "Idea Captured", time: "5 hours ago", icon: Plus, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: 2, title: "AI Analysis", time: "4 hours ago", icon: Sparkles, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
  { id: 3, title: "LinkedIn Generated", time: "2 hours ago", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: 4, title: "Scheduled", time: "Today", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
];

const mockRecentAI = [
  { id: 1, title: "10 Rules of UI", type: "Carousel Outline", icon: LayoutGrid, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: 2, title: "Future of React", type: "Twitter Thread", icon: MessageCircle, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { id: 3, title: "Animation Basics", type: "Instagram Reel", icon: Play, color: "text-pink-400", bg: "bg-pink-400/10" },
];

const mockRepurposing = [
  { id: 1, title: "The Art of Simplicity", recommend: "Turn into a LinkedIn post", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: 2, title: "Why Next.js?", recommend: "Create a Twitter thread", icon: MessageCircle, color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

/* ─────────────── Components ─────────────── */

function StatCard({ title, value, desc, icon: Icon, color, trendUp }: any) {
  return (
    <div 
      className="h-[100px] card-base hover:bg-card/80 transition-colors p-4 flex flex-col justify-between group cursor-default"
    >
       <div className="flex justify-between items-center">
         <span className="text-[13px] text-muted-foreground font-medium tracking-tight">{title}</span>
         <Icon className={`w-4 h-4 ${color} opacity-80`} />
       </div>
       <div className="flex items-baseline gap-2 mt-1">
         <h3 className="text-[24px] font-semibold text-foreground tracking-tight leading-none">{value}</h3>
         <span className={`text-[12px] flex items-center gap-0.5 ${trendUp ? 'text-emerald-500' : 'text-muted-foreground'}`}>
           {trendUp && <TrendingUp className="w-3 h-3" />}
           {desc}
         </span>
       </div>
    </div>
  )
}

function CompactIdeaCard({ idea, onClick, onEdit, onDelete, onFavourite, onGenerate }: { idea: Idea, onClick: () => void, onEdit: (e: React.MouseEvent) => void, onDelete: (e: React.MouseEvent) => void, onFavourite: (e: React.MouseEvent) => void, onGenerate: (e: React.MouseEvent) => void }) {
  return (
    <div 
      onClick={onClick}
      className="h-[180px] card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Action Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-background/80 backdrop-blur-md p-1 rounded-lg border border-border/50">
        <button onClick={onFavourite} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors" title="Favourite">
          <Heart className={cn("w-3.5 h-3.5", idea.is_favorite ? "fill-red-500 text-red-500" : "")} />
        </button>
        <button onClick={onGenerate} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title="Generate AI">
          <Wand2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={onEdit} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-blue-500 transition-colors" title="Edit">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors" title="Delete">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
            <span className="text-[12px] font-medium text-muted-foreground capitalize tracking-wide">{idea.status}</span>
          </div>
        </div>
        <h3 className="text-[15px] font-semibold text-foreground line-clamp-1 mb-1 pr-12 tracking-tight">{idea.title}</h3>
        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">{idea.description || "No description provided."}</p>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
         <div className="flex items-center gap-2 overflow-hidden">
           {idea.tags && idea.tags.length > 0 ? idea.tags.slice(0, 2).map(tag => (
             <span key={tag} className="flex items-center gap-1 text-[12px] text-muted-foreground whitespace-nowrap">
               #{tag}
             </span>
           )) : (
             <span className="text-[12px] text-muted-foreground">No tags</span>
           )}
         </div>
         <div className="flex items-center gap-1.5 text-[12px] font-medium text-primary shrink-0">
            <Sparkles className="w-3 h-3" /> Ready
         </div>
      </div>
    </div>
  )
}

/* ─────────────── Dashboard Client ─────────────── */

export default function DashboardClient({ 
  recentIdeas, 
  stats 
}: { 
  recentIdeas: Idea[], 
  stats: Record<string, number> 
}) {
  const router = useRouter();
  const { userDisplayName } = useAuth();
  
  const [greeting, setGreeting] = useState("");
  const [localIdeas, setLocalIdeas] = useState<Idea[]>(recentIdeas);
  
  // Modals state
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [activeCaptureTab, setActiveCaptureTab] = useState("text");
  
  const [activeIdea, setActiveIdea] = useState<Idea | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalIdeas(recentIdeas);
  }, [recentIdeas]);

  useEffect(() => {
    const hour = new Date().getHours();
    const name = userDisplayName?.split(" ")[0] || "Creator";
    if (hour < 12) setGreeting(`Good Morning, ${name} 👋`);
    else if (hour < 18) setGreeting(`Good Afternoon, ${name} ☀️`);
    else setGreeting(`Good Evening, ${name} 🌙`);
  }, [userDisplayName]);

  // Actions
  const handleFavourite = async (idea: Idea) => {
    const newVal = !idea.is_favorite;
    setLocalIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, is_favorite: newVal } : i));
    try {
      const res = await fetch(`/api/ideas/${idea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: newVal }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(newVal ? "Added to favourites" : "Removed from favourites");
    } catch {
      toast.error("Failed to update favourite");
      setLocalIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, is_favorite: !newVal } : i));
    }
  };

  const handleEdit = (idea: Idea) => {
    setActiveIdea(idea);
    setEditTitle(idea.title);
    setEditDesc(idea.description || "");
    setIsEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!activeIdea) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/ideas/${activeIdea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });
      if (!res.ok) throw new Error("Failed");
      setLocalIdeas(prev => prev.map(i => i.id === activeIdea.id ? { ...i, title: editTitle, description: editDesc } : i));
      toast.success("Idea updated");
      setIsEditModalOpen(false);
    } catch {
      toast.error("Failed to update idea");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeIdea) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/ideas/${activeIdea.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setLocalIdeas(prev => prev.filter(i => i.id !== activeIdea.id));
      toast.success("Idea deleted");
      setIsDeleteModalOpen(false);
    } catch {
      toast.error("Failed to delete idea");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-h2 leading-tight">
              {greeting}
            </h1>
            <p className="text-body mt-0.5 text-muted-foreground">
              You have <span className="text-foreground font-medium">{stats.pending || 0} ideas</span> waiting to become content.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-2">
            <button onClick={() => setIsCaptureModalOpen(true)} className="btn-outline h-8 px-3 text-[13px]">
              <Plus className="w-4 h-4" /> Quick Capture
            </button>
            <Link href="/dashboard/generate" className="btn-primary h-8 px-3 text-[13px]">
              <Sparkles className="w-4 h-4" /> Generate
            </Link>
            <div className="w-px h-5 bg-border/50 mx-1"></div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors" aria-label="Notifications">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-[13px] border border-primary/20" aria-label="Profile">
              {userDisplayName?.charAt(0) || "C"}
            </button>
          </motion.div>
        </div>

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-2 border-b border-border/50">
           <div className="relative w-full sm:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <input type="text" placeholder="Search ideas..." className="input-base pl-9 py-1.5" />
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors bg-card/40 whitespace-nowrap shadow-sm">
               <Layers className="w-3.5 h-3.5" /> Collections
             </button>
             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors bg-card/40 whitespace-nowrap shadow-sm">
               <Hash className="w-3.5 h-3.5" /> Filters
             </button>
             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors bg-card/40 whitespace-nowrap shadow-sm">
               <TrendingDown className="w-3.5 h-3.5" /> Sort
             </button>
           </div>
        </motion.div>

        {/* Statistics Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => router.push("/dashboard/ideas")} className="cursor-pointer">
            <StatCard title="Current Streak" value={stats.streak || 0} desc={stats.streak > 3 ? "On fire!" : "Keep it up"} icon={Flame} color="text-orange-500" trendUp={stats.streak > 0} />
          </div>
          <div onClick={() => router.push("/dashboard/ideas?filter=pending")} className="cursor-pointer">
            <StatCard title="Pending Ideas" value={stats.pending || 0} desc="Awaiting action" icon={Lightbulb} color="text-emerald-500" trendUp={stats.pending > 0} />
          </div>
          <div onClick={() => router.push("/dashboard/analytics")} className="cursor-pointer">
            <StatCard title="AI Score" value={stats.aiScore || 0} desc="Productivity" icon={Target} color="text-primary" trendUp={stats.aiScore > 50} />
          </div>
          <div onClick={() => router.push("/dashboard/ideas?filter=published")} className="cursor-pointer">
            <StatCard title="Published" value={stats.published || 0} desc="Lifetime content" icon={CheckCircle2} color="text-blue-500" trendUp={false} />
          </div>
        </motion.div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* AI Suggestions Hero Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="rounded-[14px] bg-card/40 border border-border/50 p-5 flex flex-col gap-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div>
                <h2 className="text-h3 flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" /> AI Suggestions
                </h2>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between bg-background/50 p-4 rounded-xl border border-border/50 gap-4">
                <div>
                  <span className="text-[12px] text-primary font-medium uppercase tracking-wider mb-1 block">Top Recommendation</span>
                  {localIdeas.length > 0 ? (
                    <>
                      <h3 className="text-[16px] font-semibold text-foreground mb-1 leading-tight">Generate content for '{localIdeas[0].title}'</h3>
                      <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xl">Reason: Fresh idea with high potential. Convert it to a Twitter Thread now.</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-[16px] font-semibold text-foreground mb-1 leading-tight">Capture an idea first</h3>
                      <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xl">You don't have any ideas yet. Capture one to get AI recommendations.</p>
                    </>
                  )}
                </div>
                {localIdeas.length > 0 && (
                  <button 
                    onClick={() => router.push(`/dashboard/ideas/${localIdeas[0].id}?action=generate&template=Twitter%20Thread`)}
                    className="whitespace-nowrap px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium shadow-sm hover:opacity-90 transition-all"
                  >
                    Generate Now
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                 <button 
                   onClick={() => localIdeas.length > 0 && router.push(`/dashboard/ideas/${localIdeas[0].id}?action=generate&template=Carousel`)}
                   disabled={localIdeas.length === 0}
                   className="px-3 py-1.5 rounded-lg bg-card border border-border/50 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium disabled:opacity-50 shadow-sm"
                 >
                   Convert to Carousel
                 </button>
                 <button 
                   onClick={() => localIdeas.length > 0 && router.push(`/dashboard/ideas/${localIdeas[0].id}?action=generate&template=Newsletter`)}
                   disabled={localIdeas.length === 0}
                   className="px-3 py-1.5 rounded-lg bg-card border border-border/50 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium disabled:opacity-50 shadow-sm"
                 >
                   Draft Newsletter
                 </button>
                 <button 
                   onClick={() => localIdeas.length > 0 && router.push(`/dashboard/ideas/${localIdeas[0].id}?action=generate&template=LinkedIn%20Post`)}
                   disabled={localIdeas.length === 0}
                   className="px-3 py-1.5 rounded-lg bg-card border border-border/50 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium disabled:opacity-50 shadow-sm"
                 >
                   Repurpose for LinkedIn
                 </button>
              </div>
            </motion.div>

            {/* Recent Ideas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-h3">Recent Ideas</h2>
                <Link href="/dashboard/ideas" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-medium">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localIdeas.slice(0, 4).map(idea => (
                  <CompactIdeaCard 
                    key={idea.id} 
                    idea={idea} 
                    onClick={() => router.push(`/dashboard/ideas/${idea.id}`)}
                    onEdit={(e) => { e.stopPropagation(); handleEdit(idea); }}
                    onDelete={(e) => { 
                      e.stopPropagation(); 
                      setActiveIdea(idea); 
                      setIsDeleteModalOpen(true); 
                    }}
                    onFavourite={(e) => { e.stopPropagation(); handleFavourite(idea); }}
                    onGenerate={(e) => { e.stopPropagation(); router.push(`/dashboard/ideas/${idea.id}?action=generate`); }}
                  />
                ))}
                {localIdeas.length === 0 && (
                  <div className="col-span-2 p-10 rounded-[14px] border border-border/50 bg-card/40 text-center flex flex-col items-center justify-center">
                    <Logo variant="icon" size={48} className="mb-4 opacity-50 grayscale" />
                    <p className="text-[16px] font-semibold text-foreground mb-1">No ideas yet</p>
                    <p className="text-[13px] text-muted-foreground">Capture your first idea to get started.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex flex-col gap-3 pt-2">
              <h2 className="text-h3">Recent Activity</h2>
              <div className="rounded-[14px] bg-card/40 border border-border/50 p-6">
                 <div className="relative border-l border-border/50 ml-3 space-y-6">
                    {mockActivity.map((act, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className={`absolute -left-[28px] top-1 w-6 h-6 rounded-full flex items-center justify-center ${act.bg} ${act.color} ring-4 ring-card bg-background z-10`}>
                          <act.icon className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-foreground leading-none mb-1.5">{act.title}</p>
                          <span className="text-[12px] text-muted-foreground">{act.time}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="flex flex-col gap-6">
            
            {/* AI Productivity Widget */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="rounded-[14px] bg-card/40 border border-border/50 p-5 flex flex-col gap-4">
               <h2 className="text-h3 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-emerald-500" /> Productivity Score
               </h2>
               <div className="flex flex-col gap-3 pt-1">
                 <div className="flex justify-between items-end">
                   <div className="text-[32px] font-semibold text-foreground leading-none tracking-tight">{stats.aiScore || 0}<span className="text-[16px] text-muted-foreground font-normal">/100</span></div>
                   <div className="text-[12px] text-emerald-500 font-medium px-2 py-0.5 bg-emerald-500/10 rounded flex items-center gap-1 mb-1">
                     <TrendingUp className="w-3 h-3" /> +5
                   </div>
                 </div>
                 <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full" style={{ width: `${stats.aiScore || 0}%` }} />
                 </div>
                 <p className="text-[12px] text-muted-foreground leading-relaxed">
                   Your AI utilization is growing. Keep capturing ideas and generating content.
                 </p>
               </div>
            </motion.div>

            {/* Recommended Next Steps */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="rounded-[14px] bg-card/40 border border-border/50 p-5 flex flex-col gap-4">
               <h2 className="text-h3 flex items-center gap-2">
                 <Compass className="w-4 h-4 text-blue-500" /> Next Steps
               </h2>
               <div className="flex flex-col gap-2 pt-1">
                 {mockRepurposing.map(item => (
                   <div key={item.id} className="p-3 rounded-lg bg-card border border-border/50 hover:bg-muted transition-colors cursor-pointer group shadow-sm">
                     <div className="flex items-center gap-2 mb-1">
                       <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                       <span className="text-[13px] font-medium text-foreground">{item.title}</span>
                     </div>
                     <p className="text-[12px] text-muted-foreground pl-[26px] group-hover:text-foreground transition-colors">
                       {item.recommend} &rarr;
                     </p>
                   </div>
                 ))}
               </div>
            </motion.div>

            {/* Recent Generations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="rounded-[14px] bg-card/40 border border-border/50 p-5 flex flex-col gap-3">
               <h2 className="text-h3 flex items-center gap-2">
                 <Wand2 className="w-4 h-4 text-primary" /> Recent Output
               </h2>
               <div className="flex flex-col gap-2 pt-1">
                 {mockRecentAI.map(item => (
                   <div key={item.id} onClick={() => router.push("/dashboard/generate")} className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-border/50 hover:bg-muted transition-colors cursor-pointer group">
                     <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg}`}>
                         <item.icon className={`w-4 h-4 ${item.color}`} />
                       </div>
                       <div>
                         <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors leading-tight">{item.title}</p>
                         <p className="text-[12px] text-muted-foreground leading-tight mt-0.5">{item.type}</p>
                       </div>
                     </div>
                     <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                   </div>
                 ))}
               </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Capture Modal */}
      <AnimatePresence>
        {isCaptureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsCaptureModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto card-base p-0 shadow-2xl z-10 hide-scrollbar"
            >
              <div className="sticky top-0 bg-card border-b border-border z-20 flex items-center justify-between p-4">
                <h3 className="text-lg font-bold">Quick Capture</h3>
                <button onClick={() => setIsCaptureModalOpen(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <TabBar 
                  tabs={[
                    { key: "text", label: "Text", icon: FileText },
                    { key: "screenshot", label: "Screenshot", icon: Camera },
                    { key: "voice", label: "Voice", icon: Mic },
                    { key: "youtube", label: "YouTube", icon: Play }
                  ]} 
                  activeTab={activeCaptureTab} 
                  onTabChange={setActiveCaptureTab} 
                />
                <div className="mt-6">
                  <TabPanel active={activeCaptureTab === "text"}><TextCapture /></TabPanel>
                  <TabPanel active={activeCaptureTab === "screenshot"}><ScreenshotCapture /></TabPanel>
                  <TabPanel active={activeCaptureTab === "voice"}><VoiceCapture /></TabPanel>
                  <TabPanel active={activeCaptureTab === "youtube"}><YoutubeCapture /></TabPanel>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && activeIdea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-md card-base shadow-2xl z-10"
            >
              <h3 className="text-h3 mb-4">Edit Idea</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="label-base mb-0">Title</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)} 
                    className="input-base" 
                  />
                </div>
                <div className="form-group">
                  <label className="label-base mb-0">Description</label>
                  <textarea 
                    value={editDesc} 
                    onChange={e => setEditDesc(e.target.value)} 
                    rows={4}
                    className="input-base h-auto resize-none py-2" 
                  />
                </div>
                <div className="flex items-center gap-3 justify-end mt-4">
                  <button onClick={() => setIsEditModalOpen(false)} className="btn-ghost">Cancel</button>
                  <button onClick={saveEdit} disabled={isSaving} className="btn-primary">
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />} Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && activeIdea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-sm card-base shadow-2xl z-10"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-h3 mb-2">Delete Idea?</h3>
              <p className="text-body mb-6">Are you sure you want to delete "{activeIdea.title}"? This action cannot be undone.</p>
              <div className="flex items-center gap-3 w-full">
                <button onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={isSaving} className="btn-primary bg-destructive hover:bg-destructive/90 text-destructive-foreground flex-1 border-none shadow-none">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
