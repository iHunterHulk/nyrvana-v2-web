import type { PaletteAction, ActionKind } from './types';
import { toggleTheme } from '../theme/client';
import { logout } from '../auth/client';

// Module-scope registry
const actionRegistry = new Map<string, PaletteAction>();

// Register a new action
export function registerAction(action: PaletteAction): void {
  actionRegistry.set(action.id, action);
}

// Unregister an action
export function unregisterAction(id: string): void {
  actionRegistry.delete(id);
}

// List all actions
export function listActions(): PaletteAction[] {
  return Array.from(actionRegistry.values());
}

// Bootstrap actions
registerAction({
  id: 'nav-dashboard',
  kind: 'nav',
  title: 'Go to Dashboard',
  hint: 'Dashboard',
  shortcut: 'g h',
  perform: () => {
    window.location.pathname = '/dashboard';
  }
});

registerAction({
  id: 'nav-adapters',
  kind: 'nav',
  title: 'Go to Adapters',
  hint: 'Adapters',
  shortcut: 'g a',
  perform: () => {
    window.location.pathname = '/adapters';
  }
});

registerAction({
  id: 'nav-chat',
  kind: 'nav',
  title: 'Go to Chat',
  hint: 'Chat',
  shortcut: 'g c',
  perform: () => {
    window.location.pathname = '/chat';
  }
});

registerAction({
  id: 'nav-search',
  kind: 'nav',
  title: 'Go to Search',
  hint: 'Search',
  shortcut: 'g s',
  perform: () => {
    window.location.pathname = '/search';
  }
});

registerAction({
  id: 'nav-credentials',
  kind: 'nav',
  title: 'Go to Credentials',
  hint: 'Credentials',
  shortcut: 'g k',
  perform: () => {
    window.location.pathname = '/credentials';
  }
});

registerAction({
  id: 'nav-settings',
  kind: 'nav',
  title: 'Go to Settings',
  hint: 'Settings',
  shortcut: 'g ,',
  perform: () => {
    window.location.pathname = '/settings';
  }
});

registerAction({
  id: 'mode-theme-toggle',
  kind: 'mode',
  title: 'Toggle Theme',
  hint: 'Dark/Light',
  perform: () => toggleTheme()
});

registerAction({
  id: 'mode-logout',
  kind: 'mutation',
  title: 'Log Out',
  hint: 'End session',
  perform: () => logout()
});