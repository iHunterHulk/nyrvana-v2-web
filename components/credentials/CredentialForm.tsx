'use client';

import React, { useState } from 'react';
import { FieldDef } from '@/lib/credentials/schema';

interface CredentialFormProps {
  adapter: string;
  fields: FieldDef[];
  current: Record<string, unknown> | null;
  onSaved: (values: Record<string, unknown>) => void;
  onCancel: () => void;
}

export function CredentialForm({ adapter, fields, current, onSaved, onCancel }: CredentialFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(
    fields.reduce((acc, field) => {
      // For existing values, show masked placeholder
      if (current?.[field.key] !== undefined) {
        acc[field.key] = '***';
      } else {
        acc[field.key] = '';
      }
      return acc;
    }, {} as Record<string, unknown>)
  );
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitValues: Record<string, unknown> = {};
    
    for (const field of fields) {
      const val = values[field.key];
      // Only send value if it's not the masked placeholder
      if (val !== '***') {
        submitValues[field.key] = val;
      }
    }
    
    onSaved(submitValues);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-[color:var(--color-bg-elevated)] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <h3 className="text-[18px] font-medium mb-5">{adapter} Credentials</h3>
      {fields.map(field => (
        <div key={field.key} className="mb-4">
          <label htmlFor={`credential-${field.key}`} className="block text-xs font-medium mb-1.5 text-[color:var(--color-text-secondary)]">
            {field.label}
          </label>
          <div className="relative">
            <input
              id={`credential-${field.key}`}
              type={field.type === 'password' && !showPasswords[field.key] ? 'password' : 'text'}
              value={values[field.key] as string || ''}
              onChange={e => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full h-10 px-3 border border-[color:var(--color-border)] rounded-[8px] text-[14px] focus:outline-none focus:border-[color:var(--color-primary)] focus:shadow-[0_0_0_2px_rgba(0,123,255,0.25)]"
            />
            {field.type === 'password' && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field.key)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer text-[color:var(--color-text-secondary)]"
              >
                {showPasswords[field.key] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                )}
              </button>
            )}
          </div>
          {values[field.key] === '***' && (
            <div className="text-xs text-[color:var(--color-text-secondary)] mt-1">Leave blank to keep current</div>
          )}
        </div>
      ))}
      <div className="flex gap-3 mt-6">
        <button 
          type="submit" 
          className="px-4 py-2 bg-[color:var(--color-primary)] text-white rounded-[8px] text-[14px] font-medium hover:bg-[color:var(--color-primary-hover)]"
        >
          Save credentials
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 bg-[color:var(--color-bg)] text-[color:var(--color-text)] border border-[color:var(--color-border)] rounded-[8px] text-[14px] font-medium hover:bg-[color:var(--color-bg-hover)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}