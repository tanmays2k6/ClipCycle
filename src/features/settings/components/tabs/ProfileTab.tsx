"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/utils/cn";

export function ProfileTab({ data, update }: { data: any, update: (data: any) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Quick validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (jpg, png, webp)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    toast.info("Uploading avatar...");

    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Not logged in");

      const fileExt = file.name.split('.').pop();
      const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      update({ avatar_url: publicUrlData.publicUrl });
      toast.success("Avatar uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const InputRow = ({ label, id, value, type = "text", placeholder = "", maxLength, disabled = false }: any) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">{label}</label>
      <input
        id={id}
        type={type}
        value={value || ""}
        onChange={(e) => !disabled && update({ [id]: e.target.value })}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full bg-surface-hover border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all",
          disabled && "opacity-60 cursor-not-allowed bg-surface/50"
        )}
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-surface-hover flex items-center justify-center">
            {data?.avatar_url ? (
              <img src={data.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-text-tertiary">
                {data?.full_name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Profile Picture</h3>
          <p className="text-xs text-text-tertiary mt-1 max-w-xs">
            JPG, PNG or WEBP. 2MB max. We recommend using a square image.
          </p>
          {isUploading && (
            <div className="mt-2 text-xs font-medium text-brand-primary animate-pulse">
              Uploading...
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputRow label="Full Name" id="full_name" value={data?.full_name} placeholder="e.g. Jane Doe" />
        <InputRow label="Email Address" id="email" value={data?.email} disabled={true} placeholder="jane@example.com" />
        
        <InputRow label="Username" id="username" value={data?.username} placeholder="janedoe" />
        
        <div className="col-span-1 md:col-span-2 space-y-1.5">
          <label htmlFor="bio" className="text-sm font-medium text-text-secondary">Bio</label>
          <textarea
            id="bio"
            value={data?.bio || ""}
            onChange={(e) => update({ bio: e.target.value })}
            maxLength={160}
            rows={3}
            placeholder="A short bio about yourself"
            className="w-full bg-surface-hover border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all resize-none"
          />
          <div className="text-right text-xs text-text-tertiary">
            {(data?.bio || "").length} / 160
          </div>
        </div>

        <InputRow label="Creator Category" id="creator_category" value={data?.creator_category} placeholder="e.g. Technology, Lifestyle" />
        <InputRow label="College / University" id="college" value={data?.college} placeholder="e.g. Stanford University" />
        <InputRow label="Website" id="website" value={data?.website} type="url" placeholder="https://example.com" />
        
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-sm font-semibold text-text-primary mb-4 pb-2 border-b border-border">Social Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputRow label="Twitter" id="twitter" value={data?.twitter} placeholder="@username" />
            <InputRow label="LinkedIn" id="linkedin" value={data?.linkedin} placeholder="linkedin.com/in/username" />
            <InputRow label="Instagram" id="instagram" value={data?.instagram} placeholder="@username" />
            <InputRow label="YouTube" id="youtube" value={data?.youtube} placeholder="youtube.com/@username" />
          </div>
        </div>
      </div>
    </div>
  );
}
