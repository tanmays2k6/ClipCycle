import { SupabaseClient } from "@supabase/supabase-js";
import type { Idea, IdeaStatus, IdeaPlatform } from "@/types/database";

// =============================================================================
// Search Service — Strategy Pattern
// Currently: keyword search via Supabase ilike + array overlap
// Future:    semantic search via pgvector embeddings
// =============================================================================

// ── Search parameters ────────────────────────────────────────────────────────

export interface SearchParams {
  query: string;
  status?: IdeaStatus;
  platform?: IdeaPlatform;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  ideas: Idea[];
  total: number;
  strategy: "keyword" | "semantic";
}

// ── Keyword search (current implementation) ──────────────────────────────────

export async function keywordSearch(
  supabase: SupabaseClient,
  params: SearchParams
): Promise<SearchResult> {
  const { query, status, platform, tag, limit = 20, offset = 0 } = params;

  let builder = supabase
    .from("ideas")
    .select("*", { count: "exact" });

  // Full-text keyword match on title and description
  if (query.trim()) {
    // Use Supabase `or` filter for ilike on both title and description
    const pattern = `%${query.trim()}%`;
    builder = builder.or(
      `title.ilike.${pattern},description.ilike.${pattern}`
    );
  }

  // Optional filters
  if (status) {
    builder = builder.eq("status", status);
  }

  if (platform) {
    builder = builder.contains("platforms", [platform]);
  }

  if (tag) {
    builder = builder.contains("tags", [tag]);
  }

  // Ordering and pagination
  builder = builder
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await builder;

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  return {
    ideas: (data as Idea[]) ?? [],
    total: count ?? 0,
    strategy: "keyword",
  };
}

// ── Semantic search (future placeholder) ─────────────────────────────────────
// To enable semantic search:
//
// 1. Add an `embedding` column to the `ideas` table:
//    ALTER TABLE ideas ADD COLUMN embedding vector(768);
//    CREATE INDEX idx_ideas_embedding ON ideas USING ivfflat (embedding vector_cosine_ops);
//
// 2. Generate embeddings on idea creation/update via Gemini embedding API
//
// 3. Implement this function:
//
// export async function semanticSearch(
//   supabase: SupabaseClient,
//   params: SearchParams
// ): Promise<SearchResult> {
//   // 1. Generate embedding for the query text
//   // const queryEmbedding = await generateEmbedding(params.query);
//
//   // 2. Call an RPC function that does cosine similarity search
//   // const { data } = await supabase.rpc("search_ideas", {
//   //   query_embedding: queryEmbedding,
//   //   match_threshold: 0.7,
//   //   match_count: params.limit ?? 20,
//   // });
//
//   // 3. Return results
//   // return { ideas: data, total: data.length, strategy: "semantic" };
// }

// ── Unified search entry point ───────────────────────────────────────────────

export async function searchIdeas(
  supabase: SupabaseClient,
  params: SearchParams
): Promise<SearchResult> {
  // When semantic search is ready, add logic here:
  // if (shouldUseSemanticSearch(params.query)) {
  //   return semanticSearch(supabase, params);
  // }

  return keywordSearch(supabase, params);
}
