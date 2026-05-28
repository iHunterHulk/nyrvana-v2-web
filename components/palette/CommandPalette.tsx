'use client';

import React, { useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { PaletteAction, ActionKind } from '../../lib/palette/types';
import { listActions } from '../../lib/palette/registry';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [inputValue, setInputValue] = useState('');

  const actions = listActions();
  
  // Group actions by kind
  const navActions = actions.filter(action => action.kind === 'nav');
  const otherActions = actions.filter(action => action.kind !== 'nav');

  const handleSelect = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action) {
      action.perform();
      onOpenChange(false);
      setInputValue('');
    }
  };

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
          />
          
          {/* Palette */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            initial={{ scale: 0.96, y: '-40%' }}
            animate={{ scale: 1, y: '-50%' }}
            exit={{ scale: 0.96, y: '-40%' }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <Command.Dialog 
              open={open} 
              onOpenChange={onOpenChange}
              label="Command Palette"
              className="bg-background border border-border rounded-lg shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-2 border-b border-border">
                <kbd className="text-xs font-mono">⌃K</kbd>
                <span className="text-xs font-mono">Esc to close</span>
              </div>
              
              {/* Input */}
              <Command.Input
                placeholder="What do you need..."
                className="w-full px-4 py-3 text-sm bg-transparent border-none focus:outline-none"
                value={inputValue}
                onValueChange={setInputValue}
              />
              
              {/* List */}
              <Command.List className="max-h-[480px] overflow-y-auto">
                {navActions.length > 0 && (
                  <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {navActions.map(action => (
                      <Command.Item
                        key={action.id}
                        value={action.id}
                        onSelect={handleSelect}
                        className="flex justify-between items-center px-4 py-2 text-sm cursor-pointer hover:bg-elevated selected:bg-blue-subtle h-9"
                      >
                        <span>{action.title}</span>
                        {action.shortcut && (
                          <span className="text-xs text-muted-foreground">{action.shortcut}</span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
                
                {otherActions.length > 0 && (
                  <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {otherActions.map(action => (
                      <Command.Item
                        key={action.id}
                        value={action.id}
                        onSelect={handleSelect}
                        className="flex justify-between items-center px-4 py-2 text-sm cursor-pointer hover:bg-elevated selected:bg-blue-subtle h-9"
                      >
                        <span>{action.title}</span>
                        {action.hint && (
                          <span className="text-xs text-muted-foreground">{action.hint}</span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </Command.Dialog>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}