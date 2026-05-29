'use client';

import { useEffect, useState } from 'react';
import {
  Shield,
  Bell,
  FileText,
  Sparkles,
  Image as ImageIcon,
  Cloud,
  Rss,
  Workflow,
  FileCog,
  LayoutGrid,
  SearchCode,
  BarChart3,
  Timer,
  Kanban,
  ScrollText,
  Activity,
  type LucideIcon,
} from 'lucide-react';
import { Topbar } from '@/components/dashboard/Topbar';
import { AdapterCard } from '@/components/dashboard/AdapterCard';
import { apiFetch } from '@/lib/auth/client';

type Status = 'healthy' | 'degraded' | 'down' | 'pending';

interface AdapterMeta {
  id: string;
  name: string;
  icon: LucideIcon;
}

const adapters: AdapterMeta[] = [
  { id: 'adguard', name: 'AdGuard Home', icon: Shield },
  { id: 'ntfy', name: 'Ntfy', icon: Bell },
  { id: 'memos', name: 'Memos', icon: FileText },
  { id: 'ollama', name: 'Ollama Cloud', icon: Sparkles },
  { id: 'immich', name: 'Immich', icon: ImageIcon },
  { id: 'nextcloud', name: 'Nextcloud', icon: Cloud },
  { id: 'miniflux', name: 'Miniflux', icon: Rss },
  { id: 'paperless', name: 'Paperless-ngx', icon: ScrollText },
  { id: 'n8n', name: 'n8n', icon: Workflow },
  { id: 'stirling', name: 'Stirling PDF', icon: FileCog },
  { id: 'homepage', name: 'Homepage', icon: LayoutGrid },
  { id: 'searxng', name: 'SearXNG', icon: SearchCode },
  { id: 'umami', name: 'Umami', icon: BarChart3 },
  { id: 'sablier', name: 'Sablier', icon: Timer },
  { id: 'plane', name: 'Plane', icon: Kanban },
];

interface HealthResponse {
  status: string;
  uptime: number;
  adapters?: Record<string, { status: Status; message?: string }>;
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    
    // Initial fetch
    (async () => {
      try {
        const res = await apiFetch('/health');
        if (!res.ok) throw new Error(`${res.status}`);
        const data = (await res.json()) as HealthResponse;
        if (alive) setHealth(data);
      } catch {
        if (alive) setHealth(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    // Set up polling
    const intervalId = setInterval(async () => {
      try {
        const res = await apiFetch('/health');
        if (!res.ok) throw new Error(`${res.status}`);
        const data = (await res.json()) as HealthResponse;
        if (alive) setHealth(data);
      } catch {
        if (alive) setHealth(null);
      }
    }, 15000);

    return () => {
      alive = false;
      clearInterval(intervalId);
    };
  }, []);

  const healthyCount = health?.adapters
    ? Object.values(health.adapters).filter((a) => a.status === 'healthy').length
    : 0;
  const totalCount = adapters.length;

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar title="Dashboard" description="Overview of your personal infrastructure" />
      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Adapters healthy" value={`${healthyCount}/${totalCount}`} hint="across your services" tone="primary" />
          <KpiCard label="System uptime" value={health ? formatUptime(health.uptime) : '—'} hint="since last restart" tone="emerald" />
          <KpiCard label="Connected today" value="—" hint="active sessions" tone="violet" />
          <KpiCard label="Recent events" value="0" hint="last 24 hours" tone="amber" />
        </div>

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Services</h2>
              <p className="text-xs text-muted-foreground">Live health of every connected adapter.</p>
            </div>
            <span className="text-xs text-muted-foreground font-mono flex items-center gap-2">
              {loading ? 'syncing…' : `${totalCount} adapters`}
              {!loading && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/30"></span>
                  <span>Live</span>
                </span>
              )}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {adapters.map((a, i) => {
              const entry = health?.adapters?.[a.id];
              const status: Status = entry?.status ?? (loading ? 'pending' : 'down');
              return (
                <div
                  key={a.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
                >
                  <AdapterCard id={a.id} name={a.name} icon={a.icon} status={status} message={entry?.message} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl ring-1 ring-white/[0.02] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 ring-1 ring-border/50">
              <Activity className="h-4 w-4 text-foreground/80" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
              <p className="text-xs text-muted-foreground">Adapter events and audit log entries.</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-muted-foreground">No recent activity.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Events from your adapters will appear here.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

function KpiCard({ label, value, hint, tone }: { label: string; value: string; hint: string; tone: 'primary' | 'emerald' | 'violet' | 'amber' }) {
  const toneClass = {
    primary: 'from-primary/20 to-primary/0',
    emerald: 'from-emerald-500/20 to-emerald-500/0',
    violet: 'from-violet-500/20 to-violet-500/0',
    amber: 'from-amber-500/20 to-amber-500/0',
  }[tone];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl ring-1 ring-white/[0.02] p-5">
      <div className={`pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${toneClass} blur-2xl`} />
      <p className="relative text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="relative mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="relative mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}
