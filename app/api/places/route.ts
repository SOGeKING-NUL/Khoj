  // app/api/places/route.ts
  import { NextResponse } from 'next/server';

  export async function GET() {
    try {
      // ✅ FIX: Return as array
      const places = [{
        placeId: "ChIJyy_Vxxj9DDkRPXF11X7EfT0",
        displayName: {
          text: "Karim Hotel",
          languageCode: "en"
        },
        formattedAddress: "16, Gali Kababian, Jama Masjid, Old Delhi, Delhi, 110006, India",
        lat: 28.6494961,
        lng: 77.2337642,
        type: [
          "indian_restaurant",
          "restaurant",
          "food",
          "point_of_interest",
          "establishment"
        ]
      }];

      return NextResponse.json(places);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch places' },
        { status: 500 }
      );
    }
  }
