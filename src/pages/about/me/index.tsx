import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Loader, RefreshCw } from 'lucide-react';

// Create a new QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000, // Data becomes stale after 5 seconds
      cacheTime: 30000, // Cache is kept for 30 seconds
    },
  },
});

// Main app component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">TanStack Query Caching Demo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QueryComponent id={1} />
          <QueryComponent id={2} />
        </div>
        <CacheControls />
        <CacheExplanation />
      </div>
    </QueryClientProvider>
  );
}

// Component that demonstrates query caching
function QueryComponent({ id }) {
  const { data, isLoading, isFetching, dataUpdatedAt, refetch } = useQuery({
    queryKey: [`post-${id}`],
    queryFn: () => fetchPost(id),
  });

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Post {id}</h2>
        <div className="flex gap-2 items-center">
          {isFetching && <Loader className="animate-spin" size={18} />}
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
          >
            <RefreshCw size={16} />
            Refetch
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin" size={24} />
        </div>
      ) : (
        <div className="mt-3">
          <h3 className="font-medium text-lg">{data.title}</h3>
          <p className="text-gray-600 mt-1">{data.body}</p>
          <div className="mt-3 text-sm text-gray-500">
            Last fetched: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}

// Component for controlling cache
function CacheControls() {
  return (
    <div className="mt-6 border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Cache Controls</h2>
      <div className="flex gap-3">
        <button
          onClick={() => queryClient.invalidateQueries()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Invalidate All Queries
        </button>
        <button
          onClick={() => queryClient.clear()}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
}

// Component for explaining caching behavior
function CacheExplanation() {
  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50 shadow">
      <h2 className="text-xl font-semibold mb-3">How Caching Works</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Stale Time (5s):</strong> Data is considered fresh for 5 seconds. During this time, repeated queries use cached data without refetching.</li>
        <li><strong>Cache Time (30s):</strong> Cached data is kept for 30 seconds, even if no components are using it.</li>
        <li><strong>Background Updates:</strong> When a query is stale and components re-mount or refocus, TanStack Query refetches in the background.</li>
        <li><strong>Manual Controls:</strong> Use the buttons above to manually control cache behavior.</li>
      </ul>
    </div>
  );
}

// Simulate an API call with random delay
async function fetchPost(id: number) {
  // Simulate network delay
  const delay = Math.random() * 1000 + 500;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Return mock data
  return {
    id,
    title: `Sample Post ${id} (${Math.floor(Math.random() * 1000)})`,
    body: "This is a sample post body that demonstrates TanStack Query's caching capabilities. Notice how subsequent requests use cached data."
  };
}