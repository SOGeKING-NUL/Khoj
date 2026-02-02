import {Queue} from "bullmq";
import redisConnection from "./connection";
import { ReelJobData } from "@/app/types";

export const reelQueue= new Queue('reel_extraction', {
    connection: redisConnection
})

export async function addReelJob(data: ReelJobData){
    return reelQueue.add('extract-reel', data, {
        attempts: 3,
        backoff: {type: 'exponential', delay: 2000}
    });
};