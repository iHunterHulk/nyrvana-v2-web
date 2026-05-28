'use client';

import { useState, useEffect } from 'react';
import { getStoredTheme, setStoredTheme, Theme } from '@/lib/theme/persist';

export const PreferencesSection = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Load stored theme
    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
    
    // Load sidebar preference from cookie
    const sidebarCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('nv-sidebar-default='));
    if (sidebarCookie) {
      setSidebarCollapsed(sidebarCookie.split('=')[1] === 'true');
    }
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const handleSidebarToggle = () => {
    const newValue = !sidebarCollapsed;
    setSidebarCollapsed(newValue);
    document.cookie = `nv-sidebar-default=${newValue}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Preferences</h2>
      
      {/* Theme Selection */}
      <div>
        <p className="text-sm mb-3">Theme</p>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              checked={theme === 'light'}
              onChange={() => handleThemeChange('light')}
              className="mr-2"
            />
            <span className="text-sm">Light</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              checked={theme === 'dark'}
              onChange={() => handleThemeChange('dark')}
              className="mr-2"
            />
            <span className="text-sm">Dark</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="theme"
              checked={theme === 'system'}
              onChange={() => handleThemeChange('system')}
              className="mr-2"
            />
            <span className="text-sm">System</span>
          </label>
        </div>
      </div>
      
      {/* Sidebar Preference */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={sidebarCollapsed}
            onChange={handleSidebarToggle}
            className="mr-2"
          />
          <span className="text-sm">Start with sidebar collapsed</span>
        </label>
      </div>
      
      {/* Keyboard Shortcuts */}
      <div>
        <button 
          onClick={() => {
            // This would trigger the keyboard help overlay from PR 5
            // Implementation depends on how that was set up
            document.dispatchEvent(new CustomEvent('toggle-help-overlay'));
          }}
          className="text-sm text-[color:var(--color-fg-link)] hover:underline"
        >
          View keyboard shortcuts (?)
        </button>
      </div>
    </div>
  );
};