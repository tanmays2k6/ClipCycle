"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Roadmap", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#1f2937] bg-[#0B0F17] text-slate-300 pt-32 pb-16">
      <div className="container-premium">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-24 mb-24">
          
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center text-center md:items-start md:text-left space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo variant="horizontal" size={40} />
            </Link>
            <p className="text-[15px] text-slate-400 max-w-[280px] leading-relaxed font-bold">
              Capture. Organize. Create. Repeat.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1f2937] flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors font-bold text-sm">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1f2937] flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors font-bold text-sm">
                Ig
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1f2937] flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors font-bold text-sm">
                In
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1f2937] flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-colors font-bold text-sm">
                Git
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1 flex flex-col items-center text-center md:items-start md:text-left">
              <h4 className="text-[15px] font-bold text-slate-100 mb-6">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[15px] text-slate-400 hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1f2937] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-slate-400 font-medium">
            © {new Date().getFullYear()} ClipCycle. All rights reserved.
          </p>
          <p className="text-[14px] text-slate-400 font-medium flex items-center gap-2">
            Made with <span className="text-red-500 text-lg">♥</span> for Student Creators
          </p>
        </div>
      </div>
    </footer>
  );
}
