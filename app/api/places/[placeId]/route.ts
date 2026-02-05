import client from "@/app/lib/googlePlaces/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{placeId: string}>}){

    try{
        const {placeId}= await params;

        const apiKey= process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
        

        const [response]= await client.getPlace({
            name: `places/${placeId}`
        },
        {
            otherArgs:{
                headers:{
                    "X-Goog-FieldMask": "id,displayName,formattedAddress,rating,userRatingCount,photos,regularOpeningHours,websiteUri,nationalPhoneNumber"
                }
            }
        });

        if(!response){
            return NextResponse.json({error: 'Place not found'}, {status: 404});
        }
        
        try{

            
            const photoNames= response.photos?.slice(0,3).map(photo=> photo.name) ?? []; //i.e. the photos goes from an object of name, attributees etc to just the names of the photos I will use to get the image uris. returns object of just urls in it. if photos object is empty then defualt to null

            const photoUrl= await Promise.all(photoNames.map(async (photoName)=>{

                const requestUrl= `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;

                const res= await fetch(requestUrl);
                return res.url;
            }));// this all method of the promize call runs all the instance in parallel and returns the result together

            return NextResponse.json({
                placeId: response.id,
                displayName: response.displayName?.text,
                formattedAddress: response.formattedAddress,
                rating: response.rating,
                userRatingCount: response.userRatingCount,
                website: response.websiteUri,
                phone: response.nationalPhoneNumber,
                openingHours: response.regularOpeningHours?.weekdayDescriptions,
                photos: photoUrl,
            });

        }catch(err){
            console.log("error getting photo uri", err);
        };            
    }catch(err){
        console.error("Error loading place details:", err);
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.json({error: 'Failed to fetch place details', message}, {status: 500});
    }
}