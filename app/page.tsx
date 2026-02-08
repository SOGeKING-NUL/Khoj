'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const result = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: result.error || 'Failed to process reel' });
        setLoading(false);
        return;
      }

      if (result.status === 'cached') {
        setMessage({ type: 'success', text: 'Place already saved! Check your map.' });
      } else if (result.status === 'processing') {
        setMessage({ type: 'success', text: 'Processing reel... Check back in a moment!' });
      }

      setUrl('');
      
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Save Places from Reels</h1>
          <p className="text-muted-foreground">Paste an Instagram reel link to save the location</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://instagram.com/reel/..."
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
          />
          
          <button
            type="submit"
            disabled={loading || !isLoaded}
            className="w-full bg-foreground hover:bg-foreground/90 text-background py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Save Place'}
          </button>
        </form>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {!isSignedIn && isLoaded && (
          <p className="text-center text-sm text-muted-foreground">
            Sign in to start saving places
          </p>
        )}
      </div>
    </div>
  );
}
