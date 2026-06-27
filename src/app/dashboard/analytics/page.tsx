import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AnalyticsClient from "./client";
export const metadata = {
  title: "Analytics | ClipCycle",
  description: "Understand your content workflow and performance.",
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all ideas for metrics
  const { data: ideas } = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", user.id);

  // Fetch activity logs for timeline
  const { data: activities } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch generated content for AI metrics
  const { count: generatedCount } = await supabase
    .from("generated_content")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id);

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <AnalyticsClient 
        ideas={ideas || []} 
        activities={activities || []} 
        generatedCount={generatedCount || 0}
      />
    </div>
  );
}
