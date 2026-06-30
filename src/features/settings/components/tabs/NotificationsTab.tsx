"use client";

import { cn } from "@/utils/cn";
import { Mail, Smartphone, Bell, Sparkles, Calendar, Zap, ShieldAlert, Monitor } from "lucide-react";

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

const NotificationRow = ({ id, label, desc, icon: Icon, data, update }: any) => (
  <div className="flex items-center justify-between p-5 hover:bg-surface-hover/30 transition-colors">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-text-secondary" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-tertiary mt-1">{desc}</p>
      </div>
    </div>
    <Toggle enabled={data?.[id]} onChange={(val) => update({ [id]: val })} />
  </div>
);

export function NotificationsTab({ data, update }: { data: any, update: (data: any) => void }) {

  return (
    <div className="space-y-8">
      {/* Delivery Methods */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary px-1">Delivery Methods</h3>
        <div className="rounded-2xl border border-border bg-surface-hover/30 divide-y divide-border overflow-hidden">
          <NotificationRow 
            id="email_notifications" 
            label="Email Notifications" 
            desc="Receive notifications via your registered email address." 
            icon={Mail} 
            data={data} update={update}
          />
          <NotificationRow 
            id="push_notifications" 
            label="Push Notifications" 
            desc="Receive push notifications on your mobile device." 
            icon={Smartphone} 
            data={data} update={update}
          />
          <NotificationRow 
            id="desktop_notifications" 
            label="Desktop Notifications" 
            desc="Receive notifications in your browser." 
            icon={Monitor} 
            data={data} update={update}
          />
        </div>
      </div>

      {/* Notification Types */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary px-1">Notification Types</h3>
        <div className="rounded-2xl border border-border bg-surface-hover/30 divide-y divide-border overflow-hidden">
          <NotificationRow 
            id="ai_suggestions" 
            label="AI Suggestions" 
            desc="Get notified when AI finishes generating content or analyzing ideas." 
            icon={Sparkles} 
            data={data} update={update}
          />
          <NotificationRow 
            id="weekly_digest" 
            label="Weekly Digest" 
            desc="A weekly summary of your content performance and new ideas." 
            icon={Calendar} 
            data={data} update={update}
          />
          <NotificationRow 
            id="product_updates" 
            label="Product Updates" 
            desc="News about new features, improvements, and changes to ClipCycle." 
            icon={Zap} 
            data={data} update={update}
          />
          <NotificationRow 
            id="security_alerts" 
            label="Security Alerts" 
            desc="Important notifications about your account security." 
            icon={ShieldAlert} 
            data={data} update={update}
          />
        </div>
      </div>
    </div>
  );
}
