import "dotenv/config";
import { Worker } from "bullmq";
import redisConnection from "./connection";
import getReelData from "../apify/runApifyActor";
import { places, reelMetadata, userPlaces } from "@/app/db/schema";
import { db } from "@/app/db/db";
import ExtractLocation from "../openrouter/extractLocation";
import { getLocationGeodata } from "../googlePlaces/textSearch";
import { eq } from "drizzle-orm";

const worker = new Worker(
    'reel_extraction', async (job)=>{

        const {userId, url} =job.data;

        const metadata= await getReelData(url);

        const reelRow={
              shortCode:   metadata.shortCode,
              url:         metadata.url,
              caption:     metadata.caption,
              comments:    metadata.comments,
              hashtags:    metadata.hashtags,
              transcript:  metadata.transcript
            }

        await db.insert(reelMetadata).values(reelRow).onConflictDoNothing();

        console.log("Apify worker finished, metadataextracted and stored in db");

        const location= await ExtractLocation(metadata);
        console.log("location metadata extract via LLM");

        const geodata= await getLocationGeodata(location);

        if(location.spotFound && geodata?.placeId && geodata.lat && geodata.lng){

            const placeRow={
                placeId:            geodata.placeId,
                displayName:        geodata.displayName,
                formattedAddress:   geodata.formattedAddress,
                lat:                geodata.lat,
                lng:                geodata.lng,
                type:               geodata.type
            };

            await db.insert(places).values(placeRow).onConflictDoNothing();
            
            await db.update(reelMetadata)
                .set({place_id: geodata.placeId})
                .where(eq(reelMetadata.shortCode, metadata.shortCode));
            
            console.log(`location found via google places api ${geodata.placeId} and db updated with ${userId}data`);

            const userPlacesData={
                userId: userId,
                placeId: geodata.placeId 
            };
            
            await db.insert(userPlaces).values(userPlacesData).onConflictDoNothing();

            console.log("added place to user profile");
        };     
        
        return {ok: true, shortCode: metadata.shortCode};

    }, {connection: redisConnection}
);

worker.on('completed', (job, result)=>{
    console.log("job completed", job, result);
});

worker.on("failed", (job, error)=>{
    console.error("Job failed", job?.id, error?.message ?? error);
});

worker.on("error", (err)=>{
    console.error("Worker connection error:", err.message);
});

console.log("Reel worker running. Waiting for jobs on queue 'reel_extraction'.");
