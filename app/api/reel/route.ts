import { NextRequest, NextResponse } from "next/server";
import getReelData from "../../lib/apify/runApifyActor";
import ExtractLocation from "@/app/lib/openrouter/extractLocation";

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
        const location= await ExtractLocation(metadata);
        
        return NextResponse.json({metadata, location});


    }catch(err){
        return NextResponse.json(
            {error: "failed to run api: ", err},
            {status: 500}
        )
    }
}