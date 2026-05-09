import { ReactNode } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <a
        href="#huvudinnehall"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-accent-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        Hoppa till innehåll
      </a>
      <ScrollProgress />
      <AnimatedBackground />
      <TopNav />
      <main id="huvudinnehall" className="flex-1 relative z-10">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
