// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('should call onSearch when Cmd+Enter is pressed', async () => {
    // Arrange
    const onSearchMock = vi.fn();
    const onClearMock = vi.fn();
    
    const { unmount } = render(<SearchInput onSearch={onSearchMock} onClear={onClearMock} />);
    
    const input = screen.getByPlaceholderText('What can I help you find?');
    
    // Act
    await fireEvent.change(input, { target: { value: 'test query' } });
    await fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });

    // Assert
    expect(onSearchMock).toHaveBeenCalledWith('test query');
    
    // Clean up
    unmount();
  });

  it('should clear the input and call onClear when Escape is pressed', async () => {
    // Arrange
    const onSearchMock = vi.fn();
    const onClearMock = vi.fn();
    
    const { unmount } = render(<SearchInput onSearch={onSearchMock} onClear={onClearMock} />);
    
    const input = screen.getByPlaceholderText('What can I help you find?');
    await fireEvent.change(input, { target: { value: 'test query' } });
    
    // Act
    await fireEvent.keyDown(input, { key: 'Escape' });

    // Assert
    expect(onClearMock).toHaveBeenCalled();
    expect(input).toHaveValue('');
    
    // Clean up
    unmount();
  });
});