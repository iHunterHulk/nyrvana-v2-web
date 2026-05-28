'use client';

import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { usePageTitle } from '@/lib/hooks/usePageTitle';

export default function SettingsPage() {
  usePageTitle('Settings');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <SettingsPanel />
    </div>
  );
}