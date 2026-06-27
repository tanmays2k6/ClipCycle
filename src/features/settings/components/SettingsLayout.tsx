"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ProfileTab } from "./tabs/ProfileTab";
import { AccountTab } from "./tabs/AccountTab";
import { AppearanceTab } from "./tabs/AppearanceTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { AITab } from "./tabs/AITab";
import { PrivacyTab } from "./tabs/PrivacyTab";
import { IntegrationsTab } from "./tabs/IntegrationsTab";
import { DataTab } from "./tabs/DataTab";
import { DangerZoneTab } from "./tabs/DangerZoneTab";
import { usePreferences } from "@/store/usePreferences";
import { Check, User, Shield, Palette, Sparkles, Lock, Link, Database, AlertTriangle, Bell } from "lucide-react";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "integrations", label: "Integrations", icon: Link },
  { id: "data", label: "Data", icon: Database },
  { id: "danger", label: "Danger", icon: AlertTriangle },
];

export function SettingsLayout({ initialSettings, onRefresh }: { initialSettings: any, onRefresh: () => void }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [localSettings, setLocalSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedState, setShowSavedState] = useState(false);
  const { setAll } = usePreferences();

  useEffect(() => {
    setLocalSettings(initialSettings);
  }, [initialSettings]);

  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(initialSettings);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const categories = Object.keys(localSettings).filter(cat => cat !== "account" && cat !== "danger");
      let errorOccurred = false;

      for (const category of categories) {
        if (JSON.stringify(localSettings[category]) !== JSON.stringify(initialSettings[category])) {
          const res = await fetch("/api/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, data: localSettings[category] }),
          });
          if (!res.ok) {
            errorOccurred = true;
          }
        }
      }

      if (errorOccurred) {
        toast.error("Failed to save some settings");
      } else {
        // Sync global state immediately after successful save
        if (localSettings.appearance) {
          setAll({
            theme: localSettings.appearance.theme,
            accentColor: localSettings.appearance.accent_color,
            compactMode: localSettings.appearance.compact_mode,
            reduceMotion: localSettings.appearance.reduce_motion,
          });
        }
        
        onRefresh();
        
        setShowSavedState(true);
        setTimeout(() => {
          setShowSavedState(false);
        }, 2000);
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  const updateCategory = (category: string, updates: any) => {
    setLocalSettings((prev: any) => {
      const newSettings = {
        ...prev,
        [category]: { ...prev[category], ...updates },
      };

      // Also dynamically apply appearance immediately if changed so user can preview before saving
      if (category === "appearance") {
        if (updates.theme) setAll({ theme: updates.theme });
        if (updates.accent_color) setAll({ accentColor: updates.accent_color });
        if (updates.compact_mode !== undefined) setAll({ compactMode: updates.compact_mode });
        if (updates.reduce_motion !== undefined) setAll({ reduceMotion: updates.reduce_motion });
      }

      return newSettings;
    });
  };

  const handleCancel = () => {
    // Restore global preferences to what they were before the preview modifications
    if (initialSettings.appearance) {
      setAll({
        theme: initialSettings.appearance.theme,
        accentColor: initialSettings.appearance.accent_color,
        compactMode: initialSettings.appearance.compact_mode,
        reduceMotion: initialSettings.appearance.reduce_motion,
      });
    }
    setLocalSettings(initialSettings);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab data={{ ...localSettings.profile, email: localSettings.account?.email }} update={(updates) => updateCategory("profile", updates)} />;
      case "account":
        return <AccountTab data={localSettings.account} />;
      case "appearance":
        return <AppearanceTab data={localSettings.appearance} update={(updates) => updateCategory("appearance", updates)} />;
      case "notifications":
        return <NotificationsTab data={localSettings.notifications} update={(updates) => updateCategory("notifications", updates)} />;
      case "ai":
        return <AITab data={localSettings.ai} update={(updates) => updateCategory("ai", updates)} />;
      case "privacy":
        return <PrivacyTab data={localSettings.privacy} update={(updates) => updateCategory("privacy", updates)} />;
      case "integrations":
        return <IntegrationsTab data={localSettings.integrations} update={(updates) => updateCategory("integrations", updates)} />;
      case "data":
        return <DataTab />;
      case "danger":
        return <DangerZoneTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 relative">
      
      {/* Pill Tabs Navigation */}
      <div className="flex overflow-x-auto no-scrollbar py-2 -mx-2 px-2 hide-scrollbar">
        <div className="flex gap-2 p-1.5 bg-surface-hover/50 rounded-2xl border border-border/50 backdrop-blur-md">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDanger = tab.id === "danger";

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 rounded-xl group",
                  isActive
                    ? isDanger ? "text-white" : "text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-surface"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className={cn(
                      "absolute inset-0 rounded-xl shadow-sm border",
                      isDanger ? "bg-red-500 border-red-400" : "bg-surface border-border"
                    )}
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 relative z-10 transition-colors", isActive ? (isDanger ? "text-white" : "text-brand-primary") : "group-hover:text-text-primary")} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Premium Content Card */}
      <div className="min-h-[500px] bg-surface border border-border rounded-[24px] p-8 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Save Banner */}
      <AnimatePresence>
        {(hasChanges || showSavedState) && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-premium rounded-2xl p-4 flex items-center gap-6 w-[90%] max-w-xl justify-between shadow-2xl border border-border/80"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text-primary">
                {showSavedState ? "Settings Saved" : "Unsaved changes"}
              </span>
              <span className="text-xs text-text-tertiary">
                {showSavedState ? "Your preferences have been updated." : "You have modified your settings."}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {!showSavedState ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-white bg-brand-primary hover:brightness-110 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </>
              ) : (
                <div className="px-6 py-2 flex items-center gap-2 text-sm font-medium text-green-500 bg-green-500/10 rounded-xl border border-green-500/20">
                  <Check className="w-4 h-4" />
                  Saved
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
