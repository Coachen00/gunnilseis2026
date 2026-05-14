import { ReactNode, Children, isValidElement, cloneElement } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface StaggerListProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  y?: number;
  as?: "div" | "ol" | "ul";
  once?: boolean;
  itemClassName?: string;
}

/**
 * Wrappar en lista (ol/ul/div) och staggrar in barnen via Framer Motion.
 * Diskret: 12px lift, 0.45s, 60ms mellan items. Respekterar prefers-reduced-motion.
 */
const StaggerList = ({
  children,
  delay = 0,
  stagger = 0.06,
  y = 12,
  as = "div",
  once = true,
  className,
  itemClassName,
  ...rest
}: StaggerListProps) => {
  const prefersReducedMotion = useReducedMotion();
  const items = Children.toArray(children);
  const MotionTag = motion[as] as typeof motion.div;
  const MotionItem = motion.div;

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
      {...rest}
    >
      {items.map((child, i) => (
        <MotionItem
          key={isValidElement(child) && child.key ? child.key : i}
          variants={{
            hidden: { opacity: 0, y },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className={itemClassName}
        >
          {child}
        </MotionItem>
      ))}
    </MotionTag>
  );
};

export default StaggerList;
