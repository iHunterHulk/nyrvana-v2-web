import { useEffect, useRef } from 'react';
import { registerAction, unregisterAction } from './registry';

interface UseShortcutsProps {
  onOpenPalette: () => void;
  onOpenHelp: () => void;
}

export function useShortcuts({ onOpenPalette, onOpenHelp }: UseShortcutsProps) {
  const lastKeyRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if in an input element
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Handle single key shortcuts
      if (event.key === '?') {
        event.preventDefault();
        onOpenHelp();
        return;
      }

      if (event.key === 'Escape') {
        // This would typically be handled by the UI components themselves
        return;
      }

      // Handle Cmd/Ctrl + K
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onOpenPalette();
        return;
      }

      // Handle two-key vim sequences (g + letter)
      if (event.key === 'g') {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout
        lastKeyRef.current = 'g';
        timeoutRef.current = setTimeout(() => {
          lastKeyRef.current = null;
        }, 1500); // 1.5 second timeout
        return;
      }

      // If we have a pending 'g' key, check for the second key
      if (lastKeyRef.current === 'g') {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        lastKeyRef.current = null;
        
        // Handle g + letter shortcuts
        event.preventDefault();
        switch (event.key) {
          case 'h':
            // Navigate to dashboard
            window.location.hash = '#/dashboard';
            break;
          case 'a':
            // Navigate to adapters
            window.location.hash = '#/adapters';
            break;
          case 'c':
            // Navigate to chat
            window.location.hash = '#/chat';
            break;
          case 's':
            // Navigate to search
            window.location.hash = '#/search';
            break;
          case 'k':
            // Navigate to credentials
            window.location.hash = '#/credentials';
            break;
          case ',':
            // Navigate to settings
            window.location.hash = '#/settings';
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onOpenPalette, onOpenHelp]);
}