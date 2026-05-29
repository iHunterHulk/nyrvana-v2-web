'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { KeyRound, CheckCircle2, XCircle, Loader2, Save, Trash2, Pencil } from 'lucide-react';
import { Topbar } from '@/components/dashboard/Topbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiFetch } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

interface FieldDef { key: string; label: string; type: 'text' | 'password' | 'url'; required: boolean; }

const schema: Record<string, FieldDef[]> = {
  adguard: [
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'user', label: 'Username', type: 'text', required: true },
    { key: 'pass', label: 'Password', type: 'password', required: true },
  ],
  ntfy: [
    { key: 'baseUrl', label: 'Base URL', type: 'url', required: true },
    { key: 'defaultTopic', label: 'Default Topic', type: 'text', required: false },
    { key: 'token', label: 'Token', type: 'password', required: false },
  ],
  memos: [
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'token', label: 'API Token', type: 'password', required: false },
  ],
  ollama: [
    { key: 'baseUrl', label: 'Base URL', type: 'url', required: true },
    { key: 'apiKey', label: 'API Key', type: 'password', required: false },
    { key: 'defaultModel', label: 'Default Model', type: 'text', required: false },
  ],
  immich: [
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'apiKey', label: 'API Key', type: 'password', required: true },
  ],
  nextcloud: [
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'user', label: 'Username', type: 'text', required: true },
    { key: 'pass', label: 'Password', type: 'password', required: true },
  ],
  miniflux: [
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'token', label: 'API Token', type: 'password', required: true },
  ],
  paperless: [
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'token', label: 'Token', type: 'password', required: true },
  ],
  n8n: [
    { key: 'url', label: 'URL', type: 'url', required: true },
    { key: 'apiKey', label: 'API Key', type: 'password', required: true },
  ],
};

const adapterIds = Object.keys(schema);

export default function CredentialsPage() {
  const [data, setData] = useState<Record<string, Record<string, unknown> | null>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result: Record<string, Record<string, unknown> | null> = {};
      await Promise.all(
        adapterIds.map(async (id) => {
          try {
            const res = await apiFetch(`/credentials/${id}`);
            if (res.status === 404) result[id] = null;
            else if (res.ok) result[id] = await res.json();
            else result[id] = null;
          } catch {
            result[id] = null;
          }
        }),
      );
      setData(result);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar title="Credentials" description="Encrypted per-user secrets for each adapter." />
      <main className="flex-1 p-4 lg:p-6 space-y-4">
        <div className="mx-auto max-w-3xl space-y-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            adapterIds.map((id) => (
              <CredentialRow
                key={id}
                id={id}
                fields={schema[id]}
                current={data[id]}
                isEditing={editing === id}
                onEdit={() => setEditing(editing === id ? null : id)}
                onSaved={(saved) => {
                  setData((d) => ({ ...d, [id]: saved }));
                  setEditing(null);
                  toast.success(`${id} credentials saved`);
                }}
                onDeleted={() => {
                  setData((d) => ({ ...d, [id]: null }));
                  toast.success(`${id} credentials removed`);
                }}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function CredentialRow({
  id,
  fields,
  current,
  isEditing,
  onEdit,
  onSaved,
  onDeleted,
}: {
  id: string;
  fields: FieldDef[];
  current: Record<string, unknown> | null;
  isEditing: boolean;
  onEdit: () => void;
  onSaved: (saved: Record<string, unknown>) => void;
  onDeleted: () => void;
}) {
  const configured = current !== null;
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl ring-1 ring-white/[0.02] transition-all',
        isEditing && 'border-border ring-white/5',
      )}
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 ring-1 ring-border/50">
            <KeyRound className="h-4 w-4 text-foreground/80" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">{id}</p>
            <div className="flex items-center gap-1.5 text-xs">
              {configured ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Configured</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Not set</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {configured && !isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={async () => {
                if (!confirm(`Delete ${id} credentials?`)) return;
                const res = await apiFetch(`/credentials/${id}`, { method: 'DELETE' });
                if (res.ok) onDeleted();
                else toast.error(`Failed to delete (HTTP ${res.status})`);
              }}
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant={isEditing ? 'secondary' : 'ghost'} size="sm" className="h-8 gap-1.5 text-xs" onClick={onEdit}>
            <Pencil className="h-3 w-3" />
            {isEditing ? 'Close' : configured ? 'Edit' : 'Set up'}
          </Button>
        </div>
      </div>

      {isEditing && <CredentialForm id={id} fields={fields} current={current} onSaved={onSaved} />}
    </div>
  );
}

function CredentialForm({
  id,
  fields,
  current,
  onSaved,
}: {
  id: string;
  fields: FieldDef[];
  current: Record<string, unknown> | null;
  onSaved: (saved: Record<string, unknown>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      const v = current?.[f.key];
      init[f.key] = typeof v === 'string' && v !== '***' ? v : '';
    }
    return init;
  });
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...current };
      for (const f of fields) {
        if (values[f.key]) payload[f.key] = values[f.key];
      }
      const res = await apiFetch(`/credentials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast.error(`Save failed (HTTP ${res.status})`);
        return;
      }
      const r2 = await apiFetch(`/credentials/${id}`);
      onSaved(await r2.json());
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="border-t border-border/40 p-4 space-y-3">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</Label>
          <Input
            type={f.type === 'password' ? 'password' : 'text'}
            value={values[f.key]}
            placeholder={f.type === 'password' && current?.[f.key] === '***' ? 'Leave blank to keep current' : ''}
            onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
            className="h-9 bg-background/60 border-border/60 focus-visible:border-ring/80"
          />
        </div>
      ))}
      <Button type="submit" disabled={saving} className="w-full h-9 gap-2">
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        Save credentials
      </Button>
    </form>
  );
}
