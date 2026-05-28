// @vitest-environment jsdom

import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { StreamingAccentBar } from './StreamingAccentBar';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ style, animate, ...props }: any) => (
      <div style={style} data-animate={JSON.stringify(animate)} {...props} data-testid="motion-div" />
    )
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: vi.fn().mockReturnValue(false)
}));

describe('StreamingAccentBar', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => cleanup());

  it('renders streaming variant with pulsing animation', () => {
    render(<StreamingAccentBar streaming={true} />);
    const div = screen.getByTestId('motion-div');
    expect(div).toBeInTheDocument();
    // Pulsing opacity array signals the streaming animation
    expect(div.getAttribute('data-animate')).toContain('0.6');
    expect(div.getAttribute('data-animate')).toContain('0.9');
  });

  it('renders fade-to-zero variant when not streaming', () => {
    render(<StreamingAccentBar streaming={false} />);
    const div = screen.getByTestId('motion-div');
    expect(div.getAttribute('data-animate')).toContain('"opacity":0');
  });
});
