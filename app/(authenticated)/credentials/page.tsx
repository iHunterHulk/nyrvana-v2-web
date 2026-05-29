'use client';

import { CredentialsPanel } from '@/components/credentials/CredentialsPanel';
import { ShellContext } from '@/components/shell/Shell';
import { useContext, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { setTitle } = useContext(ShellContext);

  useEffect(() => {
    setTitle('Credentials');
  }, [setTitle]);

  return (
    <div className="flex min-h-screen flex-col">
      <CredentialsPanel />
    </div>
  );
}