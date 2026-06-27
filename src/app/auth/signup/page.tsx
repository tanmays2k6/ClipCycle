"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    setIsLoading(false);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4 text-center py-6"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Check your email
          </h2>
          <p className="text-xs text-text-tertiary max-w-sm mx-auto leading-relaxed">
            We have sent a verification link to <span className="text-text-secondary font-medium">{email}</span>. Click the link to complete registration.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-block mt-4 text-xs font-semibold text-violet-400 hover:text-violet-300 hover:underline transition-colors"
        >
          Back to Sign In
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-text-primary tracking-tight">
          Create an account
        </h2>
        <p className="text-xs text-text-tertiary">
          Capture your content ideas with ClipCycle today.
        </p>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
            Full name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tanmay C"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
            <User className="absolute left-4 top-3.5 w-4 h-4 text-text-tertiary" />
          </div>
        </div>

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
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-text-tertiary" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              minLength={8}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-text-tertiary" />
          </div>
        </div>

        {/* Submit signup */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-600/20 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Register Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>

      {/* Footer link */}
      <p className="text-center text-xs text-text-tertiary mt-4">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
