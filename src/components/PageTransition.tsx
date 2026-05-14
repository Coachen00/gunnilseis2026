import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Mjuk sidövergång — diskret fade på route-byte. Respekterar reduced-motion.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
