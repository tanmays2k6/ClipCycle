import { cn } from "@/utils/cn";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center", className)}>
      {/* Light Theme Logo */}
      <img
        src="/images/logo-horizontal.png"
        alt="ClipCycle"
        loading="lazy"
        className="block dark:hidden w-full h-auto object-contain bg-transparent border-none"
        style={{ boxShadow: "none", filter: "none", padding: 0 }}
      />
      {/* Dark Theme Logo - Uses invert as fallback to create a light logo, can be swapped later */}
      <img
        src="/images/logo-horizontal.png"
        alt="ClipCycle"
        loading="lazy"
        className="hidden dark:block w-full h-auto object-contain bg-transparent border-none dark:invert"
        style={{ boxShadow: "none", padding: 0 }}
      />
    </div>
  );
}
