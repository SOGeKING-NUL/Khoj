import { NextRequest, NextResponse } from "next/server";
import getReelData from "../../lib/apify/runApifyActor";
import ExtractLocation from "@/app/lib/openrouter/extractLocation";
import { getLocationGeodata } from "@/app/lib/googlePlaces/textSearch";

import { db } from "@/app/db/db";
import { reelMetadata } from "@/app/db/schema";

export async function POST(req: NextRequest){
    
    try{
        const {url}= await req.json();
        if(!url){
            return NextResponse.json(
                {error: "URL required"},
                {status: 400}
            );
        };

        const metadata= await getReelData(url);

        const reelRow={
              shortCode:   metadata.shortCode,
              url:         metadata.url,
              caption:     metadata.caption,
              comments:    metadata.comments,
              hashtags:     metadata.hashtags,
              transcript:  metadata.transcript
            }

        await db.insert(reelMetadata).values(reelRow).onConflictDoNothing();

        const location= await ExtractLocation(metadata);
        const geodata= await getLocationGeodata(location);
        
        return NextResponse.json({metadata, location, geodata});


    }catch(err){
        return NextResponse.json(
            {error: "failed to run api: ", err},
            {status: 500}
        )
    }
}