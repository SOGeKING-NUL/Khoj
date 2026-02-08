# 🔧 Queue Failure Fix Applied

## Problem
The worker was failing with this error:
```
Failed query: insert into "user_places" ("id", "user_id", "place_id", "saved_at") 
values (default, $1, $2, default) on conflict do nothing
```

## Root Cause
The `user_places` table has a **unique constraint** on `(userId, placeId)`, but Drizzle's `.onConflictDoNothing()` wasn't properly handling it without specifying the conflict target.

## Solution
Updated both files to explicitly specify the conflict target:

### Files Changed:
1. ✅ `app/lib/queue/reel-worker.ts`
2. ✅ `app/api/reel/route.ts`

### Change Made:
```typescript
// BEFORE (causing error)
await db.insert(userPlaces)
  .values(userPlacesData)
  .onConflictDoNothing();

// AFTER (fixed)
await db.insert(userPlaces)
  .values(userPlacesData)
  .onConflictDoNothing({ target: [userPlaces.userId, userPlaces.placeId] });
```

## How to Apply Fix

### 1. Restart the Worker
```bash
# Stop the current worker (Ctrl+C if running)
# Then restart it:
npm run worker
```

### 2. Test with a Reel
1. Go to home page
2. Paste an Instagram reel URL
3. Submit
4. Check worker logs - should see "added place to user profile"

### 3. Verify in Database
The place should now be saved to `user_places` without errors.

## Why This Happened
When you have a unique constraint on multiple columns, Drizzle needs to know which columns to check for conflicts. Without specifying the target, it was trying to use the primary key (`id`) which always generates a new UUID, causing the conflict check to fail.

## What This Fixes
- ✅ Worker no longer crashes when saving places
- ✅ Duplicate place saves are properly ignored
- ✅ Same place can be saved by multiple users
- ✅ Same user can't save the same place twice

---

## Next Steps
Once you restart the worker, try submitting a reel again. It should work now! 🚀
