import { db } from '@/app/db/db';
import { user } from '@/app/db/schema';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { eq } from 'drizzle-orm';
import { NextRequest } from "next/server";

 export async function POST(req: NextRequest){

    try{
        const event= await verifyWebhook(req);
        const eventType= event.type;

        switch(eventType){
            case 'user.created':
                const userData={
                    userId: event.data.id ,
                    email: event.data.email_addresses?.[0]?.email_address,  //returns array of objects for the address selected
                    firstName: event.data.first_name,
                    lastName: event.data.last_name,
                }
                await db.insert(user).values(userData);
                console.log('User created:', userData.userId);
                break;

            case 'user.deleted':
                await db.delete(user).where(eq(user.userId, event.data.id!));   //! becase the event data can also be null but the db column only accepts text
                console.log('User deleted', user.userId)
                break;
        }
        return new Response("Success", {status: 200});
        
    }catch(err){
        console.log("webhook error: ", err);
        return new Response('Error', {status: 400})
    }
}