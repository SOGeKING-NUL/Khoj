import { ApifyClient } from 'apify-client';

export default new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});