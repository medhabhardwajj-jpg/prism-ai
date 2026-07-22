import { motion } from "framer-motion";

export const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
};

export function PageTransition({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={`w-full h-full min-h-[calc(100dvh-4rem)] p-4 md:p-8 lg:p-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
