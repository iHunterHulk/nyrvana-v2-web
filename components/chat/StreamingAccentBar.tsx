'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StreamingAccentBarProps {
  streaming: boolean;
}

export function StreamingAccentBar({ streaming }: StreamingAccentBarProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // Don't render anything if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }
  
  // When not streaming, we want to animate to opacity 0 and then unmount
  if (!streaming) {
    return (
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '4px',
          backgroundColor: 'var(--color-blue-vibrant)',
          borderRadius: '2px 0 0 2px',
        }}
      />
    );
  }
  
  // When streaming, pulse opacity from 60% to 90% to 60% over 1200ms
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ 
        opacity: [0.6, 0.9, 0.6],
      }}
      transition={{ 
        duration: 1.2,
        ease: 'easeInOut', // Fixed easing
        repeat: Infinity
      }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: '4px',
        backgroundColor: 'var(--color-blue-vibrant)',
        borderRadius: '2px 0 0 2px',
      }}
    />
  );
}