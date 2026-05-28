import { apiFetch } from '../auth/client';
import { parseSSEStream, SSEEvent } from './parse-sse';

export interface ChatMessage { 
  role: 'user' | 'assistant'; 
  content: string; 
}

export interface SendChatOpts {
  messages: ChatMessage[];
  model?: string;
  signal?: AbortSignal;
  onDelta: (delta: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}

export async function sendChat(opts: SendChatOpts): Promise<void> {
  const { messages, model, signal, onDelta, onDone, onError } = opts;
  const res = await apiFetch('/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, model }),
    signal,
  });
  if (!res.ok || !res.body) {
    onError?.(`chat http ${res.status}`);
    return;
  }
  for await (const ev of parseSSEStream(res.body)) {
    if (ev.type === 'delta') onDelta(ev.content);
    else if (ev.type === 'done') { onDone?.(); return; }
    else if (ev.type === 'error') { onError?.(ev.message); return; }
  }
}