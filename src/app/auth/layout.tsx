import { AuthShowcase } from "@/components/auth/auth-showcase";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-5 md:p-8 lg:p-16">
      <div className="w-full max-w-[1440px] bg-transparent lg:bg-card/40 lg:backdrop-blur-xl lg:border lg:border-border/50 lg:shadow-2xl rounded-[40px] flex flex-col lg:flex-row overflow-hidden min-h-[800px]">
        
        {/* Left Panel: Auth Form (45%) */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-4 sm:px-12 py-10 lg:py-20 bg-transparent">
          {children}
        </div>

        {/* Right Panel: Interactive Showcase (55%) */}
        <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-card/50 border-l border-border/50 items-center justify-center">
          <AuthShowcase />
        </div>
      </div>
    </div>
  );
}
