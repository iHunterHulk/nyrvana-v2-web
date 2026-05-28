'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, X, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'down' | 'pending';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          label: 'Healthy',
          icon: Check,
          colorClass: 'bg-[color:var(--color-status-up)]',
          iconClass: 'text-[color:var(--color-green-text)]'
        };
      case 'degraded':
        return {
          label: 'Degraded',
          icon: AlertTriangle,
          colorClass: 'bg-[color:var(--color-status-warning)]',
          iconClass: 'text-[color:var(--color-yellow-text)]'
        };
      case 'down':
        return {
          label: 'Down',
          icon: X,
          colorClass: 'bg-[color:var(--color-status-down)]',
          iconClass: 'text-[color:var(--color-red-text)]'
        };
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          colorClass: 'bg-[color:var(--color-status-pending)]',
          iconClass: 'text-[color:var(--color-text-secondary)]'
        };
      default:
        return {
          label: 'Unknown',
          icon: Clock,
          colorClass: 'bg-[color:var(--color-status-pending)]',
          iconClass: 'text-[color:var(--color-text-secondary)]'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className="relative inline-flex items-center">
      <motion.div
        initial={false}
        animate={{
          backgroundColor: [
            'var(--color-status-pending)',
            'var(--color-status-pending)',
          ],
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.2,
          ease: [0.2, 0, 0, 1] as any,
        }}
        className={`w-6 h-6 rounded-full flex items-center justify-center ${config.colorClass}`}
      >
        <IconComponent className={`w-3 h-3 ${config.iconClass}`} />
      </motion.div>
      
      {/* Bloom effect for healthy status */}
      <AnimatePresence>
        {status === 'healthy' && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ boxShadow: '0 0 0 0 var(--color-green-vibrant)' }}
            animate={{ boxShadow: '0 0 0 12px transparent' }}
            exit={{ boxShadow: '0 0 0 0 transparent' }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusBadge;