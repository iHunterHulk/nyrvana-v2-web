'use client';

import React, { useState, useEffect } from 'react';
import { getCredentials, setCredentials, deleteCredentials } from '@/lib/credentials/client';
import { adapterFields } from '@/lib/credentials/schema';
import { AdapterRow } from './AdapterRow';
import { CredentialForm } from './CredentialForm';
import { toast } from 'sonner';

export function CredentialsPanel() {
  const [credentials, setCredentialsState] = useState<Record<string, Record<string, unknown> | null>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllCredentials = async () => {
      try {
        const results = await Promise.all(
          Object.keys(adapterFields).map(async (adapter) => {
            const creds = await getCredentials(adapter);
            return [adapter, creds];
          })
        );
        setCredentialsState(Object.fromEntries(results));
      } catch (error) {
        console.error('Failed to load credentials:', error);
        toast.error('Failed to load credentials');
      } finally {
        setLoading(false);
      }
    };

    loadAllCredentials();
  }, []);

  const handleEdit = (adapter: string) => {
    setEditing(adapter);
  };

  const handleDelete = async (adapter: string) => {
    try {
      await deleteCredentials(adapter);
      setCredentialsState(prev => ({ ...prev, [adapter]: null }));
      toast.success('Credentials deleted successfully');
    } catch (error) {
      console.error('Failed to delete credentials:', error);
      toast.error('Failed to delete credentials');
    }
  };

  const handleSave = async (adapter: string, values: Record<string, unknown>) => {
    try {
      await setCredentials(adapter, values);
      const updatedCreds = await getCredentials(adapter);
      setCredentialsState(prev => ({ ...prev, [adapter]: updatedCreds }));
      setEditing(null);
      toast.success('Credentials saved successfully');
    } catch (error) {
      console.error('Failed to save credentials:', error);
      toast.error('Failed to save credentials');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-[16px]">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Credentials</h2>
      <p className="text-[color:var(--color-text-secondary)] mb-6">
        Manage API credentials for external services used by Nyrvana. These are stored encrypted in the database.
      </p>
      
      <div className="flex flex-col gap-0">
        {Object.keys(adapterFields).map(adapter => (
          <AdapterRow
            key={adapter}
            adapter={adapter}
            isConfigured={credentials[adapter] !== null}
            onEdit={() => handleEdit(adapter)}
            onDelete={() => handleDelete(adapter)}
          />
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[color:var(--color-bg)] rounded-lg shadow-xl w-full max-w-md">
            <CredentialForm
              adapter={editing}
              fields={adapterFields[editing]}
              current={credentials[editing]}
              onSaved={(values) => handleSave(editing, values)}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}