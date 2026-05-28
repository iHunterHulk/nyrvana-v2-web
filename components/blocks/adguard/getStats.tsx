'use client';

import React from 'react';
import { registerBlock } from '../../../lib/blocks/registry';
import StatusBadge from '../StatusBadge';
import type { Block } from '../../../lib/blocks/types';
import type { BlockProps } from '../../../lib/blocks/types';

// Define the data type for this block
interface AdGuardStatsData {
  healthy: boolean;
  queriesToday: number;
  blockedToday: number;
}

// Manifest for this block
const manifest = {
  id: 'adguard.getStats',
  adapterId: 'adguard',
  op: 'getStats',
  title: 'AdGuard DNS Stats',
  description: 'Queries handled and blocked in the last 24 hours.',
  defaultSize: 'md' as const,
  refreshIntervalMs: 60_000,
};

// Fetcher that returns hardcoded fake data for PR 6
const fetcher = async (): Promise<AdGuardStatsData> => {
  return {
    healthy: true,
    queriesToday: 18392,
    blockedToday: 245,
  };
};

// Component to render the block
const Component = ({ data }: BlockProps<AdGuardStatsData>) => {
  // Calculate the percentage of blocked queries
  const blockedPercentage = ((data.blockedToday / data.queriesToday) * 100).toFixed(1);
  
  return (
    <div className="bg-[color:var(--color-bg-elevated)] border border-[color:var(--color-border)] hover:border-[color:var(--color-border-hover)] rounded-[6px] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">AdGuard DNS Stats</h3>
        <StatusBadge status={data.healthy ? 'healthy' : 'down'} />
      </div>
      
      <div className="flex space-x-6">
        <div>
          <div className="text-2xl font-medium font-mono">
            {data.queriesToday.toLocaleString()}
          </div>
          <div className="text-xs text-[color:var(--color-text-secondary)]">
            queries today
          </div>
        </div>
        
        <div>
          <div className="text-2xl font-medium font-mono">
            {data.blockedToday.toLocaleString()}
          </div>
          <div className="text-xs text-[color:var(--color-text-secondary)]">
            {blockedPercentage}% blocked
          </div>
        </div>
      </div>
    </div>
  );
};

// Generic loading component
const Loading = () => (
  <div className="bg-[color:var(--color-bg-elevated)] border border-[color:var(--color-border)] rounded-[6px] p-4 h-44 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
      <div className="w-6 h-6 rounded-full bg-gray-200"></div>
    </div>
    <div className="flex space-x-6">
      <div>
        <div className="h-8 w-20 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
      <div>
        <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Generic error component
const Error = ({ error, refresh }: { error: Error; refresh: () => Promise<void> }) => (
  <div className="border-2 border-[color:var(--color-status-down)] bg-[color:var(--color-red-subtle)] rounded-[6px] p-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium">Could not load AdGuard stats</h3>
        <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">
          {error.message || 'An error occurred while loading AdGuard statistics.'}
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

// Create the block object
const block: Block<AdGuardStatsData> = {
  manifest,
  Component,
  Loading,
  Error,
  fetcher,
};

// Register the block
registerBlock(block);

export default block;