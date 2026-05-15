import { ReactNode } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import SkipToContent from "@/components/SkipToContent";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SkipToContent />
      <AnimatedBackground />
      <TopNav />
      <main id="main" tabIndex={-1} className="flex-1 relative z-10 focus:outline-none" aria-label="Huvudinnehåll">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
