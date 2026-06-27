import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.user.id;
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "json";

    const { data: ideas, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
    }

    if (format === "csv") {
      const headers = ["ID", "Title", "Description", "Source", "Status", "Tags", "Platforms", "Created At"];
      const rows = ideas.map(idea => [
        idea.id,
        `"${idea.title.replace(/"/g, '""')}"`,
        `"${(idea.description || "").replace(/"/g, '""')}"`,
        idea.source,
        idea.status,
        `"${idea.tags.join(",")}"`,
        `"${idea.platforms.join(",")}"`,
        idea.created_at,
      ]);
      const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="clipcycle-ideas-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (format === "markdown") {
      let mdContent = `# ClipCycle Ideas Export\n\n`;
      ideas.forEach(idea => {
        mdContent += `## ${idea.title}\n`;
        if (idea.description) mdContent += `${idea.description}\n\n`;
        mdContent += `- **Status**: ${idea.status}\n`;
        mdContent += `- **Source**: ${idea.source}\n`;
        if (idea.tags.length) mdContent += `- **Tags**: ${idea.tags.join(", ")}\n`;
        if (idea.platforms.length) mdContent += `- **Platforms**: ${idea.platforms.join(", ")}\n`;
        mdContent += `- **Created At**: ${new Date(idea.created_at).toLocaleString()}\n\n---\n\n`;
      });
      
      return new NextResponse(mdContent, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="clipcycle-ideas-${new Date().toISOString().split('T')[0]}.md"`,
        },
      });
    }

    // Default to JSON
    const jsonContent = JSON.stringify(ideas, null, 2);
    return new NextResponse(jsonContent, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="clipcycle-ideas-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
