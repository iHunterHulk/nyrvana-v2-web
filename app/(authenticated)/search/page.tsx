'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface SearchResults {
  results: any[];
}

export default function Page() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SearchResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const examples = [
    'show DNS stats',
    'recent unread feeds',
    'what photos did I take today',
    'list notes from this week'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // In a real implementation, this would call an API
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setData({ results: [] }); // Mock empty results
    }, 500);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    // Simulate form submission
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setData({ results: [] }); // Mock empty results
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/70 backdrop-blur-xl px-6">
        <h1 className="text-sm font-semibold tracking-tight">Search</h1>
        <span className="text-xs text-muted-foreground">Query across all your services</span>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto pt-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Ask anything about your data..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 pl-4 pr-20 text-base"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 rounded-md bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {!data && !isLoading && !error && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="rounded-full border border-border/50 bg-card/40 backdrop-blur-xl px-3 py-1.5 text-xs hover:bg-card/70 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            )}
            
            {data && (
              <div className="mt-8 space-y-4">
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    No results found for "{query}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try rephrasing your query or check your adapters are connected.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
