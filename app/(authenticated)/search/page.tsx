'use client';

import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { SearchPanel } from '@/components/search/SearchPanel';

export default function SearchPage() {
  usePageTitle('Search');
  
  return (
    <div className="p-6">
      <SearchPanel />
    </div>
  );
}