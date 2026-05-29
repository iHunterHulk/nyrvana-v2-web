export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/40 bg-background/70 backdrop-blur-xl px-6">
        <h1 className="text-sm font-semibold tracking-tight">Settings</h1>
        <span className="text-xs text-muted-foreground">Coming soon</span>
      </header>
      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-sm text-muted-foreground">This page is on the rebuild queue. Foundation is in place; surface area lands page-by-page.</p>
        </div>
      </main>
    </div>
  );
}
