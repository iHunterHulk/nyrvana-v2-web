import Shell from '@/components/shell/Shell';
import type { ReactNode } from 'react';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}