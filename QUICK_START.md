# 🚀 Quick Start Guide

## What's New

✅ **PWA enabled** - App can be installed on mobile/desktop
✅ **Auth flow** - Users must sign in to save places
✅ **Clean home page** - Simple reel URL input
✅ **Profile page** - View all saved places and stats
✅ **Better navigation** - Map link + profile dropdown

---

## Test It Now

### 1. **Development Mode** (PWA disabled)
```bash
npm run dev
```
Open http://localhost:3000

### 2. **Production Mode** (PWA enabled)
```bash
npm run build
npm start
```
Open http://localhost:3000

**In production mode:**
- Service worker registers automatically
- Install prompt appears in Chrome
- Manifest loads correctly
- App works offline (cached pages)

---

## User Flow

1. **Home** (`/`) → Paste Instagram reel URL
   - If not signed in → Redirects to `/auth`
   - If signed in → Processes reel

2. **Auth** (`/auth`) → Sign in with Clerk
   - Instagram OAuth available
   - Email/password available

3. **Map** (`/map`) → View all saved places
   - Color-coded markers by place type
   - Click marker → See place details
   - Get directions to place

4. **Profile** (`/profile`) → View stats and places
   - Total places saved
   - Countries visited
   - Place types discovered
   - Click place → Opens map with that place selected

---

## Install PWA

### **Desktop (Chrome/Edge)**
1. Visit site in production mode
2. Look for install icon in address bar (⊕)
3. Click "Install"
4. App opens in standalone window

### **Android (Chrome)**
1. Deploy to Vercel
2. Visit site on phone
3. Chrome shows "Add to Home Screen" banner
4. Tap to install
5. App icon appears on home screen

### **iOS (Safari)**
1. Deploy to Vercel
2. Visit site in Safari (not Chrome!)
3. Tap Share button
4. Tap "Add to Home Screen"
5. Tap "Add"

---

## Deploy to Vercel

```bash
git add .
git commit -m "PWA setup complete"
git push
```

Vercel auto-deploys from your main branch.

---

## Next: Proximity Notifications

Ready to implement? Here's what we'll build:

### **Database Changes**
```sql
-- User notification preferences
CREATE TABLE notification_settings (
  user_id TEXT PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  radius_meters INTEGER DEFAULT 500
);

-- Push notification subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY,
  user_id TEXT,
  endpoint TEXT,
  p256dh TEXT,
  auth TEXT
);

-- Notification log (prevent spam)
CREATE TABLE notification_log (
  id UUID PRIMARY KEY,
  user_id TEXT,
  place_id TEXT,
  sent_at TIMESTAMP
);
```

### **New Features**
1. Settings page (`/settings`)
   - Enable/disable notifications toggle
   - Radius slider (100m - 2km)
   - Test notification button

2. Push notification subscription
   - Request permission on profile page
   - Store subscription in database
   - Generate VAPID keys

3. Background location tracking
   - Service worker checks location every 5-10 min
   - Queries nearby places from database
   - Sends push notification if within radius

4. Proximity API (`/api/notifications/check-proximity`)
   - Receives user location
   - Queries PostGIS for nearby places
   - Sends push notification
   - Logs notification to prevent spam

---

## File Structure

```
app/
├── page.tsx                 ✅ Home (reel input)
├── auth/[[...auth]]/        ✅ Sign in page
├── map/                     ✅ Map view
├── profile/                 ✅ Profile page
├── settings/                ⏳ Coming next
├── api/
│   ├── places/              ✅ Get/manage places
│   ├── reel/                ✅ Process reels
│   └── notifications/       ⏳ Coming next
│       ├── subscribe/       ⏳ Save push subscription
│       └── check-proximity/ ⏳ Check nearby places
└── components/
    └── Nav.tsx              ✅ Navigation

public/
├── manifest.json            ✅ PWA manifest
├── icon.jpg                 ✅ App icon
└── sw.js                    ✅ Service worker (prod only)
```

---

## Commands

```bash
# Development
npm run dev              # Start dev server (PWA disabled)

# Production
npm run build            # Build for production
npm start                # Run production server

# Background Jobs
npm run worker           # Run reel processing worker

# Database
npx drizzle-kit push     # Push schema changes
npx drizzle-kit studio   # Open database GUI
```

---

## Environment Variables

Make sure these are set in `.env`:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_GOOGLE_MAP_ID=82bf...

# Database
DATABASE_URL=postgresql://...

# Redis (for job queue)
REDIS_URL=rediss://...

# APIs
APIFY_API_TOKEN=apify_api_...
OPENROUTER_API_KEY=sk-or-v1-...

# Coming soon for notifications:
# NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
# VAPID_PRIVATE_KEY=...
```

---

## Troubleshooting

### **Service worker not registering?**
- Make sure you're in production mode (`npm run build && npm start`)
- Check DevTools → Application → Service Workers
- PWA is disabled in development mode

### **Install prompt not showing?**
- Must be HTTPS (Vercel provides this)
- Must have valid manifest.json
- Must have service worker registered
- Chrome may delay prompt (can force in DevTools)

### **Map not loading?**
- Check Google Maps API key is valid
- Check API key has Maps JavaScript API enabled
- Check browser console for errors

### **Places not saving?**
- Check user is signed in
- Check API route returns success
- Check background worker is running (`npm run worker`)
- Check Redis connection

---

## Ready to Continue?

Let me know when you want to implement:
1. ✅ PWA setup (DONE)
2. ✅ Auth flow (DONE)
3. ✅ Profile page (DONE)
4. ⏳ Proximity notifications (NEXT)
5. ⏳ Settings page (NEXT)
6. ⏳ Collections/folders (FUTURE)
7. ⏳ Itinerary generator (FUTURE)

🎯 **Current Status:** Foundation complete, ready for notifications!
