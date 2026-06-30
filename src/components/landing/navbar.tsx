"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Product", href: "#product" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent h-[64px] md:h-[72px] flex items-center",
          scrolled ? "bg-card/80 backdrop-blur-xl border-border shadow-sm" : "bg-transparent"
        )}
      >
        <div className="container-premium">
          <div className="flex items-center justify-between w-full h-full">
            
            {/* Logo - Left */}
            <Link href="/" className="flex items-center shrink-0 w-48" onClick={() => setMobileOpen(false)}>
              <Logo variant="horizontal" size={40} />
            </Link>

            {/* Desktop Links - Centered */}
            <div className="hidden lg:flex items-center justify-center gap-10 flex-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[15px] font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
                </a>
              ))}
            </div>

            {/* CTAs - Right */}
            <div className="flex items-center justify-end gap-4 shrink-0 w-auto">
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-[15px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="btn-primary px-5 py-2 h-10 rounded-xl"
                >
                  Start Free
                </Link>
              </div>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] z-[70] bg-card border-l border-border flex flex-col lg:hidden overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 h-[80px] border-b border-border shrink-0">
                <Logo variant="icon" size={28} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="py-2 flex items-center justify-between">
                  <span className="text-lg font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              <div className="p-6 border-t border-border flex flex-col gap-4 shrink-0">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-ghost w-full justify-center"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Start Free
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
