import { NextRequest, NextResponse } from "next/server";
import getReelData from "../../lib/runApifyActor";

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
        return NextResponse.json(metadata);


    }catch(err){
        return NextResponse.json(
            {error: "failed to run api: ", err},
            {status: 500}
        )
    }
}