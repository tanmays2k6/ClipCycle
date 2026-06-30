import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clipcycle.com"),
  title: "ClipCycle",
  description:
    "ClipCycle is the AI-powered Content Idea Vault for student creators. Capture ideas from anywhere, let AI organize them, and convert them into publish-ready content.",
  keywords: [
    "content ideas",
    "AI content",
    "student creators",
    "content vault",
    "idea organizer",
    "Instagram creators",
    "YouTube creators",
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "ClipCycle — Never Lose Another Content Idea",
    description:
      "The AI-powered Content Idea Vault for student creators. Capture, organize, and create.",
    type: "website",
    url: "https://clipcycle.com",
    images: [{ url: "/images/logo-horizontal.png", width: 1024, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipCycle — Never Lose Another Content Idea",
    description: "The AI-powered Content Idea Vault for student creators. Capture, organize, and create.",
    images: ["/images/logo-horizontal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster 
              position="bottom-right" 
              richColors 
              toastOptions={{
                classNames: {
                  toast: "shadow-premium border border-border/50 backdrop-blur-xl bg-surface/90 text-text-primary",
                }
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
