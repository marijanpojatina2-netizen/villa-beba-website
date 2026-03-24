'use client';

import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const getInitial = () => {
    switch (direction) {
      case 'left':
        return { opacity: 0, x: 40 };
      case 'right':
        return { opacity: 0, x: -40 };
      case 'up':
      default:
        return { opacity: 0, y: 40 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'up':
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
