import { z } from 'zod';
import client from './apify'
import "./schema"
import { reelMetadataSchema } from '../../schema';

// const runHpix= await client.actor('hpix/ig-reels-scraper').call({
//   "custom_functions": "{ shouldSkip: (data) => false, shouldContinue: (data) => true}",
//   "include_raw_data": false,
//   "max_comments": 10,
//   "max_posts": 1,
//   "post_urls": [
//     "https://www.instagram.com/reel/DTf4Ih5D8SJ/"
//   ],
//   "target": "all",
//   "reels_count": 12
// });

async function getReelData(reelUrl:string): Promise<z.infer< typeof reelMetadataSchema>>{

    const run = await client.actor("apify/instagram-reel-scraper").call({
    "includeDownloadedVideo": false,
    "includeSharesCount": false,
    "includeTranscript": false,
    "resultsLimit": 2,
    "skipPinnedPosts": false,
    "username": [
        reelUrl
    ]
    });

    const {items}= await client.dataset(run.defaultDatasetId).listItems();
    // `items` is an array of dataset items returned by the Apify actor.
    // Since we're processing a single reel URL, `items[0]` represents the metadata for the first reel.
    // If the actor returns multiple items, this would access the first one; add error handling if needed.

    if(!items || items.length == 0){
        throw new Error('No items found for this reel.');
    };

    const processedItems: z.infer< typeof reelMetadataSchema>= {
        url: (items[0] as any).url,
        caption: (items[0] as any).caption,
        transcript: (items[0] as any).transcript,
        comments: (items[0] as any).latestComments.map((comment: any) => comment.text),
        hashtags: (items[0] as any).hashtags,
        shortCode: (items[0] as any).shortCode,
        thumbnail: (items[0] as any).displayUrl,
        videoURL: (items[0] as any).videoUrl,
    };

    return processedItems;
};

export default getReelData;




