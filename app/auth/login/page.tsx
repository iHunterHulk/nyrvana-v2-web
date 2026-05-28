'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-bg-elevated)]" 
         style={{ background: 'linear-gradient(to bottom right, var(--color-bg), var(--color-bg-elevated))' }}>
      <div className="w-[360px] rounded-3xl border border-[color:var(--color-border)] shadow-lg bg-[var(--color-bg-elevated)] p-6">
        <h2 className="text-2xl font-semibold leading-[1.2] tracking-[-0.015em] mb-2">Welcome back</h2>
        <p className="text-sm font-normal leading-[1.4] mb-6">Sign in to Nyrvana</p>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-[var(--color-status-down)] bg-opacity-10 text-[var(--color-status-down)] text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-3 focus:ring-[var(--color-blue-500)] focus:ring-opacity-30"
              required
            />
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-3 focus:ring-[var(--color-blue-500)] focus:ring-opacity-30"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[var(--color-blue-500)] text-base font-medium rounded-md focus:outline-none focus:ring-3 focus:ring-[var(--color-blue-500)] focus:ring-opacity-30 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}