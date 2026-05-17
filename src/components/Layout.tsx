import { ReactNode } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import MatchdayBanner from "@/components/MatchdayBanner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground />
      <TopNav />
      <MatchdayBanner />
      <main className="flex-1 relative z-10">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
