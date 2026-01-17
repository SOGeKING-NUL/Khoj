'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
      setData({ error: 'Failed to fetch' });
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>HOME FOR KHOJ</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Instagram reel URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Metadata'}
        </button>
      </form>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
