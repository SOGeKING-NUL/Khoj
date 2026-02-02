  // app/api/places/route.ts
import { db } from '@/app/db/db';
import { places, userPlaces } from '@/app/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest){
  try {

    const {userId}= await auth();

    if(!userId){
        return NextResponse.json({
            error: 'unauthorized'
        }, {status: 401})
    }

    const rows= await db
                .select({
                    placeId: places.placeId,
                    displayName: places.displayName,
                    formattedAddress: places.formattedAddress,
                    lat: places.lat,
                    lng: places.lng,
                    type: places.type,
                  })
                .from(places)
                .innerJoin(userPlaces, eq( places.placeId, userPlaces.placeId))
                .where(eq(userPlaces.userId, userId));

    return NextResponse.json(rows);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}

