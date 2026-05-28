'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcutGroups = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: 'g h', description: 'Go to Dashboard' },
      { keys: 'g a', description: 'Go to Adapters' },
      { keys: 'g c', description: 'Go to Chat' },
      { keys: 'g s', description: 'Go to Search' },
      { keys: 'g k', description: 'Go to Credentials' },
      { keys: 'g ,', description: 'Go to Settings' },
    ]
  },
  {
    category: 'Global',
    shortcuts: [
      { keys: 'Ctrl/Cmd + K', description: 'Open Command Palette' },
      { keys: '?', description: 'Show Help' },
      { keys: 'Esc', description: 'Close Modal' },
    ]
  },
  {
    category: 'Chat',
    shortcuts: [
      { keys: 'Cmd/Ctrl + Enter', description: 'Send Message' },
    ]
  },
  {
    category: 'Layout',
    shortcuts: [
      { keys: 'Cmd/Ctrl + \\', description: 'Toggle Sidebar' },
    ]
  }
];

export function HelpOverlay({ open, onOpenChange }: HelpOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            onClick={() => onOpenChange(false)}
          />
          
          {/* Help Overlay */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
            initial={{ scale: 0.96, y: '-40%' }}
            animate={{ scale: 1, y: '-50%' }}
            exit={{ scale: 0.96, y: '-40%' }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div className="bg-background border border-border rounded-lg shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                  <button 
                    onClick={() => onOpenChange(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
                
                <div className="space-y-6">
                  {shortcutGroups.map(group => (
                    <div key={group.category}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {group.category}
                      </h3>
                      <div className="space-y-2">
                        {group.shortcuts.map((shortcut, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-sm">{shortcut.description}</span>
                            <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
                              {shortcut.keys}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}