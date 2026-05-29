import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-[0_0_30px_-8px_oklch(0.6_0.245_262.881/.6)] ring-1 ring-white/10',
        className
      )}
      style={{ height: size, width: size }}
    >
      <svg
        viewBox="0 0 24 24"
        className="text-primary-foreground"
        style={{ height: size * 0.55, width: size * 0.55 }}
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
  );
}
