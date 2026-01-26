import { generateObject } from "ai";
import { z } from "zod";
import { reelMetadataSchema } from "../../schema";
import {LocationSchema} from "../../schema";
import { openrouter } from "@openrouter/ai-sdk-provider";

async function ExtractLocation(reelMetadata: z.infer< typeof reelMetadataSchema>): Promise<z.infer<typeof LocationSchema>>{

    const {object}= await generateObject({
        model: openrouter("anthropic/claude-sonnet-4.5"),
        schema: LocationSchema,
        prompt:`You are a location extraction expert for travel and food content from Instagram reels.

            **Your Task:** Extract the PRIMARY place/location mentioned or shown in this reel.

            ---

            **Caption:**
            ${reelMetadata.caption}

            **Video Transcript:**
            ${reelMetadata.transcript || 'N/A'}

            **Top Comments:**
            ${reelMetadata.comments || 'None'}

            **Hashtags:**
            ${reelMetadata.hashtags|| 'None'}

            ---

            **Rules:**
            1. Extract the MAIN place (if multiple, pick the most prominent one)
            2. Be specific: "Karim's Restaurant" > "Old Delhi"
            3. Fill locality (neighborhood/area) when clear from context
            4. Detect country from context clues (language, currency, landmarks)
            5. Match type to the place category (see list below)
            6. Set confidence based on how explicitly the place is mentioned

            **Place Types (use EXACTLY these):**
            - restaurant (dining places serving meals)
            - cafe (coffee shops, bakeries, light snacks)
            - tourist_attraction (monuments, landmarks, viewpoints, historical sites)
            - temple (Hindu/Buddhist/Jain temples)
            - mosque (Islamic mosques)
            - church (Christian churches)
            - park (gardens, public parks)
            - museum (museums, art galleries)
            - shopping_mall (malls, shopping complexes)
            - lodging (hotels, hostels, resorts, homestays)
            - natural_feature (beaches, waterfalls, lakes, mountains, valleys)
            - other (anything else not fitting above)

            **Confidence Levels:**
            - high: Explicit name + clear location ("breakfast at Karim's in Jama Masjid Delhi")
            - medium: Name mentioned but location vague ("amazing cafe in CP" without city)
            - low: Only general area ("somewhere in South India")

            **Source Priority:** caption > transcript > comments > hashtags

            ---

            **Return the extracted location data matching the schema.**

            **Examples:**

            India food: "Best momos at Dolma House, Majnu Ka Tilla!"
            {
            "spotFound": true,
            "place": {
                "name": "Dolma House",
                "type": "restaurant",
                "locality": "Majnu Ka Tilla",
                "city": "New Delhi",
                "state": "Delhi",
                "country": "India"
            },
            "confidence": "high",
            "source": "caption",
            "reasoning": "Restaurant name and Delhi locality explicitly mentioned"
            }

            Thailand beach: "Sunset at Railay Beach 🌅 #krabi #thailand"
            {
            "spotFound": true,
            "place": {
                "name": "Railay Beach",
                "type": "natural_feature",
                "locality": "Ao Nang",
                "city": "Krabi",
                "state": "Krabi Province",
                "country": "Thailand"
            },
            "confidence": "high",
            "source": "caption",
            "reasoning": "Beach name and hashtags confirm Thailand location"
            }

            NOW EXTRACT FROM THE REEL DATA ABOVE:`
    });

    return object;
};

export default ExtractLocation;