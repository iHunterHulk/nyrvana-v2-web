// @vitest-environment jsdom

import { beforeEach, describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { sendChat } from './client';

// Mock the apiFetch function
vi.mock('../auth/client', () => ({
  apiFetch: vi.fn()
}));

import { apiFetch } from '../auth/client';

describe('sendChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onDelta for each delta event and onDone when finished', async () => {
    // Create a mock response with a streamable body
    const streamChunks = [
      'data: {"delta":"hello"}\n',
      'data: {"delta":" world"}\n',
      'data: [DONE]\n'
    ];
    
    const readableStream = new ReadableStream<Uint8Array>({
      start(controller) {
        streamChunks.forEach(chunk => {
          controller.enqueue(new TextEncoder().encode(chunk));
        });
        controller.close();
      }
    });
    
    const mockResponse = {
      ok: true,
      body: readableStream
    } as unknown as Response;
    
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const onDelta = vi.fn();
    const onDone = vi.fn();
    
    await sendChat({
      messages: [{ role: 'user', content: 'hello' }],
      onDelta,
      onDone
    });
    
    expect(apiFetch).toHaveBeenCalledWith('/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ 
        messages: [{ role: 'user', content: 'hello' }] 
      }),
      signal: undefined
    });
    
    expect(onDelta).toHaveBeenCalledWith('hello');
    expect(onDelta).toHaveBeenCalledWith(' world');
    expect(onDone).toHaveBeenCalled();
  });

  it('should call onError when the response is not ok', async () => {
    const mockResponse = {
      ok: false,
      status: 500
    } as unknown as Response;
    
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const onError = vi.fn();
    
    await sendChat({
      messages: [{ role: 'user', content: 'hello' }],
      onDelta: vi.fn(),
      onError
    });
    
    expect(onError).toHaveBeenCalledWith('chat http 500');
  });

  it('should call onError when there is an error event in the stream', async () => {
    const streamChunks = [
      'data: {"delta":"hello"}\n',
      'data: {"error":"Something went wrong"}\n'
    ];
    
    const readableStream = new ReadableStream<Uint8Array>({
      start(controller) {
        streamChunks.forEach(chunk => {
          controller.enqueue(new TextEncoder().encode(chunk));
        });
        controller.close();
      }
    });
    
    const mockResponse = {
      ok: true,
      body: readableStream
    } as unknown as Response;
    
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const onDelta = vi.fn();
    const onError = vi.fn();
    
    await sendChat({
      messages: [{ role: 'user', content: 'hello' }],
      onDelta,
      onError
    });
    
    expect(onDelta).toHaveBeenCalledWith('hello');
    expect(onError).toHaveBeenCalledWith('Something went wrong');
  });
});