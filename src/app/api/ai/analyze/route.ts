import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gemini, GEMINI_MODEL } from "@/lib/gemini/client";
import type { IdeaPlatform } from "@/types/database";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const analyzeSchema = z.object({
  idea_id: z.string().uuid(),
  title: z.string().max(500).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  platform: z.string().optional().nullable(),
});

// ── Response shape ───────────────────────────────────────────────────────────

interface AnalysisResult {
  title: string;
  summary: string;
  platforms: IdeaPlatform[];
  keywords: string[];
  hook: string;
  audience: string;
  tone: string;
  suggested_cta: string;
  tags: string[];
}

// ── Prompt ────────────────────────────────────────────────────────────────────

function buildPrompt(title: string, description: string, tags: string[], platform: string): string {
  return `You are a content strategist for student creators on social media.

Analyze the following content idea and return a JSON object with EXACTLY these fields:

- "title": A clear, catchy title for the idea (max 80 chars).
- "summary": A concise 2–3 sentence summary of what this content is about.
- "platforms": An array of the best platforms for this content. Only use values from: "instagram", "youtube", "linkedin", "twitter", "blog".
- "keywords": An array of 5–8 SEO/discoverability keywords.
- "hook": A strong opening hook sentence to grab attention (suitable for the first line of a post or video intro).
- "audience": A single sentence describing the target audience.
- "tone": The recommended tone (e.g. "Conversational & Motivational", "Professional & Educational").
- "suggested_cta": A specific call-to-action to include at the end of the content.
- "tags": An array of 4–6 hashtag-style tags WITHOUT the # symbol.

Content idea to analyze:
Title: ${title}
Description: ${description || "None provided"}
Current Tags: ${tags.length > 0 ? tags.join(", ") : "None"}
Platform Preference: ${platform || "Any"}

IMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no explanation — just the raw JSON object.`;
}

// ── Validate platforms ───────────────────────────────────────────────────────

const VALID_PLATFORMS = new Set<IdeaPlatform>([
  "instagram",
  "youtube",
  "linkedin",
  "twitter",
  "blog",
]);

function sanitizePlatforms(platforms: unknown): IdeaPlatform[] {
  if (!Array.isArray(platforms)) return [];
  return platforms.filter(
    (p): p is IdeaPlatform => typeof p === "string" && VALID_PLATFORMS.has(p as IdeaPlatform)
  );
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!(await checkRateLimit(ip, 10))) { 
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    // 1. Authenticate
    const supabase = await createClient();
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

    // 2. Parse input
    const body = await request.json().catch(() => null);
    
    const resultParsed = analyzeSchema.safeParse(body);
    if (!resultParsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: resultParsed.error.format() },
        { status: 400 }
      );
    }

    const { idea_id: ideaId, title, description, tags, platform } = resultParsed.data;

    // 3. Call Gemini
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildPrompt(title || "", description || "", tags, platform || ""),
      config: {
        temperature: 0.7,
        topP: 0.9,
        responseMimeType: "application/json",
      },
    });

    const rawOutput = response.text?.trim();

    if (!rawOutput) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    // 4. Parse Gemini JSON response
    let analysis: AnalysisResult;
    try {
      const parsed = JSON.parse(rawOutput);
      analysis = {
        title: String(parsed.title ?? ""),
        summary: String(parsed.summary ?? ""),
        platforms: sanitizePlatforms(parsed.platforms),
        keywords: Array.isArray(parsed.keywords)
          ? parsed.keywords.map(String)
          : [],
        hook: String(parsed.hook ?? ""),
        audience: String(parsed.audience ?? ""),
        tone: String(parsed.tone ?? ""),
        suggested_cta: String(parsed.suggested_cta ?? ""),
        tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
      };
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response.", raw: rawOutput },
        { status: 502 }
      );
    }

    // 5. Store in ai_analysis table
    // Packing Hook and CTA into strengths, Audience and Tone into improvements
    const { data: stored, error: dbError } = await supabase
      .from("ai_analysis")
      .insert({
        user_id: user.id,
        idea_id: ideaId,
        summary: analysis.summary,
        suggested_platforms: analysis.platforms,
        suggested_tags: analysis.tags.length > 0 ? analysis.tags : analysis.keywords,
        trend_score: null,
        virality_score: null,
        strengths: [analysis.hook, analysis.suggested_cta].filter(Boolean),
        improvements: [analysis.audience, analysis.tone].filter(Boolean),
        best_post_time: null,
        model_used: GEMINI_MODEL,
      })
      .select("id")
      .single();

    if (dbError) {
      // Silent fail in production
      return NextResponse.json(
        { error: "Failed to store analysis in database." },
        { status: 500 }
      );
    }

    // 6. Log activity
    if (stored?.id) {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        activity_type: "ai_analysis_completed",
        idea_id: ideaId,
        metadata: {
          analysis_id: stored.id,
          model: GEMINI_MODEL,
        },
      });
    }

    // 7. Return response
    return NextResponse.json({
      success: true,
      analysis,
      analysis_id: stored?.id ?? null,
    });
  } catch (error) {
    // Silent fail in production
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
