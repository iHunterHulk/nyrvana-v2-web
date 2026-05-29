'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  className?: string;
}

export function MessageBubble({ content, isUser, className }: MessageBubbleProps) {
  if (isUser) {
    return (
      <div className={className}>
        <p className="text-sm">{content}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}