import {AsyncHandler} from "../../utils/AsyncHandler.js";
import {userTable} from "../../DB/schema/user.js";
import {ApiError} from "../../utils/ApiError.js";
import {ApiResponse} from "../../utils/ApiResponse.js";
import { Webhook } from "svix";
import dotenv from "dotenv";
import type { WebhookEvent } from "@clerk/backend";
import { db } from "../../DB/index.js";



dotenv.config();

const RegisterUser = AsyncHandler(async (req, res) => {

const WebhookSecret = process.env.WEBHOOK_SECRET;

  if (!WebhookSecret) {
    throw new ApiError(500, "Webhook secret is not defined");
  }

    const {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
    } = req.headers;

    if (!svixId || !svixTimestamp || !svixSignature) {
        throw new ApiError(400, "Missing Svix headers");
    }

    const payload = await req.body;

    const body = JSON.stringify(payload);

    const webhook = new Webhook(WebhookSecret);

    let evt: WebhookEvent;
    
    try {
           evt = webhook.verify(body, {
               "svix-id": svixId as string,
               "svix-timestamp": svixTimestamp as string,
               "svix-signature": svixSignature as string,

           }) as WebhookEvent;
    } catch (error) {
      console.error("Webhook verification failed:", error);
      throw new ApiError(400, "Invalid webhook signature");
    }
     // for development
    console.log("Received event:", evt);

        const {id} = evt.data;
        const eventType = evt.type;
  
         if(eventType == "user.created"){
         
         try {

           if (!id || !eventType) {
            throw new ApiError(404, "Clerk_id and Event Type not found")
          }

           const existedUser = await db.query.userTable.findMany({
            with: {
              id: true,
            },

           })

              
           if (existedUser) {
               throw new ApiError(400, "Authentication Error")
           }

           const { email_addresses, "primary_email_address_id": primaryEmailAddressId } = evt.data;

           const primaryEmail = email_addresses.find(
            (email) => email.id === primaryEmailAddressId
           );

           if(!primaryEmail) {
            throw new ApiError(400, "Primary email address not found")
           }


           const newUser = await  db.insert(userTable).values({
            clerkId: id,
            email: primaryEmail.email_address,
           })
         
           if (!newUser) {
            throw new ApiError(500, "Failed to create user")
           }

           res.status(201).json(new ApiResponse(200, newUser, "User created successfully"));

         } catch (error) {
          console.error("Error creating user:", error);
           
         }

         }
         
})


export { RegisterUser };
