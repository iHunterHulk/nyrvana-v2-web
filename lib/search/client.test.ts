// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { vi, describe, it, expect } from 'vitest';
import { apiFetch } from '../auth/client';
import { search } from './client';

// Mock the apiFetch function
vi.mock('../auth/client', () => ({
  apiFetch: vi.fn(),
}));

describe('search client', () => {
  it('should call apiFetch with correct parameters and return parsed response', async () => {
    // Arrange
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ results: ['item1', 'item2'], adapter: 'test-adapter', op: 'test-op' }),
    } as any;
    
    (apiFetch as any).mockResolvedValue(mockResponse);

    // Act
    const result = await search('test query');

    // Assert
    expect(apiFetch).toHaveBeenCalledWith('/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'test query' }),
      signal: undefined,
    });
    expect(result).toEqual({ results: ['item1', 'item2'], adapter: 'test-adapter', op: 'test-op' });
  });

  it('should throw an error when response is not ok', async () => {
    // Arrange
    const mockResponse = {
      ok: false,
      status: 500,
    } as any;
    
    (apiFetch as any).mockResolvedValue(mockResponse);

    // Act & Assert
    await expect(search('test query')).rejects.toThrow('search http 500');
  });
});