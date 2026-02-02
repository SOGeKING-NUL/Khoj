import { NextRequest, NextResponse } from "next/server";
import getReelData from "../../lib/apify/runApifyActor";
import ExtractLocation from "@/app/lib/openrouter/extractLocation";
import { getLocationGeodata } from "@/app/lib/googlePlaces/textSearch";

import { db } from "@/app/db/db";
import { reelMetadata, places } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { addReelJob } from "@/app/lib/queue/reel-queue";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest){
    
    try{
        const {userId}= await auth();

        if(!userId){
            return NextResponse.json({
                error: 'unauthorized'
            }, {status: 401})
        }

        const {url}= await req.json();

        if(!url){
            return NextResponse.json(
                {error: "URL required"},
                {status: 400}
            );
        };

        const job= await addReelJob({userId, url});

        return NextResponse.json({
            status: 'processing',
            jobId: job.id
        }, {status:202})

    }catch(err){
        const message = err instanceof Error ? err.message : String(err);
        console.error("Reel enqueue failed:", err);
        return NextResponse.json(
            { error: "failed to enqueue reel", message },
            { status: 500 }
        );
    }
}