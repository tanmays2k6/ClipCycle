import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./client";
import { Idea } from "@/types/database";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch recent ideas
  const { data: recentIdeas, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    // Silent fail in production
  }

  // Fetch stats properly
  const { data: allIdeas } = await supabase
    .from("ideas")
    .select("created_at, status")
    .order("created_at", { ascending: false });
    
  let pendingCount = 0;
  let publishedCount = 0;
  let thisWeekCount = 0;
  let streak = 0;
  let totalIdeas = 0;

  if (allIdeas) {
    totalIdeas = allIdeas.length;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Process counts
    allIdeas.forEach(idea => {
      if (idea.status === 'pending') pendingCount++;
      if (idea.status === 'published') publishedCount++;
      if (new Date(idea.created_at) >= oneWeekAgo) thisWeekCount++;
    });

    // Calculate simple streak (consecutive days with an idea created)
    if (totalIdeas > 0) {
      const dates = [...new Set(allIdeas.map(d => new Date(d.created_at).toDateString()))];
      const today = new Date().toDateString();
      let checkDate = new Date();
      
      if (dates.includes(today)) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dates.includes(new Date(Date.now() - 86400000).toDateString())) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 2);
      }

      if (streak > 0) {
        while (dates.includes(checkDate.toDateString())) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }
  }

  // Calculate AI productivity base score
  const aiScore = Math.min(99, 10 + (totalIdeas * 5) + (publishedCount * 10));

  const stats = {
    ideasSaved: totalIdeas,
    ideasUsed: publishedCount,
    pending: pendingCount,
    aiScore: aiScore,
    streak: streak,
    thisWeek: thisWeekCount,
    published: publishedCount
  };

  return <DashboardClient recentIdeas={(recentIdeas as Idea[]) || []} stats={stats} />;
}
