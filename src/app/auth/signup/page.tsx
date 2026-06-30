"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, CheckSquare, Square } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";

export default function SignupPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      setErrorMessage("You must accept the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
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

  if (isSuccess) {
    return (
      <div className="w-full max-w-[460px] mx-auto bg-card rounded-[28px] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6 border border-green-100 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-[32px] font-bold text-foreground mb-4">Check your email</h2>
          <p className="text-[16px] text-muted-foreground font-medium mb-8 leading-relaxed">
            We have sent a verification link to <span className="text-foreground font-bold">{email}</span>. Click the link to complete registration.
          </p>
          <Link href="/auth/login" className="w-full h-[56px] rounded-2xl bg-secondary text-foreground font-bold text-[16px] shadow-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors border border-border">
            Return to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[460px] mx-auto bg-card rounded-[28px] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-border/60">
      
      <div className="flex justify-center mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo variant="horizontal" size={48} animated />
        </Link>
      </div>

      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-foreground leading-tight tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-[16px] font-medium">
          Start capturing your ideas with ClipCycle.
        </p>
      </div>

      {errorMessage && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-medium leading-relaxed">{errorMessage}</p>
        </motion.div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-[14px] font-bold text-foreground block">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tanmay C"
              className="w-full h-[56px] pl-12 pr-4 bg-surface rounded-2xl border border-border text-[16px] text-foreground font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

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

        {/* Password Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-foreground block">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyUp}
                placeholder="Min 8 chars"
                className="w-full h-[56px] pl-10 pr-2 bg-surface rounded-2xl border border-border text-[14px] text-foreground font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-foreground block">Confirm</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyUp={handleKeyUp}
                placeholder="Repeat password"
                className={`w-full h-[56px] pl-10 pr-10 bg-surface rounded-2xl border text-[14px] text-foreground font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 ${confirmPassword && password !== confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {capsLockActive && (
          <p className="text-[12px] text-amber-500 font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Caps lock is on
          </p>
        )}

        {/* Terms */}
        <div className="flex items-start gap-2 pt-2">
          <button type="button" onClick={() => setAcceptTerms(!acceptTerms)} className="text-primary focus:outline-none mt-0.5 shrink-0">
            {acceptTerms ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-muted-foreground" />}
          </button>
          <span className="text-[13px] font-medium text-muted-foreground select-none">
            I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
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
            <>Create Account <ArrowRight className="w-5 h-5" /></>
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
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary font-bold hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
