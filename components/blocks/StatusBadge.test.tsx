// @vitest-environment jsdom

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should render healthy status with correct color class', () => {
    render(<StatusBadge status="healthy" />);
    
    const badge = document.querySelector('.bg-\\[color\\:var\\(--color-status-up\\)\\]');
    expect(badge).toBeTruthy();
  });

  it('should render degraded status with correct color class', () => {
    render(<StatusBadge status="degraded" />);
    
    const badge = document.querySelector('.bg-\\[color\\:var\\(--color-status-warning\\)\\]');
    expect(badge).toBeTruthy();
  });

  it('should render down status with correct color class', () => {
    render(<StatusBadge status="down" />);
    
    const badge = document.querySelector('.bg-\\[color\\:var\\(--color-status-down\\)\\]');
    expect(badge).toBeTruthy();
  });

  it('should render pending status with correct color class', () => {
    render(<StatusBadge status="pending" />);
    
    const badge = document.querySelector('.bg-\\[color\\:var\\(--color-status-pending\\)\\]');
    expect(badge).toBeTruthy();
  });
});