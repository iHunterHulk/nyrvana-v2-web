'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
  isStreaming: boolean;
}

export function ChatInput({ value, onChange, onSend, onCancel, isStreaming }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSend();
    }
    
    if (e.key === 'Escape' && isStreaming) {
      e.preventDefault();
      onCancel();
    }
  };
  
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Max 6 rows (120px)
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    adjustTextareaHeight();
  };
  
  return (
    <div style={{
      position: 'sticky',
      bottom: 0,
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        width: '100%',
        gap: '8px'
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            fontSize: '14px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            resize: 'none',
            maxHeight: '120px', // Max 6 rows
            minHeight: '40px',
            backgroundColor: 'var(--color-input-bg)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-blue-vibrant)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || isStreaming}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: !value.trim() || isStreaming ? 'var(--color-button-disabled)' : 'var(--color-button-default)',
            color: 'var(--color-icon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !value.trim() || isStreaming ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (value.trim() && !isStreaming) {
              e.currentTarget.style.backgroundColor = 'var(--color-blue-vibrant)';
              e.currentTarget.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            if (value.trim() && !isStreaming) {
              e.currentTarget.style.backgroundColor = 'var(--color-button-default)';
              e.currentTarget.style.color = 'var(--color-icon)';
            }
          }}
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}