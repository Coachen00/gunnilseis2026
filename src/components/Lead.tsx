import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LeadProps {
  children: ReactNode;
  className?: string;
}

/**
 * Editorial lead-stycke. Större än brödtext, mjukare än rubrik.
 * Max 65ch så raden inte breddar sig över hela sidan.
 */
const Lead = ({ children, className }: LeadProps) => (
  <p
    className={cn(
      "max-w-prose text-lg md:text-xl font-normal leading-relaxed text-foreground/85",
      className
    )}
  >
    {children}
  </p>
);

export default Lead;
