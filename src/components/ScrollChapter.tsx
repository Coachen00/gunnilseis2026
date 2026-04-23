import { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface ScrollChapterProps {
  children: ReactNode;
  className?: string;
  minHeight?: string;
  id?: string;
}

const ScrollChapter = ({ children, className, minHeight = "min-h-[80vh]", id }: ScrollChapterProps) => {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "relative flex items-center py-24 md:py-32 transition-all duration-700 ease-out",
        minHeight,
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      <div className="container relative z-10 w-full">{children}</div>
    </section>
  );
};

export default ScrollChapter;