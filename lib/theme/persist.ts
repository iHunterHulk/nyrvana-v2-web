export type Theme = 'light' | 'dark' | 'system';

const COOKIE = 'nv-theme';
const MAX_AGE = 365 * 24 * 60 * 60;

export function getStoredTheme(): Theme {
  if (typeof document === 'undefined') return 'system';
  const match = document.cookie.match(new RegExp(`${COOKIE}=([^;]+)`));
  const v = match?.[1] as Theme | undefined;
  return v ?? 'system';
}

export function setStoredTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE}=${theme}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`;
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'system') {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}