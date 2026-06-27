import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { IdeaSource, IdeaPlatform } from "@/types/database";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const ideaSchema = z.object({
  title: z.string().min(1, "Idea title is required").max(500),
  description: z.string().max(2000).optional().nullable(),
  source: z.enum(["text", "link", "screenshot", "voice", "instagram-save", "bookmark"]).optional().default("text"),
  sourceLabel: z.string().max(100).optional().nullable(),
  sourceUrl: z.string().url().max(1000).optional().nullable(),
  platforms: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  audioUrl: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
  originalTranscript: z.string().optional().nullable(),
});
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Rate Limiting (In-Memory)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
    
    // Authenticate
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input with Zod
    const result = ideaSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { title, description, source, sourceLabel, sourceUrl, platforms, tags, audioUrl, duration, originalTranscript } = result.data;

    // Insert idea
    const { data: idea, error: insertError } = await supabase
      .from("ideas")
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        source: source || "text",
        source_label: sourceLabel || "Manual Entry",
        source_url: sourceUrl || null,
        platforms: platforms || [],
        tags: tags || [],
        audio_url: audioUrl || null,
        duration: duration || null,
        original_transcript: originalTranscript || null,
        status: "pending",
        is_favorite: false,
      })
      .select()
      .single();

    if (insertError) {
      // Silent fail in production
      return NextResponse.json(
        { error: "Failed to save idea to database." },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      activity_type: "idea_created",
      idea_id: idea.id,
      metadata: { source: idea.source },
    });

    return NextResponse.json({ success: true, idea }, { status: 201 });
  } catch (error) {
    // Silent fail in production
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
