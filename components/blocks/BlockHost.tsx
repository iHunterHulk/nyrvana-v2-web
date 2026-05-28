import React, { Suspense } from 'react';
import { getBlock } from '../../lib/blocks/registry';
import BlockError from './BlockError';
import BlockSkeleton from './BlockSkeleton';
import type { BlockSize } from '../../lib/blocks/types';

interface BlockHostProps {
  blockId: string;
  size?: BlockSize;
}

const BlockHost: React.FC<BlockHostProps> = async ({ blockId, size = 'md' }) => {
  const block = getBlock(blockId);
  
  if (!block) {
    return (
      <BlockError 
        error={new Error(`Block not found: ${blockId}`)} 
        refresh={async () => {}} 
      />
    );
  }
  
  try {
    // For PR 6, the server-fetch ctx is a stub
    const ctx = { fetch: globalThis.fetch };
    const data = await block.fetcher(ctx);
    
    // In a real implementation, we would pass the data to the component
    // For now, we're just rendering the component without data
    return (
      <div className="h-full">
        {block.Component({ data, refresh: async () => {}, size })}
      </div>
    );
  } catch (error) {
    return (
      <BlockError 
        error={error instanceof Error ? error : new Error('Unknown error')} 
        refresh={async () => {}} 
      />
    );
  }
};

export default BlockHost;