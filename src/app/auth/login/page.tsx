"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, CheckSquare, Square } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(searchParams.get("error"));

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsGoogleLoading(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto bg-card rounded-[28px] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60">
      
      <div className="flex justify-center mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo variant="horizontal" size={48} animated />
        </Link>
      </div>

      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-[32px] sm:text-[40px] font-bold text-foreground leading-tight tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground text-[16px] font-medium">
          Continue building your idea vault.
        </p>
      </div>

      {errorMessage && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-medium leading-relaxed">{errorMessage}</p>
        </motion.div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-5">
        
        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-[14px] font-bold text-foreground block">Email address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full h-[56px] pl-12 pr-4 bg-surface rounded-2xl border border-border text-[16px] text-foreground font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[14px] font-bold text-foreground block">Password</label>
            <Link href="/forgot-password" className="text-[13px] font-bold text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleKeyUp}
              placeholder="••••••••"
              className="w-full h-[56px] pl-12 pr-12 bg-surface rounded-2xl border border-border text-[16px] text-foreground font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {capsLockActive && (
            <p className="text-[12px] text-amber-500 font-bold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Caps lock is on
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-1">
          <button type="button" onClick={() => setRememberMe(!rememberMe)} className="text-primary focus:outline-none">
            {rememberMe ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-muted-foreground" />}
          </button>
          <span className="text-[14px] font-medium text-foreground cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
            Remember me for 30 days
          </span>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01, translateY: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full h-[56px] mt-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[16px] shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 transition-all disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Sign in securely <ArrowRight className="w-5 h-5" /></>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center mt-8 mb-6">
        <div className="absolute inset-x-0 h-px bg-border" />
        <span className="relative z-10 px-4 bg-card text-[11px] text-muted-foreground font-bold uppercase tracking-widest">
          Or continue with
        </span>
      </div>

      {/* Google OAuth Button */}
      <motion.button 
        whileHover={{ y: -2 }} 
        whileTap={{ scale: 0.98 }} 
        onClick={() => handleOAuthLogin('google')} 
        disabled={isGoogleLoading} 
        className="w-full h-[52px] bg-card border border-border rounded-xl flex items-center justify-center gap-3 hover:bg-muted transition-colors shadow-sm font-bold text-[15px] text-foreground"
      >
        {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
          <>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </>
        )}
      </motion.button>

      <p className="text-center text-[15px] text-muted-foreground font-medium mt-8">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-primary font-bold hover:underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
