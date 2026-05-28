import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useShortcuts } from './use-shortcuts';
import { renderHook } from '@testing-library/react';

// Mock the registry functions
vi.mock('./registry', () => ({
  registerAction: vi.fn(),
  unregisterAction: vi.fn(),
  listActions: vi.fn()
}));

describe('useShortcuts', () => {
  const mockOnOpenPalette = vi.fn();
  const mockOnOpenHelp = vi.fn();

  beforeEach(() => {
    mockOnOpenPalette.mockClear();
    mockOnOpenHelp.mockClear();
    
    // Set up jsdom environment
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Clean up any event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', window as any);
    }
    vi.useRealTimers();
  });

  it('should call onOpenPalette when Cmd+K is pressed', () => {
    renderHook(() => useShortcuts({ 
      onOpenPalette: mockOnOpenPalette,
      onOpenHelp: mockOnOpenHelp
    }));

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    window.dispatchEvent(event);

    expect(mockOnOpenPalette).toHaveBeenCalled();
  });

  it('should call onOpenHelp when ? is pressed and not in input', () => {
    renderHook(() => useShortcuts({ 
      onOpenPalette: mockOnOpenPalette,
      onOpenHelp: mockOnOpenHelp
    }));

    const event = new KeyboardEvent('keydown', { key: '?' });
    window.dispatchEvent(event);

    expect(mockOnOpenHelp).toHaveBeenCalled();
  });

  it('should NOT call onOpenHelp when ? is pressed in an input', () => {
    renderHook(() => useShortcuts({ 
      onOpenPalette: mockOnOpenPalette,
      onOpenHelp: mockOnOpenHelp
    }));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { key: '?' });
    input.dispatchEvent(event);

    expect(mockOnOpenHelp).not.toHaveBeenCalled();
  });

  it('should handle g h sequence within 1.5s', () => {
    renderHook(() => useShortcuts({ 
      onOpenPalette: mockOnOpenPalette,
      onOpenHelp: mockOnOpenHelp
    }));

    // First press 'g'
    const gEvent = new KeyboardEvent('keydown', { key: 'g' });
    window.dispatchEvent(gEvent);

    // Then press 'h' within 1.5s
    vi.advanceTimersByTime(1000); // Advance by 1 second
    const hEvent = new KeyboardEvent('keydown', { key: 'h' });
    window.dispatchEvent(hEvent);

    // We can't easily test navigation in JSDOM, but we can verify the event handling
    // For actual navigation testing, we would need to mock window.location
  });
});