"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/utils/cn";

function Toggle({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0",
        enabled ? "bg-brand-primary" : "bg-surface-hover border border-border"
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm",
          enabled ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function AppearanceTab({ data, update }: { data: any, update: (data: any) => void }) {
  
  const ThemeCard = ({ id, label, icon: Icon, isSelected }: any) => (
    <button
      onClick={() => update({ theme: id })}
      className={cn(
        "relative flex flex-col items-center gap-4 p-4 rounded-2xl border transition-all hover-lift w-full",
        isSelected
          ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary"
          : "border-border bg-surface hover:bg-surface-hover"
      )}
    >
      <div className={cn(
        "w-full h-24 rounded-xl border flex items-center justify-center overflow-hidden transition-colors",
        id === "light" ? "bg-[#F8FAFC] border-gray-200" :
        id === "dark" ? "bg-[#09090B] border-gray-800" :
        "bg-gradient-to-br from-[#F8FAFC] to-[#09090B] border-gray-600"
      )}>
        {/* Mini UI Preview inside the card */}
        <div className="w-2/3 h-12 rounded bg-surface border border-border shadow-sm flex flex-col gap-2 p-2">
          <div className="w-full h-2 rounded bg-brand-primary/50" />
          <div className="w-1/2 h-2 rounded bg-text-tertiary/20" />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", isSelected ? "text-brand-primary" : "text-text-secondary")} />
        <span className={cn("text-sm font-medium", isSelected ? "text-brand-primary" : "text-text-primary")}>
          {label}
        </span>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );

  const ACCENT_COLORS = [
    { id: "violet", name: "Purple", from: "from-violet-500", to: "to-violet-600", bg: "bg-violet-500" },
    { id: "blue", name: "Blue", from: "from-blue-500", to: "to-blue-600", bg: "bg-blue-500" },
    { id: "emerald", name: "Emerald", from: "from-emerald-500", to: "to-emerald-600", bg: "bg-emerald-500" },
    { id: "rose", name: "Rose", from: "from-rose-500", to: "to-rose-600", bg: "bg-rose-500" },
    { id: "orange", name: "Orange", from: "from-orange-500", to: "to-orange-600", bg: "bg-orange-500" },
  ];

  return (
    <div className="space-y-10">
      {/* Theme Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Theme</h3>
          <p className="text-xs text-text-tertiary mt-1">Select or customize your UI theme.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ThemeCard id="light" label="Light" icon={Sun} isSelected={data?.theme === "light"} />
          <ThemeCard id="dark" label="Dark" icon={Moon} isSelected={data?.theme === "dark"} />
          <ThemeCard id="system" label="System" icon={Monitor} isSelected={data?.theme === "system"} />
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Accent Color</h3>
          <p className="text-xs text-text-tertiary mt-1">Updates buttons, highlights, and focus rings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {ACCENT_COLORS.map(color => {
            const isSelected = data?.accent_color === color.id;
            return (
              <button
                key={color.id}
                onClick={() => update({ accent_color: color.id })}
                className={cn(
                  "relative flex items-center gap-3 p-3 rounded-2xl border transition-all hover-lift",
                  isSelected
                    ? "border-border bg-surface-hover/50 ring-1 ring-border shadow-sm"
                    : "border-transparent bg-transparent hover:bg-surface-hover/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full bg-gradient-to-br shadow-sm flex items-center justify-center",
                  color.from, color.to
                )}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={cn("text-sm font-medium", isSelected ? "text-text-primary" : "text-text-secondary")}>
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interface Options */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Interface Options</h3>
          <p className="text-xs text-text-tertiary mt-1">Customize layout density and animations.</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-hover/30 divide-y divide-border">
          
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-text-primary">Compact Mode</p>
              <p className="text-xs text-text-tertiary mt-1">Reduces padding and spacing across the dashboard.</p>
            </div>
            <Toggle enabled={data?.compact_mode} onChange={(val) => update({ compact_mode: val })} />
          </div>

          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-text-primary">Reduce Motion</p>
              <p className="text-xs text-text-tertiary mt-1">Disables non-essential animations and transitions.</p>
            </div>
            <Toggle enabled={data?.reduce_motion} onChange={(val) => update({ reduce_motion: val })} />
          </div>

        </div>
      </div>

    </div>
  );
}
