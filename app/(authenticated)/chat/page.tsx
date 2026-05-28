'use client';

import { ChatPanel } from '@/components/chat/ChatPanel';

export default function ChatPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ChatPanel />
    </div>
  );
}