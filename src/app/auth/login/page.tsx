"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Globe, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    searchParams.get("error")
  );

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary tracking-tighter">
          Welcome back
        </h2>
        <p className="text-xs text-text-tertiary">
          Enter your details to access your Idea Vault.
        </p>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[13px] text-red-400"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface/50 border border-border text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-hover focus:bg-surface transition-all shadow-sm"
            />
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-text-tertiary" />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-violet-400 hover:text-violet-300 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface/50 border border-border text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-hover focus:bg-surface transition-all shadow-sm"
            />
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-text-tertiary" />
          </div>
        </div>

        {/* Submit email */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full btn-primary justify-center py-2.5"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Sign in with Email
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-x-0 h-px bg-border" />
        <span className="relative z-10 px-3 bg-background text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
          Or continue with
        </span>
      </div>

      {/* Google Sign In */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading || isGoogleLoading}
        className="w-full btn-secondary justify-center py-2.5"
      >
        {isGoogleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Globe className="w-4 h-4 text-red-400" />
            Google Workspace
          </>
        )}
      </motion.button>

      {/* Footer link */}
      <p className="text-center text-xs text-text-tertiary mt-4">
        New to ClipCycle?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-text-tertiary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
