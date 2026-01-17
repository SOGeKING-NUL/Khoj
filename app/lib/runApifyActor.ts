import 'dotenv/config';
import apifyClient from './apify'
import "./types"
import { reelMetadata } from './types';

// const runHpix= await apifyClient.actor('hpix/ig-reels-scraper').call({
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

async function getReelData(reelUrl:string){

    const run = await apifyClient.actor("apify/instagram-reel-scraper").call({
    "includeDownloadedVideo": false,
    "includeSharesCount": false,
    "includeTranscript": true,
    "resultsLimit": 27,
    "skipPinnedPosts": false,
    "username": [
        reelUrl
    ]
    });

    const {items}= await apifyClient.dataset(run.defaultDatasetId).listItems();

    const processedItems: reelMetadata[]= items.map(item => ({
    url: item.url,
    caption: item.caption,
    transcript: item.transcript,
    comments: item.latestComments.map(comment => comment.text),
    shortCode: item.shortCode,
    thumbnail: item.displayUrl,
    videoURL: item.videoUrl,
    }));

    return processedItems;
};

export default getReelData;




