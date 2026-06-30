import { createClient } from "@/lib/supabase/server";
import PublishedClient from "./client";
import { Idea } from "@/types/database";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PublishedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch published ideas
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .in("status", ["published", "used"]) // Including legacy used
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch published ideas:", error);
  }

  const initialPublished = (data as Idea[]) || [];

  return <PublishedClient initialPublished={initialPublished} />;
}
