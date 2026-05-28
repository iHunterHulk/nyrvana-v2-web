'use client';

import { StreamingAccentBar } from './StreamingAccentBar';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

export function MessageBubble({ role, content, streaming }: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div style={{
        alignSelf: 'flex-end',
        backgroundColor: 'var(--color-blue-subtle)',
        padding: '12px',
        borderRadius: '12px',
        maxWidth: '720px',
        fontSize: '14px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {content}
      </div>
    );
  }
  
  // Assistant message
  return (
    <div style={{
      alignSelf: 'flex-start',
      backgroundColor: 'transparent',
      padding: '12px',
      maxWidth: '720px',
      fontSize: '14px',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      position: 'relative'
    }}>
      {streaming && <StreamingAccentBar streaming={true} />}
      <div style={{ color: 'var(--color-text-primary)' }}>
        {content}
      </div>
    </div>
  );
}