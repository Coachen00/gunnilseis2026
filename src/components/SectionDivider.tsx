import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  align?: "left" | "center";
  width?: "sm" | "md" | "lg";
}

const widthMap = {
  sm: "w-12",
  md: "w-20",
  lg: "w-32",
};

/**
 * Editorial avskiljare — tunn guldlinje. Markerar taktbyte mellan sektioner
 * utan att ta plats. Default vänsterställd.
 */
const SectionDivider = ({ className, align = "left", width = "md" }: SectionDividerProps) => (
  <div
    className={cn(
      "h-px bg-accent/55",
      widthMap[width],
      align === "center" && "mx-auto",
      className
    )}
    aria-hidden="true"
  />
);

export default SectionDivider;
