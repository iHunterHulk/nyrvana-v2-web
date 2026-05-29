'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/auth/client';

interface AdapterOp {
  name: string;
  description?: string;
}

interface AdapterDetail {
  id: string;
  name: string;
  status: string;
  ops: AdapterOp[];
}

export default function AdapterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [adapter, setAdapter] = useState<AdapterDetail | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: string; message?: string } | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAdapterDetails = async () => {
      try {
        setLoading(true);
        // Fetch adapter details and available operations
        // Replace this with actual API call to /api/proxy/providers
        const mockData: AdapterDetail = {
          id,
          name: `Adapter ${id}`,
          status: 'healthy',
          ops: [
            { name: 'testConnection', description: 'Test connection to the adapter' },
            { name: 'getInfo', description: 'Get information about the adapter' },
            { name: 'listModels', description: 'List available models' },
          ],
        };
        setAdapter(mockData);
      } catch (err) {
        setError('Failed to fetch adapter details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdapterDetails();
  }, [id]);

  const handleRunOp = async (opName: string) => {
    try {
      // Replace this with actual API call to POST /api/proxy/providers/<id>/<op>
      const response = await fetch(`/api/proxy/providers/${id}/${opName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.text();
      setResults((prev) => ({ ...prev, [opName]: data }));
    } catch (err) {
      console.error(`Failed to run operation ${opName}:`, err);
      setResults((prev) => ({ ...prev, [opName]: 'Error running operation' }));
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // Call apiFetch('/health') to test connection
      const response = await apiFetch('/health');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const adapterStatus = data.adapters?.[id];
      
      if (adapterStatus) {
        setTestResult({
          status: adapterStatus.status || 'unknown',
          message: adapterStatus.message
        });
      } else {
        setTestResult({
          status: 'unknown',
          message: 'Adapter not found in health check response'
        });
      }
    } catch (err) {
      console.error('Failed to test connection:', err);
      setTestResult({
        status: 'error',
        message: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'connected':
      case 'ok':
        return 'default'; // green
      case 'warning':
      case 'degraded':
        return 'secondary'; // amber
      case 'error':
      case 'disconnected':
      case 'failed':
        return 'destructive'; // red
      default:
        return 'outline'; // gray
   
 }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!adapter) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Adapter Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No adapter found with ID: {id}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{adapter.name}</h1>
          <p className="text-muted-foreground">Adapter ID: {adapter.id} • Status: {adapter.status}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connection Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={testing}>
              {testing ? 'Testing...' : 'Test now'}
            </Button>
            {testResult && (
              <div className="flex items-center gap-2">
                <Badge variant={getBadgeVariant(testResult.status)}>
                  {testResult.status}
                </Badge>
                {testResult.message && (
                  <span className="text-sm text-muted-foreground">
                    {testResult.message}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {adapter.ops.map((op) => (
            <Card key={op.name} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-base font-semibold">{op.name}</CardTitle>
                {op.description && (
                  <p className="text-sm text-muted-foreground">{op.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleRunOp(op.name)}
                  variant="secondary"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  Run
                </Button>
                
                {results[op.name] && (
                  <div className="rounded-md border bg-muted p-3 text-sm">
                    <pre className="overflow-auto max-h-40">{results[op.name]}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}