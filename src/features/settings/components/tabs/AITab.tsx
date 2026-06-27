"use client";

import { Sparkles, Save, Type, AlignLeft, Share2 } from "lucide-react";
import { cn } from "@/utils/cn";

function Toggle({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0",
        enabled ? "bg-violet-600" : "bg-surface-hover border border-border"
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

export function AITab({ data, update }: { data: any, update: (data: any) => void }) {
  
  const SelectCard = ({ label, options, value, id, icon: Icon }: any) => (
    <div className="flex flex-col gap-3 p-5 border-b border-border last:border-0 hover:bg-surface-hover/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        {options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => update({ [id]: opt.value })}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-xl border transition-all text-center",
              value === opt.value
                ? "border-brand-primary bg-brand-primary text-white shadow-sm"
                : "border-border bg-surface text-text-secondary hover:border-text-tertiary"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary px-1">AI Generation Defaults</h3>
        <div className="rounded-2xl border border-border bg-surface-hover/30 overflow-hidden">
          
          <SelectCard
            id="model"
            label="Preferred AI Model"
            icon={Sparkles}
            value={data?.model}
            options={[
              { label: "Auto (Recommended)", value: "auto" },
              { label: "Gemini 1.5 Pro", value: "gemini" },
              { label: "GPT-4o", value: "openai" },
            ]}
          />
          
          <SelectCard
            id="content_tone"
            label="Default Content Tone"
            icon={Type}
            value={data?.content_tone}
            options={[
              { label: "Professional", value: "professional" },
              { label: "Casual", value: "casual" },
              { label: "Educational", value: "educational" },
              { label: "Funny", value: "funny" },
            ]}
          />
          
          <SelectCard
            id="content_length"
            label="Default Length"
            icon={AlignLeft}
            value={data?.content_length}
            options={[
              { label: "Short", value: "short" },
              { label: "Medium", value: "medium" },
              { label: "Long", value: "long" },
            ]}
          />
          
          <SelectCard
            id="default_platform"
            label="Primary Platform"
            icon={Share2}
            value={data?.default_platform}
            options={[
              { label: "LinkedIn", value: "linkedin" },
              { label: "Twitter", value: "twitter" },
              { label: "Instagram", value: "instagram" },
              { label: "YouTube", value: "youtube" },
            ]}
          />

        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary px-1">AI Workflow</h3>
        <div className="rounded-2xl border border-border bg-surface-hover/30 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                <Save className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Auto-Save Generated Content</p>
                <p className="text-xs text-text-tertiary mt-1 max-w-sm">
                  Automatically save all AI generated drafts to your database history so you never lose them.
                </p>
              </div>
            </div>
            <Toggle enabled={data?.auto_save_ai_output} onChange={(val) => update({ auto_save_ai_output: val })} />
          </div>
        </div>
      </div>
      
    </div>
  );
}
