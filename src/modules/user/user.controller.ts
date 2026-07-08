import { AsyncHandler } from '../../utils/AsyncHandler.js';
import { user } from '../../DB/schema/user.js';
import { userProfile } from '../../DB/schema/userProfile.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/backend';
import { db } from '../../DB/index.js';
import { eq } from 'drizzle-orm';
import { userSchma } from './userValidation.js';

const handleUser = AsyncHandler(async (req, res) => {
  const WebhookSecret = process.env.WEBHOOK_SECRET;

  if (!WebhookSecret) {
    throw new ApiError(500, 'Webhook secret is not defined');
  }

  const {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  } = req.headers;

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new ApiError(400, 'Missing Svix headers');
  }

  const body = JSON.stringify(req.body);

  const webhook = new Webhook(WebhookSecret);

  let evt: WebhookEvent;

  try {
    evt = webhook.verify(body, {
      'svix-id': svixId as string,
      'svix-timestamp': svixTimestamp as string,
      'svix-signature': svixSignature as string,
    }) as WebhookEvent;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw new ApiError(400, 'Invalid webhook signature');
  }
  // for development
  console.log('Received event:', evt);

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType == 'user.created') {
    if (!id || !eventType) {
      throw new ApiError(404, 'Clerk_id and Event Type not found');
    }

    const existedUser = await db.query.user.findFirst({
      where: eq(user.clerkId, id),
      columns: {
        id: true,
      },
    });

    if (existedUser) {
      throw new ApiError(400, 'Authentication Error');
    }

    const { email_addresses, primary_email_address_id: primaryEmailAddressId } = evt.data;

    const primaryEmail = email_addresses.find((email) => email.id === primaryEmailAddressId);

    if (!primaryEmail) {
      throw new ApiError(400, 'Primary email address not found');
    }

    const newUser = await db.insert(user).values({
      clerkId: id,
      email: primaryEmail.email_address,
    });

    if (!newUser) {
      throw new ApiError(500, 'Failed to create user');
    }

    return res.status(200).json(new ApiResponse(200, newUser, 'User Created Successfully'));
  }

  if (eventType === 'user.deleted') {
    if (!id || !eventType) {
      throw new ApiError(404, 'Clerk_id and Event Type not found');
    }

    const [existedUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.clerkId, id))
      .limit(1);

    if (!existedUser) {
      throw new ApiError(404, 'User not found');
    }

    const deletedUser = await db.delete(user).where(eq(user.clerkId, id)).returning();

    if (!deletedUser) {
      throw new ApiError(500, 'Error deleting User');
    }

    res.status(200).json(new ApiResponse(200, 'User Deleted Successfully'));
  }
});

const createProfile = AsyncHandler(async (req, res) => {
  const clerkId = req.userId!;

  const result = userSchma.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, 'Validation Failed');
  }

  const data = result.data;

  const [existedUser] = await db
  .select({userId: user.id})
  .from(user)
  .where(eq(user.clerkId, clerkId))
  .limit(1)
  
  if(!existedUser){
    throw new ApiError(404, "User not found")
  }

  const [existingProfile] = await db
  .select({userId: userProfile.userId})
  .from(userProfile)
  .where(eq(userProfile.userId, existedUser.userId))
  .limit(1);

  if(existingProfile){
    throw new ApiError(400, "Profile already exists")
  }

  const newProfile = await db.insert(userProfile).values({
    userId: existedUser.userId,
    name: data.name,
    mobile: data.mobile,
    batch: data.batch,
    collageName: data.collageName
  }).returning();
  
   if(!newProfile) {
    throw new ApiError(500, "Failed to create profile")
   }

   res.status(200).json(new ApiResponse(200, newProfile, "Profile Created Successfully"))

  
});

export { handleUser, createProfile };
