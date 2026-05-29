'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { login } from '@/lib/auth/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setIsPending(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes('401') || msg.toLowerCase().includes('invalid')) {
        toast.error('Invalid credentials', {
          description: 'The email or password you entered is incorrect.'
        });
      } else if (msg.includes('429')) {
        toast.error('Too many attempts', {
          description: 'Please wait a moment before trying again.'
        });
      } else {
        toast.error('Connection error', {
          description: 'We could not reach the server. Check your connection.'
        });
      }
      setIsPending(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center px-4">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.6_0.245_262.881/.35),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-1/3 left-1/4 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.18_290/.25),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.65_0.2_200/.2),transparent_60%)] blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-[0_0_40px_-10px_oklch(0.6_0.245_262.881/.6)] ring-1 ring-white/10">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
              Nyrvana
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Personal infrastructure, in one place.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/30 ring-1 ring-white/5">
          <div className="space-y-1.5 mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@nyrvana.local"
                required
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="h-11 bg-background/60 border-border/60 focus-visible:border-ring/80 focus-visible:ring-ring/30 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="h-11 bg-background/60 border-border/60 focus-visible:border-ring/80 focus-visible:ring-ring/30 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="group w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          Self-hosted. Single-tenant. Yours.
        </p>
      </div>
    </main>
  );
}
