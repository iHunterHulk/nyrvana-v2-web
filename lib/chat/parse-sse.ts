export type SSEEvent =
  | { type: 'delta'; content: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

export async function* parseSSEStream(
  body: ReadableStream<Uint8Array>
): AsyncIterable<SSEEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice('data: '.length);
        if (payload === '[DONE]') {
          yield { type: 'done' };
          return;
        }
        try {
          const obj = JSON.parse(payload);
          if (obj.error) {
            yield { type: 'error', message: String(obj.error) };
            return;
          }
          if (typeof obj.delta === 'string') {
            yield { type: 'delta', content: obj.delta };
          }
        } catch { /* skip malformed line */ }
      }
    }
  } finally {
    reader.releaseLock();
  }
}