'use client';

import { useState, useEffect } from 'react';
import { getAccessToken } from '@/lib/auth/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const [userInfo, setUserInfo] = useState<{ userId: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Run client-side only
    const fetchUserInfo = () => {
      try {
        const token = getAccessToken();
        if (token) {
          // Decode JWT (base64 decode the middle segment)
          const payload = token.split('.')[1];
          const decodedPayload = atob(payload);
          const parsed = JSON.parse(decodedPayload);
          
          setUserInfo({
            userId: parsed.userId || parsed.sub || 'Unknown',
            role: parsed.role || 'Unknown'
          });
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/70 backdrop-blur-xl px-6">
        <h1 className="text-sm font-semibold tracking-tight">Settings</h1>
        <span className="text-xs text-muted-foreground">User Information</span>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ) : userInfo ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm">{userInfo.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-mono text-sm">{userInfo.role}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No user information available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
