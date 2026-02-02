import { NextRequest, NextResponse } from "next/server";
import getReelData from "../../lib/apify/runApifyActor";
import ExtractLocation from "@/app/lib/openrouter/extractLocation";
import { getLocationGeodata } from "@/app/lib/googlePlaces/textSearch";

import { db } from "@/app/db/db";
import { reelMetadata, places } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { addReelJob } from "@/app/lib/queue/reel-queue";
import { auth } from "@clerk/nextjs/server";

function isInstagramReelOrPostUrl(rawUrl: string): boolean {

    // ensure http is added
    const candidate =
        rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
            ? rawUrl
            : `https://${rawUrl}`;

    //makes it a URL type
    let parsed: URL;
    try {
        parsed = new URL(candidate);
    } catch {
        return false;
    }

    //checks if url is from instagram
    const host = parsed.hostname.toLowerCase();
    const isInstagramHost =
        host === "instagram.com" || host === "www.instagram.com";
    if (!isInstagramHost) return false;

    // accept both /p/<id> and /reel/<id>
    return /^\/(p|reel)\/[A-Za-z0-9_-]+\/?$/.test(parsed.pathname);
}

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

        if (typeof url !== "string" || !isInstagramReelOrPostUrl(url)) {
            return NextResponse.json(
                { error: "Invalid URL. Expected an Instagram link like instagram.com/p/<id>" },
                { status: 400 }
            );
        }
        
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