"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

export function IntegrationsTab({ data, update }: { data: any, update: (data: any) => void }) {
  
  const IntegrationCard = ({ id, name, description, isConnected, icon: Icon, color }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-surface-hover/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-border/50 p-2.5 shadow-sm">
          <Icon className="w-full h-full" style={{ color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-text-primary">{name}</h4>
            {isConnected && (
              <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            )}
          </div>
          <p className="text-xs text-text-tertiary mt-1 max-w-xs">{description}</p>
        </div>
      </div>
      <button
        onClick={() => update({ [id]: !isConnected })}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-xl border transition-all shrink-0 w-full sm:w-auto",
          isConnected
            ? "border-border bg-surface text-text-secondary hover:text-red-500 hover:border-red-500/30"
            : "border-border bg-brand-primary text-white hover:bg-brand-secondary"
        )}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary px-1">Connected Apps</h3>
        <p className="text-xs text-text-tertiary px-1 -mt-2 mb-4">
          Connect your favorite tools to export and sync your ideas seamlessly.
        </p>
        
        <div className="rounded-2xl border border-border bg-surface-hover/30 divide-y divide-border overflow-hidden">
          
          {/* Custom SVG Icons since lucide doesn't have brand icons built-in easily */}
          <IntegrationCard
            id="google"
            name="Google Drive"
            description="Export your generated content and ideas directly to Google Docs."
            isConnected={data?.google}
            color="#4285F4"
            icon={({className, style}: any) => (
              <svg viewBox="0 0 24 24" className={className} style={style}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
          />

          <IntegrationCard
            id="notion"
            name="Notion"
            description="Sync your saved ideas directly into your Notion databases."
            isConnected={data?.notion}
            color="#000000"
            icon={({className, style}: any) => (
              <svg viewBox="0 0 24 24" className={className} style={style}>
                <path d="M4.459 4.208c.746-.576 1.834-.69 2.502-.69h6.126c2.46 0 4.19.824 5.367 2.277 1.06 1.306 1.455 3.1 1.096 4.908-.363 1.83-1.48 3.535-3.11 4.757-1.63 1.222-3.69 1.832-6.023 1.832H7.28c-.808 0-1.854.126-2.58.58-.727.456-1.125 1.127-1.125 2.054v.104h-1.63V4.208h2.514zm1.503 1.83v11.832c0 .484.21.84.58 1.07.37.234.908.312 1.446.312h2.296c1.782 0 3.315-.453 4.475-1.323 1.16-.87 1.954-2.072 2.215-3.385.263-1.314.045-2.617-.615-3.568-.66-.95-1.85-1.557-3.66-1.557h-4.32V6.04h-2.416z" fill="currentColor"/>
              </svg>
            )}
          />

          <IntegrationCard
            id="slack"
            name="Slack"
            description="Send AI generated content directly to Slack channels for review."
            isConnected={data?.slack}
            color="#E01E5A"
            icon={({className, style}: any) => (
              <svg viewBox="0 0 24 24" className={className} style={style}>
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.835a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.835a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.835zM17.688 8.835a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.313zM15.165 18.958a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.52v-2.522h2.523zM15.165 17.687a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.523-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522-2.523h-6.313z" fill="currentColor"/>
              </svg>
            )}
          />
          
        </div>
      </div>
    </div>
  );
}
