'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, sendChat } from '../../lib/chat/client';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);
  
  const handleSend = () => {
    if (!draft.trim() || isStreaming) return;
    
    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: draft };
    setMessages(prev => [...prev, userMessage]);
    setDraft('');
    
    // Start streaming
    setIsStreaming(true);
    setStreamingContent('');
    
    // Create abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    // Call sendChat with callbacks
    sendChat({
      messages: [...messages, userMessage],
      signal: abortController.signal,
      onDelta: (delta) => {
        setStreamingContent(prev => prev + delta);
      },
      onDone: () => {
        // Add completed assistant message
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: streamingContent 
        };
        setMessages(prev => [...prev, assistantMessage]);
        setStreamingContent('');
        setIsStreaming(false);
        abortControllerRef.current = null;
      },
      onError: (error) => {
        // Add error message
        const errorMessage: ChatMessage = { 
          role: 'assistant', 
          content: `Error: ${error}` 
        };
        setMessages(prev => [...prev, errorMessage]);
        setStreamingContent('');
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    }).catch(() => {
      // Handle network errors or other exceptions
      if (!abortController.signal.aborted) {
        const errorMessage: ChatMessage = { 
          role: 'assistant', 
          content: 'Error: Failed to send message' 
        };
        setMessages(prev => [...prev, errorMessage]);
        setStreamingContent('');
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    });
  };
  
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamingContent) {
      // Add any partial content as a message
      const partialMessage: ChatMessage = { 
        role: 'assistant', 
        content: streamingContent 
      };
      setMessages(prev => [...prev, partialMessage]);
    }
    setStreamingContent('');
    setIsStreaming(false);
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - var(--header-height))',
      maxHeight: '100%'
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message, index) => (
          <MessageBubble 
            key={index}
            role={message.role}
            content={message.content}
            streaming={false}
          />
        ))}
        {isStreaming && streamingContent && (
          <MessageBubble 
            role="assistant"
            content={streamingContent}
            streaming={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        onCancel={handleCancel}
        isStreaming={isStreaming}
      />
    </div>
  );
}