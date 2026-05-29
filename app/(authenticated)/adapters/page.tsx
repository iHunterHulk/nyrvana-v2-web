'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SearchX } from 'lucide-react';

interface Adapter {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'online' | 'offline' | 'warning';
}

// Mock data based on the adapters in the dashboard
const adapters: Adapter[] = [
  { id: 'adguard', name: 'AdGuard Home', description: 'Network-wide ads & trackers blocking', category: 'Security', status: 'online' },
  { id: 'ntfy', name: 'Ntfy', description: 'Push notification service', category: 'Communication', status: 'online' },
  { id: 'memos', name: 'Memos', description: 'Self-hosted note-taking service', category: 'Productivity', status: 'online' },
  { id: 'ollama', name: 'Ollama Cloud', description: 'AI model inference service', category: 'AI', status: 'online' },
  { id: 'immich', name: 'Immich', description: 'High performance photos and videos management', category: 'Media', status: 'online' },
  { id: 'nextcloud', name: 'Nextcloud', description: 'File sharing and collaboration platform', category: 'Storage', status: 'online' },
  { id: 'miniflux', name: 'Miniflux', description: 'Minimalist feed reader', category: 'News', status: 'online' },
  { id: 'paperless', name: 'Paperless-ngx', description: 'Document management system', category: 'Productivity', status: 'warning' },
  { id: 'n8n', name: 'n8n', description: 'Workflow automation tool', category: 'Automation', status: 'online' },
  { id: 'stirling', name: 'Stirling PDF', description: 'PDF manipulation toolkit', category: 'Productivity', status: 'online' },
  { id: 'homepage', name: 'Homepage', description: 'Dashboard for your services', category: 'UI', status: 'online' },
  { id: 'searxng', name: 'SearXNG', description: 'Privacy-respecting metasearch engine', category: 'Search', status: 'online' },
  { id: 'umami', name: 'Umami', description: 'Website analytics platform', category: 'Analytics', status: 'online' },
  { id: 'sablier', name: 'Sablier', description: 'On-demand container startup', category: 'Infrastructure', status: 'offline' },
  { id: 'plane', name: 'Plane', description: 'Project management tool', category: 'Productivity', status: 'online' },
];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');

  // Group adapters by category and filter by search query
  const groupedAdapters = useMemo(() => {
    const filtered = adapters.filter(adapter => 
      adapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adapter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adapter.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by category
    const groups: Record<string, Adapter[]> = {};
    filtered.forEach(adapter => {
      if (!groups[adapter.category]) {
        groups[adapter.category] = [];
      }
      groups[adapter.category].push(adapter);
    });

    // Sort categories alphabetically
    return Object.keys(groups)
      .sort()
      .reduce((obj, key) => {
        obj[key] = groups[key];
        return obj;
      }, {} as Record<string, Adapter[]>);
  }, [searchQuery]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/70 backdrop-blur-xl px-6">
        <h1 className="text-sm font-semibold tracking-tight">Adapters</h1>
        <span className="text-xs text-muted-foreground">Manage your integrations and connections</span>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search adapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-8">
            {Object.keys(groupedAdapters).length > 0 ? (
              Object.entries(groupedAdapters).map(([category, categoryAdapters]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {category}
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      {categoryAdapters.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryAdapters.map((adapter) => (
                      <div 
                        key={adapter.id}
                        className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl p-4 hover:bg-card/60 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-sm">{adapter.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {adapter.description}
                            </p>
                          </div>
                          <div className={`h-2 w-2 rounded-full ${
                            adapter.status === 'online' ? 'bg-green-500' :
                            adapter.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : searchQuery ? (
              <div className="text-center py-12">
                <SearchX className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-sm font-medium mb-1">No adapters match "{searchQuery}"</h3>
                <p className="text-xs text-muted-foreground mb-4">Try adjusting your search terms</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-primary hover:underline"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">
                  No adapters found.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
