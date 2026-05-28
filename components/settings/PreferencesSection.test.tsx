/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { PreferencesSection } from './PreferencesSection';

describe('PreferencesSection', () => {
  afterEach(() => cleanup());
  beforeEach(() => {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render theme options', () => {
    const { container } = render(<PreferencesSection />);
    
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('should render sidebar preference toggle', () => {
    render(<PreferencesSection />);
    
    expect(screen.getByText('Start with sidebar collapsed')).toBeInTheDocument();
  });

  it('should render keyboard shortcuts link', () => {
    render(<PreferencesSection />);
    
    expect(screen.getByText('View keyboard shortcuts (?)')).toBeInTheDocument();
  });

  it('should set theme cookie when theme changes', () => {
    render(<PreferencesSection />);
    
    const darkRadio = screen.getByRole('radio', { name: 'Dark' });
    fireEvent.click(darkRadio);
    
    expect(document.cookie).toContain('nv-theme=dark');
  });
});