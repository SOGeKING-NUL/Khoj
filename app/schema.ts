import { z } from "zod";

//lib/Apify
export const Comments= z.object({
    comment: z.string
});

export const reelMetadataSchema= z.object({
    url: z.string(),
    caption: z.string(),
    transcript: z.string(),
    comments: z.array(Comments),
    hashtags: z.array(z.string()),
    shortCode: z.string(),
    thumbnail: z.string(),
    videoURL: z.string(),
});


//lib/googlePlaces
export const LocationSchema = z.object({
    spotFound: z.boolean(),
    place: z.object({
        name: z.string(),
        type: z.enum(["restaurant", "cafe", "tourist_attraction", "temple", "mosque", "church", "park", "museum", "shopping_mall", "lodging", "natural_feature", "other"]),
        locality: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
    }).optional(),
    confidence: z.enum(["low", "medium", "high"]),
    source: z.enum(['caption', 'transcript', 'comments', 'hashtags']),
    reasoning: z.string(),
});