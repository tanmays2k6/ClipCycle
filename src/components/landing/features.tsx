"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Search, Wand2, Mic, FolderKanban, BarChart3, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/utils/cn";

const analyticsData = [
  { name: 'Mon', value: 42 },
  { name: 'Tue', value: 65 },
  { name: 'Wed', value: 38 },
  { name: 'Thu', value: 82 },
  { name: 'Fri', value: 58 },
  { name: 'Sat', value: 96 },
  { name: 'Sun', value: 73 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border px-3 py-2 rounded-lg shadow-xl">
        <p className="text-sm font-semibold text-foreground">
          {label} — {payload[0].value} Engagement Score
        </p>
      </div>
    );
  }
  return null;
};

function AnalyticsChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="w-full h-auto bg-card/95 backdrop-blur-sm rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-foreground">Content Performance</h4>
        <span className="text-[11px] font-bold text-green-600 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          ↑ +24% This Week
        </span>
      </div>
      
      <div className="w-full h-[220px] mt-auto">
        {isInView && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                ticks={[0, 20, 40, 60, 80, 100]}
              />
              <RechartsTooltip cursor={{ fill: 'var(--muted)', opacity: 0.4 }} content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]} 
                fill="url(#colorPrimary)" 
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {analyticsData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center gap-2 mt-1">
        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
        <span className="text-xs font-medium text-muted-foreground">● Content Performance</span>
      </div>
    </div>
  );
}

const features = [
  {
    title: "AI Tagging",
    description: "Deep contextual understanding of your raw ideas. ClipCycle automatically identifies the topic, target audience, and best platform, tagging it instantly.",
    icon: Brain,
    color: "text-purple-600",
    bg: "bg-purple-100",
    mockup: (
      <div className="w-full h-auto bg-card/95 backdrop-blur-sm rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">#Productivity</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">#TwitterThread</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">#HighEngagement</span>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-3">
          <Brain className="w-5 h-5 text-purple-500 shrink-0" />
          <p className="text-sm text-purple-900 leading-relaxed">AI automatically categorized this idea for your Twitter audience based on your recent performance.</p>
        </div>
      </div>
    )
  },
  {
    title: "Semantic Search",
    description: "Search by meaning, not exact keywords. Remember a vague concept about 'that productivity app'? We'll find exactly the note you meant.",
    icon: Search,
    color: "text-blue-600",
    bg: "bg-blue-100",
    mockup: (
      <div className="w-full h-auto bg-card/95 backdrop-blur-sm rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 shadow-sm">
          <Search className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-blue-900">"ideas about saving time"</span>
        </div>
        <div className="space-y-3 mt-2">
          <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors">
            <h4 className="text-sm font-bold text-foreground">The 4-Hour Workweek Notes</h4>
            <p className="text-xs text-muted-foreground mt-1">Bookmarked from Twitter • 2 weeks ago</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors opacity-70">
            <h4 className="text-sm font-bold text-foreground">Automation workflows</h4>
            <p className="text-xs text-muted-foreground mt-1">Voice Note • 1 month ago</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Instant Repurpose",
    description: "Turn one idea into an Instagram Carousel, Twitter Thread, and LinkedIn Post simultaneously with one click. Never write from scratch again.",
    icon: Wand2,
    color: "text-orange-600",
    bg: "bg-orange-100",
    mockup: (
      <div className="w-full h-auto bg-card/95 backdrop-blur-sm rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60 p-6 flex flex-col gap-4">
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 mb-2">
          <h4 className="font-semibold text-orange-900 text-sm">Original Idea</h4>
          <p className="text-xs text-orange-800 mt-1">"Why design systems matter for small teams"</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-border flex flex-col items-center justify-center gap-2 bg-card shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">in</div>
            <span className="text-[11px] font-semibold text-muted-foreground">LinkedIn Post</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <div className="p-3 rounded-xl border border-border flex flex-col items-center justify-center gap-2 bg-card shadow-sm">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-xs">𝕏</div>
            <span className="text-[11px] font-semibold text-muted-foreground">Twitter Thread</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Voice Notes",
    description: "Record audio notes on the go. AI transcribes and formats them instantly into structured text, removing filler words.",
    icon: Mic,
    color: "text-pink-600",
    bg: "bg-pink-100",
    mockup: (
      <div className="w-full h-auto bg-card/95 backdrop-blur-sm rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60 p-6 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-20" />
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 relative">
            <Mic className="w-8 h-8 text-pink-600" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 4, 5].map((h, i) => (
            <div key={i} className="w-1.5 bg-pink-300 rounded-full" style={{ height: `${h * 6}px` }} />
          ))}
        </div>
        <span className="text-sm font-medium text-muted-foreground">00:14 / 02:30</span>
      </div>
    )
  },
  {
    title: "Collections",
    description: "Auto-grouping of similar topics. ClipCycle builds a knowledge graph of your mind, effortlessly connecting related ideas.",
    icon: FolderKanban,
    color: "text-green-600",
    bg: "bg-green-100",
    mockup: (
      <div className="w-full h-auto bg-card/95 backdrop-blur-sm rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">Active Collections</span>
          <span className="text-xs text-muted-foreground">View All</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg">🎨</div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-foreground">Design Systems</h4>
              <p className="text-xs text-muted-foreground">24 ideas</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-lg">🚀</div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-foreground">Startup Advice</h4>
              <p className="text-xs text-muted-foreground">12 ideas</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Analytics",
    description: "Track which ideas performed best and let the AI suggest what to create next based on real engagement data.",
    icon: BarChart3,
    color: "text-red-600",
    bg: "bg-red-100",
    mockup: <AnalyticsChart />
  }
];

export function Features() {
  return (
    <section id="features" className="section-padding bg-background border-b border-border/50 relative overflow-hidden">
      <div className="container-premium">
        
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm uppercase tracking-wider font-semibold text-primary mb-6"
          >
            Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-h2"
          >
            Everything you need to create better content.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-body mt-6"
          >
            Stop switching between 5 different tools. ClipCycle brings your entire content workflow into one seamless workspace.
          </motion.p>
        </div>

        <div className="flex flex-col gap-[140px] md:gap-[180px]">
          {features.map((feature, index) => {
            const isImageLeft = index % 2 === 0;
            
            return (
              <div 
                key={index}
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-16 lg:gap-24",
                  !isImageLeft && "lg:flex-row-reverse"
                )}
              >
                {/* Mockup Column */}
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-full lg:w-1/2 flex items-center justify-center relative z-10"
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                    className="w-full max-w-[340px] md:max-w-[420px] h-auto relative"
                  >
                    {feature.mockup}
                  </motion.div>
                </motion.div>

                {/* Text Column */}
                <motion.div 
                  initial={{ opacity: 0, x: isImageLeft ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                  className="w-full lg:w-1/2 flex flex-col items-start"
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm", feature.bg)}>
                    <feature.icon className={cn("w-6 h-6", feature.color)} />
                  </div>
                  <h3 className="text-h2 text-3xl md:text-4xl mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-body text-lg">
                    {feature.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
