'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUp, Sparkles, StopCircle, User } from 'lucide-react';
import { Topbar } from '@/components/dashboard/Topbar';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = draft.trim();
    if (!text || streaming) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: 'assistant', content: '' }]);
    setDraft('');
    setStreaming(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await apiFetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error(`chat ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') break;
          try {
            const obj = JSON.parse(payload);
            if (typeof obj.delta === 'string') {
              setMessages((m) =>
                m.map((mm) =>
                  mm.id === assistantId ? { ...mm, content: mm.content + obj.delta } : mm,
                ),
              );
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages((m) =>
        m.map((mm) =>
          mm.id === assistantId
            ? { ...mm, content: mm.content + '\n\n[Error: ' + (err instanceof Error ? err.message : 'unknown') + ']' }
            : mm,
        ),
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar title="Chat" description="Conversational AI across your infrastructure." />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 lg:px-6 pt-4 pb-32">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 ring-1 ring-white/10 shadow-[0_0_40px_-8px_oklch(0.6_0.245_262.881/.6)] mb-5">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">How can I help?</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Ask anything about your infrastructure. The assistant has context across every connected service.
                </p>
                <div className="mt-6 grid gap-2 w-full max-w-md">
                  {[
                    'Summarize my recent notes from Memos',
                    'What did AdGuard block in the last hour?',
                    'Are any of my services down?',
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDraft(s)}
                      className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl px-4 py-3 text-left text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                streaming={streaming && m.role === 'assistant' && m.id === messages[messages.length - 1]?.id}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-border/40 bg-background/70 backdrop-blur-xl px-4 lg:px-6 py-3">
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="relative flex items-end gap-2 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl px-4 py-3 ring-1 ring-white/[0.02] focus-within:border-ring/60 focus-within:ring-ring/20 transition-colors"
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Message Nyrvana..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground outline-none max-h-40"
                style={{ minHeight: 28 }}
              />
              {streaming ? (
                <Button type="button" onClick={stop} size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground" aria-label="Stop">
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" size="icon" disabled={!draft.trim()} className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/90" aria-label="Send">
                  <ArrowUp className="h-4 w-4" />
                </Button>
              )}
            </form>
            <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
              ⌘+Enter to send · Esc to stop streaming · Powered by Ollama
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ role, content, streaming }: { role: 'user' | 'assistant'; content: string; streaming?: boolean }) {
  return (
    <div className={cn('flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300', role === 'user' && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1',
          role === 'user'
            ? 'bg-muted/40 ring-border/50'
            : 'bg-gradient-to-br from-primary via-primary/80 to-primary/60 ring-white/10 shadow-[0_0_20px_-4px_oklch(0.6_0.245_262.881/.5)]',
        )}
      >
        {role === 'user' ? <User className="h-4 w-4 text-foreground/80" /> : <Sparkles className="h-4 w-4 text-primary-foreground" />}
      </div>
      <div
        className={cn(
          'relative max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          role === 'user'
            ? 'bg-primary/15 text-foreground border border-primary/20'
            : 'bg-card/40 backdrop-blur-xl text-foreground border border-border/40 ring-1 ring-white/[0.02]',
        )}
      >
        {role === 'assistant' && streaming && (
          <span className="absolute -left-0.5 top-3 bottom-3 w-0.5 rounded-full bg-primary animate-pulse" />
        )}
        {role === 'assistant' ? (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:bg-background/60 prose-pre:border prose-pre:border-border/50 prose-code:text-foreground prose-code:bg-muted/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || (streaming ? '...' : '')}</ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>
    </div>
  );
}
