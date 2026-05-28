// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { registerAction, unregisterAction, listActions } from './registry';

describe('registry', () => {
  it('bootstraps with the default actions', () => {
    const ids = listActions().map(a => a.id);
    expect(ids).toContain('nav-dashboard');
    expect(ids).toContain('nav-adapters');
    expect(ids).toContain('nav-chat');
    expect(ids).toContain('nav-search');
    expect(ids).toContain('nav-credentials');
    expect(ids).toContain('nav-settings');
    expect(ids).toContain('mode-theme-toggle');
    expect(ids).toContain('mode-logout');
  });

  it('nav actions have the expected shortcuts', () => {
    const byId = (id: string) => listActions().find(a => a.id === id);
    expect(byId('nav-dashboard')?.shortcut).toBe('g h');
    expect(byId('nav-adapters')?.shortcut).toBe('g a');
    expect(byId('nav-chat')?.shortcut).toBe('g c');
    expect(byId('nav-search')?.shortcut).toBe('g s');
    expect(byId('nav-credentials')?.shortcut).toBe('g k');
    expect(byId('nav-settings')?.shortcut).toBe('g ,');
  });

  it('registerAction adds a new action', () => {
    const id = 'test-unique-' + Date.now();
    registerAction({ id, kind: 'nav', title: 'Test', perform: vi.fn() });
    expect(listActions().some(a => a.id === id)).toBe(true);
    unregisterAction(id);
    expect(listActions().some(a => a.id === id)).toBe(false);
  });
});
