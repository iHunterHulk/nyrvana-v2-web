// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { StreamingAccentBar } from './StreamingAccentBar';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ style, ...props }: any) => <div style={style} {...props} data-testid="motion-div" />
  },
  useReducedMotion: vi.fn().mockReturnValue(false)
}));

describe('StreamingAccentBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when streaming is true', () => {
    render(<StreamingAccentBar streaming={true} />);
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
  });

  it('should render when streaming is false', () => {
    render(<StreamingAccentBar streaming={false} />);
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
  });
});