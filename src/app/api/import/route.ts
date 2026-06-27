import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.user.id;
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    let ideasToImport: any[] = [];

    if (file.name.endsWith(".json")) {
      try {
        ideasToImport = JSON.parse(text);
      } catch (e) {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
      }
    } else if (file.name.endsWith(".csv")) {
      // Basic CSV parser
      const rows = text.split("\n").filter(row => row.trim().length > 0);
      const headers = rows[0].split(",").map(h => h.trim());
      
      const titleIndex = headers.findIndex(h => h.toLowerCase() === "title");
      const descIndex = headers.findIndex(h => h.toLowerCase() === "description");
      
      if (titleIndex === -1) {
        return NextResponse.json({ error: "CSV must contain a Title column" }, { status: 400 });
      }

      ideasToImport = rows.slice(1).map(row => {
        // Handle basic quotes escaping (naive approach for MVP)
        const cols = row.split(",").map(c => c.replace(/^"|"$/g, "").trim());
        return {
          title: cols[titleIndex],
          description: descIndex !== -1 ? cols[descIndex] : "",
          source: "text",
          status: "pending",
          platforms: [],
          tags: []
        };
      });
    } else {
      return NextResponse.json({ error: "Unsupported file format. Please upload JSON or CSV." }, { status: 400 });
    }

    // Validate and insert
    if (!Array.isArray(ideasToImport) || ideasToImport.length === 0) {
      return NextResponse.json({ error: "No valid ideas found in file" }, { status: 400 });
    }

    // Check for duplicates by title
    const { data: existingIdeas } = await supabase
      .from("ideas")
      .select("title")
      .eq("user_id", userId);
      
    const existingTitles = new Set(existingIdeas?.map(i => i.title.toLowerCase()) || []);

    const newIdeas = ideasToImport
      .filter(idea => idea.title && !existingTitles.has(idea.title.toLowerCase()))
      .map(idea => ({
        user_id: userId,
        title: idea.title,
        description: idea.description || null,
        source: idea.source || "text",
        status: idea.status || "pending",
        platforms: Array.isArray(idea.platforms) ? idea.platforms : [],
        tags: Array.isArray(idea.tags) ? idea.tags : [],
      }));

    if (newIdeas.length === 0) {
      return NextResponse.json({ message: "No new ideas to import. All ideas were duplicates." });
    }

    const { error: insertError } = await supabase.from("ideas").insert(newIdeas);

    if (insertError) {
      console.error("Import insertion error:", insertError);
      return NextResponse.json({ error: "Failed to save imported ideas" }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: newIdeas.length });

  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
