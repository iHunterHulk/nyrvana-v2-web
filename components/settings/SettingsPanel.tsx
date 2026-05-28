'use client';

import { ProfileSection } from './ProfileSection';
import { PreferencesSection } from './PreferencesSection';

export const SettingsPanel = () => {
  return (
    <div className="max-w-2xl space-y-12">
      <ProfileSection />
      <PreferencesSection />
    </div>
  );
};