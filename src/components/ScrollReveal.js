'use client';
import { motion } from 'framer-motion';

export default function ScrollReveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
