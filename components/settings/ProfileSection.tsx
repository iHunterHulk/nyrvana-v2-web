'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, User } from '@/lib/user/client';

export const ProfileSection = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-[color:var(--color-fg-muted)] uppercase tracking-wide">Email</p>
          <p className="text-sm">
            {loading ? 'Loading...' : user?.email || 'Unknown'}
          </p>
        </div>
        <div>
          <p className="text-xs text-[color:var(--color-fg-muted)] uppercase tracking-wide">Role</p>
          <p className="text-sm">
            {loading ? 'Loading...' : user?.role || 'Unknown'}
          </p>
        </div>
      </div>
      <p className="text-xs text-[color:var(--color-fg-muted)]">
        Profile editing arrives in a later release.
      </p>
    </div>
  );
};