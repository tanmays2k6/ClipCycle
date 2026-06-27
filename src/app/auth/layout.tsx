import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative z-10">
        
        {/* Content Box */}
        <div className="w-full max-w-sm mx-auto">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Logo size={80} animated />
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right Panel: Illustration */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-surface/30 items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        
        <div className="relative z-10 max-w-md w-full glass p-10 rounded-3xl border border-border/50 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4 leading-tight">
            The intelligent workspace for modern creators.
          </h2>
          <p className="text-base text-text-secondary leading-relaxed mb-8">
            Capture everything, let AI organize it, and generate publish-ready content in seconds.
          </p>
          
          {/* Testimonial snippet */}
          <div className="pt-6 border-t border-border/50">
            <p className="text-sm text-text-secondary italic mb-4">
              &quot;ClipCycle saved me 4 hours a week by organizing all my scattered screenshots and voice notes.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-xs font-semibold text-white">
                AK
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">Ananya Krishnan</p>
                <p className="text-[10px] text-text-tertiary">@ananya.creates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
