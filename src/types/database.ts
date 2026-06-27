// =============================================================================
// ClipCycle — Database Types
// Mirror of the Supabase schema for type-safe client queries
// =============================================================================

// ── Enums ────────────────────────────────────────────────────────────────────

export type IdeaStatus = "pending" | "draft" | "used" | "archived";
export type IdeaSource = "text" | "link" | "screenshot" | "voice" | "instagram-save" | "bookmark";
export type IdeaPlatform = "instagram" | "youtube" | "linkedin" | "twitter" | "blog";
export type ContentType = "caption" | "script" | "post" | "thread" | "outline" | "article";
export type ActivityType =
  | "idea_created"
  | "idea_updated"
  | "idea_deleted"
  | "idea_status_changed"
  | "content_generated"
  | "ai_analysis_completed"
  | "user_signed_in"
  | "user_signed_out";
export type Plan = "free" | "pro" | "team";

// ── Row Types ────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  plan: Plan;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  source: IdeaSource;
  source_label: string | null;
  source_url: string | null;
  status: IdeaStatus;
  platforms: IdeaPlatform[];
  tags: string[];
  audio_url: string | null;
  duration: number | null;
  original_transcript: string | null;
  ai_suggestion: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedContent {
  id: string;
  idea_id: string;
  user_id: string;
  platform: IdeaPlatform;
  content_type: ContentType;
  title: string | null;
  body: string;
  model_used: string | null;
  prompt_tokens: number | null;
  output_tokens: number | null;
  is_saved: boolean;
  created_at: string;
}

export interface AIAnalysis {
  id: string;
  idea_id: string;
  user_id: string;
  trend_score: number | null;
  virality_score: number | null;
  suggested_platforms: IdeaPlatform[];
  suggested_tags: string[];
  summary: string | null;
  strengths: string[] | null;
  improvements: string[] | null;
  best_post_time: string | null;
  model_used: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  idea_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ScheduledPost {
  id: string;
  user_id: string;
  idea_id: string;
  platform: IdeaPlatform;
  publish_date: string;
  publish_time: string | null;
  priority: "low" | "medium" | "high";
  status: "scheduled" | "published" | "missed" | "draft";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsCache {
  id: string;
  user_id: string;
  date: string;
  ideas_saved: number;
  ideas_published: number;
  ai_generated: number;
  completion_rate: number;
  productivity_score: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ── Database type map (for supabase-js generic typing) ───────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  college: string | null;
  creator_category: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  youtube: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppearanceSettings {
  user_id: string;
  theme: "light" | "dark" | "system";
  compact_mode: boolean;
  accent_color: string;
  reduce_motion: boolean;
  updated_at: string;
}

export interface NotificationSettings {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  ai_suggestions: boolean;
  weekly_digest: boolean;
  product_updates: boolean;
  security_alerts: boolean;
  desktop_notifications: boolean;
  updated_at: string;
}

export interface AIPreferences {
  user_id: string;
  model: string;
  content_tone: string;
  content_length: string;
  default_platform: IdeaPlatform;
  auto_save_ai_output: boolean;
  updated_at: string;
}

export interface PrivacySettings {
  user_id: string;
  two_factor_auth: boolean;
  data_usage_ai_training: boolean;
  updated_at: string;
}

export interface UserIntegrations {
  user_id: string;
  google: boolean;
  notion: boolean;
  slack: boolean;
  discord: boolean;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, "id">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, "id">>;
      };
      appearance_settings: {
        Row: AppearanceSettings;
        Insert: Omit<AppearanceSettings, "updated_at"> & {
          updated_at?: string;
        };
        Update: Partial<Omit<AppearanceSettings, "user_id">>;
      };
      notification_settings: {
        Row: NotificationSettings;
        Insert: Omit<NotificationSettings, "updated_at"> & {
          updated_at?: string;
        };
        Update: Partial<Omit<NotificationSettings, "user_id">>;
      };
      ai_preferences: {
        Row: AIPreferences;
        Insert: Omit<AIPreferences, "updated_at"> & {
          updated_at?: string;
        };
        Update: Partial<Omit<AIPreferences, "user_id">>;
      };
      privacy_settings: {
        Row: PrivacySettings;
        Insert: Omit<PrivacySettings, "updated_at"> & {
          updated_at?: string;
        };
        Update: Partial<Omit<PrivacySettings, "user_id">>;
      };
      user_integrations: {
        Row: UserIntegrations;
        Insert: Omit<UserIntegrations, "updated_at"> & {
          updated_at?: string;
        };
        Update: Partial<Omit<UserIntegrations, "user_id">>;
      };
      ideas: {
        Row: Idea;
        Insert: Omit<Idea, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Idea, "id" | "user_id">>;
      };
      generated_content: {
        Row: GeneratedContent;
        Insert: Omit<GeneratedContent, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GeneratedContent, "id" | "user_id" | "idea_id">>;
      };
      ai_analysis: {
        Row: AIAnalysis;
        Insert: Omit<AIAnalysis, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<AIAnalysis, "id" | "user_id" | "idea_id">>;
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };
      scheduled_posts: {
        Row: ScheduledPost;
        Insert: Omit<ScheduledPost, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ScheduledPost, "id" | "user_id">>;
      };
      analytics_cache: {
        Row: AnalyticsCache;
        Insert: Omit<AnalyticsCache, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<AnalyticsCache, "id" | "user_id" | "date">>;
      };
    };
  };
}
