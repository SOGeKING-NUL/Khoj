import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user= pgTable('user', {
    userId: text('user_id').primaryKey(),   //get from clerk
    email: text('email'),    
    firstName: text('first_name'), 
    lastName: text('last_name'),               //get from clerk
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow()
})