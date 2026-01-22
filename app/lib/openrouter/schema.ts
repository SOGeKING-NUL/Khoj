import { z } from "zod";

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