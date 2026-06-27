import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  compactMode: boolean;
  reduceMotion: boolean;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: string) => void;
  setCompactMode: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
  setAll: (prefs: Partial<PreferencesState>) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'dark',
      accentColor: 'violet',
      compactMode: false,
      reduceMotion: false,

      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setAll: (prefs) => set((state) => ({ ...state, ...prefs })),
    }),
    {
      name: 'clipcycle-preferences', // unique name for localStorage
    }
  )
);
