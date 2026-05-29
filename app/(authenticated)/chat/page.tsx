'use client';

import { useState } from 'react';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, content: 'Hello! How can I help you today?', isUser: false },
    { id: 2, content: 'Can you show me how markdown works?', isUser: true },
    { 
      id: 3, 
      content: `# Markdown Support

Here's how markdown rendering works in chat:

## Features
- **Bold text**
- *Italic text*
- \`Inline code\`
- [Links](https://example.com)

### Code Block
\`\`\`javascript
function hello() {
  console.log('Hello World!');
}
\`\`\`

### Lists
1. First item
2. Second item
   - Nested item

> This is a blockquote

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |`,
      isUser: false 
    }
  ]);
  
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, content: input, isUser: true }
      ]);
      setInput('');
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            id: prev.length + 1, 
            content: `I received your message: "${input}". This demonstrates how user messages appear as plain text while AI responses are rendered with markdown.`, 
            isUser: false 
          }
        ]);
      }, 1000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/70 backdrop-blur-xl px-6">
        <h1 className="text-sm font-semibold tracking-tight">Chat</h1>
      </header>
      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <Card 
              key={message.id} 
              className={`max-w-3xl mx-auto ${
                message.isUser 
                  ? 'ml-auto bg-primary text-primary-foreground' 
                  : 'mr-auto bg-muted'
              }`}
            >
              <CardContent className="p-4">
                <MessageBubble 
                  content={message.content} 
                  isUser={message.isUser} 
                />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="max-w-3xl mx-auto w-full flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </main>
    </div>
  );
}