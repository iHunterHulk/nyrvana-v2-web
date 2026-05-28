'use client';

import React from 'react';

interface AdapterRowProps {
  adapter: string;
  isConfigured: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const adapterLabel: Record<string, string> = {
  adguard: 'AdGuard Home',
  ntfy: 'Ntfy.sh',
  memos: 'Memos',
  ollama: 'Ollama API',
};

export function AdapterRow({ adapter, isConfigured, onEdit, onDelete }: AdapterRowProps) {
  return (
    <div className="h-[60px] flex items-center justify-between border-b border-[color:var(--color-border)] p-[16px] transition-colors duration-200 hover:bg-[color:var(--color-bg-elevated)]">
      <div className="flex items-center gap-[12px]">
        <div className="text-[14px] font-medium">{adapterLabel[adapter] || adapter}</div>
        <div className={`text-xs px-2 py-1 rounded-full ${
          isConfigured 
            ? 'bg-[color:var(--color-green-subtle)] text-[color:var(--color-green-text)]' 
            : 'bg-[color:var(--color-gray-subtle)] text-[color:var(--color-text-secondary)]'
        }`}>
          {isConfigured ? 'Configured' : 'Not set'}
        </div>
      </div>
      <div className="flex gap-[4px]">
        <button 
          onClick={onEdit}
          className="w-8 h-8 flex items-center justify-center text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-hover)] rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </button>
        {isConfigured && (
          <button 
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-hover)] rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}