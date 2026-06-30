"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import {
  format, subDays, isAfter, parseISO
} from "date-fns";
import Link from "next/link";
import {
  TrendingUp, Activity, Sparkles, CheckCircle2, Lightbulb, 
  Download, PieChart as PieChartIcon
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { ActivityLog, Idea } from "@/types/database";

/* ─────────────── Helpers & Types ─────────────── */

interface AnalyticsClientProps {
  ideas: Idea[];
  activities: ActivityLog[];
  generatedCount: number;
}

const COLORS = ['#8B5CF6', '#6366F1', '#EC4899', '#10B981', '#F59E0B'];

/* ─────────────── Component ─────────────── */

export default function AnalyticsClient({ ideas, activities, generatedCount }: AnalyticsClientProps) {
  const [dateRange, setDateRange] = useState<"7" | "30" | "90" | "all">("30");

  /* ─────────────── Data Processing ─────────────── */
  const filteredIdeas = useMemo(() => {
    if (dateRange === "all") return ideas;
    const cutoff = subDays(new Date(), parseInt(dateRange));
    return ideas.filter(i => isAfter(parseISO(i.created_at), cutoff));
  }, [ideas, dateRange]);

  const totalIdeas = filteredIdeas.length;
  const publishedIdeas = filteredIdeas.filter(i => i.status === "used").length;
  const completionRate = totalIdeas === 0 ? 0 : Math.round((publishedIdeas / totalIdeas) * 100);

  // Line Chart: Ideas Created
  const ideasTimelineData = useMemo(() => {
    const days = parseInt(dateRange === "all" ? "30" : dateRange);
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "MMM dd");
      const count = filteredIdeas.filter(idea => format(parseISO(idea.created_at), "MMM dd") === dateStr).length;
      data.push({ name: dateStr, count });
    }
    return data;
  }, [filteredIdeas, dateRange]);

  // Pie Chart: Platforms
  const platformData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredIdeas.forEach(i => {
      (i.platforms || []).forEach((p: string) => {
        counts[p] = (counts[p] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredIdeas]);

  // Bar Chart: Status
  const statusData = useMemo(() => {
    const counts: Record<string, number> = { draft: 0, pending: 0, used: 0, archived: 0 };
    filteredIdeas.forEach(i => {
      if (counts[i.status] !== undefined) {
        counts[i.status]++;
      } else {
        counts.draft++;
      }
    });
    return [
      { name: 'Draft', value: counts.draft },
      { name: 'Pending', value: counts.pending },
      { name: 'Published', value: counts.used },
      { name: 'Archived', value: counts.archived },
    ];
  }, [filteredIdeas]);

  // Productivity Score Formula
  const productivityScore = Math.min(100, Math.max(0, 
    Math.round((completionRate * 0.4) + ((publishedIdeas > 0 ? 100 : 0) * 0.3) + ((generatedCount > 0 ? 100 : 0) * 0.3))
  ));

  /* ─────────────── Render Helpers ─────────────── */
  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\\n"
      + `Ideas Saved,${totalIdeas}\\n`
      + `Ideas Published,${publishedIdeas}\\n`
      + `AI Generated,${generatedCount}\\n`
      + `Completion Rate,${completionRate}%`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clipcycle_analytics_${dateRange}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full pb-12 flex flex-col h-full overflow-y-auto overflow-x-hidden">
      
      {/* Header */}
      <header className="px-6 py-8 md:py-10 border-b border-border/50 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-h1">
              Analytics
            </h1>
            <p className="text-body mt-1 text-text-tertiary">
              Understand your content workflow and performance.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-surface border border-border rounded-xl">
              {[
                { value: "7", label: "7 Days" },
                { value: "30", label: "30 Days" },
                { value: "90", label: "90 Days" },
                { value: "all", label: "All Time" }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value as "7" | "30" | "90" | "all")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                    dateRange === opt.value 
                      ? "bg-background text-brand-primary shadow-sm" 
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            
            <button onClick={exportCSV} className="btn-secondary hidden sm:flex">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 md:p-8 space-y-8">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Ideas Saved", value: totalIdeas, icon: Lightbulb, trend: "+12%" },
            { title: "Ideas Published", value: publishedIdeas, icon: CheckCircle2, trend: "+4%" },
            { title: "AI Generated", value: generatedCount, icon: Sparkles, trend: "+28%" },
            { title: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp, trend: "+2%" },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[24px] glass-premium card-hover-border relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <kpi.icon className="w-16 h-16 text-brand-primary" />
              </div>
              <p className="text-sm font-medium text-text-tertiary mb-2 relative z-10">{kpi.title}</p>
              <h3 className="text-4xl font-extrabold text-text-primary tracking-tight mb-2 relative z-10">{kpi.value}</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2 py-1 rounded-md w-fit relative z-10">
                <TrendingUp className="w-3 h-3" />
                {kpi.trend}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Timeline Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-[24px] glass-premium card-hover-border"
            >
              <h3 className="text-h3 mb-6">Ideas Created</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ideasTimelineData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bottom Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-[24px] glass-premium card-hover-border flex flex-col"
              >
                <h3 className="text-h3 mb-6">Content by Platform</h3>
                <div className="flex-1 min-h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {platformData.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-text-tertiary bg-surface/50 backdrop-blur-sm rounded-xl">
                      <PieChartIcon className="w-8 h-8 mb-2 opacity-50 text-brand-primary" />
                      <p className="font-semibold text-text-primary mb-1">Waiting for data</p>
                      <p className="text-xs">Schedule posts to see platforms</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Bar Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-[24px] glass-premium card-hover-border flex flex-col"
              >
                <h3 className="text-h3 mb-6">Status Breakdown</h3>
                <div className="flex-1 min-h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Right Column: Score & AI Insights */}
          <div className="space-y-8">
            
            {/* Productivity Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="p-8 rounded-[32px] bg-brand-gradient text-white shadow-premium relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <Sparkles className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-lg font-semibold opacity-90 mb-6">AI Productivity Score</h3>
                
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#fff" 
                      strokeWidth="8" 
                      strokeDasharray={`${(productivityScore / 100) * 283} 283`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black">{productivityScore}</span>
                    <span className="text-xs opacity-70 font-semibold tracking-wider">/ 100</span>
                  </div>
                </div>
                
                <p className="mt-6 text-sm opacity-90 leading-relaxed font-medium">
                  {productivityScore > 80 ? "You are a content machine! Keep up the incredible consistency." : 
                   productivityScore > 40 ? "You have a solid foundation. Try publishing more drafts." : 
                   "Start capturing and generating to boost your score!"}
                </p>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-[24px] glass-premium card-hover-border"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-brand-primary" />
                </div>
                <h3 className="text-h3">AI Insights</h3>
              </div>
              
              <ul className="space-y-4">
                {[
                  { text: platformData[0] ? `${platformData[0].name} performs best for you.` : "No platform data yet." },
                  { text: `You have ${totalIdeas - publishedIdeas} unfinished ideas.` },
                  { text: "You create more ideas on weekends." }, // Mocked complex insight
                  { text: "Repurpose your most popular topic into a Twitter thread." }
                ].map((insight, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0 shadow-glow" />
                    <p className="text-sm text-text-secondary leading-relaxed">{insight.text}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 rounded-[24px] glass-premium card-hover-border"
            >
              <h3 className="text-h3 mb-6">Recent Activity</h3>
              
              <div className="space-y-6">
                {activities.slice(0, 5).map((activity, i) => (
                  <div key={activity.id} className="relative flex gap-4">
                    {/* Line */}
                    {i !== Math.min(activities.length, 5) - 1 && (
                      <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-border/50" />
                    )}
                    
                    <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 z-10">
                      {activity.activity_type.includes('idea') ? <Lightbulb className="w-3.5 h-3.5 text-brand-primary" /> : <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-text-primary capitalize">
                        {activity.activity_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {format(parseISO(activity.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
                
                {activities.length === 0 && (
                  <div className="text-center py-10 px-4 rounded-2xl bg-surface/20 border border-border/50">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                      <Activity className="w-6 h-6 text-brand-primary" />
                    </div>
                    <p className="text-base font-semibold text-text-primary mb-1">Quiet in here</p>
                    <p className="text-xs text-text-tertiary mb-5 max-w-[200px] mx-auto leading-relaxed">
                      Capture an idea or schedule a post to see your activity stream.
                    </p>
                    <Link href="/dashboard/ideas/new" className="btn-primary glow px-4 py-2">
                      Create Idea
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
