import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { reelMetadata, userPlaces } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { addReelJob } from "@/app/lib/queue/reel-queue";
import { auth } from "@clerk/nextjs/server";
import { ReelShortCodeSearch } from "@/app/types";

function parseInstagramShortCode(rawUrl: string): string | null {

  // Normalise to include scheme
  const candidate =
    rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  }catch(err){
    return null;
  }

  //checks if url is from instagram
  const host = parsed.hostname.toLowerCase();
  const isInstagramHost =
    host === "instagram.com" || host === "www.instagram.com";
  if (!isInstagramHost) return null;

  // Path must start with /p/<id> or /reel/<id>, but can have extra segments after
  const match = parsed.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]+)(?:\/|$)/);
  if (!match) return null;

  return match[2]; // shortcode
}

async function isNewInstagramReelOrPostUrl(rawUrl: string): Promise<ReelShortCodeSearch> {
  const shortCode = parseInstagramShortCode(rawUrl);

  if (!shortCode) {
    return {
      valid: false,
      isNew: false,
      shortCode: null ,
      existing: null ,
    };
  }

  const row = await db
    .select()
    .from(reelMetadata)
    .where(eq(reelMetadata.shortCode, shortCode));

  const existing = row[0] ?? null;  // the ?? or the nullish operator fallbacks to th latter value if the former value is null or undeined so if row is emptty it becomes null

  return {
    valid: true,
    isNew: row.length === 0,
    shortCode,
    existing,
  };
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

        if(!url || typeof(url) !== "string"){
            return NextResponse.json(
                {error: "URL required"},
                {status: 400}
            );
        };

        const result = await isNewInstagramReelOrPostUrl(url);

        if (!result.valid) {
            return NextResponse.json(
                { error: "Invalid URL. Expected an Instagram reel/post link" },
                { status: 400 }
            );
        }

        //if reel already exists, return cached data instead of enqueuing a new job
        if (!result.isNew && result.existing) {

            //update place in th user places table
            const userPlacesData={
                userId: userId,
                placeId: result.existing.place_id,  
            };
            
            await db.insert(userPlaces).values(userPlacesData).onConflictDoNothing();

            return NextResponse.json(
                {
                    status: "cached",
                    metadata: result.existing,
                },
                { status: 200 }
            );
        }

        // new reels are enqueued
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