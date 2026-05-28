import type { Block } from './types';

// Module-scope Map for block registry
const blockRegistry = new Map<string, Block<unknown>>();

/**
 * Register a block in the registry
 */
export function registerBlock<TData>(block: Block<TData>): void {
  blockRegistry.set(block.manifest.id, block as Block<unknown>);
}

/**
 * Get a block by ID from the registry
 */
export function getBlock(id: string): Block<unknown> | undefined {
  return blockRegistry.get(id);
}

/**
 * List all registered blocks
 */
export function listBlocks(): Block<unknown>[] {
  return Array.from(blockRegistry.values());
}

/**
 * Unregister a block by ID
 */
export function unregisterBlock(id: string): boolean {
  return blockRegistry.delete(id);
}