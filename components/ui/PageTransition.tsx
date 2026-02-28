"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { FrozenRoute } from "./FrozenRoute"

interface PageTransitionProps {
  children: React.ReactNode
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname()

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 30, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -30, scale: 1.05, filter: "blur(10px)" }}
          transition={{
            duration: 0.45,
            ease: [0.32, 0.72, 0, 1], // Apple-style easing, made slower
            opacity: { duration: 0.35 },
            x: { delay: 0.05, duration: 0.4 } // Staggered x movement
          }}
          className="h-full w-full bg-background"
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0 
          }}
        >
          <FrozenRoute>
            {children}
          </FrozenRoute>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
