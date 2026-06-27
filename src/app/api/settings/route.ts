import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional(),
  college: z.string().optional(),
  creator_category: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  avatar_url: z.string().optional(),
});

const settingsSchema = z.object({
  category: z.enum([
    "profile",
    "appearance",
    "notifications",
    "ai",
    "privacy",
    "integrations",
  ]),
  data: z.any(), // We will validate category-specific data below
});

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.user.id;

    let [{ data: profile }, { data: appearance }, { data: notifications }, { data: ai }, { data: privacy }, { data: integrations }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("appearance_settings").select("*").eq("user_id", userId).single(),
      supabase.from("notification_settings").select("*").eq("user_id", userId).single(),
      supabase.from("ai_preferences").select("*").eq("user_id", userId).single(),
      supabase.from("privacy_settings").select("*").eq("user_id", userId).single(),
      supabase.from("user_integrations").select("*").eq("user_id", userId).single(),
    ]);

    // Auto-create profile if missing
    if (!profile) {
      const userMeta = authData.user.user_metadata || {};
      const newProfile = {
        id: userId,
        full_name: userMeta.full_name || userMeta.name || "",
        avatar_url: userMeta.avatar_url || userMeta.picture || "",
      };
      const { data: insertedProfile, error: insertError } = await supabase
        .from("profiles")
        .upsert(newProfile)
        .select()
        .single();
      
      if (!insertError && insertedProfile) {
        profile = insertedProfile;
      } else {
        console.error("Failed to auto-create profile:", insertError);
        profile = newProfile; // Use fallback for this request
      }
    }

    // Construct the settings object with defaults if they don't exist yet
    const settings = {
      profile: {
        full_name: profile?.full_name || "",
        avatar_url: profile?.avatar_url || "",
        bio: profile?.bio || "",
        username: profile?.username || "",
        creator_category: profile?.creator_category || "",
        college: profile?.college || "",
        website: profile?.website || "",
        twitter: profile?.twitter || "",
        linkedin: profile?.linkedin || "",
        instagram: profile?.instagram || "",
        youtube: profile?.youtube || "",
      },
      appearance: appearance || {
        theme: "system",
        compact_mode: false,
        accent_color: "violet",
        reduce_motion: false,
      },
      notifications: notifications || {
        email_notifications: true,
        push_notifications: false,
        ai_suggestions: true,
        weekly_digest: true,
        product_updates: true,
        security_alerts: true,
        desktop_notifications: false,
      },
      ai: ai || {
        model: "auto",
        content_tone: "professional",
        content_length: "medium",
        default_platform: "linkedin",
        auto_save_ai_output: true,
      },
      privacy: privacy || {
        two_factor_auth: false,
        data_usage_ai_training: false,
      },
      integrations: integrations || {
        google: false,
        notion: false,
        slack: false,
        discord: false,
      },
      account: {
        email: authData.user.email,
        last_sign_in_at: authData.user.last_sign_in_at,
        created_at: authData.user.created_at,
        providers: authData.user.app_metadata.providers || [],
      },
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.user.id;
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { category, data } = parsed.data;
    let result;

    switch (category) {
      case "profile":
        const profileValidation = profileSchema.safeParse(data);
        if (!profileValidation.success) {
          return NextResponse.json(
            { error: "Invalid profile data", details: profileValidation.error.format() },
            { status: 400 }
          );
        }
        
        result = await supabase.from("profiles").upsert({
          id: userId,
          full_name: profileValidation.data.full_name,
          username: profileValidation.data.username,
          bio: profileValidation.data.bio,
          avatar_url: profileValidation.data.avatar_url,
          creator_category: profileValidation.data.creator_category,
          college: profileValidation.data.college,
          website: profileValidation.data.website,
          twitter: profileValidation.data.twitter,
          linkedin: profileValidation.data.linkedin,
          instagram: profileValidation.data.instagram,
          youtube: profileValidation.data.youtube,
          updated_at: new Date().toISOString()
        }, { onConflict: "id" });
        break;

      case "appearance":
        result = await supabase.from("appearance_settings").upsert({
          user_id: userId,
          theme: data.theme,
          compact_mode: data.compact_mode,
          accent_color: data.accent_color,
          reduce_motion: data.reduce_motion,
        }, { onConflict: "user_id" });
        break;

      case "notifications":
        result = await supabase.from("notification_settings").upsert({
          user_id: userId,
          email_notifications: data.email_notifications,
          push_notifications: data.push_notifications,
          ai_suggestions: data.ai_suggestions,
          weekly_digest: data.weekly_digest,
          product_updates: data.product_updates,
          security_alerts: data.security_alerts,
          desktop_notifications: data.desktop_notifications,
        }, { onConflict: "user_id" });
        break;

      case "ai":
        result = await supabase.from("ai_preferences").upsert({
          user_id: userId,
          model: data.model,
          content_tone: data.content_tone,
          content_length: data.content_length,
          default_platform: data.default_platform,
          auto_save_ai_output: data.auto_save_ai_output,
        }, { onConflict: "user_id" });
        break;

      case "privacy":
        result = await supabase.from("privacy_settings").upsert({
          user_id: userId,
          two_factor_auth: data.two_factor_auth,
          data_usage_ai_training: data.data_usage_ai_training,
        }, { onConflict: "user_id" });
        break;

      case "integrations":
        result = await supabase.from("user_integrations").upsert({
          user_id: userId,
          google: data.google,
          notion: data.notion,
          slack: data.slack,
          discord: data.discord,
        }, { onConflict: "user_id" });
        break;
        
      default:
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (result.error) {
      console.error("Database update error:", result.error);
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
