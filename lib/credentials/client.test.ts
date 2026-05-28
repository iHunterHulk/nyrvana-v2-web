// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getCredentials, setCredentials, deleteCredentials } from './client';
import { apiFetch } from '../auth/client';

vi.mock('../auth/client');

describe('credentials client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('getCredentials returns data on 200', async () => {
    (apiFetch as any).mockResolvedValue({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ url: 'http://test' }),
    });

    const res = await getCredentials('adguard');
    expect(res).toEqual({ url: 'http://test' });
    expect(apiFetch).toHaveBeenCalledWith('/credentials/adguard');
  });

  it('getCredentials returns null on 404', async () => {
    (apiFetch as any).mockResolvedValue({ status: 404, ok: false });

    const res = await getCredentials('adguard');
    expect(res).toBeNull();
    expect(apiFetch).toHaveBeenCalledWith('/credentials/adguard');
  });

  it('getCredentials throws on other error status', async () => {
    (apiFetch as any).mockResolvedValue({ status: 500, ok: false });

    await expect(getCredentials('adguard')).rejects.toThrow('credentials get http 500');
    expect(apiFetch).toHaveBeenCalledWith('/credentials/adguard');
  });

  it('setCredentials calls PUT with JSON body', async () => {
    (apiFetch as any).mockResolvedValue({ ok: true });

    await setCredentials('adguard', { url: 'http://test', user: 'admin' });
    expect(apiFetch).toHaveBeenCalledWith('/credentials/adguard', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: 'http://test', user: 'admin' }),
    });
  });

  it('setCredentials throws on error status', async () => {
    (apiFetch as any).mockResolvedValue({ status: 400, ok: false });

    await expect(setCredentials('adguard', {})).rejects.toThrow('credentials put http 400');
  });

  it('deleteCredentials calls DELETE', async () => {
    (apiFetch as any).mockResolvedValue({ ok: true });

    await deleteCredentials('adguard');
    expect(apiFetch).toHaveBeenCalledWith('/credentials/adguard', { method: 'DELETE' });
  });

  it('deleteCredentials does not throw on 404', async () => {
    (apiFetch as any).mockResolvedValue({ status: 404, ok: false });

    await expect(deleteCredentials('adguard')).resolves.toBeUndefined();
  });

  it('deleteCredentials throws on other error status', async () => {
    (apiFetch as any).mockResolvedValue({ status: 500, ok: false });

    await expect(deleteCredentials('adguard')).rejects.toThrow('credentials delete http 500');
  });
});