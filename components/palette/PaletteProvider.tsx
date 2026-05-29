'use client';

import { useEffect, useState } from 'react';
import { CommandPalette } from './CommandPalette';

export function PaletteProvider() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return <CommandPalette open={open} onOpenChange={setOpen} />;
}
