/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getStoredTheme, setStoredTheme, applyTheme } from './persist';

describe('theme persistence', () => {
  beforeEach(() => {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    
    // Reset mock implementations
    vi.restoreAllMocks();
  });

  it('should get stored theme from cookie', () => {
    document.cookie = 'nv-theme=dark; Path=/; Max-Age=31536000; SameSite=Lax';
    expect(getStoredTheme()).toBe('dark');
  });

  it('should default to system theme when no cookie', () => {
    expect(getStoredTheme()).toBe('system');
  });

  it('should set theme cookie and apply theme', () => {
    const mockApplyTheme = vi.spyOn(document.documentElement, 'setAttribute');
    setStoredTheme('light');
    expect(document.cookie).toContain('nv-theme=light');
    expect(mockApplyTheme).toHaveBeenCalledWith('data-theme', 'light');
  });

  it('should apply system theme based on media query', () => {
    const mockApplyTheme = vi.spyOn(document.documentElement, 'setAttribute');
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
      return {
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as any;
    });
    applyTheme('system');
    expect(mockApplyTheme).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('should apply light theme directly', () => {
    const mockApplyTheme = vi.spyOn(document.documentElement, 'setAttribute');
    applyTheme('light');
    expect(mockApplyTheme).toHaveBeenCalledWith('data-theme', 'light');
  });
});