import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IdeaDetailView } from "@/features/ideas";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaPage({ params }: PageProps) {
  const resolvedParams = await params;
  const ideaId = resolvedParams.id;
  
  const supabase = await createClient();
  
  // 1. Fetch the idea
  const { data: idea, error: ideaError } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", ideaId)
    .single();

  if (ideaError || !idea) {
    notFound(); // Triggers the nearest not-found.tsx
  }

  // 2. Fetch AI Analysis
  const { data: aiAnalysis } = await supabase
    .from("ai_analysis")
    .select("*")
    .eq("idea_id", ideaId)
    .maybeSingle();

  // 3. Fetch Generated Content
  const { data: generatedContent } = await supabase
    .from("generated_content")
    .select("*")
    .eq("idea_id", ideaId)
    .order("created_at", { ascending: false });

  // 4. Determine Previous and Next Idea IDs based on creation date
  // Previous idea (older)
  const { data: prevIdea } = await supabase
    .from("ideas")
    .select("id")
    .lt("created_at", idea.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
    
  // Next idea (newer)
  const { data: nextIdea } = await supabase
    .from("ideas")
    .select("id")
    .gt("created_at", idea.created_at)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <IdeaDetailView 
      idea={idea} 
      aiAnalysis={aiAnalysis} 
      generatedContent={generatedContent || []} 
      prevIdeaId={prevIdea?.id || null}
      nextIdeaId={nextIdea?.id || null}
    />
  );
}
