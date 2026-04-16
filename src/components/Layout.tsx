import { ReactNode } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground />
      <TopNav />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
