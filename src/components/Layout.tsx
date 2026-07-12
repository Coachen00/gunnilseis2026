import { ReactNode } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import SkipToContent from "@/components/SkipToContent";
import MatchdayBanner from "@/components/MatchdayBanner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-kedja-paper">
      <SkipToContent />
      <TopNav />
      <MatchdayBanner />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 relative z-10 focus:outline-none"
        aria-label="Huvudinnehåll"
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
