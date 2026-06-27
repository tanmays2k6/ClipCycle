"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { usePreferences } from "@/store/usePreferences";
import { createClient } from "@/lib/supabase/client";

const ACCENT_COLORS: Record<string, string> = {
  violet: "#8b5cf6",
  blue: "#3b82f6",
  emerald: "#10b981",
  rose: "#f43f5e",
  orange: "#f97316",
};

function PreferencesEffect() {
  const { theme, accentColor, compactMode, reduceMotion, setAll } = usePreferences();
  const { setTheme, theme: currentTheme } = useTheme();

  // Load from DB on mount to sync across devices if authenticated
  useEffect(() => {
    const syncWithDb = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("appearance_settings").select("*").eq("user_id", user.id).single();
        if (data) {
          setAll({
            theme: data.theme as any,
            accentColor: data.accent_color,
            compactMode: data.compact_mode,
            reduceMotion: data.reduce_motion,
          });
          if (data.theme) {
            setTheme(data.theme);
          }
        }
      }
    };
    syncWithDb();
  }, [setAll, setTheme]);

  // Sync Zustand theme state with next-themes dynamically for instant preview
  useEffect(() => {
    if (theme && theme !== currentTheme) {
      setTheme(theme);
    }
  }, [theme, setTheme, currentTheme]);

  // Apply to DOM
  useEffect(() => {
    const root = document.documentElement;

    // Apply Accent Color
    const colorHex = ACCENT_COLORS[accentColor] || ACCENT_COLORS.violet;
    root.style.setProperty("--primary", colorHex);
    root.style.setProperty("--brand-primary", colorHex);
    root.style.setProperty("--brand-secondary", colorHex); 
    
    // Apply Options
    root.classList.toggle("compact-mode", compactMode);
    root.classList.toggle("reduce-motion", reduceMotion);
  }, [accentColor, compactMode, reduceMotion]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {mounted && <PreferencesEffect />}
      {children}
    </NextThemesProvider>
  );
}
