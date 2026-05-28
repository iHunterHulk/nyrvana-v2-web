'use client';

import usePageTitle from '@/lib/shell/use-page-title';

export default function DashboardPage() {
  usePageTitle('Dashboard');
  
  return (
    <div className="grid grid-cols-12 gap-4 p-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div 
          key={item}
          className={`bg-[color:var(--color-bg-elevated)] border border-[color:var(--color-border)] rounded-md p-4 min-h-32 animate-pulse ${
            item <= 2 ? 'col-span-3' : 
            item === 3 ? 'col-span-6' : 
            item === 4 ? 'col-span-3' : 
            item === 5 ? 'col-span-9' : 
            'col-span-12'
          }`}
        >
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 mx-auto"></div>
              <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}