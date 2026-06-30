export type IdeaStatus = "pending" | "used" | "draft" | "analyzed" | "generated" | "ready" | "published" | "archived";
export type IdeaPlatform = "instagram" | "youtube" | "linkedin" | "twitter" | "blog";
export type IdeaSource = "text" | "link" | "screenshot" | "voice" | "instagram-save" | "bookmark";

export interface Idea {
  id: string;
  title: string;
  description: string;
  source: IdeaSource;
  sourceLabel: string;
  platforms: IdeaPlatform[];
  status: IdeaStatus;
  tags: string[];
  createdAt: string;
  aiSuggestion?: string;
  publishedAt?: string;
  publishedPlatform?: string;
  publishedUrl?: string;
  scheduledAt?: string;
  lastGeneratedAt?: string;
}

export interface DashboardStats {
  ideasSaved: number;
  ideasUsed: number;
  pending: number;
  aiSuggestions: number;
  ideasSavedTrend: number;
  ideasUsedTrend: number;
  pendingTrend: number;
  aiSuggestionsTrend: number;
}

export const mockStats: DashboardStats = {
  ideasSaved: 128,
  ideasUsed: 47,
  pending: 23,
  aiSuggestions: 15,
  ideasSavedTrend: 12,
  ideasUsedTrend: 8,
  pendingTrend: -3,
  aiSuggestionsTrend: 5,
};

export const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "5 AM Morning Routine for College Students",
    description:
      "Film a day-in-the-life showing the morning routine — meditation, journaling, gym, healthy breakfast. Focus on how it improved grades and energy levels throughout the day.",
    source: "instagram-save",
    sourceLabel: "Instagram Save",
    platforms: ["instagram", "youtube"],
    status: "pending",
    tags: ["productivity", "routine", "college"],
    createdAt: "2 hours ago",
    aiSuggestion: "Strong Reel potential — trending audio available for morning routines.",
  },
  {
    id: "2",
    title: "Notion Setup for Semester Planning",
    description:
      "Complete walkthrough of my Notion template for tracking assignments, deadlines, reading lists, and exam schedules. Include the free template download link.",
    source: "text",
    sourceLabel: "Quick Note",
    platforms: ["youtube", "linkedin"],
    status: "draft",
    tags: ["notion", "study", "organization"],
    createdAt: "5 hours ago",
    aiSuggestion: "Carousel format would work well on LinkedIn — step-by-step screenshots.",
  },
  {
    id: "3",
    title: "Top 10 Free Resources Every CS Student Needs",
    description:
      "Curate a list including freeCodeCamp, CS50, LeetCode free tier, GitHub Student Pack, Figma for students, JetBrains free licenses, and more.",
    source: "bookmark",
    sourceLabel: "Browser Bookmark",
    platforms: ["instagram", "twitter", "linkedin"],
    status: "used",
    tags: ["resources", "CS", "free-tools"],
    createdAt: "1 day ago",
  },
  {
    id: "4",
    title: "Study With Me — 3 Hour Deep Work Session",
    description:
      "Record a Pomodoro-style study session with lofi music. Show real notes, textbook pages, and coding projects. Include timer overlay and ambient desk setup.",
    source: "voice",
    sourceLabel: "Voice Note",
    platforms: ["youtube"],
    status: "pending",
    tags: ["study-with-me", "deep-work", "lofi"],
    createdAt: "1 day ago",
    aiSuggestion: "YouTube Shorts clip of the setup + full session as long-form video.",
  },
  {
    id: "5",
    title: "How I Got a 9.5 CGPA While Running a YouTube Channel",
    description:
      "Personal story format — balancing content creation and academics. Include practical time-blocking tips, batching content, and what to sacrifice.",
    source: "text",
    sourceLabel: "Quick Note",
    platforms: ["youtube", "linkedin", "instagram"],
    status: "pending",
    tags: ["personal", "balance", "CGPA"],
    createdAt: "2 days ago",
  },
  {
    id: "6",
    title: "iPhone vs Android for Student Creators",
    description:
      "Compare camera quality, editing apps, workflow integration. Focus on Instagram Reels and YouTube Shorts creation on both platforms. Include real examples.",
    source: "link",
    sourceLabel: "Saved Link",
    platforms: ["youtube", "twitter"],
    status: "draft",
    tags: ["tech", "comparison", "mobile"],
    createdAt: "3 days ago",
  },
  {
    id: "7",
    title: "Building a Personal Brand as a College Student",
    description:
      "Framework for identifying your niche, creating consistent content, growing on LinkedIn, and converting followers into internship opportunities.",
    source: "screenshot",
    sourceLabel: "Screenshot",
    platforms: ["linkedin", "instagram"],
    status: "pending",
    tags: ["personal-brand", "career", "linkedin"],
    createdAt: "3 days ago",
    aiSuggestion: "LinkedIn article + Instagram carousel summarizing the key points.",
  },
  {
    id: "8",
    title: "AI Tools That Actually Help With Assignments",
    description:
      "Honest review of ChatGPT, Claude, Perplexity, Grammarly, and QuillBot for academic work. What to use, what to avoid, and how to use them ethically.",
    source: "text",
    sourceLabel: "Quick Note",
    platforms: ["youtube", "instagram", "twitter"],
    status: "used",
    tags: ["AI", "tools", "academic"],
    createdAt: "4 days ago",
  },
];
