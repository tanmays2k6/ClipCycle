import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchIdeas } from "@/services/search";
import type { IdeaStatus, IdeaPlatform } from "@/types/database";

import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const searchSchema = z.object({
  query: z.string().default(""),
  status: z.enum(["pending", "draft", "used", "archived"]).optional().nullable(),
  platform: z.enum(["instagram", "youtube", "linkedin", "twitter", "blog"]).optional().nullable(),
  tag: z.string().optional().nullable(),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    // Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!(await checkRateLimit(ip, 60))) { // Slightly higher limit for search
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

    const searchParams = new URL(request.url).searchParams;
    const params = Object.fromEntries(searchParams.entries());

    const resultParsed = searchSchema.safeParse(params);
    if (!resultParsed.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: resultParsed.error.format() },
        { status: 400 }
      );
    }

    const { query, status, platform, tag, limit, offset } = resultParsed.data;

    // 3. Search
    const result = await searchIdeas(supabase, {
      query,
      status: status ?? undefined,
      platform: platform ?? undefined,
      tag: tag ?? undefined,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    // Silent fail in production
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
