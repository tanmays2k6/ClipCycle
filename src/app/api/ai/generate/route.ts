import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gemini, GEMINI_MODEL } from "@/lib/gemini/client";
import type { ContentType, IdeaPlatform } from "@/types/database";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const generateSchema = z.object({
  idea_id: z.string().uuid(),
  title: z.string().max(500).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  content_type: z.enum(["script", "post", "outline", "thread", "caption", "article"]),
});

function buildPrompt(title: string, description: string, contentType: ContentType): string {
  const baseText = `Content idea:
Title: ${title}
Description: ${description || "None provided"}

You are a master social media copywriter and content strategist. Based on the idea above, please generate the following format explicitly tailored for the requested platform type:
`;

  switch (contentType) {
    case "script":
      return baseText + `Generate a short-form video script (Reel/TikTok).
Output must include a strong hook, visual scene descriptions, and a clear call-to-action at the end.`;
    case "post":
      return baseText + `Generate a highly engaging, professional LinkedIn post.
Output must use good spacing, start with a punchy hook, share a learning or insight, and end with an engaging question and relevant hashtags.`;
    case "outline":
      return baseText + `Generate a Carousel outline (for LinkedIn or Instagram).
Output must clearly define Slide 1 (Hook), Slide 2-4 (Body/Value), and Slide 5 (Call to Action). Include visual suggestions for each slide.`;
    case "thread":
      return baseText + `Generate a Twitter/X thread.
Output must start with a viral hook tweet (1/n), followed by 3-5 high-value tweets elaborating the idea, ending with a tweet for a call-to-action to follow or reply. Use spacing and minimal emojis appropriately.`;
    default:
      return baseText + `Generate engaging social media copy. Include a hook, body, and CTA.`;
  }
}

function getPlatformForType(contentType: ContentType): IdeaPlatform {
  switch (contentType) {
    case "script":
      return "instagram";
    case "post":
      return "linkedin";
    case "outline":
      return "instagram";
    case "thread":
      return "twitter";
    default:
      return "instagram";
  }
}

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
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // 2. Parse input
    const body = await request.json().catch(() => null);
    const resultParsed = generateSchema.safeParse(body);
    
    if (!resultParsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: resultParsed.error.format() },
        { status: 400 }
      );
    }

    const { idea_id, title, description, content_type } = resultParsed.data;

    // 3. Call Gemini
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildPrompt(title || "", description || "", content_type as ContentType),
      config: {
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const generatedText = response.text?.trim();

    if (!generatedText) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    // 4. Store in database
    const platform = getPlatformForType(content_type);
    
    const { data: stored, error: dbError } = await supabase
      .from("generated_content")
      .insert({
        user_id: user.id,
        idea_id,
        platform,
        content_type,
        body: generatedText,
        is_saved: true,
        model_used: GEMINI_MODEL,
      })
      .select("*")
      .single();

    if (dbError) {
      // Silent fail in production
      return NextResponse.json(
        { error: "Failed to store generated content." },
        { status: 500 }
      );
    }

    // 5. Log activity
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      activity_type: "content_generated",
      idea_id,
      metadata: {
        content_id: stored.id,
        content_type,
        platform
      },
    });

    return NextResponse.json({ success: true, data: stored });
  } catch (error) {
    // Silent fail in production
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
