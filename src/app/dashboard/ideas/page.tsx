import { createClient } from "@/lib/supabase/server";
import IdeasListClient from "./client";
import { Idea } from "@/types/database";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function IdeasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch initial ideas
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    // Silent fail in production
  }

  const initialIdeas = (data as Idea[]) || [];

  return <IdeasListClient initialIdeas={initialIdeas} />;
}
