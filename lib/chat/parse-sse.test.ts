// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { parseSSEStream, SSEEvent } from './parse-sse';

function createStream(chunks: string[]): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach(chunk => {
        controller.enqueue(new TextEncoder().encode(chunk));
      });
      controller.close();
    }
  });
}

describe('parseSSEStream', () => {
  it('should parse multiple delta events followed by DONE', async () => {
    const chunks = [
      'data: {"delta":"hello"}\n',
      'data: {"delta":" world"}\n',
      'data: [DONE]\n'
    ];
    
    const stream = createStream(chunks);
    const events: SSEEvent[] = [];
    
    for await (const event of parseSSEStream(stream)) {
      events.push(event);
    }
    
    expect(events).toEqual([
      { type: 'delta', content: 'hello' },
      { type: 'delta', content: ' world' },
      { type: 'done' }
    ]);
  });

  it('should handle JSON objects split across chunks', async () => {
    const chunks = [
      'data: {"delta":"hello',
      '"}\ndata: {"delta":" world"}\n',
      'data: [DONE]\n'
    ];
    
    const stream = createStream(chunks);
    const events: SSEEvent[] = [];
    
    for await (const event of parseSSEStream(stream)) {
      events.push(event);
    }
    
    expect(events).toEqual([
      { type: 'delta', content: 'hello' },
      { type: 'delta', content: ' world' },
      { type: 'done' }
    ]);
  });

  it('should handle error events', async () => {
    const chunks = [
      'data: {"delta":"hello"}\n',
      'data: {"error":"Something went wrong"}\n'
    ];
    
    const stream = createStream(chunks);
    const events: SSEEvent[] = [];
    
    for await (const event of parseSSEStream(stream)) {
      events.push(event);
    }
    
    expect(events).toEqual([
      { type: 'delta', content: 'hello' },
      { type: 'error', message: 'Something went wrong' }
    ]);
  });
});