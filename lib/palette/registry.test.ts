import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerAction, unregisterAction, listActions } from './registry';

describe('registry', () => {
  beforeEach(() => {
    // Manually clear the registry for the first test only
    const actions = listActions();
    actions.forEach(action => unregisterAction(action.id));
  });

  it('should register and unregister actions', () => {
    const action = {
      id: 'test-action',
      kind: 'nav' as const,
      title: 'Test Action',
      perform: vi.fn()
    };

    // Register the action
    registerAction(action);
    
    // Check that it's registered
    const actions = listActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(action);
    
    // Unregister the action
    unregisterAction('test-action');
    
    // Check that it's unregistered
    expect(listActions()).toHaveLength(0);
  });

  it('should bootstrap with 8 actions', () => {
    // Import the registry module to trigger bootstrap
    require('./registry');
    
    const actions = listActions();
    expect(actions).toHaveLength(8);
    
    // Check for specific actions
    const actionIds = actions.map(a => a.id);
    expect(actionIds).toContain('nav-dashboard');
    expect(actionIds).toContain('nav-adapters');
    expect(actionIds).toContain('nav-chat');
    expect(actionIds).toContain('nav-search');
    expect(actionIds).toContain('nav-credentials');
    expect(actionIds).toContain('nav-settings');
    expect(actionIds).toContain('mode-theme-toggle');
    expect(actionIds).toContain('mode-logout');
  });

  it('should have correct navigation shortcuts', () => {
    // Import the registry module to trigger bootstrap
    require('./registry');
    
    const actions = listActions();
    
    const navActions = actions.filter(a => a.kind === 'nav');
    expect(navActions).toHaveLength(6);
    
    const shortcuts = navActions.map(a => a.shortcut);
    expect(shortcuts).toContain('g h');
    expect(shortcuts).toContain('g a');
    expect(shortcuts).toContain('g c');
    expect(shortcuts).toContain('g s');
    expect(shortcuts).toContain('g k');
    expect(shortcuts).toContain('g ,');
  });
});