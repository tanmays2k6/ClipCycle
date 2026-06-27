"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, CheckCircle2, Clock, Sparkles, TrendingUp, TrendingDown, ArrowRight,
  Flame, Target, Zap, Plus, Activity, FileText, LayoutGrid, MessageCircle, Play, 
  Layers, Send, Briefcase, Compass, Wand2, Bell, Hash, Edit2, Trash2, Heart, X, Camera, Mic, Loader2, AlertTriangle
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { Idea } from "@/types/database";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { toast } from "sonner";
import { TabBar, TabPanel } from "@/components/shared/tabs";
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
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }} 
      className="h-[120px] rounded-[24px] bg-card border border-border p-5 flex flex-col justify-between group cursor-default shadow-sm hover:shadow-xl transition-all"
    >
       <div className="flex justify-between items-start">
         <span className="text-[16px] text-muted-foreground font-medium">{title}</span>
         <div className={`p-2 rounded-xl bg-muted/50 ${color} group-hover:bg-muted transition-colors`}>
            <Icon className="w-5 h-5" />
         </div>
       </div>
       <div className="flex items-baseline gap-2">
         <h3 className="text-[36px] font-bold text-foreground tracking-tight leading-none">{value}</h3>
         <span className={`text-[13px] flex items-center gap-1 ${trendUp ? 'text-success' : 'text-muted-foreground'}`}>
           {trendUp && <TrendingUp className="w-3.5 h-3.5" />}
           {desc}
         </span>
       </div>
    </motion.div>
  )
}

function CompactIdeaCard({ idea, onClick, onEdit, onDelete, onFavourite, onGenerate }: { idea: Idea, onClick: () => void, onEdit: (e: React.MouseEvent) => void, onDelete: (e: React.MouseEvent) => void, onFavourite: (e: React.MouseEvent) => void, onGenerate: (e: React.MouseEvent) => void }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }} 
      onClick={onClick}
      className="h-[220px] rounded-[24px] bg-card border border-border p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Action Overlay */}
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300 z-10">
        <button onClick={onFavourite} className="p-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-colors shadow-sm" title="Favourite">
          <Heart className={cn("w-4 h-4", idea.is_favorite ? "fill-red-500 text-red-500" : "")} />
        </button>
        <button onClick={onGenerate} className="p-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm" title="Generate AI">
          <Wand2 className="w-4 h-4" />
        </button>
        <button onClick={onEdit} className="p-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 transition-colors shadow-sm" title="Edit">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors shadow-sm" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="px-2.5 py-1 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] text-[13px] font-medium border border-[#8B5CF6]/20 capitalize">
            {idea.status}
          </div>
        </div>
        <h3 className="text-[22px] font-bold text-foreground line-clamp-1 mb-1 pr-12">{idea.title}</h3>
        <p className="text-[16px] text-muted-foreground line-clamp-2">{idea.description || "No description provided."}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
         <div className="flex items-center gap-2 overflow-hidden">
           {idea.tags && idea.tags.length > 0 ? idea.tags.slice(0, 2).map(tag => (
             <span key={tag} className="flex items-center gap-1 text-[13px] text-muted-foreground whitespace-nowrap">
               <Hash className="w-3 h-3" />{tag}
             </span>
           )) : (
             <span className="text-[13px] text-muted-foreground">No tags</span>
           )}
         </div>
         <div className="flex items-center gap-1.5 text-[13px] font-medium text-success bg-success/10 px-2.5 py-1 rounded-md shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> AI Ready
         </div>
      </div>
    </motion.div>
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
      <div className="max-w-[1600px] mx-auto w-full px-6 py-12 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-[32px] md:text-[48px] font-extrabold text-foreground tracking-tight leading-tight">
              {greeting}
            </h1>
            <p className="text-[14px] md:text-[16px] text-muted-foreground mt-1">
              You have <span className="text-foreground font-medium">{stats.pending || 0} ideas</span> waiting to become content.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-4">
            <button onClick={() => setIsCaptureModalOpen(true)} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card hover:bg-muted border border-border text-foreground text-[16px] font-medium transition-all hover:-translate-y-0.5">
              <Plus className="w-5 h-5" /> Quick Capture
            </button>
            <Link href="/dashboard/ai-studio" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-[16px] font-medium transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:-translate-y-0.5">
              <Sparkles className="w-5 h-5" /> AI Generator
            </Link>
            <button className="w-[44px] h-[44px] md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-xl bg-card hover:bg-muted border border-border text-muted-foreground transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-[44px] h-[44px] md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-[16px]" aria-label="Profile">
              {userDisplayName?.charAt(0) || "C"}
            </button>
          </motion.div>
        </div>

        {/* Statistics Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div onClick={() => router.push("/dashboard/ideas")} className="cursor-pointer">
            <StatCard title="Current Streak" value={stats.streak || 0} desc={stats.streak > 3 ? "On fire!" : "Keep it up"} icon={Flame} color="text-orange-500" trendUp={stats.streak > 0} />
          </div>
          <div onClick={() => router.push("/dashboard/ideas?filter=pending")} className="cursor-pointer">
            <StatCard title="Pending Ideas" value={stats.pending || 0} desc="Awaiting action" icon={Lightbulb} color="text-success" trendUp={stats.pending > 0} />
          </div>
          <div onClick={() => router.push("/dashboard/analytics")} className="cursor-pointer">
            <StatCard title="AI Productivity" value={stats.aiScore || 0} desc="Score" icon={Target} color="text-primary" trendUp={stats.aiScore > 50} />
          </div>
          <div onClick={() => router.push("/dashboard/ideas?filter=published")} className="cursor-pointer">
            <StatCard title="Ideas Published" value={stats.published || 0} desc="Lifetime content" icon={CheckCircle2} color="text-blue-500" trendUp={false} />
          </div>
        </motion.div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* AI Suggestions Hero Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="rounded-[24px] bg-card border border-border p-6 flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div>
                <h2 className="text-[28px] font-bold text-foreground flex items-center gap-2 mb-2 tracking-tight">
                  <Sparkles className="w-6 h-6 text-primary" /> AI Suggestions
                </h2>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between bg-muted/30 p-6 rounded-2xl border border-border gap-6">
                <div>
                  <span className="text-[13px] text-primary font-semibold uppercase tracking-wider mb-2 block">Top Recommendation</span>
                  {localIdeas.length > 0 ? (
                    <>
                      <h3 className="text-[22px] font-bold text-foreground mb-2 leading-tight">Generate content for '{localIdeas[0].title}'</h3>
                      <p className="text-[16px] text-muted-foreground leading-relaxed max-w-xl">Reason: Fresh idea with high potential. Convert it to a Twitter Thread now.</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-[22px] font-bold text-foreground mb-2 leading-tight">Capture an idea first</h3>
                      <p className="text-[16px] text-muted-foreground leading-relaxed max-w-xl">You don't have any ideas yet. Capture one to get AI recommendations.</p>
                    </>
                  )}
                </div>
                {localIdeas.length > 0 && (
                  <button 
                    onClick={() => router.push(`/dashboard/ideas/${localIdeas[0].id}?action=generate&template=Twitter%20Thread`)}
                    className="whitespace-nowrap px-6 py-3 rounded-xl bg-primary text-primary-foreground text-[16px] font-medium shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:opacity-90 transition-all hover:scale-[1.02]"
                  >
                    Generate Now
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                 <button 
                   onClick={() => localIdeas.length > 0 && router.push(`/dashboard/ideas/${localIdeas[0].id}?action=generate&template=Carousel`)}
                   disabled={localIdeas.length === 0}
                   className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-left disabled:opacity-50"
                 >
                   Convert to Carousel
                 </button>
                 <button 
                   onClick={() => localIdeas.length > 0 && router.push(`/dashboard/ideas/${localIdeas[0].id}?action=generate&template=Newsletter`)}
                   disabled={localIdeas.length === 0}
                   className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-left disabled:opacity-50"
                 >
                   Draft Newsletter
                 </button>
                 <button 
                   onClick={() => localIdeas.length > 0 && router.push(`/dashboard/ideas/${localIdeas[0].id}?action=generate&template=LinkedIn%20Post`)}
                   disabled={localIdeas.length === 0}
                   className="px-4 py-2 rounded-xl bg-muted/50 border border-border text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-left disabled:opacity-50"
                 >
                   Repurpose for LinkedIn
                 </button>
              </div>
            </motion.div>

            {/* Recent Ideas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-[28px] font-bold text-foreground tracking-tight">Recent Ideas</h2>
                <Link href="/dashboard/ideas" className="text-[16px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-medium">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="col-span-2 p-12 rounded-[24px] border border-border bg-card text-center flex flex-col items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-muted-foreground mb-4" />
                    <p className="text-[22px] font-bold text-foreground mb-2">No ideas yet</p>
                    <p className="text-[16px] text-muted-foreground">Capture your first idea to get started.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex flex-col gap-4 pt-2">
              <h2 className="text-[28px] font-bold text-foreground tracking-tight">Recent Activity</h2>
              <div className="rounded-[24px] bg-card border border-border p-8">
                 <div className="space-y-0">
                    {mockActivity.map((act, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.bg} ${act.color} ring-8 ring-card z-10`}>
                            <act.icon className="w-5 h-5" />
                          </div>
                          {i !== mockActivity.length - 1 && <div className="w-[2px] h-12 bg-border my-1" />}
                        </div>
                        <div className="pt-2 pb-6">
                          <p className="text-[16px] font-medium text-foreground group-hover:text-primary transition-colors cursor-default">{act.title}</p>
                          <span className="text-[13px] text-muted-foreground">{act.time}</span>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="rounded-[24px] bg-card border border-border p-6 flex flex-col gap-4">
               <h2 className="text-[22px] font-bold text-foreground tracking-tight flex items-center gap-2">
                 <Activity className="w-5 h-5 text-success" /> AI Productivity
               </h2>
               <div className="flex flex-col gap-4 pt-2">
                 <div className="flex justify-between items-end">
                   <div className="text-[48px] font-extrabold text-foreground leading-none tracking-tight">{stats.aiScore || 0}<span className="text-[22px] text-muted-foreground">/100</span></div>
                   <div className="text-[13px] text-success font-medium px-2 py-1 bg-success/10 rounded-lg flex items-center gap-1 mb-1">
                     <TrendingUp className="w-3.5 h-3.5" /> +5
                   </div>
                 </div>
                 <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-primary rounded-full" style={{ width: `${stats.aiScore || 0}%` }} />
                 </div>
                 <p className="text-[13px] text-muted-foreground leading-relaxed">
                   Your AI utilization is growing. Keep capturing ideas and generating content to boost your score!
                 </p>
               </div>
            </motion.div>

            {/* Recommended Next Steps */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="rounded-[24px] bg-card border border-border p-6 flex flex-col gap-4">
               <h2 className="text-[22px] font-bold text-foreground tracking-tight flex items-center gap-2">
                 <Compass className="w-5 h-5 text-blue-500" /> Next Steps
               </h2>
               <div className="flex flex-col gap-3 pt-2">
                 {mockRepurposing.map(item => (
                   <div key={item.id} className="p-4 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-colors cursor-pointer group">
                     <div className="flex items-center gap-3 mb-1">
                       <item.icon className={`w-4 h-4 ${item.color}`} />
                       <span className="text-[16px] font-medium text-foreground">{item.title}</span>
                     </div>
                     <p className="text-[13px] text-muted-foreground pl-7 group-hover:text-foreground transition-colors">
                       {item.recommend} &rarr;
                     </p>
                   </div>
                 ))}
               </div>
            </motion.div>

            {/* Recent Generations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="rounded-[24px] bg-card border border-border p-6 flex flex-col gap-4">
               <h2 className="text-[22px] font-bold text-foreground tracking-tight flex items-center gap-2">
                 <Wand2 className="w-5 h-5 text-primary" /> Recent Output
               </h2>
               <div className="flex flex-col gap-2 pt-2">
                 {mockRecentAI.map(item => (
                   <div key={item.id} onClick={() => router.push("/dashboard/ai-studio")} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-colors cursor-pointer group">
                     <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
                         <item.icon className={`w-5 h-5 ${item.color}`} />
                       </div>
                       <div>
                         <p className="text-[16px] font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                         <p className="text-[13px] text-muted-foreground">{item.type}</p>
                       </div>
                     </div>
                     <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
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
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl z-10 hide-scrollbar"
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
              className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 z-10"
            >
              <h3 className="text-xl font-bold mb-4">Edit Idea</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-1.5 block">Title</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)} 
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2 focus:border-primary outline-none" 
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-medium mb-1.5 block">Description</label>
                  <textarea 
                    value={editDesc} 
                    onChange={e => setEditDesc(e.target.value)} 
                    rows={4}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2 focus:border-primary outline-none resize-none" 
                  />
                </div>
                <div className="flex items-center gap-3 justify-end mt-4">
                  <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                  <button onClick={saveEdit} disabled={isSaving} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
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
              className="relative w-full max-w-sm rounded-2xl bg-card border border-border shadow-2xl p-6 z-10"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Idea?</h3>
              <p className="text-muted-foreground text-sm mb-6">Are you sure you want to delete "{activeIdea.title}"? This action cannot be undone.</p>
              <div className="flex items-center gap-3 w-full">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-muted text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={isSaving} className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
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
