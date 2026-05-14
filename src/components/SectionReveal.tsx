import { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface SectionRevealProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "article" | "header" | "footer";
  once?: boolean;
}

/**
 * Lugn in-view fade + soft lift. Respekterar prefers-reduced-motion.
 * Diskret — 18px lift, 0.7s, easeOut. Inget studs.
 */
const SectionReveal = ({
  children,
  delay = 0,
  y = 18,
  as = "div",
  once = true,
  className,
  ...rest
}: SectionRevealProps) => {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default SectionReveal;
