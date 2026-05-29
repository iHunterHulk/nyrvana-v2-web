'use client';

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'healthy' | 'degraded' | 'down' | 'pending';

interface AdapterCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  status: Status;
  message?: string;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; icon: LucideIcon; dotClass: string; textClass: string; ringClass: string }
> = {
  healthy: {
    label: 'Healthy',
    icon: CheckCircle2,
    dotClass: 'bg-emerald-500 shadow-[0_0_12px_oklch(0.7_0.18_145/.6)]',
    textClass: 'text-emerald-400',
    ringClass: 'ring-emerald-500/10',
  },
  degraded: {
    label: 'Degraded',
    icon: AlertTriangle,
    dotClass: 'bg-amber-500 shadow-[0_0_12px_oklch(0.75_0.16_60/.6)]',
    textClass: 'text-amber-400',
    ringClass: 'ring-amber-500/10',
  },
  down: {
    label: 'Down',
    icon: XCircle,
    dotClass: 'bg-red-500 shadow-[0_0_12px_oklch(0.65_0.22_25/.6)]',
    textClass: 'text-red-400',
    ringClass: 'ring-red-500/10',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    dotClass: 'bg-muted-foreground/40',
    textClass: 'text-muted-foreground',
    ringClass: 'ring-border/40',
  },
};

export function AdapterCard({ name, icon: Icon, status, message, className }: AdapterCardProps) {
  const cfg = statusConfig[status];
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl ring-1 ring-white/[0.02] p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:border-border hover:ring-white/5 hover:translate-y-[-1px] hover:shadow-xl hover:shadow-black/20',
        className
      )}
    >
      {/* glow accent */}
      <div
        className={cn(
          'pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70',
          status === 'healthy' && 'bg-emerald-500/20',
          status === 'degraded' && 'bg-amber-500/20',
          status === 'down' && 'bg-red-500/20',
          status === 'pending' && 'bg-muted-foreground/10',
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 ring-1 ring-border/50">
            <Icon className="h-5 w-5 text-foreground/80" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">{name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{cfg.label}</p>
          </div>
        </div>
        <span
          aria-hidden
          className={cn('h-2 w-2 rounded-full', cfg.dotClass)}
        />
      </div>

      {message && (
        <p className="relative mt-4 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {message}
        </p>
      )}

      <div className="relative mt-4 flex items-center justify-between border-t border-border/30 pt-3">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
          Last checked
        </span>
        <span className="text-xs text-muted-foreground">just now</span>
      </div>
    </div>
  );
}
