import { createClient } from "@/lib/supabase/client";
import { IdeaPlatform } from "@/types/database";
import { toast } from "sonner";

export class PublishService {
  /**
   * Mocks the publishing action and updates the idea status in the database.
   */
  static async publish(
    ideaId: string,
    platform: IdeaPlatform,
    content: string
  ): Promise<boolean> {
    try {
      // 1. Simulate network delay for social API interaction
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const supabase = createClient();
      
      // 2. Update the idea in the database
      const { error } = await supabase
        .from("ideas")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
          published_platform: platform,
          published_url: `https://${platform}.com/post/${Math.random().toString(36).substring(7)}`,
        })
        .eq("id", ideaId);

      if (error) {
        console.error("Database update failed:", error);
        throw new Error("Failed to update database status");
      }

      // 3. Log activity (Optional, but good practice per user instructions)
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase.from("activity_logs").insert({
          user_id: userData.user.id,
          activity_type: "idea_status_changed",
          idea_id: ideaId,
          metadata: { new_status: "published", platform },
        });
      }

      return true;
    } catch (err) {
      console.error("Publish error:", err);
      return false;
    }
  }

  /**
   * Mocks scheduling a post for the future.
   */
  static async schedule(
    ideaId: string,
    platform: IdeaPlatform,
    content: string,
    date: Date
  ): Promise<boolean> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const supabase = createClient();
      
      const { error } = await supabase
        .from("ideas")
        .update({
          scheduled_at: date.toISOString(),
          status: "ready", // It's ready to be published, or keep it in some pending state
        })
        .eq("id", ideaId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Schedule error:", err);
      return false;
    }
  }

  /**
   * Copies content to the user's clipboard.
   */
  static async copy(content: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackErr) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }

  /**
   * Downloads the content as a local file (TXT or Markdown).
   */
  static download(content: string, format: "txt" | "md" = "txt", filename = "post"): void {
    try {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download file");
    }
  }
}
