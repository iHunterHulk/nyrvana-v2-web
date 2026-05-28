import { cookies } from 'next/headers';
import { apiBase } from '@/lib/auth/proxy-base';

export default async function DashboardPage() {
  // This is a placeholder for the dashboard page
  // In a real implementation, this would fetch user data and display it
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="mb-8">Dashboard placeholder - this will be replaced in a later PR.</p>
        
        <form 
          action={async () => {
            'use server';
            // Call logout endpoint
            const refreshToken = (await cookies()).get('nv-refresh')?.value;
            if (refreshToken) {
              await fetch(`${apiBase}/api/v2/auth/logout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
              });
            }
            
            // Clear the refresh token cookie
            (await cookies()).delete('nv-refresh');
          }}
        >
          <button 
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}