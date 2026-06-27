"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Camera, Mic, Play, Sparkles } from "lucide-react";
import { TabBar, TabPanel } from "@/components/shared/tabs";
import {
  TextCapture,
  ScreenshotCapture,
  VoiceCapture,
  InstagramCapture,
  YoutubeCapture,
} from "@/features/ideas";

const tabs = [
  { key: "text", label: "Text", icon: FileText },
  { key: "screenshot", label: "Screenshot", icon: Camera },
  { key: "voice", label: "Voice Note", icon: Mic },
  { key: "instagram", label: "Instagram", icon: Camera },
  { key: "youtube", label: "YouTube", icon: Play },
];

export default function AddIdeaPage() {
  const [activeTab, setActiveTab] = useState("text");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header / Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/ideas"
            className="p-2 rounded-xl bg-surface/50 border border-border text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <Link href="/dashboard/ideas" className="hover:underline">Ideas</Link>
              <span>/</span>
              <span className="text-text-secondary">New</span>
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight mt-0.5">
              Add Idea
            </h2>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/15 text-xs text-violet-300">
          <Sparkles className="w-3.5 h-3.5" />
          AI Engine Active
        </div>
      </div>

      {/* Tabs Selector */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="p-6 rounded-2xl bg-surface/40 border border-border backdrop-blur-md">
        <TabPanel active={activeTab === "text"}>
          <TextCapture />
        </TabPanel>
        <TabPanel active={activeTab === "screenshot"}>
          <ScreenshotCapture />
        </TabPanel>
        <TabPanel active={activeTab === "voice"}>
          <VoiceCapture />
        </TabPanel>
        <TabPanel active={activeTab === "instagram"}>
          <InstagramCapture />
        </TabPanel>
        <TabPanel active={activeTab === "youtube"}>
          <YoutubeCapture />
        </TabPanel>
      </div>
    </div>
  );
}
