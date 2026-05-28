'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchInput } from './SearchInput';
import { RouteCard } from './RouteCard';
import { NoRouteCard } from './NoRouteCard';
import { ResultCard } from './ResultCard';
import { search, SearchResponse } from '../../lib/search/client';
import styles from './SearchPanel.module.css';

export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastResponse, setLastResponse] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);
    setError(null);
    setLastResponse(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await search(searchQuery, controller.signal);
      setLastResponse(response);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An error occurred during search');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsSearching(false);
    setLastResponse(null);
    setError(null);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className={styles.searchPanel}>
      <SearchInput onSearch={handleSearch} onClear={handleClear} />
      
      {isSearching && <div>Searching...</div>}
      
      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-error)', borderRadius: '8px', color: 'var(--color-text-error)' }}>
          Error: {error}
        </div>
      )}
      
      {!isSearching && !error && lastResponse && (
        <div className={styles.resultsContainer}>
          {'reason' in lastResponse ? (
            <NoRouteCard />
          ) : (
            <>
              <RouteCard adapter={lastResponse.adapter} op={lastResponse.op} />
              <ResultCard data={lastResponse.results} />
            </>
          )}
        </div>
      )}
      
      {!isSearching && !error && !lastResponse && (
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '24px' }}>
          Ask anything across your adapters.
        </div>
      )}
    </div>
  );
}