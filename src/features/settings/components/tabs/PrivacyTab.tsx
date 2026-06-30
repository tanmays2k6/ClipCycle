"use client";

import { Shield, Database, Lock, Smartphone, MapPin, Clock, LogOut, Monitor } from "lucide-react";
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
          "absolute top-0.5 w-5 h-5 rounded-full bg-card transition-transform duration-300 shadow-sm",
          enabled ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function PrivacyTab({ data, update }: { data: any, update: (data: any) => void }) {
  return (
    <div className="space-y-8">
      
      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary px-1">Security</h3>
        <div className="rounded-2xl border border-border bg-surface-hover/30 divide-y divide-border">
          <div className="flex items-center justify-between p-5 hover:bg-surface-hover/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-text-tertiary mt-1">Add an extra layer of security to your account.</p>
              </div>
            </div>
            <Toggle enabled={data?.two_factor_auth} onChange={(val) => update({ two_factor_auth: val })} />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary px-1">Data & Privacy</h3>
        <div className="rounded-2xl border border-border bg-surface-hover/30 divide-y divide-border">
          <div className="flex items-center justify-between p-5 hover:bg-surface-hover/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
                <Database className="w-4 h-4 text-text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Data Usage for AI Training</p>
                <p className="text-xs text-text-tertiary mt-1 max-w-sm">
                  Allow your anonymous data to be used to improve our AI models. We never train on private ideas unless explicitly shared.
                </p>
              </div>
            </div>
            <Toggle enabled={data?.data_usage_ai_training} onChange={(val) => update({ data_usage_ai_training: val })} />
          </div>
        </div>
      </div>

      {/* Session History (Visual only for now as requested by user design guidelines) */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary px-1">Active Sessions</h3>
        <div className="rounded-2xl border border-border bg-surface-hover/30 divide-y divide-border overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                <Monitor className="w-5 h-5 text-text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                  Mac OS • Chrome
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">This Device</span>
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> San Francisco, CA</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Active Now</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 opacity-75">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  iOS • Safari
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> San Francisco, CA</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last active 2h ago</span>
                </div>
              </div>
            </div>
            <button className="btn-secondary">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
