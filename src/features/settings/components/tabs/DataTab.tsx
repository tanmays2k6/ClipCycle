"use client";

import { useState, useRef } from "react";
import { Download, Upload, FileJson, FileText, Database } from "lucide-react";
import { toast } from "sonner";

export function DataTab() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    toast.info(`Exporting ideas as ${format.toUpperCase()}...`);
    try {
      // The easiest way to download is redirect to the route or fetch and create blob
      const res = await fetch(`/api/export?format=${format}`);
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clipcycle-ideas-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success("Export ready!");
    } catch (err) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (!file.name.endsWith(".json") && !file.name.endsWith(".csv")) {
      toast.error("Please upload a .json or .csv file");
      return;
    }

    setIsImporting(true);
    toast.info("Importing ideas...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Import failed");
      
      if (data.count) {
        toast.success(`Import complete! Added ${data.count} new ideas.`);
      } else {
        toast.success(data.message || "Import complete. No new ideas added.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to import ideas");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Export */}
      <div className="space-y-4">
        <h3 className="text-h3 px-1">Export Data</h3>
        <p className="text-caption px-1 -mt-2 mb-4">
          Download a copy of all your ideas, generated content, and settings.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="card-interactive flex flex-col items-center justify-center gap-3 disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-text-primary">Export as CSV</span>
          </button>
          
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="card-interactive flex flex-col items-center justify-center gap-3 disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FileJson className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-text-primary">Export as JSON</span>
          </button>
          
          <button
            onClick={() => handleExport('markdown')}
            disabled={isExporting}
            className="card-interactive flex flex-col items-center justify-center gap-3 disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-full bg-gray-500/10 text-gray-400 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-text-primary">Export as Markdown</span>
          </button>
        </div>
      </div>

      {/* Import */}
      <div className="space-y-4">
        <h3 className="text-h3 px-1">Import Data</h3>
        <div className="card-base flex flex-col items-center justify-center text-center gap-4 border-dashed">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
            <Upload className="w-5 h-5 text-text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Upload JSON or CSV</p>
            <p className="text-xs text-text-tertiary mt-1">
              Import ideas from other tools. We will automatically detect and skip duplicates based on title.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="btn-secondary mt-2"
          >
            Select File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".csv,.json"
          />
        </div>
      </div>
    </div>
  );
}
