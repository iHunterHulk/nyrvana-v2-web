'use client';

import { useState, useCallback, useEffect } from 'react';
import { ShortcutsDialog } from './ShortcutsDialog';

export function ShortcutsProvider() {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInput =
      ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;
    if (e.key === '?' && !isInput) {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return <ShortcutsDialog open={open} onOpenChange={setOpen} />;
}
