import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CalendarClient from "./client";

export const metadata = {
  title: "Calendar | ClipCycle",
  description: "Plan, organize, and schedule your content.",
};

export default async function CalendarPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch ideas
  const { data: ideas } = await supabase
    .from("ideas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch scheduled posts
  const { data: scheduledPosts } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("user_id", user.id)
    .order("publish_date", { ascending: true });

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <CalendarClient 
        initialIdeas={ideas || []} 
        initialScheduled={scheduledPosts || []} 
      />
    </div>
  );
}
