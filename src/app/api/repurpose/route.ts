import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gemini, GEMINI_MODEL } from "@/lib/gemini/client";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const repurposeSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().min(1).max(2000),
  idea_id: z.string().uuid().optional().nullable(),
});

// ── Response shape ───────────────────────────────────────────────────────────

interface RepurposeResult {
  instagram_caption: string;
  linkedin_post: string;
  twitter_thread: string;
  newsletter: string;
  carousel: string;
}

// ── Prompt ────────────────────────────────────────────────────────────────────

function buildPrompt(title: string, description: string): string {
  return `You are an expert content strategist for student creators. Given the content idea below, repurpose it into 5 distinct formats. Each format must be complete, publish-ready, and optimized for its platform.

CONTENT IDEA:
Title: "${title}"
Description: "${description}"

Return a JSON object with EXACTLY these 5 keys:

1. "instagram_caption" — A compelling Instagram caption (150–300 words). Include:
   - A strong hook in the first line
   - Line breaks for readability
   - A call-to-action at the end
   - 5–8 relevant hashtags on the last line

2. "linkedin_post" — A professional LinkedIn post (200–400 words). Include:
   - An attention-grabbing opener
   - Insights or frameworks with bullet points
   - A thought-provoking question at the end to drive engagement

3. "twitter_thread" — A Twitter/X thread of 5–7 tweets. Format each tweet on a new line prefixed with "1/", "2/", etc. Include:
   - A hook tweet to start
   - Value-packed middle tweets
   - A summary + CTA as the final tweet

4. "newsletter" — A newsletter section (300–500 words). Include:
   - A subject line on the first line prefixed with "Subject: "
   - A greeting
   - Key insights in a scannable format
   - A sign-off with CTA

5. "carousel" — An Instagram carousel script with 8–10 slides. Format each slide on a new line prefixed with "Slide 1:", "Slide 2:", etc. Include:
   - A hook slide (first slide)
   - Value slides with one key point each (keep text short, max 25 words per slide)
   - A CTA slide (last slide)

IMPORTANT: Return ONLY valid JSON. No markdown fences, no explanation — just the raw JSON object.`;
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!(await checkRateLimit(ip, 10))) { // Stricter limit for AI generation
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
    const resultParsed = repurposeSchema.safeParse(body);
    
    if (!resultParsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: resultParsed.error.format() },
        { status: 400 }
      );
    }
    
    const { title, description, idea_id: ideaId } = resultParsed.data;

    // 3. Call Gemini
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildPrompt(title.trim(), description.trim()),
      config: {
        temperature: 0.8,
        topP: 0.92,
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

    // 4. Parse JSON
    let result: RepurposeResult;
    try {
      const parsed = JSON.parse(rawOutput);
      result = {
        instagram_caption: String(parsed.instagram_caption ?? ""),
        linkedin_post: String(parsed.linkedin_post ?? ""),
        twitter_thread: String(parsed.twitter_thread ?? ""),
        newsletter: String(parsed.newsletter ?? ""),
        carousel: String(parsed.carousel ?? ""),
      };
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response.", raw: rawOutput },
        { status: 502 }
      );
    }

    // 5. Store all generated content variants
    const contentRows = [
      { platform: "instagram" as const, content_type: "caption" as const, body: result.instagram_caption },
      { platform: "linkedin" as const, content_type: "post" as const, body: result.linkedin_post },
      { platform: "twitter" as const, content_type: "thread" as const, body: result.twitter_thread },
      { platform: "blog" as const, content_type: "article" as const, body: result.newsletter },
      { platform: "instagram" as const, content_type: "outline" as const, body: result.carousel },
    ];

    const inserts = contentRows.map((row) => ({
      idea_id: ideaId,
      user_id: user.id,
      platform: row.platform,
      content_type: row.content_type,
      title,
      body: row.body,
      model_used: GEMINI_MODEL,
      is_saved: false,
    }));

    const { error: dbError } = await supabase
      .from("generated_content")
      .insert(inserts);

    if (dbError) {
      // Silent fail in production
    }

    // 6. Log activity
    if (ideaId) {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        activity_type: "content_generated",
        idea_id: ideaId,
        metadata: { platforms: contentRows.map((r) => r.platform), model: GEMINI_MODEL },
      });
    }

    // 7. Return response
    return NextResponse.json({ success: true, content: result });
  } catch (error) {
    // Silent fail in production
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
