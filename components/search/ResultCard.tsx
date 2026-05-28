'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';
import styles from './ResultCard.module.css';

interface ResultCardProps {
  data: unknown;
}

export function ResultCard({ data }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const jsonData = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={styles.resultCard}>
      <button className={styles.copyButton} onClick={handleCopy} aria-label="Copy JSON">
        <Copy size={16} />
      </button>
      {jsonData}
    </div>
  );
}