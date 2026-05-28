import React from 'react';
import type { BlockSize } from '../../lib/blocks/types';

interface BlockSkeletonProps {
  size: BlockSize;
}

const BlockSkeleton: React.FC<BlockSkeletonProps> = ({ size }) => {
  // Determine number of rows based on size
  const getRowCount = (): number => {
    switch (size) {
      case 'sm': return 1;
      case 'md': return 2;
      case 'lg': return 3;
      case 'xl': return 4;
      default: return 2;
    }
  };

  // Determine height based on size
  const getHeightClass = (): string => {
    switch (size) {
      case 'sm': return 'h-32';
      case 'md': return 'h-44';
      case 'lg': return 'h-56';
      case 'xl': return 'h-72';
      default: return 'h-44';
    }
  };

  const rowCount = getRowCount();

  return (
    <div className={`bg-[color:var(--color-bg-elevated)] border border-[color:var(--color-border)] rounded-[6px] p-4 ${getHeightClass()} animate-pulse`}>
      {/* Header row with title placeholder */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-2/5 bg-gray-200 rounded"></div>
      </div>
      
      {/* Stat rows */}
      {Array.from({ length: rowCount }).map((_, index) => (
        <div key={index} className="flex space-x-4 mb-3 last:mb-0">
          <div className="h-6 flex-1 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default BlockSkeleton;