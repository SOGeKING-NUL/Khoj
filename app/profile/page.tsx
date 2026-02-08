'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Places } from '../types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [places, setPlaces] = useState<Places[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/auth');
      return;
    }

    async function fetchPlaces() {
      try {
        const response = await axios.get('/api/places');
        setPlaces(response.data);
      } catch (error) {
        console.error('Failed to fetch places:', error);
      }
      setLoading(false);
    }

    if (isLoaded && isSignedIn) {
      fetchPlaces();
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <img
            src={user?.imageUrl}
            alt={user?.firstName || 'User'}
            className="w-20 h-20 rounded-full border-2 border-border"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-accent p-4 rounded-lg border border-border">
            <div className="text-3xl font-bold text-foreground">{places.length}</div>
            <div className="text-sm text-muted-foreground">Places Saved</div>
          </div>
          <div className="bg-accent p-4 rounded-lg border border-border">
            <div className="text-3xl font-bold text-foreground">
              {new Set(places.map(p => p.formattedAddress?.split(',').pop()?.trim())).size}
            </div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="bg-accent p-4 rounded-lg border border-border col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-foreground">
              {new Set(places.map(p => p.type)).size}
            </div>
            <div className="text-sm text-muted-foreground">Place Types</div>
          </div>
        </div>

        {/* Saved Places */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Saved Places</h2>
            <Link
              href="/map"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View on Map →
            </Link>
          </div>

          {places.length === 0 ? (
            <div className="text-center py-12 bg-accent rounded-lg border border-border">
              <p className="text-muted-foreground mb-4">No places saved yet</p>
              <Link
                href="/"
                className="inline-block bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Save Your First Place
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {places.map((place) => (
                <div
                  key={place.placeId}
                  className="bg-accent p-4 rounded-lg border border-border hover:border-foreground transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{place.displayName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {place.formattedAddress}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-background px-2 py-1 rounded border border-border text-foreground capitalize">
                          {place.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/map?place=${place.placeId}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
