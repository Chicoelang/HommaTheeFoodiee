// src/components/providers/MotionProvider.tsx
'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

// ─── Variants yang dipakai di seluruh app ────────────────────────────────

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.4, delay },
  }),
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      delay,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const slideInFromLeftVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Reusable animated components ────────────────────────────────────────

interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** FadeUp: elemen muncul dari bawah ke atas saat masuk viewport */
export function FadeUp({ children, delay = 0, className, ...props }: MotionDivProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={delay}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

/** FadeIn: elemen fade masuk saat masuk viewport */
export function FadeIn({ children, delay = 0, className, ...props }: MotionDivProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      variants={fadeInVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={delay}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

/** ScaleIn: elemen scale masuk — bagus untuk cards */
export function ScaleIn({ children, delay = 0, className, ...props }: MotionDivProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      variants={scaleInVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={delay}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

/** StaggerGrid: wrapper untuk grid cards — anak-anak masuk berurutan */
export function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** StaggerItem: anak dari StaggerGrid */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/** AnimatedPresenceWrapper: untuk komponen yang mount/unmount dengan animasi */
export function AnimatedPresenceWrapper({ children }: { children: ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}

/** PageTransition: wrapper untuk transisi antar halaman */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Re-export framer-motion primitives yang sering dipakai
export { motion, AnimatePresence };