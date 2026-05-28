// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import Shell from './Shell';
import { describe, it, expect } from 'vitest';


// jsdom does not implement matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }),
  });
}

describe('Shell', () => {
  it('renders without crashing', () => {
    render(
      <Shell>
        <div>Test Content</div>
      </Shell>
    );
    
    // Just check that rendering doesn't throw an error
    expect(true).toBe(true);
  });
});