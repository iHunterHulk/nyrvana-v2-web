// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { SearchPanel } from './SearchPanel';
import * as searchClient from '../../lib/search/client';

// Mock the search client
vi.mock('../../lib/search/client', () => ({
  search: vi.fn(),
}));

describe('SearchPanel', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should display placeholder text when no search has been performed', () => {
    // Arrange
    render(<SearchPanel />);
    
    // Act & Assert
    expect(screen.getByText('Ask anything across your adapters.')).toBeInTheDocument();
  });

  it('should call search function and display results when search is performed', async () => {
    // Arrange
    const mockResponse = {
      results: ['result1', 'result2'],
      adapter: 'test-adapter',
      op: 'test-op'
    };
    
    vi.spyOn(searchClient, 'search').mockResolvedValue(mockResponse as any);
    
    render(<SearchPanel />);
    
    // Act
    const input = screen.getByPlaceholderText('What can I help you find?');
    await fireEvent.change(input, { target: { value: 'test query' } });
    await fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Routed to')).toBeInTheDocument();
      // Use a more flexible matcher for the adapter and operation
      expect(screen.getByText((content) => 
        content.includes('test-adapter') && content.includes('test-op')
      )).toBeInTheDocument();
    });
  });

  it('should display NoRouteCard when search returns no-route', async () => {
    // Arrange
    const mockResponse = {
      results: [],
      reason: 'no-route'
    };
    
    vi.spyOn(searchClient, 'search').mockResolvedValue(mockResponse as any);
    
    render(<SearchPanel />);
    
    // Act
    const input = screen.getByPlaceholderText('What can I help you find?');
    await fireEvent.change(input, { target: { value: 'test query' } });
    await fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('No matching action found.')).toBeInTheDocument();
    });
  });

  it('should display error message when search fails', async () => {
    // Arrange
    vi.spyOn(searchClient, 'search').mockRejectedValue(new Error('Search failed'));
    
    render(<SearchPanel />);
    
    // Act
    const input = screen.getByPlaceholderText('What can I help you find?');
    await fireEvent.change(input, { target: { value: 'test query' } });
    await fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Error: Search failed')).toBeInTheDocument();
    });
  });

  it('should clear state when clear is called', async () => {
    // Arrange
    const mockResponse = {
      results: ['result1', 'result2'],
      adapter: 'test-adapter',
      op: 'test-op'
    };
    
    vi.spyOn(searchClient, 'search').mockResolvedValue(mockResponse as any);
    
    render(<SearchPanel />);
    
    // Perform a search first
    const input = screen.getByPlaceholderText('What can I help you find?');
    await fireEvent.change(input, { target: { value: 'test query' } });
    await fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });
    
    await waitFor(() => {
      expect(screen.getByText('Routed to')).toBeInTheDocument();
    });
    
    // Act - Clear the search
    await fireEvent.keyDown(input, { key: 'Escape' });
    
    // Assert
    expect(screen.getByText('Ask anything across your adapters.')).toBeInTheDocument();
  });
});