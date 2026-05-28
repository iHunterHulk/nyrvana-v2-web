// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import * as clientModule from '../../lib/credentials/client';
import { CredentialsPanel } from './CredentialsPanel';

vi.mock('../../lib/credentials/client', () => ({
  getCredentials: vi.fn(),
  setCredentials: vi.fn(),
  deleteCredentials: vi.fn(),
}));

describe('CredentialsPanel', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => cleanup());

  it('renders rows for all adapters when none configured', async () => {
    (clientModule.getCredentials as any).mockResolvedValue(null);
    render(<CredentialsPanel />);
    await waitFor(() => {
      expect(screen.getAllByText(/Not set/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});
