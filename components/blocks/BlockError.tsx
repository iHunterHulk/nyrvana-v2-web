import React from 'react';

interface BlockErrorProps {
  error: Error;
  refresh: () => Promise<void>;
}

const BlockError: React.FC<BlockErrorProps> = ({ error, refresh }) => {
  return (
    <div className="border-2 border-[color:var(--color-status-down)] bg-[color:var(--color-red-subtle)] rounded-[6px] p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium">Could not load</h3>
          <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">
            {error.message || 'An error occurred while loading this block.'}
          </p>
        </div>
        <button
          onClick={() => refresh()}
          className="text-xs bg-[color:var(--color-bg)] hover:bg-[color:var(--color-bg-hover)] border border-[color:var(--color-border)] rounded px-2 py-1"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default BlockError;