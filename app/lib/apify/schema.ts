import {z} from 'zod';

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