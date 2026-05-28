// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { registerBlock, getBlock, listBlocks, unregisterBlock } from './registry';
import type { Block } from './types';

// Mock block for testing
const mockBlock: Block<unknown> = {
  manifest: {
    id: 'test.block',
    adapterId: 'test',
    op: 'block',
    title: 'Test Block',
    description: 'A test block',
    defaultSize: 'md',
  },
  Component: () => null,
  Loading: () => null,
  Error: () => null,
  fetcher: async () => ({}),
};

describe('Block Registry', () => {
  beforeEach(() => {
    // Clear registry before each test
    Array.from(listBlocks()).forEach(block => 
      unregisterBlock(block.manifest.id)
    );
  });

  it('should register and get a block', () => {
    registerBlock(mockBlock);
    const retrievedBlock = getBlock('test.block');
    expect(retrievedBlock).toBeDefined();
    expect(retrievedBlock?.manifest.id).toBe('test.block');
  });

  it('should list all registered blocks', () => {
    registerBlock(mockBlock);
    const blocks = listBlocks();
    expect(blocks).toHaveLength(1);
    expect(blocks[0].manifest.id).toBe('test.block');
  });

  it('should unregister a block', () => {
    registerBlock(mockBlock);
    expect(getBlock('test.block')).toBeDefined();
    
    const result = unregisterBlock('test.block');
    expect(result).toBe(true);
    expect(getBlock('test.block')).toBeUndefined();
  });

  it('should return false when unregistering a non-existent block', () => {
    const result = unregisterBlock('non-existent');
    expect(result).toBe(false);
  });
});