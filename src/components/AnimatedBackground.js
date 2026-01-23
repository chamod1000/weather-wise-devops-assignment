"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-50">
      {/* Main Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50" />

      {/* Animated 3D Orbs */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/40 blur-3xl shadow-xl"
        style={{ transformStyle: 'preserve-3d' }}
      />

      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          x: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-40 right-[5%] w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-200/30 to-blue-300/30 blur-3xl shadow-2xl"
      />

      {/* Floating 3D Shapes (CSS Pseudo-3D) */}
      <motion.div 
         animate={{ rotate: 360, y: [0, -30, 0] }}
         transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
         className="absolute top-40 right-[20%] opacity-20"
      >
        <div className="w-20 h-20 border-4 border-blue-200 rounded-xl transform rotate-12 relative">
             <div className="absolute inset-0 border-4 border-indigo-200 rounded-xl transform -rotate-12 scale-90" />
        </div>
      </motion.div>

       <motion.div 
         animate={{ rotate: -360, y: [0, 40, 0] }}
         transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
         className="absolute bottom-20 left-[15%] opacity-20"
      >
        <div className="w-16 h-16 border-4 border-purple-200 rotate-45 relative">
             <div className="absolute inset-0 border-4 border-pink-200 -rotate-45 scale-75" />
        </div>
      </motion.div>
    </div>
  );
}
